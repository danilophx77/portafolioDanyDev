const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const sanitizeField = (value) => String(value || "").trim();

const encodeBase64 = (value) => btoa(String(value));

const getSupabaseToken = (env) =>
  String(env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY || "").trim();

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

const createSupabaseRequest = (env, path, init = {}) => {
  const token = getSupabaseToken(env);
  const baseUrl = String(env.SUPABASE_URL || "").trim();

  if (!baseUrl || !token) {
    throw new Error("Supabase no esta configurado.");
  }

  const headers = new Headers(init.headers || {});
  headers.set("apikey", token);
  headers.set("Authorization", `Bearer ${token}`);

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(`${baseUrl}/rest/v1/${path}`, {
    ...init,
    headers,
  });
};

export const isSupabaseEnabled = (env) =>
  Boolean(String(env.SUPABASE_URL || "").trim() && getSupabaseToken(env));

export const isResendEnabled = (env) =>
  Boolean(
    String(env.RESEND_API_KEY || "").trim() &&
      String(env.CONTACT_TO_EMAIL || "").trim() &&
      String(env.CONTACT_FROM_EMAIL || "").trim()
  );

export const checkSupabaseRateLimit = async (env, ipHash, windowMinutes, maxRequests) => {
  if (!isSupabaseEnabled(env) || !ipHash) {
    return false;
  }

  const table = String(env.SUPABASE_CONTACT_TABLE || "contact_messages").trim();
  const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();
  const params = new URLSearchParams({
    select: "id",
    ip_hash: `eq.${ipHash}`,
    created_at: `gte.${windowStart}`,
    order: "created_at.desc",
    limit: String(maxRequests),
  });

  const response = await createSupabaseRequest(env, `${table}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Supabase rate limit query failed with status ${response.status}`);
  }

  const rows = await response.json();
  return Array.isArray(rows) && rows.length >= maxRequests;
};

export const insertSupabaseContact = async (env, submission, metadata) => {
  if (!isSupabaseEnabled(env)) {
    return null;
  }

  const table = String(env.SUPABASE_CONTACT_TABLE || "contact_messages").trim();
  const response = await createSupabaseRequest(env, table, {
    method: "POST",
    headers: {
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      name: submission.name,
      email: submission.email,
      subject: submission.subject,
      message: submission.message,
      company: submission.company,
      ip_hash: metadata.ipHash,
      origin: metadata.origin,
      user_agent: metadata.userAgent,
      source: metadata.source,
      delivery_status: metadata.deliveryStatus || "received",
      email_status: metadata.emailStatus || "pending",
    }),
  });

  if (!response.ok) {
    throw new Error(`Supabase insert failed with status ${response.status}`);
  }

  const rows = await response.json();
  return Array.isArray(rows) ? rows[0] || null : null;
};

export const updateSupabaseContact = async (env, recordId, updates) => {
  if (!isSupabaseEnabled(env) || !recordId) {
    return;
  }

  const table = String(env.SUPABASE_CONTACT_TABLE || "contact_messages").trim();
  const params = new URLSearchParams({
    id: `eq.${recordId}`,
  });

  const response = await createSupabaseRequest(env, `${table}?${params.toString()}`, {
    method: "PATCH",
    headers: {
      Prefer: "return=minimal",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error(`Supabase update failed with status ${response.status}`);
  }
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
