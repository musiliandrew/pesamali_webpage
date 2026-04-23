import { getApiBaseUrl } from "@/lib/env";
import { getToken } from "@/lib/auth";

const BASE_URL = getApiBaseUrl().replace(/\/+$/, "");

type HeadersInitLike = HeadersInit | Record<string, string>;

function mergeHeaders(...headersList: Array<HeadersInitLike | undefined>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const h of headersList) {
    if (!h) continue;
    if (h instanceof Headers) {
      h.forEach((v, k) => {
        out[k] = v;
      });
    } else if (Array.isArray(h)) {
      for (const [k, v] of h) out[k] = String(v);
    } else {
      Object.assign(out, h);
    }
  }
  return out;
}

function authHeader(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function get<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = mergeHeaders({ Accept: "application/json" }, init.headers as HeadersInitLike | undefined, authHeader());
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, { ...init, method: "GET", headers });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GET ${path} failed: ${res.status}${text ? ` - ${text}` : ""}`);
  }
  return (await res.json()) as T;
}

export async function post<T>(path: string, body?: unknown, init: RequestInit = {}): Promise<T> {
  const baseHeaders: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) {
    baseHeaders["Content-Type"] = "application/json";
  }
  const headers = mergeHeaders(baseHeaders, init.headers as HeadersInitLike | undefined, authHeader());
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    ...init,
    method: "POST",
    headers,
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`POST ${path} failed: ${res.status}${text ? ` - ${text}` : ""}`);
  }
  return (await res.json()) as T;
}

export async function patch<T>(path: string, body: unknown, init: RequestInit = {}): Promise<T> {
  const headers = mergeHeaders(
    { Accept: "application/json", "Content-Type": "application/json" },
    init.headers as HeadersInitLike | undefined,
    authHeader(),
  );
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, { ...init, method: "PATCH", headers, body: JSON.stringify(body) });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`PATCH ${path} failed: ${res.status}${text ? ` - ${text}` : ""}`);
  }
  return (await res.json()) as T;
}

export async function del<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = mergeHeaders({ Accept: "application/json" }, init.headers as HeadersInitLike | undefined, authHeader());
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, { ...init, method: "DELETE", headers });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`DELETE ${path} failed: ${res.status}${text ? ` - ${text}` : ""}`);
  }
  return (await res.json()) as T;
}

export { BASE_URL };
