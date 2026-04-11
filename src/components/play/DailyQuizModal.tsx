"use client";

import { useEffect, useState, useMemo } from "react";
import OverlayModal from "./OverlayModal";
import { Brain, Star, Clock, CheckCircle2, XCircle, ArrowRight, Trophy } from "lucide-react";
import { getApiBaseUrl } from "@/lib/env";
import { getToken } from "@/lib/auth";

type Question = {
    id: string;
    text: string;
    options: { [key: string]: string };
};

type QuizSession = {
    session_id: string;
    questions: Question[];
    quiz_type: string;
};

export default function DailyQuizModal({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    const [state, setState] = useState<"intro" | "quiz" | "result">("intro");
    const [session, setSession] = useState<QuizSession | null>(null);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [results, setResults] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [lastCheck, setLastCheck] = useState<{ available: boolean; message: string } | null>(null);

    const apiBase = useMemo(() => getApiBaseUrl(), []);

    useEffect(() => {
        if (!open) return;
        checkAvailability();
    }, [open]);

    const checkAvailability = async () => {
        try {
            const res = await fetch(`${apiBase}/api/quizzes/daily-available`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (res.ok) setLastCheck(await res.json());
        } catch { }
    };

    const startQuiz = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${apiBase}/api/quizzes/sessions/start`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ quiz_type: "daily" }),
            });
            if (res.ok) {
                setSession(await res.json());
                setState("quiz");
            } else {
                const err = await res.json();
                alert(err.detail || "Could not start quiz");
            }
        } catch { } finally {
            setLoading(false);
        }
    };

    const submitAnswer = async (option: string) => {
        if (!session) return;
        const q = session.questions[currentIdx];
        setLoading(true);
        try {
            const res = await fetch(`${apiBase}/api/quizzes/sessions/${session.session_id}/answer`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ question_id: q.id, user_answer: option }),
            });
            if (res.ok) {
                const data = await res.json();
                setAnswers(prev => ({ ...prev, [q.id]: option }));

                if (currentIdx < session.questions.length - 1) {
                    setCurrentIdx(currentIdx + 1);
                } else {
                    completeQuiz();
                }
            }
        } catch { } finally {
            setLoading(false);
        }
    };

    const completeQuiz = async () => {
        if (!session) return;
        setLoading(true);
        try {
            const res = await fetch(`${apiBase}/api/quizzes/sessions/${session.session_id}/complete`, {
                method: "POST",
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (res.ok) {
                setResults(await res.json());
                setState("result");
            }
        } catch { } finally {
            setLoading(false);
        }
    };

    const currentQuestion = session?.questions[currentIdx];

    return (
        <OverlayModal open={open} onClose={onClose} title="Daily Financial Quiz" maxWidthClassName="max-w-xl">
            {state === "intro" && (
                <div className="flex flex-col items-center text-center py-6">
                    <div className="w-20 h-20 bg-brand-gold/10 rounded-full flex items-center justify-center text-brand-gold mb-6 shadow-xl shadow-brand-gold/10">
                        <Brain size={44} />
                    </div>
                    <h2 className="text-2xl font-black text-brand-dark uppercase tracking-tight mb-2">Test Your Knowledge</h2>
                    <p className="text-sm font-bold text-brand-dark/50 max-w-sm mb-8">
                        Complete the daily quiz to earn Pesa Points and improve your financial literacy!
                    </p>

                    <div className="grid grid-cols-3 gap-4 w-full mb-8">
                        <div className="p-4 rounded-2xl bg-black/5">
                            <div className="text-brand-green font-black text-lg">8</div>
                            <div className="text-[9px] font-black uppercase text-brand-dark/40 tracking-widest">Questions</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-black/5">
                            <div className="text-brand-gold font-black text-lg">+100</div>
                            <div className="text-[9px] font-black uppercase text-brand-dark/40 tracking-widest">Points</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-black/5">
                            <div className="text-blue-500 font-black text-lg">🔥</div>
                            <div className="text-[9px] font-black uppercase text-brand-dark/40 tracking-widest">Streak</div>
                        </div>
                    </div>

                    <button
                        onClick={startQuiz}
                        disabled={loading || lastCheck?.available === false}
                        className="w-full py-5 rounded-2xl bg-brand-gold text-white text-base font-black uppercase tracking-widest shadow-xl shadow-brand-gold/30 hover:scale-[1.02] active:scale-95 transition disabled:opacity-50 disabled:scale-100"
                    >
                        {loading ? "Preparing Quiz..." : lastCheck?.available === false ? "Come back tomorrow" : "Start Daily Quiz ➡️"}
                    </button>

                    {lastCheck?.available === false && (
                        <div className="mt-4 text-[10px] font-black text-brand-red uppercase tracking-widest">
                            Already completed for today!
                        </div>
                    )}
                </div>
            )}

            {state === "quiz" && session && currentQuestion && (
                <div className="flex flex-col py-2">
                    <div className="flex items-center justify-between mb-6">
                        <div className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40">
                            Question {currentIdx + 1} of {session.questions.length}
                        </div>
                        <div className="flex gap-1">
                            {session.questions.map((_, idx) => (
                                <div key={idx} className={`w-6 h-1 rounded-full ${idx === currentIdx ? 'bg-brand-gold' : idx < currentIdx ? 'bg-brand-green' : 'bg-black/5'}`} />
                            ))}
                        </div>
                    </div>

                    <div className="min-h-[100px] flex items-center justify-center text-center mb-8 px-2">
                        <h3 className="text-lg font-black text-brand-dark leading-tight tracking-tight uppercase">
                            {currentQuestion.text}
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {Object.entries(currentQuestion.options).map(([key, value]) => (
                            <button
                                key={key}
                                onClick={() => submitAnswer(key)}
                                disabled={loading}
                                className="group w-full p-4 rounded-2xl bg-white border-2 border-black/[0.04] text-left hover:border-brand-gold transition-all active:scale-[0.98] flex items-center gap-4"
                            >
                                <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center font-black group-hover:bg-brand-gold group-hover:text-white transition-colors">
                                    {key}
                                </div>
                                <div className="flex-1 text-sm font-bold text-brand-dark/80">{value}</div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {state === "result" && results && (
                <div className="flex flex-col items-center text-center py-6">
                    <div className="w-20 h-20 bg-brand-green/10 rounded-full flex items-center justify-center text-brand-green mb-6 shadow-xl shadow-brand-green/10">
                        <Trophy size={44} />
                    </div>
                    <h2 className="text-2xl font-black text-brand-dark uppercase tracking-tight mb-2">Quiz Completed!</h2>
                    <div className="text-4xl font-black text-brand-green mb-1">{results.accuracy}%</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40 mb-8">Accuracy Score</div>

                    <div className="w-full bg-black/5 rounded-3xl p-6 mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-black uppercase text-brand-dark/40 tracking-wider">Points Earned</span>
                            <span className="text-lg font-black text-brand-gold">+{results.points_earned}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-black uppercase text-brand-dark/40 tracking-wider">Current Streak</span>
                            <span className="text-lg font-black text-blue-500">{results.current_streak} Days 🔥</span>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full py-5 rounded-2xl bg-brand-dark text-white text-base font-black uppercase tracking-widest shadow-xl shadow-brand-dark/20 hover:scale-[1.02] active:scale-95 transition"
                    >
                        Collect Rewards 🏆
                    </button>
                </div>
            )}
        </OverlayModal>
    );
}
