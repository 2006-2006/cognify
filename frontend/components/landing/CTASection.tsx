'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Shield, Cpu, Zap, Activity } from 'lucide-react';
import { useRef } from 'react';

export const CTASection = ({ onStart }: { onStart: () => void }) => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
    const rotate = useTransform(scrollYProgress, [0, 1], [2, -2]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return (
        <section ref={containerRef} className="py-40 md:py-60 px-6 relative overflow-hidden bg-black">
            {/* Background Decor */}
            <div className="absolute inset-0 opacity-[0.02] mesh-grid" />

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    style={{ y, rotateX: rotate }}
                    className="relative p-12 md:p-32 rounded-[4rem] md:rounded-[6rem] overflow-hidden border border-white/10 bg-gradient-to-br from-white/[0.03] via-transparent to-white/[0.01] backdrop-blur-3xl shadow-[0_0_100px_rgba(0,0,0,0.8)] group"
                >
                    {/* Grid Lines */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-1000">
                        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
                    </div>

                    {/* Glowing Corner */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full group-hover:bg-cyan-500/20 transition-all duration-1000" />

                    <div className="relative z-10 text-center space-y-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-4 px-8 py-3 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-[10px] font-mono tracking-[0.6em] uppercase backdrop-blur-md"
                        >
                            <span className="flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-cyan-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,1)]"></span>
                            </span>
                            System Terminal Online
                        </motion.div>

                        <h2 className="text-7xl md:text-[11rem] font-black font-display text-white leading-[0.8] tracking-tighter text-reflect">
                            READY TO <br />
                            <span className="text-gradient-primary">EVOLVE?</span>
                        </h2>

                        <p className="text-xl md:text-3xl text-gray-500 max-w-3xl mx-auto font-light leading-relaxed tracking-wide">
                            Initialize your autonomous decision fabric today and transcend traditional enterprise limitations.
                        </p>

                        <div className="flex flex-col items-center gap-16 pt-8">
                            <motion.button
                                onClick={onStart}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                className="group btn-premium !text-2xl !px-20 !py-10"
                            >
                                <span className="flex items-center gap-6">
                                    LAUNCH CORE TERMINAL <ArrowRight className="w-8 h-8 group-hover:translate-x-3 transition-transform duration-500" />
                                </span>
                            </motion.button>

                            <div className="flex flex-col md:flex-row items-center gap-16">
                                {[
                                    { icon: Shield, label: "Enterprise Grade", color: "text-cyan-500" },
                                    { icon: Zap, label: "Zero Latency", color: "text-amber-500" },
                                    { icon: Activity, label: "Self Healing", color: "text-emerald-500" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 group/item cursor-default">
                                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 group-hover/item:border-white/20 transition-colors">
                                            <item.icon className={`w-6 h-6 ${item.color}`} />
                                        </div>
                                        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-500 group-hover/item:text-gray-300 transition-colors">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Scanline Effect */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
                </motion.div>
            </div>
        </section>
    );
};
