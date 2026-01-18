"use client";
import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowUpRight, Sparkles, Activity } from "lucide-react";

const SoftButton = ({
    children,
    className = "",
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode; className?: string }) => (
    <button
        className={
            "rounded-full px-5 py-2.5 text-sm font-medium shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 " +
            "bg-blue-600 text-white hover:bg-blue-500 focus:ring-blue-400 " +
            className
        }
        {...props}
    >
        {children}
    </button>
);

function MiniBars() {
    return (
        <div className="mt-6 flex h-36 items-end gap-4 rounded-xl bg-white/5 p-4">
            {[18, 48, 72, 96].map((h, i) => (
                <motion.div
                    key={i}
                    initial={{ height: 0, opacity: 0.6 }}
                    animate={{ height: h }}
                    transition={{ delay: 0.5 + i * 0.15, type: "spring" }}
                    className="w-10 rounded-xl bg-gradient-to-t from-cyan-400 to-blue-500 shadow-inner"
                />
            ))}
        </div>
    );
}

function Planet() {
    return (
        <motion.svg
            initial={{ rotate: -8 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 2, type: "spring" }}
            width="220"
            height="220"
            viewBox="0 0 220 220"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
            </defs>
            <circle cx="110" cy="110" r="56" fill="url(#grad)" opacity="0.95" />
            <circle cx="94" cy="98" r="10" fill="white" opacity="0.45" />
            <circle cx="132" cy="126" r="8" fill="white" opacity="0.35" />
            <motion.ellipse
                cx="110" cy="110" rx="100" ry="34" stroke="white" strokeOpacity="0.6" fill="none"
                animate={{ strokeDashoffset: [200, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} strokeDasharray="200 200"
            />
            <motion.circle cx="210" cy="110" r="4" fill="white" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 2.2, repeat: Infinity }} />
        </motion.svg>
    );
}

const Stat = ({ label, value }: { label: string; value: string }) => (
    <div className="space-y-1">
        <div className="text-4xl font-bold tracking-tight text-white">{value}</div>
        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</div>
    </div>
);

export default function CognifyLandingPage({ onStart, onViewDashboard }: { onStart?: () => void; onViewDashboard?: () => void }) {
    return (
        <div className="w-full bg-[#020617]">
            {/* Fonts */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        :root { --font-sans: 'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', sans-serif; }
        .font-jakarta { font-family: var(--font-sans); }
      `}</style>

            {/* Top nav */}
            <nav className="mx-auto flex w-full max-w-[1180px] items-center justify-between px-4 py-8 md:px-0">
                <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform">
                        <Sparkles className="h-6 w-6" />
                    </div>
                    <span className="font-jakarta text-2xl font-bold tracking-tight text-white">Cognify<span className="text-cyan-400">.ai</span></span>
                </div>
                <div className="hidden items-center gap-10 md:flex">
                    {['Platform', 'Intelligence', 'Network', 'Ecosystem'].map((item) => (
                        <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-slate-400 hover:text-white transition-colors uppercase tracking-widest">{item}</a>
                    ))}
                </div>
                <div className="hidden gap-4 md:flex">

                    <SoftButton onClick={onStart} className="bg-blue-600 hover:bg-blue-500 shadow-blue-500/25 uppercase tracking-widest">Join Network</SoftButton>
                </div>
            </nav>

            {/* Hero area */}
            <div className="mx-auto grid w-full max-w-[1180px] grid-cols-1 gap-12 px-4 pt-10 pb-24 md:grid-cols-2 md:px-0 items-center">
                {/* Left: headline */}
                <div className="flex flex-col justify-center space-y-10 pr-2">
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest"
                        >
                            <Activity className="w-3 h-3" />
                            Neural Core V12 Active
                        </motion.div>
                        <h1 className="text-6xl md:text-7xl font-bold leading-[1.05] tracking-tight text-white font-display">
                            Autonomous
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Intelligence.</span>
                        </h1>
                        <p className="max-w-md text-xl text-slate-400 leading-relaxed font-light">
                            Deploy multi-agent neural swarms to transform raw data into sovereign decisions. Fast, secure, and entirely autonomous.
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        <SoftButton onClick={onStart} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-base shadow-xl shadow-blue-500/20 uppercase tracking-widest">
                            Start Ingestion <ArrowUpRight className="ml-2 inline h-5 w-5" />
                        </SoftButton>
                    </div>

                    <div className="grid grid-cols-2 gap-12 pt-4 md:max-w-sm">
                        <Stat label="Active Agents" value="50M+" />
                        <Stat label="Neural Throughput" value="1.2TB/s" />
                    </div>

                    <div className="mt-6 flex items-center gap-10 opacity-50">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Enterprise Ready</span>
                        <div className="flex items-center gap-8 text-slate-300 grayscale select-none">
                            <span className="font-bold text-lg tracking-tighter">NVIDIA</span>
                            <span className="font-bold text-lg tracking-tighter">DATABRICKS</span>
                            <span className="font-bold text-lg tracking-tighter">SNOWFLAKE</span>
                        </div>
                    </div>
                </div>

                {/* Right: animated card grid */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {/* Secure card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="relative col-span-1 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-black border border-white/5 p-8 text-white shadow-2xl"
                    >
                        <div className="absolute inset-0">
                            <div className="absolute inset-0 bg-blue-500/10 blur-[100px]" />
                            <svg className="absolute inset-0 h-full w-full opacity-20" viewBox="0 0 400 400">
                                {[...Array(12)].map((_, i) => (
                                    <circle key={i} cx="200" cy="200" r={20 + i * 14} fill="none" stroke="currentColor" strokeOpacity="0.12" />
                                ))}
                            </svg>
                        </div>

                        <div className="relative flex h-full flex-col justify-between space-y-20">
                            <div className="flex items-center gap-3">
                                <div className="rounded-2xl bg-blue-500/20 p-3 border border-blue-500/20">
                                    <ShieldCheck className="h-6 w-6 text-blue-400" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Zero Trust Arch</span>
                            </div>
                            <div className="text-2xl font-bold leading-tight">
                                Sovereign control over
                                <br /> every neural vector.
                            </div>
                            <motion.div
                                className="absolute right-0 top-0 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 4, repeat: Infinity }}
                            />
                        </div>
                    </motion.div>

                    {/* Nodes card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative col-span-1 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-cyan-600 to-blue-700 p-8 text-white shadow-2xl shadow-cyan-500/20"
                    >
                        <div className="pointer-events-none absolute -right-4 -top-8 opacity-60">
                            <Planet />
                        </div>
                        <div className="relative mt-32 text-xs font-bold uppercase tracking-widest text-cyan-200">Global Mesh</div>
                        <div className="text-2xl font-bold leading-tight mt-2">
                            Distributed nodes,
                            <br /> unified intelligence.
                        </div>
                    </motion.div>

                    {/* Growth card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="col-span-1 rounded-[2.5rem] bg-white/[0.03] p-8 text-white border border-white/5 shadow-2xl backdrop-blur-3xl"
                    >
                        <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Efficiency Index</div>
                        <div className="mt-4 text-4xl font-bold tracking-tight">98.4<span className="text-lg font-light text-slate-500 ml-1">%</span></div>
                        <div className="mt-2 text-xs font-bold text-cyan-400 flex items-center gap-1">
                            <Activity className="w-3 h-3" />
                            +12.4% Neural Gain
                        </div>
                        <MiniBars />
                    </motion.div>

                    <div className="hidden md:block" />
                </div>
            </div>
        </div>
    );
}
