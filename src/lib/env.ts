export type AppEnvironment = "development" | "lan" | "production";

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

export function getEnvironment(): AppEnvironment {
  const primary = process.env.NEXT_PUBLIC_ENVIRONMENT?.toLowerCase();
  if (primary) {
    if (primary === "production" || primary === "prod") return "production";
    if (primary === "lan") return "lan";
    if (primary === "local") return "development";
    if (primary === "development" || primary === "dev") return "development";
  }

  const legacy = process.env.NEXT_PUBLIC_ENV?.toLowerCase();
  if (legacy === "production" || legacy === "prod") return "production";
  if (legacy === "lan") return "lan";
  if (legacy === "local") return "development";
  if (legacy === "development" || legacy === "dev") return "development";

  return process.env.NODE_ENV === "production" ? "production" : "development";
}

export function getApiBaseUrl(): string {
  const env = getEnvironment();
  if (env === "production") {
    return normalizeBaseUrl(
      process.env.NEXT_PUBLIC_API_URL_PROD || "https://api.quantiq.co.ke",
    );
  }
  if (env === "lan") {
    return normalizeBaseUrl(
      process.env.NEXT_PUBLIC_API_URL_LAN || "http://192.168.100.70:4000",
    );
  }
  return normalizeBaseUrl(process.env.NEXT_PUBLIC_API_URL_DEV || "http://localhost:4000");
}

export function getWsBaseUrl(): string {
  const env = getEnvironment();
  if (env === "production") {
    return normalizeBaseUrl(
      process.env.NEXT_PUBLIC_WS_URL_PROD || "wss://ws.quantiq.co.ke",
    );
  }
  if (env === "lan") {
    return normalizeBaseUrl(
      process.env.NEXT_PUBLIC_WS_URL_LAN || "http://192.168.100.70:4100",
    );
  }
  return normalizeBaseUrl(process.env.NEXT_PUBLIC_WS_URL_DEV || "http://localhost:4100");
}
