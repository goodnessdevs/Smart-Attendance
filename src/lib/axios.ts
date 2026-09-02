import axios from "axios";

/**
 * The single HTTP client for the whole app (reads and writes alike).
 *
 * baseURL points at this app's own BFF, not the upstream backend: the session
 * JWT lives in an httpOnly cookie that JS cannot read, so the Authorization
 * header is attached server-side in src/app/api/backend/[...path]/route.ts.
 * That is why there is no auth request-interceptor here.
 *
 *   /backend/*  proxied to the attendance API with the bearer token attached
 *   /auth/*     this app's own session routes
 */
export const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

/** Where to send someone whose session has expired, based on where they are. */
function loginPathForCurrentArea() {
  const path = window.location.pathname;
  if (path.startsWith("/lecturer")) return "/lecturer/login";
  if (path.startsWith("/admin")) return "/admin/login";
  return "/login";
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!axios.isAxiosError(error) || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // A 401 from the session routes is a normal answer ("you are signed out"),
    // not a reason to bounce the user — that would loop on the login page.
    const url = error.config?.url ?? "";
    if (!url.startsWith("/auth") && typeof window !== "undefined") {
      window.location.assign(loginPathForCurrentArea());
    }

    return Promise.reject(error);
  }
);
