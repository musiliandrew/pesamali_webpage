"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { io, type Socket } from "socket.io-client";
import { getWsBaseUrl } from "@/lib/env";
import { getToken } from "@/lib/auth";

type GameState = unknown;

type ConnectionState = "disconnected" | "connecting" | "connected" | "error";

function asMessage(err: unknown): string {
  if (typeof err === "string") return err;
  if (err && typeof err === "object" && "message" in err) {
    const msg = (err as { message?: unknown }).message;
    return typeof msg === "string" ? msg : String(msg);
  }
  return String(err);
}

export default function PlayGamePage() {
  const router = useRouter();
  const params = useParams<{ matchId: string }>();
  const matchId = params.matchId;

  const wsBase = useMemo(() => {
    return getWsBaseUrl();
  }, []);

  const socketRef = useRef<Socket | null>(null);
  const [connection, setConnection] = useState<ConnectionState>("connecting");
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/play/login");
      return;
    }

    const socket = io(wsBase, {
      path: "/ws",
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setConnection("connected");
      socket.emit("join_match", { matchId });
      // Mirror mobile behavior: only auto-start when lobby flagged it (AI practice).
      try {
        const key = `pm_autostart_${matchId}`;
        const shouldAutoStart = localStorage.getItem(key) === "1";
        if (shouldAutoStart) {
          localStorage.removeItem(key);
          socket.emit("start_match", { matchId });
        }
      } catch {
        // ignore
      }
    });

    socket.on("connect_error", (e: unknown) => {
      setConnection("error");
      setError(asMessage(e));
    });

    socket.on("disconnect", () => {
      setConnection("disconnected");
    });

    socket.on("error_event", (e: unknown) => {
      if (e && typeof e === "object" && "message" in e) {
        const msg = (e as { message?: unknown }).message;
        setError(typeof msg === "string" ? msg : String(msg));
        return;
      }
      setError("Unknown error");
    });

    socket.on("game_state", (state: unknown) => {
      setGameState(state);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [matchId, router, wsBase]);

  const roll = () => {
    socketRef.current?.emit("roll", { matchId });
  };

  return (
    <main className="min-h-screen bg-brand-dark text-brand-cream px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="text-brand-cream/60 text-xs uppercase tracking-widest">
              Match
            </div>
            <h1 className="text-xl font-extrabold">{matchId}</h1>
            <div className="text-sm mt-1">
              Status: <span className="text-brand-gold font-bold">{connection}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.replace("/play/lobby")}
              className="text-sm px-4 py-2 rounded-full border border-brand-olive/40 hover:border-brand-gold hover:text-brand-gold transition"
            >
              Back to Lobby
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-brand-red/40 bg-brand-red/10 p-3 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-brand-green/20 border border-brand-olive/30 rounded-2xl p-6">
            <div className="text-brand-gold font-bold mb-3">Game State</div>
            <pre className="text-xs text-brand-cream/70 overflow-auto max-h-[60vh]">
              {JSON.stringify(gameState, null, 2)}
            </pre>
          </div>

          <div className="bg-brand-green/20 border border-brand-olive/30 rounded-2xl p-6">
            <div className="text-brand-gold font-bold mb-3">Actions</div>
            <button
              onClick={roll}
              disabled={connection !== "connected"}
              className="w-full bg-brand-gold hover:bg-brand-gold-light disabled:opacity-50 text-brand-dark font-extrabold px-5 py-3 rounded-xl transition"
            >
              Roll Dice
            </button>
            <p className="text-xs text-brand-cream/50 mt-3">
              This is the first web slice: connect → join match → display `game_state`.
              Next we’ll replace this with the real board UI.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
