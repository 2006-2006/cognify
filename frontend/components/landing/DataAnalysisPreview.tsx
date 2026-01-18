'use client';

import { motion } from 'framer-motion';

export const DataAnalysisPreview = () => {
    return (
        <div className="relative group w-full max-w-lg mx-auto">
            {/* Ambient Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />

            <div className="relative p-8 md:p-12 rounded-[2.5rem] bg-[#030712] border border-white/10 overflow-hidden shadow-2xl">
                {/* Background Decor */}
                <div className="absolute inset-0 bg-blue-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-[60px]" />

                <div className="relative z-10 space-y-8">
                    {/* Header Simulation */}
                    <div className="flex justify-between items-center mb-4 opacity-50">
                        <div className="h-2 w-24 bg-white/20 rounded-full" />
                        <div className="h-2 w-8 bg-white/10 rounded-full" />
                    </div>

                    {/* Animated Bars */}
                    {[85, 60, 95, 75].map((width, i) => (
                        <div key={i} className="relative group/bar">
                            {/* Bar Background */}
                            <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                                {/* Fill */}
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${width}%` }}
                                    transition={{ duration: 1.5, delay: i * 0.2, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 relative"
                                >
                                    {/* Shimmer Effect */}
                                    <motion.div
                                        className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                        initial={{ x: '-100%' }}
                                        animate={{ x: '100%' }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
                                    />
                                </motion.div>
                            </div>

                            {/* Hover info (Glass Tooltip) */}
                            <div className="absolute -top-8 left-0 opacity-0 group-hover/bar:opacity-100 transition-opacity duration-300">
                                <div className="px-2 py-1 bg-black/80 border border-white/10 rounded-md text-[10px] text-cyan-400 font-mono">
                                    Metric_{i + 1}: {width}%
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Bottom Info Simulation */}
                    <div className="flex gap-4 mt-6 opacity-30">
                        <div className="h-8 w-8 rounded-lg bg-white/20" />
                        <div className="space-y-2 flex-1">
                            <div className="h-2 w-full bg-white/10 rounded-full" />
                            <div className="h-2 w-2/3 bg-white/10 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
