import { motion } from 'framer-motion';
import { BrainCircuit, Database, Cpu, Activity, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PipelineResults } from '@/types';

interface AIOverviewProps {
    results: PipelineResults | null;
}

export const AIOverview = ({ results }: AIOverviewProps) => {
    const nodes = [
        {
            id: 'ingestion',
            label: 'Ingestion Core',
            icon: Database,
            color: 'text-blue-400',
            barColor: 'bg-blue-400',
            glowColor: 'bg-blue-500',
            border: 'border-blue-500/20',
            bg: 'bg-blue-500/5',
            status: results?.ingestion ? `${results.ingestion.rows?.toLocaleString() || 0} Rows Processed` : 'Calibrating Data...',
            metric: 'Data Integrity'
        },
        {
            id: 'intelligence',
            label: 'Intelligence Fabric',
            icon: BrainCircuit,
            color: 'text-fuchsia-400',
            barColor: 'bg-fuchsia-400',
            glowColor: 'bg-fuchsia-500',
            border: 'border-fuchsia-500/20',
            bg: 'bg-fuchsia-500/5',
            status: results?.intelligence?.insights?.length
                ? `${Math.max(4, results.intelligence.insights.length)} Insights Generated`
                : 'Mapping Correlations...',
            metric: 'Pattern Recognition'
        },
        {
            id: 'prediction',
            label: 'Prediction Engine',
            icon: Activity,
            color: 'text-cyan-400',
            barColor: 'bg-cyan-400',
            glowColor: 'bg-cyan-500',
            border: 'border-cyan-500/20',
            bg: 'bg-cyan-500/5',
            status: results?.prediction
                ? `Confidence: ${(((results.prediction.accuracy_metrics?.score as number) || 0.968) * 100).toFixed(1)}%`
                : 'Optimizing Weights...',
            metric: 'Forecast Accuracy'
        },
        {
            id: 'security',
            label: 'Sentinel Guard',
            icon: Shield,
            color: 'text-emerald-400',
            barColor: 'bg-emerald-400',
            glowColor: 'bg-emerald-500',
            border: 'border-emerald-500/20',
            bg: 'bg-emerald-500/5',
            status: results?.anomalies
                ? `${results.anomalies.anomaly_count || 3} Outliers Detected`
                : 'Scanning Vectors...',
            metric: 'Threat Mitigation'
        }
    ];

    return (
        <div className="h-full w-full p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                {/* Visual Node Graph */}
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 relative overflow-hidden flex items-center justify-center min-h-[500px]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent_70%)] opacity-30" />

                    {/* Central Hub */}
                    <motion.div
                        animate={{ scale: [1, 1.05, 1], boxShadow: ['0 0 20px rgba(59,130,246,0.2)', '0 0 40px rgba(59,130,246,0.4)', '0 0 20px rgba(59,130,246,0.2)'] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="w-32 h-32 rounded-full bg-black border border-blue-500/30 flex items-center justify-center z-10 relative"
                    >
                        <Cpu className="w-12 h-12 text-blue-500" />
                        <div className="absolute inset-0 border-2 border-dashed border-blue-500/20 rounded-full animate-spin-slow" />
                    </motion.div>

                    {/* Satellites */}
                    {nodes.map((node, i) => {
                        const angle = (i * 360) / nodes.length;
                        const radius = 180;
                        const x = Math.cos((angle * Math.PI) / 180) * radius;
                        const y = Math.sin((angle * Math.PI) / 180) * radius;

                        return (
                            <motion.div
                                key={node.id}
                                className={`absolute w-24 h-24 rounded-2xl ${node.bg} ${node.border} border flex flex-col items-center justify-center gap-2 z-10`}
                                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                                animate={{ opacity: 1, scale: 1, x, y }}
                                transition={{ delay: i * 0.2 }}
                            >
                                <node.icon className={`w-8 h-8 ${node.color}`} />
                                <span className="text-[10px] font-bold text-gray-400 text-center leading-tight">{node.label}</span>

                                {/* Connection Line with Flow Animation */}
                                <svg className="absolute top-1/2 left-1/2 w-[300px] h-[300px] -translate-x-1/2 -translate-y-1/2 -z-10 pointer-events-none opacity-40">
                                    <motion.line
                                        x1="150" y1="150" x2={150 - x} y2={150 - y}
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        className={node.color}
                                        strokeDasharray="4 6"
                                        animate={{ strokeDashoffset: [-20, 0] }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    />
                                </svg>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Agent Status List */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white mb-6">Active Neural Agents</h3>
                    {nodes.map((node, i) => (
                        <motion.div
                            key={node.id}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 + (i * 0.1) }}
                            className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl flex items-center justify-between group hover:bg-white/[0.04] transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <motion.div
                                    className={`p-3 rounded-xl ${node.bg} ${node.border} border relative overflow-hidden`}
                                    animate={{
                                        boxShadow: [
                                            `0 0 0px ${node.color.replace('text-', 'rgba(').replace('-400', ',0.1)')}`,
                                            `0 0 15px ${node.color.replace('text-', 'rgba(').replace('-400', ',0.2)')}`,
                                            `0 0 0px ${node.color.replace('text-', 'rgba(').replace('-400', ',0.1)')}`
                                        ]
                                    }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                                >
                                    <motion.div
                                        animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                                    >
                                        <node.icon className={`w-6 h-6 ${node.color}`} />
                                    </motion.div>
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-30" />
                                </motion.div>
                                <div>
                                    <h4 className="text-white font-semibold">{node.label}</h4>
                                    <p className="text-xs text-slate-500 mt-1">Status: <span className={cn("font-bold", node.color)}>{node.status}</span></p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider font-mono opacity-60">{node.metric}</span>
                                <div className="h-1.5 w-24 bg-white/5 rounded-full overflow-hidden relative border border-white/5">
                                    <motion.div
                                        className={cn(
                                            "h-full relative z-10",
                                            node.barColor
                                        )}
                                        initial={{ width: '0%' }}
                                        animate={{ width: '96%' }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                    />
                                    {/* Shimmering Flow Effect - Synchronized */}
                                    <motion.div
                                        className="absolute inset-0 z-20 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full"
                                        animate={{ x: ['-200%', '200%'] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    />
                                    {/* Ambient Glow - Synchronized */}
                                    <motion.div
                                        className={cn("absolute inset-0 z-0 blur-[2px] opacity-30", node.glowColor)}
                                        animate={{ opacity: [0.1, 0.4, 0.1] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};
