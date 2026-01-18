'use client';
import { motion } from 'framer-motion';
import { BrainCircuit, Zap, Shield, Monitor, Cpu, Network, Activity, Database } from 'lucide-react';

const features = [
    {
        title: "Multi-Agent AI",
        description: "Cooperative AI agents analyze your data",
        icon: BrainCircuit,
        color: "text-blue-400",
        bullet: "Cooperative AI agents analyze your data"
    },
    {
        title: "Real-Time Predictions",
        description: "Generate forecasts and risk alerts in real-time",
        icon: Zap,
        color: "text-cyan-400",
        bullet: "Generate forecasts and risk alerts in real time"
    },
    {
        title: "Risk & Anomaly Detection",
        description: "Identify anomalies and assess risks early",
        icon: Shield,
        color: "text-white",
        bullet: "Identify anomalies and assess risks early"
    },
    {
        title: "Interactive Dashboard",
        description: "Visualize results with interactive charts",
        icon: Monitor,
        color: "text-indigo-400",
        bullet: "Visualize results with interactive charts/charts"
    }
];

const FeatureCard = ({ feature, index }: { feature: any; index: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group relative rounded-2xl glass-morphism p-8 border border-white/10 hover:border-cyan-500/50 transition-all duration-300 inner-glow overflow-hidden"
        >
            <div className="flex flex-col h-full">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                        <feature.icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <h3 className="text-2xl font-black text-white tracking-tight">
                        {feature.title}
                    </h3>
                </div>

                <div className="mt-auto">
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3 text-lg text-slate-400 font-light leading-snug">
                            <span className="mt-2.5 h-1.5 w-1.5 rounded-full bg-cyan-500 shrink-0" />
                            {feature.bullet}
                        </li>
                    </ul>
                </div>
            </div>

            {/* Subtle Gradient Glow */}
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>
    );
};

export const Features = () => {
    return (
        <section id="features" className="py-20 px-6 relative overflow-hidden bg-black">
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} feature={feature} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};
