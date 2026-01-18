'use client';
import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Terminal } from 'lucide-react';

interface NeuralLogsProps {
    logs: string[];
}

export function NeuralLogs({ logs }: NeuralLogsProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="h-[600px] rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl flex flex-col overflow-hidden relative"
        >
            {/* Header */}
            <div className="relative z-10 p-5 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/10">
                        <Activity className="w-4 h-4 text-cyan-500" />
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 tracking-widest font-display uppercase">Neural Logs</h3>
                        <p className="text-[9px] text-gray-600 font-mono mt-0.5">Stream ID: 0x829A...F2</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-bold text-emerald-500/80 tracking-wider">LIVE</span>
                </div>
            </div>

            {/* Log Stream - Clean & Efficient */}
            <div
                ref={scrollRef}
                className="relative z-10 flex-1 overflow-y-auto p-5 space-y-3 font-mono text-[10px] custom-scrollbar"
            >
                <AnimatePresence mode="popLayout">
                    {logs.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-full flex flex-col items-center justify-center text-gray-700 space-y-3 opacity-50"
                        >
                            <Terminal className="w-6 h-6" />
                            <p className="text-[10px] tracking-widest uppercase">Awaiting Input...</p>
                        </motion.div>
                    )}

                    {logs.map((log, i) => {
                        const match = log.match(/^\[(.*?)\] (.*)/);
                        const time = match ? match[1] : new Date().toLocaleTimeString();
                        const content = match ? match[2] : log;

                        return (
                            <motion.div
                                key={`${i}-${time}`}
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2 }}
                                className="flex gap-4 group hover:bg-white/[0.02] -mx-2 px-2 py-0.5 rounded transition-colors"
                            >
                                <span className="text-gray-600 shrink-0 select-none w-14 text-right tabular-nums opacity-60">
                                    {time}
                                </span>
                                <span className="text-gray-400 break-words leading-relaxed group-hover:text-gray-300 transition-colors">
                                    {content.split(/(:)/).map((part, idx) =>
                                        part === ':' ? <span key={idx} className="text-gray-600 mr-2">:</span> :
                                            part.includes('Agent') ? <span key={idx} className="text-cyan-600 font-semibold">{part}</span> :
                                                <span key={idx}>{part}</span>
                                    )}
                                </span>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
