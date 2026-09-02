import "server-only";
import { env } from "@/config/env";

export class BackendError extends Error {
  constructor(
    readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "BackendError";
  }
}

/**
 * Calls the upstream attendance API with an explicit bearer token.
 *
 * Only ever runs on the server, so the token never reaches the browser.
 */
export async function backendFetch<T>(
  endpoint: string,
  token: string,
  init: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${env.BACKEND_URL}/${endpoint}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...init.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new BackendError(
      response.status,
      `Backend responded ${response.status} for /${endpoint}`
    );
  }

  return response.json() as Promise<T>;
}
