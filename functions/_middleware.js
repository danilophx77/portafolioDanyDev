const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Cross-Origin-Resource-Policy": "same-site",
};

export async function onRequest(context) {
  const response = await context.next();
  const { pathname } = new URL(context.request.url);

  if (pathname.startsWith("/api/")) {
    Object.entries(securityHeaders).forEach(([header, value]) => {
      response.headers.set(header, value);
    });
  }

  return response;
}
