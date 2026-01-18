import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Database, ShieldCheck, Cpu, ArrowRight, Zap, Network } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useCallback, useState } from 'react';

export const DataConnect = ({ onDataReady }: { onDataReady: (file?: File) => void }) => {
    const [activeTab, setActiveTab] = useState<'upload' | 'sample'>('upload');
    const [file, setFile] = useState<File | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'text/csv': ['.csv'], 'application/json': ['.json'] },
        maxFiles: 1
    });

    const handleConnect = () => {
        if (activeTab === 'upload' && file) {
            onDataReady(file);
        } else if (activeTab === 'sample') {
            onDataReady(undefined); // undefined signals "use sample"
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto glass-morphism rounded-[3rem] p-10 shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10 relative overflow-hidden group">
            {/* Background Ambient Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] pointer-events-none group-hover:bg-cyan-500/20 transition-all duration-1000" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[100px] pointer-events-none group-hover:bg-purple-500/20 transition-all duration-1000" />

            <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8">
                    <div>
                        <h2 className="text-4xl font-black font-display text-white tracking-tighter mb-2">
                            Initialize <span className="text-cyan-400">Neural Connect.</span>
                        </h2>
                        <p className="text-gray-500 font-light text-sm tracking-wide">Ready for high-fidelity data synchronization.</p>
                    </div>
                    <div className="flex gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-md">
                        <button
                            onClick={() => setActiveTab('upload')}
                            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-500 ${activeTab === 'upload' ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(34,211,238,0.4)]' : 'text-gray-500 hover:text-white'}`}
                        >
                            Payload
                        </button>
                        <button
                            onClick={() => setActiveTab('sample')}
                            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-500 ${activeTab === 'sample' ? 'bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'text-gray-500 hover:text-white'}`}
                        >
                            Enterprise Sample
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="min-h-[350px]"
                    >
                        {activeTab === 'upload' ? (
                            <div
                                {...getRootProps()}
                                className={`
                                    h-[350px] border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center cursor-pointer transition-all duration-500 relative overflow-hidden
                                    ${isDragActive ? 'border-cyan-500 bg-cyan-500/5 scale-[1.01]' : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'}
                                `}
                            >
                                <input {...getInputProps()} />
                                <div className="absolute inset-0 mesh-grid opacity-5 pointer-events-none" />

                                {file ? (
                                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center relative z-10 px-6">
                                        <div className="w-24 h-24 mx-auto bg-cyan-500/20 text-cyan-400 rounded-3xl flex items-center justify-center mb-6 border border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                                            <FileText className="w-12 h-12" />
                                        </div>
                                        <h4 className="text-2xl font-bold text-white mb-2">{file.name}</h4>
                                        <div className="flex items-center justify-center gap-4 text-xs font-mono text-gray-500 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/5">
                                            <span>{(file.size / 1024).toFixed(2)} KB</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-700" />
                                            <span className="text-cyan-400">Verified Payload</span>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="text-center p-10 relative z-10">
                                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-white/10 to-transparent text-gray-400 rounded-3xl flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 group-hover:border-cyan-500/30 transition-all duration-700">
                                            <Upload className="w-10 h-10 group-hover:text-cyan-400 transition-colors" />
                                        </div>
                                        <p className="text-2xl text-white font-bold mb-3 tracking-tight">Drop your neural data fabric</p>
                                        <p className="text-sm text-gray-500 max-w-xs mx-auto font-light leading-relaxed">Supports CSV, JSON and structured neural logs for instant cognition.</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="h-[350px] border border-white/10 rounded-[2rem] bg-gradient-to-br from-purple-500/[0.03] to-transparent p-10 relative overflow-hidden flex flex-col justify-between">
                                <div className="absolute inset-0 mesh-grid opacity-10 pointer-events-none" />
                                <div className="absolute top-8 right-8">
                                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-mono uppercase tracking-[0.2em]">
                                        <Zap className="w-3 h-3" />
                                        Standard Core V12.0
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <h4 className="text-3xl font-black font-display text-white tracking-widest uppercase opacity-80">Simulation Core</h4>
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-4 group/item">
                                                <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover/item:border-purple-500/50 transition-colors">
                                                    <Database className="w-6 h-6 text-indigo-400" />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Dataset Size</div>
                                                    <div className="text-lg font-black text-white">2.4M ENTRIES</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 group/item">
                                                <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover/item:border-purple-500/50 transition-colors">
                                                    <Network className="h-6 w-6 text-rose-400" />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Complexity</div>
                                                    <div className="text-lg font-black text-white">HIGH-TENSOR</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rounded-2xl bg-black/40 border border-white/5 p-4 font-mono text-[10px] text-emerald-500/60 overflow-hidden relative">
                                            <div className="absolute top-0 left-0 w-full h-full p-4 space-y-2">
                                                <p className="animate-pulse">{`{ "stream_id": "0xFE82", "t": 0.942 }`}</p>
                                                <p className="animate-pulse delay-75">{`{ "stream_id": "0xFE83", "t": 0.112 }`}</p>
                                                <p className="animate-pulse delay-150">{`{ "stream_id": "0xFE84", "t": 0.884 }`}</p>
                                                <p className="animate-pulse delay-300">{`{ "stream_id": "0xFE85", "t": 0.521 }`}</p>
                                                <p className="text-purple-500 mt-4">INITIALIZING_MOCK_FABRIC_DONE</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                <div className="mt-12 flex justify-center">
                    <button
                        onClick={handleConnect}
                        disabled={!file && activeTab === 'upload'}
                        className={`
                            w-full py-8 rounded-[1.5rem] font-black text-xl flex items-center justify-center gap-4 transition-all duration-700 relative overflow-hidden group/btn
                            ${(!file && activeTab === 'upload')
                                ? 'bg-white/5 text-gray-700 cursor-not-allowed border border-white/5 grayscale'
                                : 'bg-white text-black hover:bg-cyan-500 hover:text-white shadow-[0_0_50px_rgba(0,0,0,0.5)] hover:shadow-[0_0_50px_rgba(34,211,238,0.3)] hover:scale-[1.02]'}
                        `}
                    >
                        <ShieldCheck className="w-6 h-6" />
                        <span className="uppercase tracking-[0.2em]">Initiate Neural Link</span>
                        <ArrowRight className="w-6 h-6 transform transition-transform group-hover/btn:translate-x-2" />
                    </button>
                </div>
            </div>

            {/* Bottom Tech Bar */}
            <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center text-[8px] font-mono text-gray-600 tracking-[0.4em] uppercase">
                <span>Network Protocol: v10.0.4-CRYPTO</span>
                <span className="text-cyan-500/40">Status: Listening</span>
            </div>
        </div>
    );
};
