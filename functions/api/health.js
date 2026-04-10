import { isD1Enabled, isResendEnabled } from "../_lib/contact";
import { json, toNumber } from "../_lib/http";

export const onRequestGet = async ({ env }) =>
  json({
    status: "ok",
    runtime: "cloudflare-pages-functions",
    timestamp: new Date().toISOString(),
    environment: String(env.APP_ENV || "preview"),
    emailEnabled: isResendEnabled(env),
    databaseEnabled: isD1Enabled(env),
    rateLimitWindowMinutes: toNumber(env.CONTACT_RATE_WINDOW_MINUTES, 15),
    rateLimitMaxRequests: toNumber(env.CONTACT_RATE_MAX_REQUESTS, 5),
  });
