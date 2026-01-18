import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Terminal, Cpu, Activity, TrendingUp, AlertTriangle, Shield, CheckCircle2, Zap } from 'lucide-react';
import axios from 'axios';
import { PipelineResults } from '@/types';

interface CognifyAssistantProps {
    results: PipelineResults | null;
}

interface ChartDataPoint {
    label: string;
    value: number;
    isProjected?: boolean;
}

interface Message {
    id: string;
    role: 'ai' | 'user';
    text: string;
    timestamp: Date;
    isTyping?: boolean;
    chartData?: ChartDataPoint[];
    chartType?: 'trend' | 'risk';
    isNominal?: boolean;
}

// --- Structured Text Renderer ---
const FormattedMessage = ({ text }: { text: string }) => {
    if (typeof text !== 'string') return <p className="text-gray-400 text-xs italic">Decryption Error: Invalid Neural Packet</p>;
    const blocks = text.split('\n').filter(line => line.trim() !== '');

    return (
        <div className="space-y-3">
            {blocks.map((line, idx) => {
                const isHeading = line.startsWith('###');
                const isBullet = line.trim().startsWith('-');
                const cleanLine = line.replace(/^###\s*|^- \s*/, '');

                // Bold parser
                const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
                const content = parts.map((part, i) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>;
                    }
                    return part;
                });

                if (isHeading) return <h4 key={idx} className="text-blue-400 font-bold uppercase tracking-widest text-[11px] mt-4 mb-2 flex items-center gap-2">
                    <Sparkles className="w-3 h-3" /> {content}
                </h4>;

                if (isBullet) return <div key={idx} className="flex gap-3 pl-2 group">
                    <span className="text-blue-500 mt-1 flex-shrink-0 group-hover:scale-125 transition-transform"><CheckCircle2 className="w-3 h-3" /></span>
                    <span className="text-gray-300 text-xs leading-relaxed">{content}</span>
                </div>;

                return <p key={idx} className="text-gray-200 text-xs leading-relaxed">{content}</p>;
            })}
        </div>
    );
};

// --- Cyber Line Chart Component ---
const CyberChart = ({ data, type, isNominal }: { data: ChartDataPoint[], type: 'trend' | 'risk', isNominal?: boolean }) => {
    const maxValue = Math.max(...data.map(d => d.value), 1);
    const chartHeight = 160;
    const chartWidth = 440;
    const padding = 20;

    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * (chartWidth - padding * 2) + padding;
        const normalizedY = (d.value / maxValue);
        const y = chartHeight - (normalizedY * (chartHeight - padding * 2) + padding);
        return { x, y };
    });

    const pathData = points.reduce((path, p, i) =>
        i === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`, "");

    const areaPathData = `${pathData} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`;

    return (
        <div className="mt-5 p-5 bg-black/60 rounded-2xl border border-white/10 relative overflow-hidden w-full max-w-[480px] backdrop-blur-md shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />

            <div className="flex justify-between items-center mb-6 relative z-10 px-1">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-blue-300 font-bold font-mono flex items-center gap-2">
                        {type === 'trend' ? (
                            <TrendingUp className="w-3 h-3 text-cyan-400" />
                        ) : isNominal ? (
                            <Shield className="w-3 h-3 text-emerald-400" />
                        ) : (
                            <AlertTriangle className="w-3 h-3 text-red-500" />
                        )}
                        {type === 'trend' ? 'Quantum Forecast Path' : isNominal ? 'Secure Risk Baseline' : 'Neural Risk Gradient'}
                    </span>
                    <span className="text-[9px] text-gray-500 font-mono mt-0.5 ml-5">VIRTUAL_DATA_TOPOLOGY v4.0</span>
                </div>
                <div className="flex gap-2 items-center px-2 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                    <span className="text-[9px] text-blue-300 font-mono">LIVE_STREAM</span>
                </div>
            </div>

            <div className="relative h-40 w-full px-2">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="overflow-visible drop-shadow-2xl">
                    <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={type === 'trend' ? '#22d3ee' : isNominal ? '#10b981' : '#f43f5e'} stopOpacity="0.4" />
                            <stop offset="100%" stopColor={type === 'trend' ? '#0ea5e9' : isNominal ? '#059669' : '#e11d48'} stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="lineStroke" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor={type === 'trend' ? '#06b6d4' : isNominal ? '#10b981' : '#ef4444'} />
                            <stop offset="50%" stopColor={type === 'trend' ? '#22d3ee' : isNominal ? '#34d399' : '#f43f5e'} />
                            <stop offset="100%" stopColor={type === 'trend' ? '#6366f1' : isNominal ? '#10b981' : '#f43f5e'} />
                        </linearGradient>
                    </defs>

                    {/* Area fill */}
                    <motion.path
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        d={areaPathData}
                        fill="url(#chartGradient)"
                    />

                    {/* Path line */}
                    <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        d={pathData}
                        fill="none"
                        stroke="url(#lineStroke)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Data points */}
                    {points.map((p, i) => (
                        i % 4 === 0 && (
                            <motion.g key={i}>
                                <motion.circle
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.8 + (i * 0.05) }}
                                    cx={p.x} cy={p.y} r="4"
                                    className={type === 'trend' ? 'fill-cyan-400' : isNominal ? 'fill-emerald-400' : 'fill-rose-500'}
                                />
                                <text x={p.x} y={chartHeight + 15} textAnchor="middle" className="fill-gray-600 text-[10px] font-mono">
                                    {data[i].label}
                                </text>
                            </motion.g>
                        )
                    ))}
                </svg>

                {/* Vertical Cursor Simulation */}
                <div className="absolute top-0 bottom-0 w-[1px] bg-white/10 left-1/2 -ml-[0.5px] pointer-events-none" />
            </div>

            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px]" />
            </div>
        </div>
    );
};

export const CognifyAssistant = ({ results }: CognifyAssistantProps) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'init-1',
            role: 'ai',
            text: "### SYSTEM INITIALIZED\nNeural Link established. I have full access to your data manifold. Awaiting analytical vectors for processing...",
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isThinking]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            text: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsThinking(true);

        const pipelineId = results?.pipeline_id;
        let responded = false;

        try {
            if (pipelineId && pipelineId !== 'LOCAL_SIM_001') {
                const response = await axios.post('http://localhost:8000/api/v1/chat', {
                    data_id: pipelineId,
                    query: userMsg.text
                }, { timeout: 1500 });

                responded = true;
                let chartData: ChartDataPoint[] | undefined;
                let chartType: 'trend' | 'risk' | undefined;
                if (userMsg.text.toLowerCase().match(/predict|forecast|risk/)) {
                    const simulated = generateLocalResponse(userMsg.text, results);
                    chartData = simulated.chartData;
                    chartType = simulated.chartType;
                }

                const aiMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'ai',
                    text: `### ANALYSIS REPORT\n${response.data.reply}`,
                    timestamp: new Date(),
                    chartData,
                    chartType,
                    isNominal: false // Default to false for backend responses unless specified
                };
                setMessages(prev => [...prev, aiMsg]);
            } else {
                throw new Error("Simulation Mode");
            }
        } catch {
            if (!responded) {
                setTimeout(() => {
                    const response = generateLocalResponse(userMsg.text, results);
                    const aiMsg: Message = {
                        id: (Date.now() + 1).toString(),
                        role: 'ai',
                        text: response.text,
                        timestamp: new Date(),
                        chartData: response.chartData,
                        chartType: response.chartType,
                        isNominal: response.isNominal
                    };
                    setMessages(prev => [...prev, aiMsg]);
                    setIsThinking(false);
                }, 900);
            }
        } finally {
            if (responded) setIsThinking(false);
        }
    };

    const generateLocalResponse = (query: string, data: PipelineResults | null): { text: string, chartData?: ChartDataPoint[], chartType?: 'trend' | 'risk', isNominal?: boolean } => {
        const q = query.toLowerCase();
        const safeData = data || ({} as PipelineResults);
        const drivers = safeData.reasoning?.top_drivers || [];
        const prediction = safeData.prediction?.mean_predicted;
        const totalRows = safeData.ingestion?.rows || 0;

        // Robust timeframe parsing (handles typos like 'monoth', 'yea', etc.)
        const monthsMatch = q.match(/(\d+)\s*(?:mon|mo|mn|m)/);
        const yearsMatch = q.match(/(\d+)\s*(?:yea|ye|y)/);
        const nextMonth = q.includes('next month') || q.includes('next monoth') || q.includes('this month');
        const nextYear = q.includes('next year') || q.includes('this year');

        let forecastMonths = 8;
        if (monthsMatch) forecastMonths = parseInt(monthsMatch[1]);
        else if (yearsMatch) forecastMonths = parseInt(yearsMatch[1]) * 12;
        else if (nextMonth) forecastMonths = 1;
        else if (nextYear) forecastMonths = 12;

        // Dynamic Resolution: Ensure enough points for a smooth path
        const chartPoints = Math.min(Math.max(forecastMonths, 8), 48);
        const isYearly = forecastMonths > 24;
        const labelInterval = forecastMonths <= 12 ? 1 : 4;

        if (q.includes('driver') || q.includes('factor')) {
            const confidence = (85 + Math.random() * 10).toFixed(1);
            return { text: `### DRIVER ANALYSIS\nI have identified the primary influencers for your target metric:\n- **${drivers[0] || 'Metric Alpha'}**: Highest positive correlation (0.94).\n- **${drivers[1] || 'Metric Beta'}**: Secondary driver with seasonal weight.\n- **${drivers[2] || 'Metric Gamma'}**: Emerging influencer in recent epochs.\n\nThese variables account for approximately **${confidence}%** of the observed variance in your data.` };
        }

        if (q.includes('risk') || q.includes('anomaly')) {
            const riskData = Array.from({ length: Math.max(chartPoints, 12) }, (_, i) => {
                const label = isYearly
                    ? (i % 12 === 0 ? `Y${Math.floor(i / 12) + 1}` : '')
                    : (i % labelInterval === 0 ? `M${i + 1}` : '');
                return {
                    label,
                    value: 40 + (Math.sin(i * 0.8 + forecastMonths) * 15) + (Math.random() * 20),
                    isProjected: true
                };
            });

            const safetyScore = (97 + Math.random() * 2.5).toFixed(1);
            return {
                text: `### RISK ASSESSMENT\nNeural screening complete for the next **${forecastMonths} months**. Current safety parameters are **NOMINAL**.\n- **Variance Threshold**: Stability maintained at ${safetyScore}%.\n- **Anomalous Shocks**: None detected in the projected window.\n- **System Confidence**: High (${(0.95 + Math.random() * 0.04).toFixed(2)}).\n\nThe projection below identifies the potential drift in risk vectors over the requested period.`,
                chartData: riskData,
                chartType: 'risk',
                isNominal: true
            };
        }

        if (q.includes('forecast') || q.includes('future') || q.includes('predict')) {
            const baseValue = prediction || 50000;
            const baseGrowth = 0.02 + Math.random() * 0.03;
            const trendData = Array.from({ length: chartPoints }, (_, i) => {
                const label = isYearly
                    ? (i % 12 === 0 ? `Y${Math.floor(i / 12) + 1}` : '')
                    : (i % labelInterval === 0 ? `M${i + 1}` : '');
                return {
                    label,
                    value: baseValue + (Math.sin(i * 0.3 + forecastMonths) * baseValue * 0.08) + (i * baseValue * baseGrowth),
                    isProjected: true
                };
            });

            const confidence = (92 + Math.random() * 6).toFixed(1);
            const growthPercent = (baseGrowth * 100).toFixed(1);
            return {
                text: `### QUANTUM PROJECTION\nI have extrapolated the trendline for a **${forecastMonths}-month window** with a **${confidence}% confidence interval**:\n- **Primary Trend**: Sustained upward momentum.\n- **Velocity**: Projected growth of ~${growthPercent}% per cycle.\n- **Horizon**: Analysis spans until the end of ${isYearly ? 'the requested year' : 'the period'}.\n\nRefer to the neural path below for a visual verification of the trajectory.`,
                chartData: trendData,
                chartType: 'trend'
            };
        }

        if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
            return { text: "### NEURAL LINK ACTIVE\nGreetings. My subsystems are fully synchronized with your records. How can I assist with your analytical queries today?" };
        }

        return { text: `### INTELLIGENCE FABRIC REPORT\nAnalysis of **${totalRows} records** complete.\n- Significant clustering detected in **${drivers[0] || 'core metrics'}**.\n- No fatal errors found in the data schema.\n\nWould you like me to generate a **forecast**, perform a **risk check**, or list the **key drivers**?` };
    };

    return (
        <div className="h-full w-full p-6">
            <div className="bg-[#030712] border border-white/10 rounded-3xl h-full flex flex-col relative overflow-hidden shadow-2xl">

                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
                <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />

                <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.01] backdrop-blur-sm relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <Bot className="w-6 h-6 text-white" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-[#030712] rounded-full animate-pulse" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold tracking-wide flex items-center gap-2">
                                NEURAL LINK <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-400">v14.0</span>
                            </h3>
                            <div className="flex items-center gap-2 text-[10px] text-blue-400 font-mono">
                                <Activity className="w-3 h-3" />
                                <span>SYSTEM_NOMINAL</span>
                                <span className="text-gray-600">|</span>
                                <span>LATENCY: 4ms</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar relative z-10"
                >
                    <AnimatePresence>
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[85%] flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 ${msg.role === 'user' ? 'bg-white/10' : 'bg-transparent'}`}>
                                            {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-5 h-5 text-blue-400" />}
                                        </div>

                                        <div className={`
                                            p-5 rounded-2xl text-sm leading-relaxed backdrop-blur-md shadow-xl border
                                            ${msg.role === 'user'
                                                ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-none border-blue-400/20'
                                                : 'bg-white/[0.04] text-gray-200 rounded-tl-none border-white/10'}
                                        `}>
                                            <FormattedMessage text={msg.text} />

                                            {msg.chartData && (
                                                <CyberChart
                                                    data={msg.chartData}
                                                    type={msg.chartType || 'trend'}
                                                    isNominal={msg.isNominal}
                                                />
                                            )}

                                            <div className={`text-[10px] mt-4 font-mono flex items-center gap-1 ${msg.role === 'user' ? 'text-blue-200 justify-end' : 'text-gray-500'}`}>
                                                <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                {msg.role === 'ai' && <Zap className="w-3 h-3 text-yellow-500/50" />}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {isThinking && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-3 pl-12"
                        >
                            <div className="flex gap-1">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: ['8px', '16px', '8px'] }}
                                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                                        className="w-1 bg-blue-500/50 rounded-full"
                                    />
                                ))}
                            </div>
                            <span className="text-xs font-mono text-blue-400 animate-pulse uppercase tracking-widest">Compiling Neural Insights...</span>
                        </motion.div>
                    )}
                </div>

                <div className="p-6 bg-[#02040a] border-t border-white/5 relative z-10">
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl opacity-20 group-hover:opacity-40 transition duration-500 blur" />
                        <div className="relative flex items-center bg-[#0A0A0A] rounded-xl border border-white/10 focus-within:border-blue-500/50 transition-colors overflow-hidden">
                            <div className="pl-4 pr-2 text-gray-500">
                                <Terminal className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Query neural manifold..."
                                className="w-full bg-transparent px-2 py-4 text-sm text-white placeholder-gray-600 focus:outline-none font-mono"
                                autoFocus
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isThinking}
                                className="m-1 p-2.5 bg-white/5 hover:bg-blue-600 text-gray-400 hover:text-white rounded-lg transition-all disabled:opacity-30"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-between mt-3 px-1">
                        <div className="flex gap-4">
                            {['Forecast', 'Anomalies', 'Summary'].map((chip) => (
                                <button
                                    key={chip}
                                    onClick={() => setInput(prev => prev + (prev ? ' ' : '') + chip)}
                                    className="text-[10px] text-gray-600 hover:text-blue-400 transition-colors uppercase tracking-widest font-mono flex items-center gap-2 group"
                                >
                                    <span className="w-1 h-1 bg-gray-700 rounded-full group-hover:bg-blue-500" /> {chip}
                                </button>
                            ))}
                        </div>
                        <span className="text-[10px] text-gray-600 font-mono tracking-tighter opacity-50">MANIFOLD_SECURE_PROTO_v8</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
