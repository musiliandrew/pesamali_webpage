"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getApiBaseUrl } from "@/lib/env";
import { clearAuth, getToken, validateToken } from "@/lib/auth";
import Image from "next/image";
import MatchSetupModal, { type GameMode } from "@/components/play/MatchSetupModal";
import type { WebDream } from "@/components/play/DreamCarousel";
import AppHeader from "@/components/play/AppHeader";
import LobbyStats from "@/components/play/LobbyStats";
import LobbyQuickActions from "@/components/play/LobbyQuickActions";
import FriendsModal from "@/components/play/FriendsModal";
import SocietiesModal from "@/components/play/SocietiesModal";
import LeaderboardModal from "@/components/play/LeaderboardModal";
import DailyQuizModal from "@/components/play/DailyQuizModal";

type Dream = {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  cost?: number;
  min_pesa_points?: number;
  profession_id?: string;
  category?: string | null;
  icon?: string | null;
};

export default function PlayLobbyPage() {
  const router = useRouter();

  const apiBase = useMemo(() => {
    return getApiBaseUrl();
  }, []);

  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [showJoinCode, setShowJoinCode] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [meName, setMeName] = useState<string>("Player");
  const [meStats, setMeStats] = useState<{
    pesaPoints: number;
    pesaTokens: number;
    streak: number;
    tier?: string;
  }>({ pesaPoints: 0, pesaTokens: 0, streak: 0 });
  const [showMatchSetup, setShowMatchSetup] = useState(false);
  const [showFriends, setShowFriends] = useState(false);
  const [showSocieties, setShowSocieties] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showDailyQuiz, setShowDailyQuiz] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>("ai");
  const [playerCount, setPlayerCount] = useState<number>(2);
  const [selectedDreamId, setSelectedDreamId] = useState<string>("");

  function isAvailableLobby(x: unknown): x is { id: string; size: number; needsPlayers: number } {
    if (!x || typeof x !== "object") return false;
    const o = x as { id?: unknown; size?: unknown; needsPlayers?: unknown };
    return (
      typeof o.id === "string" &&
      typeof o.size === "number" &&
      typeof o.needsPlayers === "number"
    );
  }

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const token = getToken();
      if (!token) {
        router.replace("/play/login");
        return;
      }

      const ok = await validateToken(token).catch(() => false);
      if (cancelled) return;
      if (!ok) {
        clearAuth();
        router.replace("/play/login");
        return;
      }

      try {
        const cached = localStorage.getItem("pm_user");
        if (cached) {
          const parsed = JSON.parse(cached) as {
            displayName?: string;
            pesaPoints?: number;
            pesaTokens?: number;
            streak?: number;
            tier?: string;
          };
          if (parsed?.displayName) setMeName(parsed.displayName);
          setMeStats({
            pesaPoints: typeof parsed?.pesaPoints === "number" ? parsed.pesaPoints : 0,
            pesaTokens: typeof parsed?.pesaTokens === "number" ? parsed.pesaTokens : 0,
            streak: typeof parsed?.streak === "number" ? parsed.streak : 0,
            tier: parsed?.tier,
          });
        }
      } catch {
        // ignore
      }

      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${apiBase}/api/dreams`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          clearAuth();
          router.replace("/play/login");
          return;
        }

        if (!res.ok) throw new Error(`Failed to load dreams (${res.status})`);
        const data = (await res.json()) as Dream[];
        setDreams(data || []);
        if (data && data.length > 0) {
          setSelectedDreamId((prev) => prev || data[0].id);
        }
      } catch (e) {
        setError(String(e));
      } finally {
        setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [apiBase, router]);

  const handleStartFromSetup = async () => {
    const token = getToken();
    if (!token) {
      clearAuth();
      router.replace("/play/login");
      return;
    }

    if (!selectedDreamId) {
      setError("Please select a dream");
      return;
    }

    setStarting(true);
    setError(null);

    try {
      // Mirror mobile mapping: ai -> ai, online -> quick_play, private -> private
      const matchTypeMap: Record<GameMode, string> = {
        ai: "ai",
        online: "quick_play",
        private: "private",
      };

      if (gameMode === "online") {
        // Try join available lobby first (match mobile behavior)
        const availResp = await fetch(
          `${apiBase}/api/matches/lobbies/available?dream_id=${encodeURIComponent(selectedDreamId)}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (availResp.ok) {
          const lobbies: unknown = await availResp.json();
          if (Array.isArray(lobbies)) {
            const lobby = lobbies.find(
              (l) => isAvailableLobby(l) && l.size === playerCount && l.needsPlayers > 0,
            );

            if (lobby) {
              const joinResp = await fetch(`${apiBase}/api/matches/${lobby.id}/join`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
              });

              if (joinResp.ok) {
                const joinData: unknown = await joinResp.json();
                const matchId =
                  joinData &&
                    typeof joinData === "object" &&
                    "match" in joinData &&
                    (joinData as { match?: { id?: unknown } }).match &&
                    typeof (joinData as { match?: { id?: unknown } }).match?.id === "string"
                    ? (joinData as { match?: { id?: string } }).match?.id
                    : null;

                if (matchId) {
                  setShowMatchSetup(false);
                  router.push(`/play/game/${matchId}`);
                  return;
                }
              }
            }
          }
        }
      }

      // Otherwise create match
      const res = await fetch(`${apiBase}/api/matches/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          size: playerCount,
          vsAi: gameMode === "ai", // Only create bots for AI mode
          dreamId: selectedDreamId,
          matchType: matchTypeMap[gameMode],
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Failed to create match (${res.status})`);
      }

      const data = (await res.json()) as { matchId?: string; match?: { id?: string } };
      const matchId = data.matchId || data.match?.id;
      if (!matchId) throw new Error("No matchId returned");

      if (gameMode === "ai") {
        try {
          localStorage.setItem(`pm_autostart_${matchId}`, "1");
        } catch {
          // ignore
        }
      }

      setShowMatchSetup(false);
      router.push(`/play/game/${matchId}`);
    } catch (e) {
      setError(String(e));
    } finally {
      setStarting(false);
    }
  };

  const signOut = () => {
    clearAuth();
    router.replace("/play/login");
  };

  const startQuickAi = async (dreamId: string) => {
    const token = getToken();
    if (!token) return;

    setStarting(true);
    try {
      const res = await fetch(`${apiBase}/api/matches/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          size: 2,
          vsAi: true,
          dreamId,
          matchType: "ai",
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Failed to create match (${res.status})`);
      }

      const data = (await res.json()) as { matchId: string };
      if (!data?.matchId) throw new Error("No matchId returned");

      try {
        localStorage.setItem(`pm_autostart_${data.matchId}`, "1");
      } catch {
        // ignore
      }

      router.push(`/play/game/${data.matchId}`);
    } catch (e) {
      setError(String(e));
    } finally {
      setStarting(false);
    }
  };

  const joinByCode = async () => {
    const token = getToken();
    if (!token) {
      clearAuth();
      router.replace("/play/login");
      return;
    }

    const code = joinCode.trim().toUpperCase();
    if (!code) return;

    setJoining(true);
    try {
      const params = new URLSearchParams({ code });
      const res = await fetch(`${apiBase}/api/matches/join-by-code?${params.toString()}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Failed to join (${res.status})`);
      }
      const data: unknown = await res.json();
      const matchId =
        data &&
        typeof data === "object" &&
        (
          ("match" in data &&
            (data as { match?: { id?: unknown } }).match &&
            typeof (data as { match?: { id?: unknown } }).match?.id === "string" &&
            (data as { match?: { id?: string } }).match?.id) ||
          ("matchId" in data &&
            typeof (data as { matchId?: unknown }).matchId === "string" &&
            (data as { matchId?: string }).matchId)
        );
      if (!matchId) throw new Error("No matchId returned");
      setShowJoinCode(false);
      setJoinCode("");
      router.push(`/play/game/${matchId}`);
    } catch (e) {
      setError(String(e));
    } finally {
      setJoining(false);
    }
  };

  return (
    <main
      className="h-[100dvh] overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/Green_with_visuals_background.jpg')" }}
    >
      <div className="h-full bg-gradient-to-b from-[rgba(8,18,4,0.85)] via-[rgba(12,22,6,0.90)] to-[rgba(5,12,2,0.95)] flex flex-col">
        <AppHeader
          displayName={meName}
          profession={null}
          unreadCount={0}
          onPressProfile={() => { }}
          onPressNotifications={() => { }}
        />

        <div className="flex-1 overflow-y-auto no-scrollbar pb-4">
          <div className="max-w-2xl mx-auto flex flex-col h-full">
            <div className="flex items-center justify-center pt-1 pb-0 sm:pt-4">
              <Image
                src="/coverpesa_mali_page-0004-removebg-preview.png"
                alt="PesaMali"
                width={900}
                height={420}
                className="w-[min(320px,60vw)] sm:w-[520px] h-auto"
                priority
              />
            </div>

            {error && (
              <div className="mx-4 mt-1 rounded-xl border border-brand-red/40 bg-brand-red/10 p-2 text-[10px] text-brand-cream text-center">
                {error}
              </div>
            )}

            <div className="mt-0 sm:mt-2">
              <LobbyStats
                pesaPoints={meStats.pesaPoints}
                pesaTokens={meStats.pesaTokens}
                streak={meStats.streak}
                friendsCount={0}
                tier={meStats.tier || "Bronze"}
                onPressTokens={() => { }}
                onPressPoints={() => { }}
                onPressLeaderboard={() => setShowLeaderboard(true)}
              />
            </div>

            <div className="px-5 mt-4 sm:mt-6 mb-1 flex justify-between items-center">
              <div className="text-white text-[11px] font-black tracking-[2.5px] opacity-70 uppercase">Lobby Menu</div>
              <div className="h-[1px] flex-1 bg-white/10 ml-3" />
            </div>

            <div className="flex-1">
              <LobbyQuickActions
                onStartMatchSetup={() => setShowMatchSetup(true)}
                onShowJoinCode={() => setShowJoinCode(true)}
                onShowFriends={() => setShowFriends(true)}
                onShowSocieties={() => setShowSocieties(true)}
                onShowLeaderboard={() => setShowLeaderboard(true)}
                onShowDailyQuiz={() => setShowDailyQuiz(true)}
                friendsBadgeCount={0}
              />
            </div>

            <div className="px-5 mt-4 pb-4">
              <button
                onClick={signOut}
                className="w-full text-[11px] font-black uppercase tracking-wider py-3 rounded-2xl border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition bg-white/5 active:scale-[0.98]"
              >
                Logout Account
              </button>
            </div>
          </div>
        </div>

        {showJoinCode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => (joining ? null : setShowJoinCode(false))}
            />
            <div className="relative w-full max-w-md rounded-2xl bg-brand-cream text-brand-dark border border-[rgba(212,175,55,0.35)] p-6">
              <div className="text-lg font-extrabold mb-1">Join with lobby code</div>
              <div className="text-sm text-brand-dark/60 mb-4">
                Enter a code like PESA-1234
              </div>

              <input
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="PESA-1234"
                className="w-full rounded-xl bg-white border-2 border-[rgba(139,115,85,0.28)] px-4 py-3 font-extrabold tracking-widest uppercase outline-none"
              />

              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => setShowJoinCode(false)}
                  disabled={joining}
                  className="flex-1 rounded-xl border border-[rgba(139,115,85,0.35)] px-4 py-3 font-extrabold"
                >
                  Cancel
                </button>
                <button
                  onClick={joinByCode}
                  disabled={joining || joinCode.trim().length === 0}
                  className="flex-1 rounded-xl bg-brand-gold hover:bg-brand-gold-light disabled:opacity-50 px-4 py-3 font-extrabold text-white"
                >
                  {joining ? "Joining…" : "Join"}
                </button>
              </div>
            </div>
          </div>
        )}

        <MatchSetupModal
          open={showMatchSetup}
          onClose={() => setShowMatchSetup(false)}
          dreams={dreams as WebDream[]}
          selectedDreamId={selectedDreamId}
          setSelectedDreamId={setSelectedDreamId}
          gameMode={gameMode}
          setGameMode={setGameMode}
          playerCount={playerCount}
          setPlayerCount={setPlayerCount}
          onStart={handleStartFromSetup}
          starting={starting}
        />

        <FriendsModal
          open={showFriends}
          onClose={() => setShowFriends(false)}
        />

        <SocietiesModal
          open={showSocieties}
          onClose={() => setShowSocieties(false)}
        />

        <LeaderboardModal
          open={showLeaderboard}
          onClose={() => setShowLeaderboard(false)}
        />

        <DailyQuizModal
          open={showDailyQuiz}
          onClose={() => setShowDailyQuiz(false)}
        />
      </div>
    </main>
  );
}
