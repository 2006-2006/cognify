'use client';
import { useState } from 'react';
import { ChevronDown, Settings, Grid, List, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ControlBarProps {
    selections: {
        dataset: string;
        region: string;
        period: string;
    };
    onSelect: (category: string, value: string) => void;
}

export function ControlBar({ selections, onSelect }: ControlBarProps) {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const filters = {
        dataset: ['Sales Data', 'Marketing Analytics', 'Financial Report'],
        region: ['All Regions', 'North America', 'Europe', 'Asia Pacific'],
        period: ['Last 30 Days', 'Last Quarter', 'Year to Date', 'All Time']
    };

    const handleSelect = (category: string, value: string) => {
        onSelect(category, value);
        setActiveDropdown(null);
    };

    return (
        <div className="w-full h-16 bg-[#030303] border border-white/10 rounded-2xl flex items-center justify-between px-4 sticky top-0 z-40 backdrop-blur-xl bg-opacity-80">

            {/* Left Controls */}
            <div className="flex items-center gap-3">
                {Object.entries(filters).map(([key, options]) => (
                    <div key={key} className="relative">
                        <button
                            onClick={() => setActiveDropdown(activeDropdown === key ? null : key)}
                            className={`
                flex items-center gap-6 px-4 py-2 rounded-lg border text-xs font-mono tracking-wide transition-all duration-200
                ${activeDropdown === key
                                    ? 'bg-white/10 border-white/20 text-white'
                                    : 'bg-black/40 border-white/5 text-gray-400 hover:text-white hover:border-white/10'}
              `}
                        >
                            <span className="opacity-50 uppercase">{key}:</span>
                            <span className="text-gray-200">{selections[key as keyof typeof selections]}</span>
                            <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === key ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {activeDropdown === key && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.1 }}
                                    className="absolute top-full mt-2 left-0 min-w-[200px] bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 p-1"
                                >
                                    {options.map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => handleSelect(key as keyof typeof selections, option)}
                                            className={`
                        w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition-colors flex items-center justify-between group
                        ${selections[key as keyof typeof selections] === option
                                                    ? 'bg-white/10 text-white'
                                                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}
                      `}
                                        >
                                            {option}
                                            {selections[key as keyof typeof selections] === option && <ChevronRight className="w-3 h-3 text-cyan-500" />}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2 border-l border-white/10 pl-4 h-8">
                <button className="p-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                    <Settings className="w-4 h-4" />
                </button>
                <div className="flex bg-white/5 p-1 rounded-lg">
                    <button className="p-1.5 text-white bg-white/10 rounded shadow-sm">
                        <Grid className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-gray-500 hover:text-white transition-colors rounded">
                        <List className="w-4 h-4" />
                    </button>
                </div>
            </div>

        </div>
    );
}
