"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { io, type Socket } from "socket.io-client";
import { getWsBaseUrl } from "@/lib/env";
import { getToken, getUserIdFromToken } from "@/lib/auth";
import type { GameState, TokenId, PlayerState, AssetId, PlayingCard } from "@/types/game";

// Components & Modals
import GameBoard from "@/components/play/GameBoard";
import DiceRoller from "@/components/play/DiceRoller";
import GameStats from "@/components/play/GameStats";
import AssetDraftModal from "@/components/play/AssetDraftModal";
import BuyAssetModal from "@/components/play/BuyAssetModal";
import CardRevealModal from "@/components/play/CardRevealModal";
import BuyDreamModal from "@/components/play/BuyDreamModal";
import MyAssetsModal from "@/components/play/MyAssetsModal";

// Icons
import { ChevronLeft, Info, Trophy, LayoutGrid, Briefcase, CreditCard, HelpCircle, XCircle, Target } from "lucide-react";

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

  const wsBase = useMemo(() => getWsBaseUrl(), []);
  const socketRef = useRef<Socket | null>(null);

  // Core State
  const [connection, setConnection] = useState<ConnectionState>("connecting");
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [me, setMe] = useState<PlayerState | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [isSubmittingDraft, setIsSubmittingDraft] = useState(false);
  const [botStatus, setBotStatus] = useState<{ userId: string; status: string; action?: string } | null>(null);
  const [cardDrawerId, setCardDrawerId] = useState<string | null>(null);
  const [turnCountdown, setTurnCountdown] = useState<number | null>(null);
  const [animatingPath, setAnimatingPath] = useState<{ tokenId: string; path: number[] } | null>(null);

  // Modal State
  const [modals, setModals] = useState({
    draft: false,
    buyAsset: false,
    cardReveal: false,
    buyDream: false,
    myAssets: false,
  });

  // Event Data for Modals
  const [activeCard, setActiveCard] = useState<PlayingCard | null>(null);
  const [buyAssetRequest, setBuyAssetRequest] = useState<{ assetIds: AssetId[] } | null>(null);

  // Derived State
  const currentPlayer = useMemo(() => {
    if (!gameState) return null;
    return gameState.players[gameState.currentPlayerIndex] || null;
  }, [gameState]);

  const isMyTurn = useMemo(() => {
    if (!gameState || !me) return false;
    return currentPlayer?.userId === me.userId;
  }, [gameState, me, currentPlayer]);

  // Socket Connection & Listeners
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

      const key = `pm_autostart_${matchId}`;
      if (localStorage.getItem(key) === "1") {
        localStorage.removeItem(key);
        socket.emit("start_match", { matchId });
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
      setError(asMessage(e));
      setTimeout(() => setError(null), 5000);
    });

    socket.on("game_state", (state: GameState) => {
      setGameState(state);

      // Auto-open draft modal if in PRE_GAME
      if (state.phase === 'PRE_GAME') {
        setModals(m => ({ ...m, draft: true }));
      } else {
        setModals(m => ({ ...m, draft: false }));
      }

      // Identify "me"
      const tokenUserId = getUserIdFromToken();
      const userStr = localStorage.getItem("pm_user");
      let storageId = null;
      if (userStr) {
        try { storageId = JSON.parse(userStr).id; } catch { }
      }

      const myId = tokenUserId || storageId;
      if (myId) {
        const found = state.players.find(p => p.userId === myId);
        if (found) setMe(found);
      }
    });

    socket.on("buy_asset_request", (data: { assetIds: AssetId[] }) => {
      setBuyAssetRequest(data);
      setModals(m => ({ ...m, buyAsset: true }));
    });

    socket.on("draw_playing_card", (data: { card: PlayingCard }) => {
      setActiveCard(data.card);
      setCardDrawerId(currentPlayer?.userId || null);
      setModals(m => ({ ...m, cardReveal: true }));
    });

    socket.on("card_draw", (data: { userId: string; card: PlayingCard }) => {
      setActiveCard(data.card);
      setCardDrawerId(data.userId);
      setModals(m => ({ ...m, cardReveal: true }));
    });

    socket.on("dice_result", (data: { userId: string; total: number; values: number[] }) => {
      if (data.userId !== me?.userId) {
        // Sync dice result from others to show in UI
        setIsRolling(false);
      }
    });

    socket.on("move_event", (data: { userId: string; tokenId: string; path: number[] }) => {
      setAnimatingPath({ tokenId: data.tokenId, path: data.path });
      // Reset animation path after logic (1.5s normally)
      setTimeout(() => setAnimatingPath(null), 1600);
    });

    socket.on("bot_turn", (data: { userId: string; status: string; action?: string }) => {
      setBotStatus(data);
      if (data.status === 'done') {
        setTimeout(() => setBotStatus(null), 1000);
      }
    });

    socket.on("asset_return", (data: { userId: string; returns: any[] }) => {
      // Could trigger a brief "KES +X" floating animation here
    });

    socket.on("game_event", (event: any) => {
      // Handle specific event-driven transitions if needed
      if (event.type === 'win_declared') {
        // Potential win modal logic
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [matchId, router, wsBase]);

  // Actions
  const handleRoll = useCallback(() => {
    if (!isMyTurn || gameState?.turnPhase !== "WAIT_FOR_ROLL") return;
    setIsRolling(true);
    socketRef.current?.emit("roll", { matchId });
  }, [isMyTurn, gameState?.currentPlayerIndex, gameState?.turnPhase, matchId]);

  const handleTokenSelect = useCallback((tokenId: TokenId) => {
    if (!isMyTurn || gameState?.turnPhase !== "WAIT_FOR_TOKEN_SELECT") return;
    socketRef.current?.emit("select_token", { matchId, tokenId });
  }, [isMyTurn, gameState?.currentPlayerIndex, gameState?.turnPhase, matchId]);

  const handleEndTurn = useCallback(() => {
    if (!isMyTurn || gameState?.turnPhase !== "READY_TO_END_TURN") return;
    socketRef.current?.emit("end_turn", { matchId });
  }, [isMyTurn, gameState?.currentPlayerIndex, gameState?.turnPhase, matchId]);

  const handleBuyAsset = useCallback((assetId: string) => {
    socketRef.current?.emit("buy_asset", { matchId, assetId });
    setModals(m => ({ ...m, buyAsset: false }));
  }, [matchId]);

  const handleDraftConfirm = useCallback((assetId: string) => {
    if (!gameState || isSubmittingDraft) return;
    setIsSubmittingDraft(true);
    socketRef.current?.emit("pick_asset", { matchId, assetId });
    // Note: isSubmittingDraft is reset by game_state event or can be timed out
    setTimeout(() => setIsSubmittingDraft(false), 2000);
  }, [matchId, gameState, isSubmittingDraft]);

  const handleBuyDream = useCallback(() => {
    socketRef.current?.emit("buy_dream", { matchId });
    setModals(m => ({ ...m, buyDream: false }));
  }, [matchId]);

  const handleForfeit = useCallback(() => {
    if (socketRef.current && matchId) {
      if (confirm("Are you sure you want to end the game? No points will be awarded.")) {
        socketRef.current.emit("forfeit", { matchId });
        router.replace("/play/lobby");
      }
    }
  }, [matchId, router]);

  const mySelectedDraftAssets = me?.selectedAssets || [];
  const selectableTokenIds = isMyTurn && gameState && gameState.turnPhase === "WAIT_FOR_TOKEN_SELECT"
    ? me?.tokens.map(t => t.id)
    : [];

  // 1. Turn Timer Logic
  useEffect(() => {
    if (!gameState || !me) return;
    const timedPhases = ["WAIT_FOR_ROLL", "WAIT_FOR_TOKEN_SELECT", "READY_TO_END_TURN"];
    if (isMyTurn && timedPhases.includes(gameState.turnPhase)) {
      setTurnCountdown(20);
    } else {
      setTurnCountdown(null);
    }
  }, [gameState?.currentPlayerIndex, gameState?.turnPhase, isMyTurn, me]);

  useEffect(() => {
    if (turnCountdown === null) return;
    if (turnCountdown <= 0) {
      // Auto-Action at 0
      if (isMyTurn && gameState) {
        if (gameState.turnPhase === "WAIT_FOR_ROLL") {
          handleRoll();
        } else if (gameState.turnPhase === "WAIT_FOR_TOKEN_SELECT" && me?.tokens?.length) {
          handleTokenSelect(me.tokens[0].id);
        } else if (gameState.turnPhase === "READY_TO_END_TURN") {
          handleEndTurn();
        }
      }
      setTurnCountdown(null);
      return;
    }
    const timer = setTimeout(() => setTurnCountdown(c => c !== null ? c - 1 : null), 1000);
    return () => clearTimeout(timer);
  }, [turnCountdown, isMyTurn, gameState, handleRoll, handleTokenSelect, handleEndTurn, me]);

  // 2. Client Predictor (Wait for Single Token moved to Timer Logic)

  // 3. Asset Return Visual Feedback
  const [returnFeed, setReturnFeed] = useState<{ amount: number; userId: string; id: number } | null>(null);
  useEffect(() => {
    const handler = (data: { userId: string; returns: { amount: number }[] }) => {
      const total = data.returns.reduce((sum, r) => sum + r.amount, 0);
      if (total > 0) {
        setReturnFeed({ amount: total, userId: data.userId, id: Date.now() });
        setTimeout(() => setReturnFeed(null), 3000);
      }
    };
    socketRef.current?.on("asset_return", handler);
    return () => { socketRef.current?.off("asset_return", handler); };
  }, [gameState?.matchId]);

  if (!gameState) {
    return (
      <main className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-8">
        <div className="animate-spin text-brand-gold mb-6">
          <RefreshCw size={64} />
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-brand-cream text-xl font-black uppercase tracking-[4px]">PesaMali</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[url('/solid_color_branding.png')] bg-cover bg-fixed bg-center text-brand-cream font-sans selection:bg-brand-gold/30 selection:text-brand-gold overflow-x-hidden relative">
      <style jsx global>{`
        @keyframes soft-pulse { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.1); } }
        @keyframes soft-pulse-slow { 0%, 100% { opacity: 0.2; transform: scale(1.1); } 50% { opacity: 0.4; transform: scale(1); } }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Floating Return Feedback Overlay */}
      {returnFeed && (
        <div className="fixed inset-0 pointer-events-none z-[200] flex items-center justify-center">
          <div className={`p-6 rounded-3xl bg-emerald-500/90 text-white backdrop-blur-md shadow-[0_20px_50px_rgba(16,185,129,0.4)] animate-in fade-in zoom-in slide-in-from-bottom-12 duration-500 flex flex-col items-center gap-2 border-2 border-white/20`}>
            <span className="text-[10px] font-black uppercase tracking-[3px] opacity-70">Asset Returns</span>
            <span className="text-4xl font-black italic">+KES {returnFeed.amount.toLocaleString()}</span>
            <span className="text-[11px] font-bold opacity-80">{gameState.players.find(p => p.userId === returnFeed.userId)?.displayName || 'Player'}</span>
          </div>
        </div>
      )}

      {/* V2 Mobile Header Overlay (Mobile Only) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-[150] bg-[#fefcf3] border-b border-[#8b7355]/20 px-4 py-3 flex items-center justify-between shadow-sm">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 bg-white border-2 border-brand-dark/10 rounded-xl flex items-center justify-center text-brand-dark active:scale-90 transition-all shadow-sm"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black text-brand-dark/40 uppercase tracking-widest leading-none">
              TURN {gameState?.currentPlayerIndex !== undefined ? gameState.currentPlayerIndex + 1 : 1} · ROUND {gameState?.turnNumber || 1}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <div className={`w-2 h-2 rounded-full ${isMyTurn ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]' : 'bg-brand-dark/20'}`} />
            <div className="flex items-center gap-1">
              <Target size={12} className={isMyTurn ? "text-brand-gold" : "text-brand-dark/20"} />
              <span className={`text-[11px] font-black uppercase tracking-widest ${isMyTurn ? "text-brand-gold" : "text-brand-dark/20"}`}>
                {isMyTurn ? "Your Turn" : "Wait Turn"}
              </span>
            </div>
          </div>
        </div>

        <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-red-500/30">
          {turnCountdown !== null ? turnCountdown : "20"}
        </div>
      </div>

      {/* Mobile Decision Banner (Only shown during wait turns) */}
      {!isMyTurn && gameState?.phase === 'IN_PROGRESS' && (
        <div className="lg:hidden fixed top-[64px] left-0 right-0 z-[140] animate-in slide-in-from-top duration-500">
          <div className="bg-[#fbb03b] py-1.5 px-4 flex items-center justify-center gap-2 shadow-lg shadow-[#fbb03b]/20">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase text-white tracking-widest leading-none">
              {currentPlayer?.displayName} is {
                gameState.turnPhase === 'WAIT_FOR_ROLL' ? "Preparing to Roll" :
                  gameState.turnPhase === 'WAIT_FOR_TOKEN_SELECT' ? "Choosing a Token" :
                    gameState.turnPhase === 'WAIT_FOR_ASSET_PICK' ? "Picking an Asset" :
                      "Making a Decision"
              }
            </span>
          </div>
        </div>
      )}

      <div className="min-h-screen px-4 py-4 sm:py-8 lg:pt-8 pt-16 relative z-10">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-4">

          {/* Desktop Navigation (Hidden on Mobile) */}
          <div className="hidden lg:flex items-center justify-between gap-6 border-b border-brand-olive/20 pb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.replace("/play/lobby")}
                className="w-12 h-12 rounded-2xl bg-brand-cream/5 border border-brand-olive/20 flex items-center justify-center hover:bg-brand-gold hover:text-brand-dark transition-all active:scale-90 shadow-xl"
              >
                <ChevronLeft size={24} />
              </button>
              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-yellow-200 to-brand-gold uppercase tracking-tighter">
                PESAMALI ARENA
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-brand-dark/40 px-6 py-3 rounded-2xl border border-brand-olive/30 flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-black uppercase text-brand-cream/40 tracking-widest leading-none mb-1">Status</span>
                  <span className="text-[11px] font-black uppercase text-brand-gold tracking-widest leading-none">
                    {connection}
                  </span>
                </div>
                <div className={`w-3 h-3 rounded-full ${connection === 'connected' ? 'bg-green-500 shadow-green-500/50 animate-pulse' : 'bg-brand-red shadow-brand-red/50'}`} />
              </div>
              <button
                onClick={handleForfeit}
                className="px-6 py-3 rounded-2xl bg-brand-red/10 border border-brand-red/40 text-brand-red font-black uppercase tracking-widest hover:bg-brand-red hover:text-white transition-all active:scale-95 shadow-lg group flex items-center gap-2"
              >
                <XCircle size={16} />
                <span>End Game</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="relative bg-brand-red/10 border border-brand-red/40 p-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-4 overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-red" />
              <Info size={20} className="text-brand-red shrink-0" />
              <span className="text-brand-red/80">{error}</span>
            </div>
          )}

          {gameState && (
            <>
              {/* V2 Mobile Goal Banner (Mobile Only) */}
              <div className="lg:hidden p-3 rounded-2xl bg-[#fbb03b] border-2 border-white/20 flex items-center justify-between shadow-lg relative overflow-hidden mb-2">
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-50" />
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white">
                    <Trophy size={20} />
                  </div>
                  <div>
                    <span className="text-[8px] font-black text-white/60 uppercase tracking-[2px]">Objective</span>
                    <h3 className="text-[14px] font-black text-white uppercase tracking-tight">The Hillside Mansion</h3>
                  </div>
                </div>
                <div className="bg-white px-3 py-1.5 rounded-full shadow-inner relative z-10">
                  <span className="text-[11px] font-black text-[#fbb03b] uppercase tracking-tight">1,300 Pts</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Mobile Player Stats (Stacked, Mobile Only) */}
                <div className="lg:hidden flex flex-col gap-1.5 w-full px-1">
                  {gameState.players.map((p) => (
                    <GameStats
                      key={p.userId}
                      player={p}
                      isCurrentTurn={currentPlayer?.userId === p.userId}
                      variant="v2-mobile"
                      currentUserId={me?.userId}
                    />
                  ))}
                </div>

                {/* Left Column: Desktop Command Center (Hidden on Mobile) */}
                <div className="hidden lg:flex lg:col-span-3 flex-col gap-6 lg:sticky lg:top-8 order-2 lg:order-none">
                  <div className="flex items-center justify-between px-2">
                    <h2 className="text-[11px] font-black uppercase tracking-[3px] text-brand-cream/40 leading-none">Command Center</h2>
                  </div>
                  <div className="p-1 bg-brand-gold/10 rounded-[2.5rem] shadow-2xl">
                    <DiceRoller
                      onRoll={handleRoll}
                      result={gameState.diceResult}
                      disabled={!isMyTurn || gameState.turnPhase !== 'WAIT_FOR_ROLL'}
                      onRollingStateChange={setIsRolling}
                    />
                  </div>
                </div>

                {/* Middle Column: The Arena */}
                <div className="lg:col-span-6 flex flex-col gap-8 w-full">
                  <div className="relative group p-1 md:p-3 rounded-[2.5rem] md:rounded-[3rem] bg-brand-dark/20 border border-brand-gold/10 shadow-[0_0_80px_rgba(212,175,55,0.1)] backdrop-blur-sm mx-auto w-full">
                    <GameBoard
                      tiles={gameState.board}
                      tokens={gameState.players.flatMap(p => p.tokens)}
                      currentUserId={me?.userId}
                      onTokenPress={handleTokenSelect}
                      selectableTokenIds={selectableTokenIds}
                      activeDirection={currentPlayer?.direction}
                      players={gameState.players}
                      animatingPath={animatingPath}
                    />
                  </div>
                </div>

                {/* Right Column: Desktop Competitors (Hidden on Mobile) */}
                <div className="hidden lg:flex lg:col-span-3 flex-col gap-6 lg:sticky lg:top-8 order-3 lg:order-none">
                  <div className="flex items-center justify-between px-2">
                    <h2 className="text-[11px] font-black uppercase tracking-[3px] text-brand-cream/40">Competitors</h2>
                  </div>
                  {gameState.players.map((p) => (
                    <GameStats
                      key={p.userId}
                      player={p}
                      isCurrentTurn={currentPlayer?.userId === p.userId}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modals Container */}
      {gameState?.phase === "PRE_GAME" && gameState.draft && (
        <AssetDraftModal
          open={modals.draft}
          onClose={() => setModals(m => ({ ...m, draft: false }))}
          isMyTurn={gameState.draft.currentPickerUserId === me?.userId}
          availableAssets={gameState.draft.availableAssets || []}
          currentPickerName={
            gameState.players.find(p => p.userId === gameState.draft?.currentPickerUserId)?.displayName || "Opponent"
          }
          myAssetsCount={me?.selectedAssets?.length || 0}
          isSubmitting={isSubmittingDraft}
          onConfirm={handleDraftConfirm}
        />
      )}

      {gameState && (
        <BuyAssetModal
          open={modals.buyAsset}
          onClose={() => setModals(m => ({ ...m, buyAsset: false }))}
          selectedAssets={buyAssetRequest?.assetIds || []}
          assetsPool={gameState.assetsPool}
          playerPoints={me?.onHandPoints || 0}
          onBuyAsset={handleBuyAsset}
          ownedAssetIds={me?.assets.map(a => a.assetId) || []}
        />
      )}

      <CardRevealModal
        open={modals.cardReveal}
        card={activeCard}
        player={gameState?.players.find(p => p.userId === cardDrawerId) || me}
        onClose={() => {
          setModals(m => ({ ...m, cardReveal: false }));
          setCardDrawerId(null);
        }}
      />

      <BuyDreamModal
        open={modals.buyDream}
        onClose={() => setModals(m => ({ ...m, buyDream: false }))}
        dreamName={"The Dream"}
        dreamCost={gameState?.dreamCost || 1000}
        canDeclareWin={!!me && me.onHandPoints >= (gameState?.dreamCost || 1000) + (me.liabilities || 0)}
        playerCash={me?.onHandPoints}
        playerLiabilities={me?.liabilities}
        onConfirm={handleBuyDream}
      />

      <MyAssetsModal
        open={modals.myAssets}
        onClose={() => setModals(m => ({ ...m, myAssets: false }))}
        assets={me?.assets || []}
        assetsPool={gameState?.assetsPool || []}
      />

      {/* V2 Mobile Fixed Bottom Command Center (Mobile Only) */}
      {gameState?.phase === 'IN_PROGRESS' && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-[#fefcf3] border-t-2 border-[#8b7355]/20 p-5 pt-8 pb-8 rounded-t-[3.5rem] shadow-[0_-20px_60px_rgba(0,0,0,0.15)] animate-in slide-in-from-bottom-full duration-500">
          <div className="max-w-md mx-auto relative pt-4">
            {/* V2 Integrated Quick Actions */}
            <button
              onClick={() => setModals(m => ({ ...m, myAssets: true }))}
              className="absolute top-0 left-0 w-11 h-11 bg-white border-2 border-[#8b7355]/10 rounded-xl flex items-center justify-center text-brand-dark shadow-sm active:scale-95 transition-all z-[101]"
            >
              <Briefcase size={20} />
            </button>
            <button
              onClick={() => setModals(m => ({ ...m, buyDream: true }))}
              className={`absolute top-0 right-0 w-11 h-11 rounded-xl flex items-center justify-center shadow-sm transition-all active:scale-95 z-[101] ${!!me && me.onHandPoints >= (gameState?.dreamCost || 1000) + (me.liabilities || 0)
                ? "bg-[#fbb03b] text-white border-2 border-white/40 shadow-orange-200"
                : "bg-white border-2 border-[#8b7355]/10 text-brand-dark/20"
                }`}
            >
              <Target size={20} />
            </button>

            <DiceRoller
              onRoll={handleRoll}
              onEndTurn={handleEndTurn}
              result={gameState.diceResult}
              size="v2-mobile-drawer"
              turnPhase={gameState.turnPhase}
              isMyTurn={isMyTurn}
              currentPickerName={currentPlayer?.displayName || "Opponent"}
            />
          </div>
        </div>
      )}
    </main>
  );
}

function RefreshCw({ size }: { size: number }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  );
}
