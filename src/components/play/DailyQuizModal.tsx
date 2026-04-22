"use client";

import { useEffect, useState, useMemo } from "react";
import OverlayModal from "./OverlayModal";
import { Brain, Star, Clock, CheckCircle2, XCircle, ArrowRight, Trophy, Info } from "lucide-react";
import { getApiBaseUrl } from "@/lib/env";
import { getToken } from "@/lib/auth";

type Question = {
    id: string;
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
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

    const [feedback, setFeedback] = useState<{
        isCorrect: boolean;
        correctAnswer: string;
        explanation: string;
        userAnswer: string;
    } | null>(null);

    const submitAnswer = async (option: string) => {
        if (!session || feedback) return;
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
                setFeedback({
                    isCorrect: data.is_correct,
                    correctAnswer: data.correct_answer,
                    explanation: data.explanation,
                    userAnswer: option
                });
            }
        } catch { } finally {
            setLoading(false);
        }
    };

    const nextQuestion = () => {
        setFeedback(null);
        if (currentIdx < (session?.questions.length || 0) - 1) {
            setCurrentIdx(currentIdx + 1);
        } else {
            completeQuiz();
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
                            {currentQuestion.question_text}
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {[
                            { key: 'A', value: currentQuestion.option_a },
                            { key: 'B', value: currentQuestion.option_b },
                            { key: 'C', value: currentQuestion.option_c },
                            { key: 'D', value: currentQuestion.option_d },
                        ].map((opt) => {
                            const isSelected = feedback?.userAnswer === opt.key;
                            const isCorrect = opt.key === feedback?.correctAnswer;
                            const showSuccess = feedback && isCorrect;
                            const showError = feedback && isSelected && !feedback.isCorrect;

                            return (
                                <button
                                    key={opt.key}
                                    onClick={() => submitAnswer(opt.key)}
                                    disabled={loading || !!feedback}
                                    className={`group w-full p-4 rounded-2xl border-2 transition-all active:scale-[0.98] flex items-center gap-4 ${showSuccess ? 'bg-emerald-50 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]' :
                                        showError ? 'bg-red-50 border-red-500' :
                                            'bg-white border-black/[0.04] hover:border-brand-gold'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-colors ${showSuccess ? 'bg-emerald-500 text-white' :
                                        showError ? 'bg-red-500 text-white' :
                                            'bg-black/5 group-hover:bg-brand-gold group-hover:text-white'
                                        }`}>
                                        {opt.key}
                                    </div>
                                    <div className={`flex-1 text-sm font-bold ${showSuccess ? 'text-emerald-900' : showError ? 'text-red-900' : 'text-brand-dark/80'}`}>
                                        {opt.value}
                                    </div>
                                    {showSuccess && <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />}
                                    {showError && <XCircle className="text-red-500 shrink-0" size={20} />}
                                </button>
                            );
                        })}
                    </div>

                    {feedback && (
                        <div className="mt-8 animate-in slide-in-from-bottom-4 fade-in duration-500">
                            <div className={`p-5 rounded-[24px] mb-6 ${feedback.isCorrect ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`p-2 rounded-lg ${feedback.isCorrect ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                                        {feedback.isCorrect ? <Trophy size={16} /> : <Info size={16} />}
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${feedback.isCorrect ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {feedback.isCorrect ? 'Brilliant!' : 'Not Quite...'}
                                    </span>
                                </div>
                                <p className="text-[11px] font-bold text-brand-dark/70 leading-relaxed uppercase">
                                    {feedback.explanation}
                                </p>
                            </div>

                            <button
                                onClick={nextQuestion}
                                className="w-full py-5 rounded-2xl bg-brand-dark text-white text-base font-black uppercase tracking-widest shadow-xl shadow-brand-dark/20 hover:scale-[1.02] active:scale-95 transition flex items-center justify-center gap-2"
                            >
                                {currentIdx < session.questions.length - 1 ? 'Next Question' : 'See My Rewards'}
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    )}
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
