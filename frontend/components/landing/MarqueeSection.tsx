'use client';
import { motion } from 'framer-motion';
import { Cpu, Database, Shield, Zap, Globe, Activity } from 'lucide-react';

const companies = [
    { name: "AETHER CORP", icon: Cpu },
    { name: "NEURALITH", icon: Database },
    { name: "QUANTUM SYNERGY", icon: Zap },
    { name: "VERTEX AI", icon: Activity },
    { name: "HORIZON DATA", icon: Globe },
    { name: "NEXUS SYSTEMS", icon: Shield },
];

export const MarqueeSection = () => {
    return (
        <section className="py-20 bg-black relative overflow-hidden border-y border-white/5">
            <div className="absolute inset-y-0 left-0 w-60 bg-gradient-to-r from-black to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-60 bg-gradient-to-l from-black to-transparent z-10" />

            <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-6"
                >
                    <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-cyan-500/30" />
                    <span className="text-[10px] font-mono tracking-[0.8em] text-gray-500 uppercase font-black">Powering Global Sovereignty</span>
                    <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-cyan-500/30" />
                </motion.div>
            </div>

            <div className="flex overflow-hidden">
                <motion.div
                    className="flex whitespace-nowrap items-center py-4"
                    animate={{ x: [0, -2000] }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                >
                    {[...companies, ...companies, ...companies, ...companies].map((item, i) => (
                        <div key={i} className="flex items-center gap-6 mx-12 px-8 py-4 rounded-2xl glass-card group cursor-default border border-white/10 hover:border-cyan-500/40 transition-all duration-500">
                            <item.icon className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors duration-500 shadow-[0_0_15px_rgba(14,165,233,0)] group-hover:shadow-[0_0_15px_rgba(14,165,233,0.5)]" />
                            <span className="text-2xl md:text-3xl font-display font-black text-white/30 group-hover:text-white/80 transition-all duration-700 uppercase tracking-tighter">
                                {item.name}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};
