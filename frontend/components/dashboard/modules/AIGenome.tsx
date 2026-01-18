import { motion } from 'framer-motion';
import { Dna, Fingerprint, Code2, GitBranch, Terminal } from 'lucide-react';

interface AIGenomeProps {
    results: any;
}

export const AIGenome = ({ results }: AIGenomeProps) => {
    const safeResults = results || {};
    const modelName = safeResults.prediction?.model_used || 'Transformer-Hybrid';
    const pid = safeResults.pipeline_id ? safeResults.pipeline_id.substring(0, 6) : 'DEV';

    return (
        <div className="h-full w-full p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Genome Card */}
                <div className="lg:col-span-1 bg-white/[0.02] border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden min-h-[500px]">
                    <div className="absolute inset-0 bg-gradient-to-b from-pink-500/5 to-transparent opacity-50" />

                    <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        className="relative z-10"
                    >
                        <Dna className="w-32 h-32 text-pink-500" />
                    </motion.div>

                    <div className="mt-8 text-center relative z-10 space-y-2">
                        <h3 className="text-2xl font-bold text-white">Model DNA</h3>
                        <p className="text-sm text-pink-400 font-mono">Build {pid}-alpha</p>
                    </div>

                    <div className="mt-12 w-full space-y-4 relative z-10">
                        {[`Architecture: ${modelName}`, 'Params: 175B', 'Context: 32k Tokens'].map((item, i) => (
                            <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                                <span className="text-xs text-slate-400 font-bold uppercase">{item.split(':')[0]}</span>
                                <span className="text-xs text-white font-mono text-right">{item.split(':')[1]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Evolution History & Code */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <GitBranch className="w-5 h-5 text-indigo-400" /> Evolutionary Path
                        </h3>
                        <div className="space-y-6 pl-4 border-l border-white/10">
                            {[
                                { v: `v${pid} (Current)`, date: 'Just now', desc: `Optimized for uploaded dataset analysis.`, active: true },
                                { v: 'v12.0.4', date: 'Yesterday', desc: 'Enhanced reasoning capabilities via RLHF.', active: false },
                                { v: 'v12.0.3', date: '2 days ago', desc: 'Optimized LSTM latency for flash trading.', active: false },
                            ].map((item, i) => (
                                <div key={i} className="relative">
                                    <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 ${item.active ? 'bg-indigo-500 border-indigo-500' : 'bg-black border-slate-600'}`} />
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className={`text-sm font-bold ${item.active ? 'text-white' : 'text-slate-500'}`}>{item.v}</h4>
                                        <span className="text-xs text-slate-600 font-mono">{item.date}</span>
                                    </div>
                                    <p className="text-sm text-slate-400">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-black/40 border border-white/10 rounded-3xl p-6 font-mono text-xs overflow-hidden relative">
                        <div className="absolute top-4 right-4 text-slate-600">
                            <Terminal className="w-5 h-5" />
                        </div>
                        <div className="space-y-2 opacity-70">
                            <p className="text-green-400">$ load_weights --checkpoint=latest</p>
                            <p className="text-slate-400">{">"} Loading shards 1-32...</p>
                            <p className="text-slate-400">{">"} Verifying tensor integrity... OK</p>
                            <p className="text-slate-400">{">"} Initializing hyperparameter grid... OK</p>
                            <p className="text-blue-400">{">"} SYSTEM READY.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
