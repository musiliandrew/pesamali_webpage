import { getApiBaseUrl } from "@/lib/env";

const TOKEN_KEY = "pm_token";
const USER_KEY = "pm_user";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export async function validateToken(token: string): Promise<boolean> {
  const apiBase = getApiBaseUrl();
  const res = await fetch(`${apiBase}/api/auth/me`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.ok;
}

export function getUserIdFromToken(): string | null {
  const token = getToken();
  if (!token) return null;
  try {
    const payloadBase64 = token.split(".")[1];
    const decoded = JSON.parse(atob(payloadBase64));
    return decoded.sub ? String(decoded.sub) : null;
  } catch {
    return null;
  }
}
