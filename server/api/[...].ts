import { defineEventHandler, getRequestHeaders, proxyRequest } from "h3";

export default defineEventHandler(async (event) => {
  const path = event.path;
  if (path.startsWith("/assets/") || path.endsWith(".css")) {
    return null;
  }

  const config = useRuntimeConfig();
  // Concatenate to preserve /api/ on backend: /api/auth -> http://localhost:5500/api + /auth = http://localhost:5500/api/auth
  const adjustedPath = event.path.replace(/^\/api/, '');
  const targetUrl = new URL(config.apiBaseUrl + adjustedPath).toString();  // Normalize as URL

  // Forward relevant headers (cookie, authorization, etc.)
  const headers = getRequestHeaders(event);
  delete headers.host;  // Avoid sending internal host

  // Proxy the request
  try {
    return await proxyRequest(event, targetUrl, {
      headers,
      sendStream: true,
    });
  } catch (err) {
    console.error('Proxy error:', err);  // Log for debugging
    return { error: "Proxy failed" };
  }
});