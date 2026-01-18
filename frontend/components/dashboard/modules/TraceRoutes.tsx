import { motion } from 'framer-motion';
import { GitCommit, GitPullRequest, GitMerge, ArrowRight, CheckCircle2 } from 'lucide-react';

interface TraceRoutesProps {
    results: any;
}

export const TraceRoutes = ({ results }: TraceRoutesProps) => {
    const safeResults = results || {};
    const pid = safeResults.pipeline_id ? safeResults.pipeline_id.substring(0, 8) : 'LOCAL_SIM';

    // Generate trace steps based on pipeline execution
    const traces = [
        { id: `0x${pid}a1`, source: 'Ingestion_Layer', target: 'Schema_Validator', status: 'Complete', latency: '12ms' },
        { id: `0x${pid}b2`, source: 'Schema_Validator', target: 'Vector_Db', status: 'Complete', latency: '45ms' },
        { id: `0x${pid}c3`, source: 'Vector_Db', target: 'Prediction_Model', status: 'Active', latency: '110ms' },
        { id: `0x${pid}d4`, source: 'Prediction_Model', target: 'Reasoning_Engine', status: 'Queued', latency: '-' },
    ];

    if (safeResults.reasoning) {
        traces[3].status = 'Complete';
        traces[3].latency = '85ms';
    }

    return (
        <div className="h-full w-full p-8">
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 h-full flex flex-col">
                <div className="flex justify-between items-center mb-12">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                        <GitPullRequest className="w-6 h-6 text-orange-400" />
                        Data Traceability Matrix
                    </h3>
                    <div className="text-xs font-mono text-slate-500 uppercase tracking-widest">Live Topology View</div>
                </div>

                <div className="flex-1 relative min-h-[300px]">
                    {/* Simulated Trace Flow */}
                    <div className="absolute inset-0 flex items-center justify-between px-20">
                        {['Source', 'Ingestion', 'Processing', 'Output'].map((step, i) => (
                            <div key={i} className="relative z-10 flex flex-col items-center gap-4">
                                <div className="w-4 h-4 rounded-full bg-slate-800 border-2 border-slate-600" />
                                <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">{step}</span>
                            </div>
                        ))}
                        {/* Connecting Line */}
                        <div className="absolute left-20 right-20 top-2 h-0.5 bg-white/10 -z-0" />
                    </div>

                    {/* Active Parcels */}
                    {traces.map((trace, i) => (
                        <motion.div
                            key={i}
                            className="absolute top-2 left-20 right-20 h-full pointer-events-none"
                        >
                            <motion.div
                                className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_15px_orange] absolute top-[-5px]"
                                initial={{ left: '0%', opacity: 0 }}
                                animate={{
                                    left: ['0%', '33%', '66%', '100%'],
                                    opacity: [0, 1, 1, 0]
                                }}
                                transition={{
                                    duration: 3 + Math.random() * 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: i * 1.5,
                                    times: [0, 0.2, 0.8, 1]
                                }}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Log Table */}
                <div className="mt-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="text-slate-500 border-b border-white/5">
                            <tr>
                                <th className="pb-4 pl-4">Trace ID</th>
                                <th className="pb-4">Source Route</th>
                                <th className="pb-4">Target Node</th>
                                <th className="pb-4">Latency</th>
                                <th className="pb-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {traces.map((t, i) => (
                                <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="py-4 pl-4 font-mono text-slate-400">{t.id}</td>
                                    <td className="py-4 text-white font-medium">{t.source}</td>
                                    <td className="py-4 text-white font-medium flex items-center gap-2">
                                        <ArrowRight className="w-3 h-3 text-slate-600" /> {t.target}
                                    </td>
                                    <td className="py-4 text-mono text-slate-400">{t.latency}</td>
                                    <td className="py-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${t.status === 'Complete' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                            {t.status.toUpperCase()}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
