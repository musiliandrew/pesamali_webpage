"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Dice5, Hourglass } from "lucide-react";

interface DiceRollerProps {
    onRoll: () => void;
    onEndTurn?: () => void;
    result: { die1: number; die2: number; seed?: number } | null;
    disabled?: boolean;
    onAnimationComplete?: () => void;
    onRollingStateChange?: (isRolling: boolean) => void;
    size?: 'default' | 'small' | 'v2-mobile-drawer';
    turnPhase?: string;
    isMyTurn?: boolean;
    currentPickerName?: string;
}

const ROTATIONS = [
    { x: 0, y: 0 },       // Face 1
    { x: 0, y: -90 },     // Face 2
    { x: -90, y: 0 },     // Face 3
    { x: 90, y: 0 },      // Face 4
    { x: 0, y: 90 },      // Face 5
    { x: 180, y: 0 },     // Face 6
];

const DieCube = ({ value, rolling, size = 'default' }: { value: number; rolling: boolean; size?: 'default' | 'small' | 'v2-mobile-drawer' }) => {
    const rotation = ROTATIONS[value - 1] || ROTATIONS[0];
    const isSmall = size === 'small';
    const isV2Drawer = size === 'v2-mobile-drawer';
    const dimensions = isSmall ? 'w-10 h-10' : (isV2Drawer ? 'w-[64px] h-[64px]' : 'w-16 h-16');
    const translateZValue = isSmall ? '20px' : (isV2Drawer ? '31.5px' : '31.5px');
    const pipSize = isSmall ? 'w-1.5 h-1.5' : (isV2Drawer ? 'w-2.5 h-2.5' : 'w-3 h-3');

    const Face = ({ children, transform }: { children: React.ReactNode; transform: string }) => (
        <div
            className="absolute inset-0 bg-white border-2 border-brand-dark/5 rounded-xl flex items-center justify-center [backface-visibility:hidden] shadow-[inset_0_0_8px_rgba(0,0,0,0.05)]"
            style={{ transform: `${transform} translateZ(${translateZValue})` }}
        >
            {children}
        </div>
    );

    return (
        <div className={`${dimensions} [perspective:400px]`}>
            <div
                className={`relative w-full h-full [transform-style:preserve-3d] transition-transform duration-[1500ms] ease-[cubic-bezier(0.17,0.67,0.83,0.67)] ${rolling ? 'animate-dice-tumble' : ''}`}
                style={!rolling ? { transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` } : undefined}
            >
                {/* Face 1 */}
                <Face transform="">
                    <div className={`${pipSize} bg-brand-dark rounded-full shadow-[inset_0_1.5px_2px_rgba(0,0,0,0.8)]`} />
                </Face>
                {/* Face 6 */}
                <Face transform="rotateY(180deg)">
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                        {[...Array(6)].map((_, i) => <div key={i} className={`${pipSize} bg-brand-dark rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]`} />)}
                    </div>
                </Face>
                {/* Face 2 */}
                <Face transform="rotateY(90deg)">
                    <div className="flex flex-col justify-between h-full py-2">
                        <div className={`${pipSize} bg-brand-dark rounded-full self-start shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]`} />
                        <div className={`${pipSize} bg-brand-dark rounded-full self-end shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]`} />
                    </div>
                </Face>
                {/* Face 5 */}
                <Face transform="rotateY(-90deg)">
                    <div className="grid grid-cols-2 gap-2">
                        <div className={`${pipSize} bg-brand-dark rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]`} />
                        <div className={`${pipSize} bg-brand-dark rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]`} />
                        <div className={`${pipSize} bg-brand-dark rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] col-span-2 justify-self-center`} />
                        <div className={`${pipSize} bg-brand-dark rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]`} />
                        <div className={`${pipSize} bg-brand-dark rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]`} />
                    </div>
                </Face>
                {/* Face 3 */}
                <Face transform="rotateX(90deg)">
                    <div className="flex flex-col justify-between h-full py-2">
                        <div className={`${pipSize} bg-brand-dark rounded-full self-start shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]`} />
                        <div className={`${pipSize} bg-brand-dark rounded-full self-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]`} />
                        <div className={`${pipSize} bg-brand-dark rounded-full self-end shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]`} />
                    </div>
                </Face>
                {/* Face 4 */}
                <Face transform="rotateX(-90deg)">
                    <div className="grid grid-cols-2 gap-2">
                        {[...Array(4)].map((_, i) => <div key={i} className={`${pipSize} bg-brand-dark rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]`} />)}
                    </div>
                </Face>
            </div>
        </div>
    );
};

export default function DiceRoller({
    onRoll,
    onEndTurn,
    result,
    disabled = false,
    onAnimationComplete,
    onRollingStateChange,
    size = 'default',
    turnPhase,
    isMyTurn,
    currentPickerName,
}: DiceRollerProps) {
    const [isRolling, setIsRolling] = useState(false);
    const [currentResult, setCurrentResult] = useState<{
        die1: number;
        die2: number;
        seed?: number;
    } | null>(null);

    const isSmall = size === 'small';

    useEffect(() => {
        if (result && (!currentResult || result.seed !== currentResult.seed)) {
            setIsRolling(true);
            onRollingStateChange?.(true);

            // Wait for dramatic tumble animation (1.5s) before landing
            const timer = setTimeout(() => {
                setCurrentResult(result);
                setIsRolling(false);
                onRollingStateChange?.(false);
                onAnimationComplete?.();
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [result, currentResult, onAnimationComplete, onRollingStateChange]);

    const handleRoll = useCallback(() => {
        if (disabled || isRolling) return;
        setIsRolling(true);
        onRollingStateChange?.(true);
        onRoll();
    }, [disabled, isRolling, onRoll, onRollingStateChange]);

    const total = currentResult ? currentResult.die1 + currentResult.die2 : 0;

    const isV2Drawer = size === 'v2-mobile-drawer';

    if (isV2Drawer) {
        const waitingForOpponent = !isMyTurn;
        const needsRoll = turnPhase === "WAIT_FOR_ROLL";
        const needsTokenSelect = turnPhase === "WAIT_FOR_TOKEN_SELECT";
        const isMoving = turnPhase === "MOVING" || turnPhase === "RESOLVING";
        const readyToEnd = turnPhase === "READY_TO_END_TURN";

        return (
            <div className="flex flex-col gap-4 w-full animate-in slide-in-from-bottom-8 duration-500">
                <div className="flex items-center justify-between px-2">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            {waitingForOpponent ? <Hourglass size={18} className="text-brand-dark/30 animate-spin" /> : <Dice5 size={18} className="text-brand-dark/30" />}
                            <h2 className="text-lg font-black text-brand-dark uppercase tracking-tight">
                                {waitingForOpponent ? "Wait Turn" : (needsRoll ? "Roll Dice" : (needsTokenSelect ? "Your Move" : "Action"))}
                            </h2>
                        </div>
                        <p className="text-[11px] font-bold text-brand-dark/30 leading-tight">
                            {waitingForOpponent ? (
                                <span>
                                    {currentPickerName} is {
                                        turnPhase === 'WAIT_FOR_ROLL' ? "preparing to roll..." :
                                            turnPhase === 'WAIT_FOR_TOKEN_SELECT' ? "choosing a token..." :
                                                turnPhase === 'WAIT_FOR_ASSET_PICK' ? "picking an asset..." :
                                                    "making decisions..."
                                    }
                                </span>
                            ) : (needsRoll ? "Shake and roll to see your move" : (needsTokenSelect ? "Tap a token on the board to advance" : "Finalize your turn decisions"))}
                        </p>
                    </div>

                    {!waitingForOpponent && currentResult && !isRolling && !needsRoll && (
                        <div className="bg-[#2d4023] px-3 py-1.5 rounded-2xl flex items-center gap-2 shadow-lg animate-in zoom-in-75 duration-300 border border-white/10">
                            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Move</span>
                            <span className="text-lg font-black text-white">{total}</span>
                        </div>
                    )}
                </div>

                <div className={`flex items-center justify-center gap-6 py-2 transition-all duration-300 ${!isRolling && currentResult && needsTokenSelect ? 'animate-dice-impact scale-110' : (waitingForOpponent ? 'opacity-20 grayscale scale-90' : '')}`}>
                    <DieCube value={currentResult?.die1 || 1} rolling={isRolling} size={size} />
                    <span className="text-xl font-black text-brand-dark/10">+</span>
                    <DieCube value={currentResult?.die2 || 4} rolling={isRolling} size={size} />
                </div>

                {readyToEnd ? (
                    <button
                        onClick={() => onEndTurn?.()}
                        className="w-full py-4 rounded-[2rem] text-sm font-black uppercase tracking-[2px] bg-brand-gold text-brand-dark shadow-xl hover:bg-brand-gold-light active:scale-95 transition-all animate-in zoom-in duration-300"
                    >
                        End Turn
                    </button>
                ) : (
                    <button
                        onClick={handleRoll}
                        disabled={disabled || isRolling || waitingForOpponent || !needsRoll}
                        className={`w-full py-4 rounded-[2rem] text-sm font-black uppercase tracking-[2px] transition-all active:scale-95 shadow-xl ${disabled || isRolling || waitingForOpponent || !needsRoll
                            ? "bg-brand-dark/5 text-brand-dark/20 cursor-not-allowed"
                            : "bg-[#2d4023] text-white shadow-[#2d4023]/20 hover:bg-[#3d5a2f]"
                            }`}
                    >
                        {isRolling ? "Rolling..." : (needsRoll ? "Roll Dice" : (isMoving ? "Moving..." : (needsTokenSelect ? "Select Token" : "Process Turn")))}
                    </button>
                )}

                {!waitingForOpponent && needsTokenSelect && !isRolling && (
                    <div className="flex items-center justify-center gap-2 animate-bounce mt-1">
                        <span className="text-[10px] font-black text-[#2d4023] uppercase tracking-widest">
                            Advance {total} steps
                        </span>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={`flex flex-col items-center p-4 md:p-6 bg-[#0a1f1a] backdrop-blur-xl rounded-[2rem] md:rounded-[2.5rem] border-2 border-brand-gold/20 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_0_30px_rgba(212,175,55,0.05)] w-full ${isSmall ? 'gap-2' : 'gap-6'} relative overflow-hidden`}>
            {/* Felt Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/felt.png")' }} />

            <style jsx global>{`
                @keyframes dice-tumble {
                    0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateY(0); }
                    25% { transform: rotateX(180deg) rotateY(90deg) rotateZ(45deg) translateY(-20px); }
                    50% { transform: rotateX(360deg) rotateY(180deg) rotateZ(90deg) translateY(0); }
                    75% { transform: rotateX(540deg) rotateY(270deg) rotateZ(135deg) translateY(-20px); }
                    100% { transform: rotateX(720deg) rotateY(360deg) rotateZ(180deg) translateY(0); }
                }
                @keyframes dice-impact {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(0.95); }
                }
                .animate-dice-tumble {
                    animation: dice-tumble 0.3s infinite linear;
                }
                .animate-dice-impact {
                    animation: dice-impact 0.4s ease-out;
                }
            `}</style>

            <div className={`flex items-center ${isSmall ? 'gap-4' : 'gap-6 sm:gap-10'} py-2 relative z-10 ${!isRolling && currentResult ? 'animate-dice-impact' : ''}`}>
                <div className="relative">
                    <DieCube value={currentResult?.die1 || 1} rolling={isRolling} size={size} />
                    {!isRolling && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-1.5 bg-black/40 blur-md rounded-full" />}
                </div>

                <div className="relative">
                    <span className={`${isSmall ? 'text-xl' : 'text-3xl'} font-black text-brand-gold/20 italic`}>+</span>
                </div>

                <div className="relative">
                    <DieCube value={currentResult?.die2 || 5} rolling={isRolling} size={size} />
                    {!isRolling && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-1.5 bg-black/40 blur-md rounded-full" />}
                </div>

                {currentResult && !isRolling && (
                    <div className={`flex items-center ${isSmall ? 'gap-2' : 'gap-4'} ml-2 animate-in fade-in slide-in-from-left-4 duration-500`}>
                        <span className={`${isSmall ? 'text-lg' : 'text-2xl'} font-black text-brand-gold`}>=</span>
                        <div className={`${isSmall ? 'w-10 h-10 rounded-xl' : 'w-16 h-16 rounded-2xl'} bg-gradient-to-br from-brand-gold to-brand-gold-light shadow-[0_10px_20px_rgba(212,175,55,0.4)] flex flex-col items-center justify-center text-brand-dark border border-white/20`}>
                            <span className={`${isSmall ? 'text-xl' : 'text-3xl'} font-black leading-none`}>{total}</span>
                            {!isSmall && <span className="text-[9px] font-black uppercase tracking-tighter opacity-70">Points</span>}
                        </div>
                    </div>
                )}
            </div>

            <button
                onClick={handleRoll}
                disabled={disabled || isRolling}
                className={`w-full max-w-xs flex items-center justify-center gap-3 py-3 md:py-4 rounded-xl md:rounded-2xl text-base font-black tracking-[2px] uppercase transition-all active:scale-95 shadow-xl ${disabled || isRolling
                    ? "bg-white/5 text-white/20 cursor-not-allowed border border-white/5"
                    : "bg-brand-gold hover:bg-brand-gold-light text-brand-dark shadow-[0_8px_30px_rgba(212,175,55,0.4)]"
                    }`}
            >
                {isRolling ? (
                    <>
                        <Hourglass size={isSmall ? 14 : 18} className="animate-spin" />
                        {isSmall ? "..." : "Rolling..."}
                    </>
                ) : (
                    <>
                        <Dice5 size={isSmall ? 14 : 18} />
                        {isSmall ? "ROLL" : "Roll Dice"}
                    </>
                )}
            </button>
            {currentResult && !disabled && !isRolling && !isSmall && (
                <div className="p-3 rounded-2xl text-center animate-bounce">
                    <p className="text-[10px] text-brand-gold font-black uppercase tracking-[2px]">
                        Select a token to advance
                    </p>
                </div>
            )}
        </div>
    );
}
