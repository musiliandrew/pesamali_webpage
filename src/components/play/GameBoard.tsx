"use client";

import React, { useMemo } from "react";
import { ArrowRight, ArrowLeft, ArrowUp, ArrowDown, Target } from "lucide-react";
import type { BoardTile, Token, PlayerState } from "@/types/game";

const ROWS = 8;
const COLS = 10;

interface GameBoardProps {
    tiles: BoardTile[];
    tokens: Token[];
    currentUserId?: string;
    onTokenPress?: (tokenId: string) => void;
    selectableTokenIds?: string[];
    activeDirection?: number;
    highlightedTiles?: number[];
    players?: PlayerState[];
    animatingPath?: { tokenId: string; path: number[] } | null;
}

export default function GameBoard({
    tiles,
    tokens,
    currentUserId,
    onTokenPress,
    selectableTokenIds = [],
    activeDirection,
    highlightedTiles = [],
    players = [],
    animatingPath = null,
}: GameBoardProps) {
    const [visualStep, setVisualStep] = React.useState<{ tokenId: string; position: number } | null>(null);

    // Path Hopping Animation System
    React.useEffect(() => {
        if (!animatingPath || !animatingPath.path || animatingPath.path.length === 0) {
            setVisualStep(null);
            return;
        }

        let step = 0;
        const interval = setInterval(() => {
            if (step < animatingPath.path.length) {
                setVisualStep({ tokenId: animatingPath.tokenId, position: animatingPath.path[step] });
                step++;
            } else {
                clearInterval(interval);
            }
        }, 150); // Speed of the "hop"

        return () => clearInterval(interval);
    }, [animatingPath]);

    // Safety check
    if (!tiles || tiles.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-brand-gold/40 animate-pulse">
                <Target size={48} className="mb-4" />
                <span className="font-black uppercase tracking-widest text-sm">Constructing Arena...</span>
            </div>
        );
    }

    // Helper to get visual row/col for an index (1-based)
    const getVisualPos = (index: number) => {
        const row = Math.floor((index - 1) / COLS);
        const colInRow = (index - 1) % COLS;
        const isReversed = row % 2 === 1;
        const col = isReversed ? COLS - 1 - colInRow : colInRow;
        return { row, col };
    };

    // Precompute connectors/arrows between consecutive tiles
    const connectors = useMemo(() => {
        const result = [];
        for (let i = 1; i < ROWS * COLS; i++) {
            const from = i;
            const to = i + 1;
            const p1 = getVisualPos(from);
            const p2 = getVisualPos(to);

            const dx = p2.col - p1.col;
            const dy = p2.row - p1.row;

            let rotation = 0;
            if (dx > 0) rotation = 0; // Right
            else if (dx < 0) rotation = 180; // Left
            else if (dy > 0) rotation = 90; // Down
            else if (dy < 0) rotation = 270; // Up

            result.push({ from, to, row: (p1.row + p2.row) / 2, col: (p1.col + p2.col) / 2, rotation });
        }
        return result;
    }, []);

    return (
        <div className="w-full h-full flex items-center justify-center p-2 md:p-6 select-none">
            <div className="relative w-full max-w-5xl aspect-[10/8] bg-brand-dark/20 rounded-[2.5rem] border-4 border-brand-olive/10 shadow-[0_30px_100px_rgba(0,0,0,0.5)] overflow-hidden">

                {/* 1. The Tile Grid */}
                <div className="absolute inset-0 grid grid-cols-10 grid-rows-8">
                    {Array.from({ length: ROWS }).map((_, r) => (
                        <React.Fragment key={r}>
                            {Array.from({ length: COLS }).map((_, c) => {
                                const isReversed = r % 2 === 1;
                                const colInRow = isReversed ? COLS - 1 - c : c;
                                const tileIdx = (r * COLS) + colInRow + 1;
                                const tile = tiles.find(t => t.index === tileIdx);
                                if (!tile) return <div key={`${r}-${c}`} />;

                                const isForwardActive = activeDirection === 1;
                                const isHighlighted = highlightedTiles.includes(tileIdx);

                                return (
                                    <div
                                        key={tileIdx}
                                        className={`relative border-[0.5px] border-brand-gold/40 flex items-center justify-center transition-all duration-300 hover:bg-brand-gold/10 ${tile.isYellow ? "bg-brand-gold/20" : "bg-black/30"
                                            } ${tile.isAssetSpace ? "bg-brand-gold/10" : ""} ${isHighlighted ? "z-20 ring-2 ring-brand-gold shadow-[0_0_20px_rgba(212,175,55,0.5)] !border-brand-gold" : ""
                                            }`}
                                    >
                                        <span className={`absolute top-1 left-1.5 text-[7px] md:text-[9px] font-black tracking-tight transition-opacity duration-500 ${isForwardActive ? "text-brand-gold opacity-80" : "text-brand-cream/10"
                                            }`}>
                                            {tileIdx}
                                        </span>
                                        <span className={`absolute bottom-1 right-1.5 text-[7px] md:text-[9px] font-black tracking-tight transition-opacity duration-500 ${!isForwardActive ? "text-brand-gold opacity-80" : "text-brand-cream/10"
                                            }`}>
                                            {81 - tileIdx}
                                        </span>
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>

                {/* 2. Directional Arrows Layer */}
                <div className="absolute inset-0 pointer-events-none opacity-40">
                    {connectors.map((conn) => {
                        const top = ((conn.row + 0.5) / ROWS) * 100;
                        const left = ((conn.col + 0.5) / COLS) * 100;
                        const isAscending = activeDirection === 1;

                        return (
                            <div
                                key={`${conn.from}-${conn.to}`}
                                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col gap-1 items-center justify-center p-1"
                                style={{ top: `${top}%`, left: `${left}%` }}
                            >
                                <ArrowRight
                                    size={10}
                                    className={`transition-all duration-700 ${isAscending ? "text-green-500 opacity-100 scale-125" : "text-brand-cream/10 opacity-30"}`}
                                    style={{ transform: `rotate(${conn.rotation}deg)` }}
                                />
                                <ArrowRight
                                    size={10}
                                    className={`transition-all duration-700 ${!isAscending ? "text-blue-500 opacity-100 scale-125" : "text-brand-cream/10 opacity-30"}`}
                                    style={{ transform: `rotate(${conn.rotation + 180}deg)` }}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* 3. Tokens Layer */}
                <div className="absolute inset-0 pointer-events-none">
                    {tokens.map((token) => {
                        const player = players.find(p => p.userId === token.playerId);
                        const isDirectionForward = player?.direction === 1;
                        const isFinished = isDirectionForward ? token.position > 80 : token.position < 1;
                        if (isFinished) return null;

                        // Use visual hop position if animating
                        const displayPosition = (visualStep?.tokenId === token.id) ? visualStep.position : token.position;
                        const visual = getVisualPos(displayPosition);
                        const isAnimating = visualStep?.tokenId === token.id;

                        // Calculate collision offset based on displayPosition
                        const tileTokens = tokens.filter(t => {
                            const tp = players.find(p => p.userId === t.playerId);
                            const tFinished = tp?.direction === 1 ? t.position > 80 : t.position < 1;
                            const tPos = (visualStep?.tokenId === t.id) ? visualStep.position : t.position;
                            return tPos === displayPosition && !tFinished;
                        });
                        const tokenIdxInTile = tileTokens.findIndex(t => t.id === token.id);

                        const GRID_SIZE = 4;
                        const rowOffset = Math.floor(tokenIdxInTile / GRID_SIZE);
                        const colOffset = tokenIdxInTile % GRID_SIZE;

                        const baseX = ((visual.col + 0.5) / COLS) * 100;
                        const baseY = ((visual.row + 0.5) / ROWS) * 100;

                        const horizontalSpacing = 1.6;
                        const verticalSpacing = 1.6;

                        const shiftX = (colOffset - (GRID_SIZE - 1) / 2) * horizontalSpacing / COLS * 100;
                        const shiftY = (rowOffset - (GRID_SIZE - 1) / 2) * verticalSpacing / ROWS * 100;

                        const finalX = baseX + shiftX;
                        const finalY = baseY + shiftY;

                        const isSelectable = (selectableTokenIds || []).includes(token.id);
                        const playerColors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A8E6CF'];
                        const playerIdx = players.findIndex(p => p.userId === token.playerId);
                        const visualColor = playerIdx !== -1 ? playerColors[playerIdx % 4] : token.color;

                        return (
                            <button
                                key={token.id}
                                disabled={!isSelectable}
                                onClick={() => onTokenPress?.(token.id)}
                                className={`absolute w-[3.5%] aspect-square rounded-full border-2 border-brand-dark shadow-2xl pointer-events-auto ${isAnimating ? "z-[60] transition-all duration-150 ease-out scale-110 shadow-brand-gold/40" :
                                        isSelectable ? "ring-4 ring-brand-gold animate-pulse scale-125 z-50 cursor-pointer shadow-brand-gold/50 transition-all duration-300" :
                                            "z-40 cursor-default transition-all duration-1000"
                                    }`}
                                style={{
                                    top: `${finalY}%`,
                                    left: `${finalX}%`,
                                    transform: `translate(-50%, -50%)`,
                                    backgroundColor: visualColor,
                                }}
                            >
                                {currentUserId === token.playerId && (
                                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#fbb03b] rounded-full border border-brand-dark shadow-[0_0_5px_rgba(212,175,55,0.8)] z-10" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Aesthetic Overlays */}
                <div className="absolute inset-0 pointer-events-none border-[12px] border-brand-dark/20 rounded-[2.5rem] shadow-[inset_0_30px_60px_rgba(0,0,0,0.4)]" />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-brand-gold/5 via-transparent to-brand-gold/5 opacity-30" />
            </div>
        </div>
    );
}
