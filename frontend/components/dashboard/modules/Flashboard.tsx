import { motion } from 'framer-motion';
import { Activity, TrendingUp, DollarSign, Zap, Globe, Server } from 'lucide-react';

interface FlashboardProps {
    results: any;
}

export const Flashboard = ({ results }: FlashboardProps) => {
    const safeResults = results || {};
    const stats = safeResults.intelligence?.summary_stats || {};

    // Derive metrics from real data (or simulated real data)
    const revenueMean = stats.revenue?.mean || 0;
    const costMean = stats.operational_cost?.mean || 0;
    const rows = safeResults.ingestion?.rows || 0;

    // Simulate velocity based on total 'revenue' divided by virtual time window
    const velocity = (revenueMean / 60).toFixed(2);

    const metrics = [
        { label: 'Revenue Velocity', value: `$${velocity}`, sub: '/sec', change: '+12%', color: 'text-emerald-400' },
        { label: 'Transaction Vol', value: rows > 1000 ? `${(rows / 1000).toFixed(1)}k` : rows, sub: '/batch', change: '+8.5%', color: 'text-blue-400' },
        { label: 'System Load', value: `${Math.min(100, Math.floor(rows / 20))}%`, sub: 'capacity', change: '-2%', color: 'text-cyan-400' },
        { label: 'Avg Cost', value: `$${(costMean / 1000).toFixed(1)}k`, sub: '/unit', change: '-5%', color: 'text-violet-400' }
    ];

    return (
        <div className="h-full w-full p-8 space-y-8">
            {/* Header Ticker */}
            <div className="flex gap-4 overflow-hidden border-b border-white/5 pb-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <motion.div
                        key={i}
                        animate={{ x: [-1000, 0] }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full whitespace-nowrap"
                    >
                        <span className="text-xs text-gray-500 font-mono">LIVE_STREAM</span>
                        <span className="text-xs font-bold text-white">SYNC_ID: {safeResults.pipeline_id || 'LOCAL_SIM_001'}</span>
                        <span className="text-[10px] text-emerald-400">ACTIVE</span>
                    </motion.div>
                ))}
            </div>

            {/* Sparkline Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((m, i) => (
                    <motion.div
                        key={i}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-white/10 transition-colors"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-xs text-slate-500 uppercase tracking-widest">{m.label}</span>
                            <span className={`text-xs font-bold ${m.color} bg-white/5 px-2 py-1 rounded`}>{m.change}</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-white font-display">{m.value}</span>
                            <span className="text-xs text-slate-600">{m.sub}</span>
                        </div>

                        {/* Animated Sparkline Background */}
                        <svg className="absolute bottom-0 left-0 right-0 h-16 opacity-20 pointer-events-none" preserveAspectRatio="none">
                            <motion.path
                                d="M0,50 Q20,40 40,60 T80,30 T120,50 T160,20 T200,60"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className={m.color}
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                            />
                        </svg>
                    </motion.div>
                ))}
            </div>

            {/* Main Live Graph Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[400px]">
                <div className="lg:col-span-2 bg-white/[0.02] border border-white/5 rounded-3xl p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Activity className="w-5 h-5 text-cyan-500" /> Live Throughput
                        </h3>
                        <div className="flex gap-2">
                            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-[10px] text-red-500 font-bold tracking-widest">LIVE</span>
                        </div>
                    </div>
                    <div className="flex-1 flex items-end gap-1 overflow-hidden">
                        {Array.from({ length: 40 }).map((_, i) => (
                            <motion.div
                                key={i}
                                className="flex-1 bg-cyan-500/20 rounded-t-sm hover:bg-cyan-500/50 transition-colors"
                                animate={{ height: [`${Math.random() * 80 + 10}%`, `${Math.random() * 80 + 10}%`] }}
                                transition={{ duration: 0.5, repeat: Infinity, repeatType: 'mirror', delay: i * 0.02 }}
                            />
                        ))}
                    </div>
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-blue-500" /> Active Nodes
                    </h3>
                    <div className="space-y-4">
                        {['US-East-1', 'EU-West-2', 'AP-South-1', 'SA-East-1'].map((region, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <span className="text-sm text-slate-400">{region}</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.random() * 40 + 50}%` }} />
                                    </div>
                                    <span className="text-xs text-blue-400 font-mono">OK</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
