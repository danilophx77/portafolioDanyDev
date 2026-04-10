import { getPortfolioContent } from "../_lib/content";
import {
  checkSupabaseRateLimit,
  getClientIp,
  hashClientIp,
  insertSupabaseContact,
  isResendEnabled,
  normalizeSubmission,
  sendTransactionalEmail,
  updateSupabaseContact,
  validateSubmission,
} from "../_lib/contact";
import { json, toNumber } from "../_lib/http";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const onRequestOptions = async () =>
  new Response(null, {
    status: 204,
    headers: corsHeaders,
  });

export const onRequestPost = async ({ env, request }) => {
  const content = getPortfolioContent();
  let payload;

  try {
    payload = await request.json();
  } catch {
    return json(
      {
        ok: false,
        message: "El cuerpo de la solicitud debe ser JSON valido.",
      },
      {
        status: 400,
        headers: corsHeaders,
      }
    );
  }

  const submission = normalizeSubmission(payload || {});

  if (submission.company) {
    return json(
      {
        ok: true,
        delivery: "discarded",
        message: "Mensaje recibido.",
      },
      {
        status: 202,
        headers: corsHeaders,
      }
    );
  }

  const errors = validateSubmission(submission);

  if (errors.length > 0) {
    return json(
      {
        ok: false,
        message: errors[0],
        errors,
      },
      {
        status: 400,
        headers: corsHeaders,
      }
    );
  }

  const rateWindowMinutes = toNumber(env.CONTACT_RATE_WINDOW_MINUTES, 15);
  const rateMaxRequests = toNumber(env.CONTACT_RATE_MAX_REQUESTS, 5);
  const source = String(env.CONTACT_SOURCE || "portfolio").trim();
  const origin = request.headers.get("Origin") || new URL(request.url).origin;
  const userAgent = request.headers.get("User-Agent") || "";
  const clientIp = getClientIp(request);
  const ipHash = await hashClientIp(clientIp, String(env.CONTACT_HASH_SALT || ""));
  let storedRecord = null;

  try {
    const isRateLimited = await checkSupabaseRateLimit(
      env,
      ipHash,
      rateWindowMinutes,
      rateMaxRequests
    );

    if (isRateLimited) {
      return json(
        {
          ok: false,
          message: `Has alcanzado el limite de ${rateMaxRequests} mensajes cada ${rateWindowMinutes} minutos.`,
        },
        {
          status: 429,
          headers: corsHeaders,
        }
      );
    }
  } catch (error) {
    console.error("[contact:rate-limit]", error);
  }

  try {
    storedRecord = await insertSupabaseContact(env, submission, {
      ipHash,
      origin,
      userAgent,
      source,
      deliveryStatus: isResendEnabled(env) ? "processing" : "queued",
      emailStatus: isResendEnabled(env) ? "pending" : "disabled",
    });
  } catch (error) {
    console.error("[contact:supabase-insert]", error);
  }

  if (!isResendEnabled(env)) {
    return json(
      {
        ok: true,
        delivery: "queued",
        message: content.contact.form.queuedMessage,
        storage: storedRecord ? "supabase" : "none",
      },
      {
        status: 202,
        headers: corsHeaders,
      }
    );
  }

  try {
    const delivery = await sendTransactionalEmail(env, submission);

    if (storedRecord?.id) {
      await updateSupabaseContact(env, storedRecord.id, {
        delivery_status: "sent",
        email_status: delivery.provider,
        provider_message_id: delivery.id || null,
      });
    }

    return json(
      {
        ok: true,
        delivery: "email",
        message: content.contact.form.successMessage,
        storage: storedRecord ? "supabase" : "none",
      },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("[contact:email]", error);

    try {
      if (storedRecord?.id) {
        await updateSupabaseContact(env, storedRecord.id, {
          delivery_status: "failed",
          email_status: "failed",
        });
      }
    } catch (updateError) {
      console.error("[contact:supabase-update]", updateError);
    }

    return json(
      {
        ok: false,
        message: "No se pudo enviar el mensaje. Intentalo de nuevo mas tarde.",
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
};
