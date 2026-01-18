'use client';

import { motion } from 'framer-motion';
import { Activity, BarChart3, Globe, Zap, Cpu, Server } from 'lucide-react';
import { useState, useEffect } from 'react';

export const DashboardPreview = () => {
    // Simulated live data points
    const [dataPoints, setDataPoints] = useState([30, 45, 60, 40, 55, 70, 50, 65, 80, 75, 60, 85, 90, 70, 60]);

    useEffect(() => {
        const interval = setInterval(() => {
            setDataPoints(prev => [...prev.slice(1), 30 + Math.random() * 60]);
        }, 800);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#030712] p-1 group select-none">
            {/* Ambient Glow */}
            <div className="absolute top-10 left-10 w-96 h-96 bg-blue-500/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10 bg-black/40 backdrop-blur-xl rounded-[1.3rem] overflow-hidden flex flex-col h-[380px] w-full border border-white/5">

                {/* Window Header */}
                <div className="h-10 border-b border-white/5 flex items-center justify-between px-4 bg-white/[0.02]">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-black/50 rounded-full border border-white/5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[9px] font-mono text-emerald-400 font-bold tracking-widest uppercase">Live Stream</span>
                    </div>
                </div>

                {/* Main Dashboard Content */}
                <div className="p-6 flex-1 flex flex-col gap-6">

                    {/* Top Stats Row */}
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { label: "Predictive Score", value: "98.4%", icon: Zap, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20" },
                            { label: "Active Nodes", value: "8,942", icon: Globe, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
                            { label: "Latency", value: "14ms", icon: Activity, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" }
                        ].map((stat, i) => (
                            <div key={i} className={`p-3 rounded-xl border ${stat.border} bg-white/[0.01] flex flex-col gap-2`}>
                                <div className="flex justify-between items-start">
                                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{stat.label}</span>
                                    <stat.icon className={`w-3 h-3 ${stat.color}`} />
                                </div>
                                <div className="text-xl font-bold text-white tracking-tight">{stat.value}</div>
                            </div>
                        ))}
                    </div>

                    {/* Chart Area */}
                    <div className="flex-1 rounded-xl border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent p-4 relative overflow-hidden group/chart">
                        {/* Grid Lines */}
                        <div className="absolute inset-0 z-0 opacity-10">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="absolute w-full h-px bg-white top-1/2" style={{ top: `${i * 20}%` }} />
                            ))}
                            {[...Array(10)].map((_, i) => (
                                <div key={i} className="absolute h-full w-px bg-white left-1/2" style={{ left: `${i * 10}%` }} />
                            ))}
                        </div>

                        <div className="flex justify-between items-center mb-4 relative z-10">
                            <div className="flex items-center gap-2">
                                <BarChart3 className="w-4 h-4 text-cyan-400" />
                                <span className="text-xs font-bold text-slate-300">Revenue Projection</span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-500">T-MINUS 24H</span>
                        </div>

                        {/* Animated Graph Lines */}
                        <div className="relative h-24 w-full flex items-end justify-between gap-1 z-10 px-1">
                            {dataPoints.map((h, i) => (
                                <motion.div
                                    key={i}
                                    layout
                                    className="w-full bg-gradient-to-t from-cyan-500/20 to-blue-500/60 rounded-t-sm"
                                    initial={{ height: '20%' }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                />
                            ))}
                        </div>

                        {/* Floating Tooltip Simulation */}
                        <motion.div
                            className="absolute top-1/2 left-1/2 bg-slate-900/90 border border-white/20 p-2 rounded-lg backdrop-blur-md z-20 shadow-xl"
                            animate={{ x: [0, 40, -40, 0], y: [0, -20, 10, 0] }}
                            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                <span className="text-[10px] font-bold text-slate-300">Anomaly Detected</span>
                            </div>
                            <div className="text-xs font-mono text-cyan-400">#E4-921 Corrected</div>
                        </motion.div>
                    </div>

                    {/* Bottom Console Line */}
                    <div className="h-8 rounded-lg bg-black/40 border border-white/5 flex items-center px-3 gap-3">
                        <span className="text-cyan-500 text-[10px] font-mono">{">"}</span>
                        <span className="text-[10px] font-mono text-slate-400 typing-effect opacity-70">
                            Optimizing neural weights... 99.9% complete.
                        </span>
                    </div>

                </div>
            </div>
        </div>
    );
}
