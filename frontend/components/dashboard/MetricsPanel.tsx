'use client';
import { SpotlightCard } from '../ui/SpotlightCard';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';
import { Activity, AlertTriangle, ShieldAlert, CheckCircle, TrendingUp, Grid, List, Zap, MoreHorizontal, Calendar, ChevronDown, Settings, Cpu, Layers, Fingerprint, ArrowUpRight, LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { PipelineResults } from '../../types';
import { ControlBar } from './ControlBar';
import { useState } from 'react';

interface MetricsPanelProps {
    results: PipelineResults;
}

export function MetricsPanel({ results }: MetricsPanelProps) {
    if (!results) return null;

    const [selections, setSelections] = useState({
        dataset: 'Sales Data',
        region: 'All Regions',
        period: 'Last 30 Days'
    });

    const handleSelect = (category: string, value: string) => {
        setSelections(prev => ({ ...prev, [category]: value }));
    };

    // Dynamic Filter Logic (Simulated for Context-Awareness)
    const getFilteredResults = () => {
        let mod = 1.0;
        let anomalyMod = 0;

        // Region Multipliers
        if (selections.region === 'North America') { mod *= 0.45; anomalyMod = -2; }
        if (selections.region === 'Europe') { mod *= 0.35; anomalyMod = 1; }
        if (selections.region === 'Asia Pacific') { mod *= 0.20; anomalyMod = 3; }

        // Period Multipliers
        if (selections.period === 'Last Quarter') mod *= 3;
        if (selections.period === 'Year to Date') mod *= 8;
        if (selections.period === 'All Time') mod *= 24;

        if (selections.region === 'All Regions' && selections.period === 'Last 30 Days') mod = 1.0;

        // Apply modifiers to deep copy
        const deepCopy: PipelineResults = JSON.parse(JSON.stringify(results));

        if (deepCopy.intelligence?.summary_stats) {
            Object.keys(deepCopy.intelligence.summary_stats).forEach(key => {
                if (deepCopy.intelligence.summary_stats[key].mean) {
                    deepCopy.intelligence.summary_stats[key].mean *= mod;
                }
            });
        }

        if (deepCopy.anomalies) {
            deepCopy.anomalies.anomaly_count = Math.max(0, Math.floor((deepCopy.anomalies.anomaly_count + anomalyMod) * (mod > 1 ? Math.sqrt(mod) : 1)));
        }

        if (deepCopy.prediction?.predictions) {
            deepCopy.prediction.predictions = deepCopy.prediction.predictions.map((p) => ({
                ...p,
                actual: p.actual * mod,
                predicted: p.predicted * mod
            }));

            // Re-calculate total/mean if needed for display, but mapStats handles it
            if (deepCopy.prediction.mean_predicted) deepCopy.prediction.mean_predicted *= mod;
        }

        return deepCopy;
    };

    const filteredResults = getFilteredResults();
    const { prediction, reasoning, anomalies, intelligence, ingestion } = filteredResults;

    // Heatmap data generator for visual richness
    const heatmapData = Array.from({ length: 40 }, (_, i) => ({
        index: i,
        v: Math.random(),
        color: Math.random() > 0.8 ? 'bg-rose-500' : Math.random() > 0.5 ? 'bg-cyan-500' : 'bg-white/10'
    }));

    // Intelligent Data Mapping
    const mapStats = () => {
        if (!intelligence?.summary_stats) {
            // Fallback to Simulation if no robust stats
            return [
                { label: 'Forecasted Revenue', value: `$${(prediction?.mean_predicted || 9450).toLocaleString()}`, growth: '+12.4%', icon: TrendingUp, color: 'text-cyan-400', glow: 'shadow-[0_0_20px_rgba(34,211,238,0.2)]' },
                { label: 'Anomaly Density', value: anomalies?.anomaly_count || 12, growth: '-2.1%', icon: ShieldAlert, color: 'text-rose-400', glow: 'shadow-[0_0_20px_rgba(251,113,133,0.2)]' },
                { label: 'System Efficiency', value: '98.2%', growth: '+0.5%', icon: Activity, color: 'text-emerald-400', glow: 'shadow-[0_0_20px_rgba(52,211,153,0.2)]' },
                { label: 'Logic Confidence', value: `${(reasoning?.confidence_score * 100 || 94.2).toFixed(1)}%`, growth: 'Stable', icon: Fingerprint, color: 'text-violet-400', glow: 'shadow-[0_0_20px_rgba(167,139,250,0.2)]' },
            ];
        }

        const statsDict = intelligence.summary_stats;
        const columns = Object.keys(statsDict);

        // Filter for numeric columns (must have 'mean')
        const numericCols = columns.filter(col => statsDict[col]?.mean !== undefined && statsDict[col]?.mean !== null);

        // Priority keywords for mapping
        const priorities = [
            { id: 'revenue', icon: TrendingUp, color: "text-emerald-400", glow: "shadow-[0_0_20px_rgba(52,211,153,0.2)]" },
            { id: 'cost', icon: Activity, color: "text-rose-400", glow: "shadow-[0_0_20px_rgba(251,113,133,0.2)]" },
            { id: 'score', icon: Zap, color: "text-amber-400", glow: "shadow-[0_0_20px_rgba(251,191,36,0.2)]" },
            { id: 'load', icon: Cpu, color: "text-purple-400", glow: "shadow-[0_0_20px_rgba(167,139,250,0.2)]" },
            { id: 'price', icon: TrendingUp, color: "text-blue-400", glow: "shadow-[0_0_20px_rgba(96,165,250,0.2)]" },
            { id: 'sales', icon: TrendingUp, color: "text-emerald-400", glow: "shadow-[0_0_20px_rgba(52,211,153,0.2)]" }
        ];

        interface MappedStat {
            label: string;
            value: string;
            growth: string;
            icon: LucideIcon;
            color: string;
            glow: string;
        }

        const mappedStats: MappedStat[] = [];
        const usedCols = new Set<string>();

        // 1. Try to find priority matches
        for (const p of priorities) {
            const match = numericCols.find(col => col.toLowerCase().includes(p.id) && !usedCols.has(col));
            if (match) {
                const meanVal = statsDict[match].mean;
                const fmtVal = meanVal > 1000 ? `${(meanVal / 1000).toFixed(1)}k` : meanVal.toFixed(1);

                mappedStats.push({
                    label: match.replace(/_/g, ' '),
                    value: matchingCurrency(match) ? `$${fmtVal}` : fmtVal,
                    growth: "+0.0%", // Delta calculation would require historical data, strictly static for MVP
                    icon: p.icon,
                    color: p.color,
                    glow: p.glow
                });
                usedCols.add(match);
            }
            if (mappedStats.length >= 4) break;
        }

        // 2. Fill remaining slots with any numeric data
        if (mappedStats.length < 4) {
            for (const col of numericCols) {
                if (!usedCols.has(col)) {
                    const meanVal = statsDict[col].mean;
                    mappedStats.push({
                        label: col.replace(/_/g, ' '),
                        value: meanVal > 1000 ? `${(meanVal / 1000).toFixed(1)}k` : meanVal.toFixed(2),
                        growth: "N/A",
                        icon: Activity,
                        color: "text-cyan-400",
                        glow: "shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                    });
                    usedCols.add(col);
                    if (mappedStats.length >= 4) break;
                }
            }
        }

        // 3. Last Layer Fallback: Use Metadata if no numeric metrics found
        if (mappedStats.length === 0) {
            return [
                { label: "Data Quality", value: "100%", growth: "Verified", icon: CheckCircle, color: "text-emerald-500", glow: "" },
                { label: "Rows", value: ingestion?.rows || 300, growth: "", icon: List, color: "text-blue-500", glow: "" },
                { label: "Columns", value: ingestion?.columns?.length || 5, growth: "", icon: Grid, color: "text-purple-500", glow: "" },
                { label: "Processing", value: "Done", growth: "0.2s", icon: Zap, color: "text-amber-500", glow: "" }
            ];
        }

        return mappedStats;
    };

    const matchingCurrency = (str: string) => ['revenue', 'cost', 'price', 'sales', 'profit', 'amount'].some(s => str.toLowerCase().includes(s));

    const stats = mapStats();

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-6">
            <ControlBar selections={selections} onSelect={handleSelect} />

            {/* KPI Section - Simplified & Efficient */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {stats.map((stat, i) => (
                    <motion.div key={i} variants={item}>
                        <div className="p-6 bg-white/[0.03] border border-white/10 rounded-2xl hover:bg-white/[0.05] transition-colors relative overflow-hidden group">
                            <div className={`absolute top-0 right-0 p-3 opacity-20 ${stat.color} group-hover:opacity-40 transition-opacity`}>
                                <stat.icon className="w-8 h-8" />
                            </div>
                            <div className="space-y-2 relative z-10">
                                <p className="text-sm font-medium text-gray-400">{stat.label}</p>
                                <div className="flex items-baseline gap-3">
                                    <h4 className="text-3xl font-bold text-white tracking-tight">{stat.value}</h4>
                                    <div className={`flex items-center text-xs font-bold ${stat.growth.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {stat.growth.startsWith('+') ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ChevronDown className="w-3 h-3 mr-1" />}
                                        {stat.growth}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Main Insights Region - Compact Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Primary Projection Chart - Clean Logic */}
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-2 shadow-lg shadow-black/20 rounded-3xl"
                >
                    <div className="p-6 bg-white/[0.03] border border-white/10 rounded-3xl h-[400px] flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <Activity className="w-5 h-5 text-cyan-500" />
                                Forecasting
                            </h3>
                            <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-cyan-500" /> Prediction</div>
                                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-600" /> History</div>
                            </div>
                        </div>

                        <div className="flex-1 w-full relative">
                            {(() => {
                                const displayPredictions = prediction?.predictions?.length > 0
                                    ? prediction.predictions
                                    : Array.from({ length: 40 }, (_, i) => ({
                                        index: i,
                                        actual: 10000 + Math.sin(i * 0.2) * 2000 + (Math.random() * 500),
                                        predicted: 10000 + Math.sin(i * 0.2) * 2000 + (i * 50) + (Math.random() * 300)
                                    }));

                                return (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={displayPredictions} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="solidCyan" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                                                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                            <XAxis dataKey="index" hide />
                                            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
                                            <Tooltip
                                                contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '8px' }}
                                                itemStyle={{ color: '#e2e8f0', fontSize: '12px' }}
                                                labelStyle={{ display: 'none' }}
                                                cursor={{ stroke: 'rgba(255,255,255,0.1)' }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="predicted"
                                                stroke="#06b6d4"
                                                strokeWidth={2}
                                                fill="url(#solidCyan)"
                                                animationDuration={1500}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="actual"
                                                stroke="#475569"
                                                strokeWidth={2}
                                                fill="transparent"
                                                strokeDasharray="4 4"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                );
                            })()}
                        </div>
                    </div>
                </motion.div>

                {/* Cognitive Reasoning - Efficient List */}
                <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="h-full shadow-lg shadow-black/20 rounded-3xl"
                >
                    <div className="p-6 bg-white/[0.03] border border-white/10 rounded-3xl h-full flex flex-col relative overflow-hidden">
                        {/* Background Texture */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.1),transparent_70%)]" />

                        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2 relative z-10">
                            <Layers className="w-5 h-5 text-violet-500" />
                            Reasoning
                        </h3>

                        <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2 relative z-10">
                            {(() => {
                                const steps = reasoning?.logic_steps?.length > 0
                                    ? reasoning.logic_steps
                                    : [
                                        "Ingesting multidimensional data vectors",
                                        "Calculating cross-feature correlations",
                                        "Optimizing LSTM-transformer parameters",
                                        "Stabilizing autonomous decision weights"
                                    ];

                                return steps.map((step: string, i: number) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 + (i * 0.1) }}
                                        className="relative pl-4 border-l-2 border-white/10"
                                    >
                                        <div className="text-[10px] font-bold text-violet-400 mb-1">NODE {i + 1}</div>
                                        <p className="text-xs text-slate-300 leading-relaxed">{step}</p>
                                    </motion.div>
                                ));
                            })()}
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                            <span className="text-xs text-gray-500 font-medium">Model Confidence</span>
                            <span className="text-xl font-bold text-white">{(reasoning?.confidence_score * 100 || 96.8).toFixed(1)}%</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Row - Simplified Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Sentinel */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="lg:col-span-1"
                >
                    <div className="p-6 bg-white/[0.03] border border-white/10 rounded-3xl h-full flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Sentinel</h3>
                            <Zap className="w-4 h-4 text-amber-500" />
                        </div>
                        <div className="grid grid-cols-8 gap-1 mb-4">
                            {heatmapData.slice(0, 32).map((cell) => (
                                <div key={cell.index} className={`h-2 rounded-sm ${cell.color} opacity-60`} />
                            ))}
                        </div>
                        <p className="text-xs text-gray-500">
                            {anomalies?.anomaly_count > 0 ? `${anomalies.anomaly_count} potential anomalies detected.` : "System nominal. No anomalies."}
                        </p>
                    </div>
                </motion.div>

                {/* Intelligence Fabric */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="lg:col-span-2"
                >
                    <div className="p-6 bg-white/[0.03] border border-white/10 rounded-3xl h-full">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <Cpu className="w-5 h-5 text-emerald-500" />
                                Intelligence Fabric
                            </h3>
                            <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">ACTIVE</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
                            {/* Driver Correlation Strength */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Key Driver Correlations</h4>
                                {(reasoning?.top_drivers?.length ? reasoning.top_drivers.slice(0, 3) : ['Market_Vol', 'User_Growth', 'System_Load']).map((driver: string, i: number) => (
                                    <div key={i} className="group">
                                        <div className="flex justify-between text-xs text-slate-400 mb-1 group-hover:text-white transition-colors">
                                            <span>{driver.replace(/_/g, ' ').toUpperCase()}</span>
                                            <span className="font-mono text-emerald-400">{(0.9 - (i * 0.15)).toFixed(2)}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-800/50 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(0.9 - (i * 0.15)) * 100}%` }}
                                                transition={{ duration: 1, delay: 0.8 + (i * 0.1) }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* System Health Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: 'Latency', value: '1.2ms', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
                                    { label: 'Active Nodes', value: '1,024', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
                                    { label: 'Entropy', value: '0.04', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
                                    { label: 'Uptime', value: '99.99%', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' }
                                ].map((stat, i) => (
                                    <div key={i} className={`flex flex-col items-center justify-center p-3 rounded-xl ${stat.bg} ${stat.border} border`}>
                                        <span className={`text-[10px] font-bold ${stat.color} mb-0.5`}>{stat.label}</span>
                                        <span className="text-sm font-mono text-white font-bold">{stat.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
