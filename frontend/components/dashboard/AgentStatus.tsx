'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { SpotlightCard } from '../ui/SpotlightCard';
import { Activity, Brain, Database, Eye, Zap, CheckCircle2, CircleDashed, Cpu, Radio, Network } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgentStatusProps {
    steps: string[];
    activeStep: string | null;
}

const agents = [
    {
        id: 'ingestion',
        name: 'Ingestion Core',
        role: 'Schema Alignment',
        icon: Database,
        color: 'text-cyan-400',
        gradient: 'from-cyan-500/20 to-blue-500/20',
        glow: 'shadow-cyan-500/20'
    },
    {
        id: 'intelligence',
        name: 'Intelligence Fabric',
        role: 'Semantic Analysis',
        icon: Brain,
        color: 'text-fuchsia-400',
        gradient: 'from-fuchsia-500/20 to-purple-500/20',
        glow: 'shadow-fuchsia-500/20'
    },
    {
        id: 'anomaly_detection',
        name: 'Sentinel Scan',
        role: 'Risk Scanning',
        icon: Eye,
        color: 'text-rose-400',
        gradient: 'from-rose-500/20 to-orange-500/20',
        glow: 'shadow-rose-500/20'
    },
    {
        id: 'prediction',
        name: 'Oracle Forecast',
        role: 'LSTM Projection',
        icon: Activity,
        color: 'text-emerald-400',
        gradient: 'from-emerald-500/20 to-green-500/20',
        glow: 'shadow-emerald-500/20'
    },
    {
        id: 'reasoning',
        name: 'Logic Weaver',
        role: 'Inference Pathing',
        icon: Zap,
        color: 'text-amber-400',
        gradient: 'from-amber-500/20 to-yellow-500/20',
        glow: 'shadow-amber-500/20'
    },
];

export function AgentStatus({ steps, activeStep }: AgentStatusProps) {
    return (
        <div className="relative mb-16">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-black font-display text-white flex items-center gap-3">
                        <Network className="w-6 h-6 text-cyan-500" />
                        NEURAL ORCHESTRATION
                    </h2>
                    <p className="text-xs text-gray-500 font-mono uppercase tracking-[0.3em] mt-1">Autonomous Agent Coordination Stream</p>
                </div>
                <div className="flex gap-4">
                    <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Core Synchronized</span>
                    </div>
                </div>
            </div>

            <motion.div
                className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.05
                        }
                    }
                }}
            >
                {agents.map((agent, index) => {
                    const isCompleted = steps.includes(agent.id);
                    const isActive = activeStep === agent.id;

                    return (
                        <motion.div
                            key={agent.id}
                            variants={{
                                hidden: { opacity: 0, y: 10 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            className="h-full"
                        >
                            <div className={cn(
                                "relative overflow-hidden p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 h-40",
                                isActive ? "bg-white/[0.08] border border-white/20 shadow-lg" : "bg-white/[0.02] border border-white/5 opacity-60",
                                isCompleted && "opacity-100 bg-emerald-500/[0.02] border-emerald-500/20"
                            )}>

                                <div className="flex justify-between items-start z-10">
                                    <div className={cn(
                                        "p-2.5 rounded-xl bg-white/5 border border-white/5 transition-all duration-500",
                                        isActive && `bg-white/10 scale-105 shadow ${agent.color.replace('text-', 'shadow-')}/20`
                                    )}>
                                        <agent.icon className={cn("h-5 w-5", agent.color, isActive && "text-white")} />
                                    </div>
                                    <div className="flex flex-col items-end">
                                        {isCompleted ? (
                                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                        ) : isActive ? (
                                            <Radio className="h-4 w-4 text-cyan-400 animate-pulse" />
                                        ) : (
                                            <CircleDashed className="h-4 w-4 text-gray-600" />
                                        )}
                                    </div>
                                </div>

                                <div className="z-10 mt-auto">
                                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{agent.role}</div>
                                    <div className={cn(
                                        "text-sm font-semibold tracking-tight transition-colors",
                                        isActive ? "text-white" : "text-gray-400"
                                    )}>{agent.name}</div>
                                </div>

                                {isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/5 to-transparent pointer-events-none" />
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Connection Flow Visual */}
            <div className="absolute top-[60%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent -z-10" />
        </div>
    );
}
