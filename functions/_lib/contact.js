const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const sanitizeField = (value) => String(value || "").trim();

const encodeBase64 = (value) => btoa(String(value));

export const getClientIp = (request) => {
  const cfConnectingIp = request.headers.get("CF-Connecting-IP");

  if (cfConnectingIp && cfConnectingIp.trim()) {
    return cfConnectingIp.trim();
  }

  const forwarded = request.headers.get("x-forwarded-for");

  if (forwarded && forwarded.trim()) {
    return forwarded.split(",")[0].trim();
  }

  return "";
};

export const normalizeSubmission = (payload) => ({
  name: sanitizeField(payload.name),
  email: sanitizeField(payload.email).toLowerCase(),
  subject: sanitizeField(payload.subject),
  message: sanitizeField(payload.message),
  company: sanitizeField(payload.company),
});

export const validateSubmission = (submission) => {
  const errors = [];

  if (!submission.name || submission.name.length < 2) {
    errors.push("El nombre debe tener al menos 2 caracteres.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submission.email)) {
    errors.push("Introduce un email valido.");
  }

  if (!submission.message || submission.message.length < 20) {
    errors.push("El mensaje debe tener al menos 20 caracteres.");
  }

  if (submission.subject.length > 120) {
    errors.push("El asunto no puede superar 120 caracteres.");
  }

  if (submission.message.length > 2000) {
    errors.push("El mensaje no puede superar 2000 caracteres.");
  }

  return errors;
};

export const buildContactEmail = (submission) => ({
  subject: `[Portfolio] ${submission.subject || "Nuevo mensaje desde el portfolio"}`,
  text: [
    `Nombre: ${submission.name}`,
    `Email: ${submission.email}`,
    `Asunto: ${submission.subject || "Sin asunto"}`,
    "",
    submission.message,
  ].join("\n"),
  html: `
    <h2>Nuevo mensaje desde el portfolio</h2>
    <p><strong>Nombre:</strong> ${escapeHtml(submission.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(submission.email)}</p>
    <p><strong>Asunto:</strong> ${escapeHtml(submission.subject || "Sin asunto")}</p>
    <p><strong>Mensaje:</strong></p>
    <p>${escapeHtml(submission.message).replace(/\n/g, "<br />")}</p>
  `,
});

export const hashClientIp = async (ipAddress, salt = "") => {
  if (!ipAddress) {
    return "";
  }

  const payload = new TextEncoder().encode(`${salt}:${ipAddress}`);
  const digest = await crypto.subtle.digest("SHA-256", payload);

  return Array.from(new Uint8Array(digest))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
};

// --- D1 Database helpers ---

export const isD1Enabled = (env) => Boolean(env.DB);

export const isResendEnabled = (env) =>
  Boolean(
    String(env.RESEND_API_KEY || "").trim() &&
      String(env.CONTACT_TO_EMAIL || "").trim() &&
      String(env.CONTACT_FROM_EMAIL || "").trim()
  );

export const checkD1RateLimit = async (env, ipHash, windowMinutes, maxRequests) => {
  if (!isD1Enabled(env) || !ipHash) {
    return false;
  }

  const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();

  const result = await env.DB.prepare(
    "SELECT COUNT(*) as count FROM contact_messages WHERE ip_hash = ? AND created_at >= ?"
  )
    .bind(ipHash, windowStart)
    .first();

  return result && result.count >= maxRequests;
};

export const insertD1Contact = async (env, submission, metadata) => {
  if (!isD1Enabled(env)) {
    return null;
  }

  const id = crypto.randomUUID();

  await env.DB.prepare(
    `INSERT INTO contact_messages (id, name, email, subject, message, company, ip_hash, origin, user_agent, source, delivery_status, email_status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      id,
      submission.name,
      submission.email,
      submission.subject,
      submission.message,
      submission.company,
      metadata.ipHash,
      metadata.origin,
      metadata.userAgent,
      metadata.source,
      metadata.deliveryStatus || "received",
      metadata.emailStatus || "pending"
    )
    .run();

  return { id };
};

export const updateD1Contact = async (env, recordId, updates) => {
  if (!isD1Enabled(env) || !recordId) {
    return;
  }

  const setClauses = [];
  const values = [];

  for (const [key, value] of Object.entries(updates)) {
    setClauses.push(`${key} = ?`);
    values.push(value);
  }

  if (setClauses.length === 0) {
    return;
  }

  values.push(recordId);

  await env.DB.prepare(
    `UPDATE contact_messages SET ${setClauses.join(", ")} WHERE id = ?`
  )
    .bind(...values)
    .run();
};

export const sendTransactionalEmail = async (env, submission) => {
  if (!isResendEnabled(env)) {
    return { ok: false, skipped: true };
  }

  const email = buildContactEmail(submission);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${String(env.RESEND_API_KEY).trim()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: String(env.CONTACT_FROM_EMAIL).trim(),
      to: [String(env.CONTACT_TO_EMAIL).trim()],
      reply_to: submission.email,
      subject: email.subject,
      text: email.text,
      html: email.html,
      headers: {
        "X-Portfolio-Source": encodeBase64(String(env.CONTACT_SOURCE || "portfolio")),
      },
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Resend request failed with status ${response.status}: ${details}`);
  }

  const payload = await response.json();

  return {
    ok: true,
    provider: "resend",
    id: payload?.id || "",
  };
};
