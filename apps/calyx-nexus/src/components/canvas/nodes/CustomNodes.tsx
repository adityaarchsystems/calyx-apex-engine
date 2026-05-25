import React from 'react';
import { Handle, Position, NodeResizer as ReactFlowNodeResizer } from '@xyflow/react';
import { useCanvasState } from '@/context/CanvasContext';
import { FlavorTokens } from '../flavors';

const getKineticClasses = (globalKinetic: any, flavor: string) => {
    let classes = '';
    if (globalKinetic?.enableWaveMotionVectors) {
        // Erased to halt the erratic up-and-down visual floating sequence
    }
    if (globalKinetic?.enableAmbientEdgeGlow) {
        switch (flavor) {
            case 'LUXURY_GLASSMORPHISM':
                classes += ' shadow-[0_0_20px_rgba(6,182,212,0.2)]';
                break;
            case 'RETRO_TERMINAL':
                classes += ' shadow-[0_0_20px_rgba(245,158,11,0.2)]';
                break;
            case 'SCANDI_MINIMALIST':
                classes += ' shadow-[0_0_20px_rgba(255,255,255,0.08)]';
                break;
            case 'EIGHT_BIT_GIT':
                classes += ' shadow-[0_0_20px_rgba(34,197,94,0.2)]';
                break;
            default:
                classes += ' shadow-[0_0_20px_rgba(168,85,247,0.15)]';
        }
    }
    return classes;
};

const NodeResizer = ({ onResize, onResizeStop, ...props }: any) => {
    const ref = React.useRef<HTMLDivElement>(null);
    
    const handleResize = React.useCallback((event: any, params: any) => {
        if (ref.current) {
            const parent = ref.current.parentElement;
            if (parent) {
                parent.style.width = `${params.width}px`;
                parent.style.height = `${params.height}px`;
                parent.style.transform = 'translate3d(0, 0, 0)';
                parent.style.willChange = 'transform';
            }
        }
        if (onResize) {
            onResize(event, params);
        }
    }, [onResize]);

    const handleResizeStop = React.useCallback((event: any, params: any) => {
        if (onResizeStop) {
            onResizeStop(event, params);
        }
    }, [onResizeStop]);

    return (
        <div ref={ref} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <ReactFlowNodeResizer
                {...props}
                onResize={handleResize}
                onResizeStop={handleResizeStop}
            />
        </div>
    );
};

export const KINETIC_ASSET_MAP = {
    MATRIX_STREAM: {
        name: 'Matrix Code Streams',
        url: '/assets/kinetic-loops/matrix_stream.gif',
        transparentLoop: true
    },
    TELEMETRY_HALO: {
        name: 'Pulsing Telemetry Halos',
        url: '/assets/kinetic-loops/telemetry_halo.webp',
        transparentLoop: true
    },
    TERMINAL_BLINK: {
        name: 'Terminal Cursors',
        url: '/assets/kinetic-loops/terminal_blink.gif',
        transparentLoop: true
    },
    CHARACTER_CUTOUT: {
        name: 'Expressive Character Cutouts',
        url: '/assets/kinetic-loops/character_cutout.webp',
        transparentLoop: true
    }
};

const renderKineticLayers = (data: any, globalKinetic?: any) => {
    if (!data || !data.activeKineticTokens || !Array.isArray(data.activeKineticTokens)) return null;
    return data.activeKineticTokens.map((token: string) => {
        const asset = KINETIC_ASSET_MAP[token as keyof typeof KINETIC_ASSET_MAP];
        if (!asset) return null;
        if (token === 'TERMINAL_BLINK' && globalKinetic && !globalKinetic.enableTerminalCursorBlink) {
            return null;
        }
        return (
            <div 
                key={token} 
                className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden rounded-lg z-20"
                style={{ isolation: 'isolate' }}
            >
                <img 
                    src={asset.url} 
                    alt={asset.name} 
                    className="w-full h-full object-cover" 
                    style={{ mixBlendMode: 'screen', opacity: 0.65 }} 
                />
            </div>
        );
    });
};

interface PackageLanguageMap {
    [languageName: string]: number;
}

interface LanguageData {
    lang: string;
    pct: number;
}

function clampLanguages(languages: PackageLanguageMap | undefined | null, maxLanguages: number = 3): LanguageData[] {
    if (!languages) return [];
    
    const list = Object.entries(languages).map(([lang, pct]) => ({
        lang,
        pct: Number(pct)
    }));
    
    list.sort((a, b) => b.pct - a.pct);
    
    if (list.length <= maxLanguages) {
        return list;
    }
    
    const topList = list.slice(0, maxLanguages - 1);
    const remainingSum = list.slice(maxLanguages - 1).reduce((acc, curr) => acc + curr.pct, 0);
    
    topList.push({
        lang: 'Other',
        pct: Math.round(remainingSum * 10) / 10
    });
    
    return topList;
}

export const getLanguageColorHash = (name: string): string => {
    if (name.toLowerCase() === 'other') {
        return '#71717a';
    }
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    const saturation = 60 + (name.length % 4) * 8;
    const lightness = 45 + (name.charCodeAt(0) % 3) * 5;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const NodeOverlayControls = ({ id, isSelected }: { id: string; isSelected: boolean }) => {
    const { deleteNode } = useCanvasState();
    if (!isSelected) return null;
    return (
        <>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    deleteNode(id);
                }}
                className="absolute top-2 right-2 z-[99] w-5 h-5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-full flex items-center justify-center text-[10px] font-sans font-bold transition-all duration-150 cursor-pointer"
                title="Remove Component"
            >
                ×
            </button>
            <div 
                className="cursor-se-resize w-3 h-3 border-r-2 border-b-2 border-neutral-700 hover:border-purple-400 absolute bottom-1 right-1 z-[99] pointer-events-none" 
            />
        </>
    );
};

export const CustomHeaderNode = ({ id, data }: any) => {
    const { flavor, setActiveNodeId, activeNodeId, globalKinetic, updateNodeData } = useCanvasState();
    const styles = FlavorTokens[flavor];
    const isSelected = activeNodeId === id;
    const width = data.width || 280;
    const height = data.height || 90;

    return (
        <div 
            onClick={(e) => { e.stopPropagation(); setActiveNodeId(id); }}
            className={`group ${styles.panel} p-5 rounded-lg transition-all duration-200 select-none ${isSelected ? 'ring-2 ring-cyan-500/80 ring-offset-2 ring-offset-[#09090b]' : ''} ${getKineticClasses(globalKinetic, flavor)}`}
            style={{ width, height, isolation: 'isolate', transform: 'translate3d(0, 0, 0)' }}
        >
            <NodeResizer 
                color="#8b5cf6" 
                minWidth={200} 
                minHeight={60} 
                isVisible={isSelected} 
                onResize={(e: any, params: any) => {}}
                onResizeStop={(e: any, params: any) => updateNodeData(id, { width: params.width, height: params.height })} 
            />
            {renderKineticLayers(data, globalKinetic)}
            <Handle type="target" position={Position.Top} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 !bg-[#8b5cf6] !w-2.5 !h-2.5 !border border-zinc-950 !z-30" />
            <div className="flex flex-col gap-1 relative z-10">
                <h2 className={`text-xl font-black ${styles.text} truncate`}>{data.title || 'Profile Header'}</h2>
                <h3 className={`text-xs uppercase tracking-widest font-bold opacity-60 ${styles.text} truncate`}>{data.org || 'Organization'}</h3>
            </div>
            <Handle type="source" position={Position.Bottom} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 !bg-[#8b5cf6] !w-2.5 !h-2.5 !border border-zinc-950 !z-30" />
            <NodeOverlayControls id={id} isSelected={isSelected} />
        </div>
    );
};

export const CustomStatsNode = ({ id, data }: any) => {
    const { flavor, setActiveNodeId, activeNodeId, globalKinetic, updateNodeData } = useCanvasState();
    const styles = FlavorTokens[flavor];
    const isSelected = activeNodeId === id;
    const width = data.width || 320;
    const height = data.height || 128;

    const isLive = data.hydrationMode === 'LIVE_API';
    
    const staticValues = data.static_values || { 
        stat1Val: data.stat1Val || '1,280', 
        stat1Label: data.stat1Label || 'Total Repository Stars', 
        stat2Val: data.stat2Val || '840', 
        stat2Label: data.stat2Label || 'Commits Heatmap Index' 
    };
    const hydratedValues = data.hydrated_values || {};

    const mappingLabels: Record<string, string> = {
        totalStarsCount: 'Total Repository Stars',
        totalCommitContributions: 'Commits Heatmap Index',
        openSourceContributionCount: 'Open Source Contributions',
        github_repos: 'Public Repositories'
    };

    const getMetricDisplay = (columnNum: 1 | 2) => {
        if (!isLive) {
            return columnNum === 1 
                ? { val: staticValues.stat1Val, label: staticValues.stat1Label }
                : { val: staticValues.stat2Val, label: staticValues.stat2Label };
        }
        
        const mappingKey = columnNum === 1 ? data.column1Mapping : data.column2Mapping;
        if (!mappingKey) return { val: '—', label: 'Unmapped field' };
        
        let val = '—';
        if (hydratedValues.developer_metrics && mappingKey in hydratedValues.developer_metrics) {
            val = String(hydratedValues.developer_metrics[mappingKey as keyof typeof hydratedValues.developer_metrics] ?? 'Loading...');
        } else {
            val = String(hydratedValues[mappingKey as keyof typeof hydratedValues] ?? 'Loading...');
        }

        return {
            val,
            label: mappingLabels[mappingKey] || 'Live Parameter'
        };
    };

    const col1 = getMetricDisplay(1);
    const col2 = getMetricDisplay(2);

    const getLiveStyles = () => {
        if (!isLive) return { panel: '', text: '', badgeText: '', badgeBg: '', border: '' };
        switch (flavor) {
            case 'LUXURY_GLASSMORPHISM':
                return {
                    panel: '!border !border-cyan-500/40 !bg-cyan-950/20 shadow-[0_0_25px_rgba(6,182,212,0.05)]',
                    text: '!text-cyan-400 focus:!text-cyan-400',
                    badgeText: '!text-cyan-400',
                    badgeBg: '!bg-cyan-950/40 !border !border-cyan-500/30',
                    border: '!bg-cyan-500/30'
                };
            case 'RETRO_TERMINAL':
                return {
                    panel: '!border-2 !border-amber-500/60 !bg-amber-950/10 shadow-[0_0_25px_rgba(245,158,11,0.05)]',
                    text: '!text-amber-500 focus:!text-amber-500 font-mono',
                    badgeText: '!text-amber-500 font-mono',
                    badgeBg: '!bg-amber-950/30 !border !border-amber-500/40',
                    border: '!bg-amber-500/40'
                };
            case 'SCANDI_MINIMALIST':
                return {
                    panel: '!border !border-zinc-100/30 !bg-zinc-900/40 shadow-[0_0_25px_rgba(244,244,245,0.03)]',
                    text: '!text-zinc-100 focus:!text-zinc-100',
                    badgeText: '!text-zinc-100',
                    badgeBg: '!bg-zinc-900/60 !border !border-zinc-100/20',
                    border: '!bg-zinc-100/20'
                };
            case 'EIGHT_BIT_GIT':
                return {
                    panel: '!border-4 !border-green-500/50 !bg-green-950/20 shadow-[0_0_25px_rgba(34,197,94,0.05)]',
                    text: '!text-green-400 font-bold focus:!text-green-400 font-mono',
                    badgeText: '!text-green-400 font-bold font-mono',
                    badgeBg: '!bg-green-950/30 !border !border-green-500/40',
                    border: '!bg-green-500/40'
                };
            default:
                return {
                    panel: '!border !border-emerald-500/30 !bg-[#0d1612]/90 shadow-[0_0_25px_rgba(16,185,129,0.03)]',
                    text: '!text-emerald-400 focus:!text-emerald-400',
                    badgeText: '!text-emerald-400',
                    badgeBg: '!bg-[#0d1612] !border !border-emerald-500/20',
                    border: '!bg-emerald-500/20'
                };
        }
    };

    const liveStyles = getLiveStyles();

    return (
        <div 
            onClick={(e) => { e.stopPropagation(); setActiveNodeId(id); }}
            className={`${styles.panel} p-4 rounded-lg flex justify-between group transition-all duration-200 select-none ${
                isSelected ? 'ring-2 ring-purple-500/80 ring-offset-2 ring-offset-[#050507]' : ''
            } ${liveStyles.panel} ${getKineticClasses(globalKinetic, flavor)}`}
            style={{ width, height, isolation: 'isolate', transform: 'translate3d(0, 0, 0)' }}
        >
            <NodeResizer 
                color="#8b5cf6" 
                minWidth={240} 
                minHeight={100} 
                isVisible={isSelected} 
                onResize={(e: any, params: any) => {}}
                onResizeStop={(e: any, params: any) => updateNodeData(id, { width: params.width, height: params.height })} 
            />
            {renderKineticLayers(data, globalKinetic)}
            <Handle type="target" position={Position.Top} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 !bg-[#8b5cf6] !w-2.5 !h-2.5 !border border-zinc-950 !z-30" />
            
            {isLive && (
                <div className={`absolute -top-2 left-4 ${liveStyles.badgeBg} ${liveStyles.badgeText} text-[8px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded shadow-[0_0_15px_rgba(16,185,129,0.05)] flex items-center gap-1 z-30`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${flavor === 'LUXURY_GLASSMORPHISM' ? 'bg-cyan-400' : (flavor === 'RETRO_TERMINAL' ? 'bg-amber-500' : (flavor === 'SCANDI_MINIMALIST' ? 'bg-zinc-100' : 'bg-green-400'))} animate-pulse`} />
                    Live Sync
                </div>
            )}

            <div className="flex-1 flex flex-col justify-center min-w-0 relative z-10">
                <input 
                    type="text"
                    disabled={isLive}
                    value={col1.val}
                    className={`nodrag bg-transparent border-none outline-none text-current font-black text-3xl p-0 focus:ring-0 font-mono tracking-tight w-full min-w-0 ${isLive ? `${liveStyles.text} cursor-not-allowed` : ''}`}
                    onChange={(e) => { e.stopPropagation(); !isLive && updateNodeData(id, { static_values: { ...staticValues, stat1Val: e.target.value } }); }}
                    onKeyDown={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                />
                <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold mt-1 overflow-hidden text-ellipsis whitespace-nowrap">
                    {col1.label}
                </div>
            </div>

            <div className={`w-[1px] h-14 mx-4 self-center relative z-10 ${isLive ? liveStyles.border : 'bg-zinc-800/80'}`} />

            <div className="flex-1 flex flex-col justify-center min-w-0 relative z-10">
                <input 
                    type="text"
                    disabled={isLive}
                    value={col2.val}
                    className={`nodrag bg-transparent border-none outline-none text-current font-black text-3xl p-0 focus:ring-0 font-mono tracking-tight w-full min-w-0 ${isLive ? `${liveStyles.text} cursor-not-allowed` : ''}`}
                    onChange={(e) => { e.stopPropagation(); !isLive && updateNodeData(id, { static_values: { ...staticValues, stat2Val: e.target.value } }); }}
                    onKeyDown={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                />
                <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold mt-1 overflow-hidden text-ellipsis whitespace-nowrap">
                    {col2.label}
                </div>
            </div>

            <Handle type="source" position={Position.Bottom} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 !bg-[#8b5cf6] !w-2.5 !h-2.5 !border border-zinc-950 !z-30" />
            <NodeOverlayControls id={id} isSelected={isSelected} />
        </div>
    );
};

const TECH_GLYPHS: Record<string, { path: string; minimalistPath: string; color: string }> = {
    react: {
        path: "M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Zm-3.8-5.8 1.4-1.4 2.4 2.4 4.8-4.8 1.4 1.4-6.2 6.2Z",
        minimalistPath: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-3.8-5.8 1.4-1.4 2.4 2.4 4.8-4.8 1.4 1.4-6.2 6.2Z",
        color: "#61dafb"
    },
    typescript: {
        path: "M2 2h20v20H2V2zm12.3 11.2c-.3-.5-.7-.9-1.2-1.2-.5-.3-1.1-.4-1.8-.4-.6 0-1.1.1-1.6.4-.4.3-.7.6-.9 1.1-.2.4-.3.9-.3 1.5 0 .6.1 1.1.3 1.5.2.4.5.8.9 1 .4.2.9.3 1.5.3.7 0 1.2-.1 1.7-.4.5-.3.8-.7 1.1-1.2l2.3 1.4c-.6.9-1.3 1.7-2.3 2.2-1 .5-2.2.8-3.6.8-1.4 0-2.6-.3-3.7-.9-1-.6-1.8-1.5-2.4-2.7-.6-1.2-.8-2.6-.8-4.2s.3-3 .9-4.2c.6-1.2 1.4-2.1 2.5-2.7 1.1-.6 2.3-.9 3.7-.9 1.5 0 2.8.3 3.8.9 1 .6 1.7 1.4 2.2 2.4l-2.4 1.4zm6.6-4.5h-5.2v2.2h1.4v6.6h2.4v-6.6h1.4V8.7z",
        minimalistPath: "M2 2h20v20H2V2zm12.3 11.2c-.3-.5-.7-.9-1.2-1.2-.5-.3-1.1-.4-1.8-.4-.6 0-1.1.1-1.6.4-.4.3-.7.6-.9 1.1-.2.4-.3.9-.3 1.5 0 .6.1 1.1.3 1.5.2.4.5.8.9 1 .4.2.9.3 1.5.3.7 0 1.2-.1 1.7-.4.5-.3.8-.7 1.1-1.2l2.3 1.4c-.6.9-1.3 1.7-2.3 2.2-1 .5-2.2.8-3.6.8-1.4 0-2.6-.3-3.7-.9-1-.6-1.8-1.5-2.4-2.7-.6-1.2-.8-2.6-.8-4.2s.3-3 .9-4.2c.6-1.2 1.4-2.1 2.5-2.7 1.1-.6 2.3-.9 3.7-.9 1.5 0 2.8.3 3.8.9 1 .6 1.7 1.4 2.2 2.4l-2.4 1.4zm6.6-4.5h-5.2v2.2h1.4v6.6h2.4v-6.6h1.4V8.7z",
        color: "#3178c6"
    },
    tailwind: {
        path: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm3.5 10.5-3.5 3.5-3.5-3.5 1.4-1.4 2.1 2.1 2.1-2.1Z",
        minimalistPath: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-8L12 8.5 8.5 12l3.5 3.5 3.5-3.5z",
        color: "#38bdf8"
    },
    nodejs: {
        path: "M12 2L3 7v10l9 5 9-5V7l-9-5zm-1 15.5l-4-2.3V11l4 2.3v4.2zm1.8-6.3L8.8 8.9 12 7.1l3.2 1.8-3.2 1.8zm4.2 4L13 17.5v-4.2l4-2.3v4.2z",
        minimalistPath: "M12 2L2 7.5v9L12 22l10-5.5v-9L12 2zM4 8.5l8-4.4 8 4.4v7l-8 4.4-8-4.4v-7z",
        color: "#339933"
    },
    postgres: {
        path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z",
        minimalistPath: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-5h-2V7h2v8z",
        color: "#336791"
    },
    rust: {
        path: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 14.5h-2v-1h2Zm0-2.5h-2V7h2Z",
        minimalistPath: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-5.5h-2v-2h2v2zm0-3.5h-2V7h2v4z",
        color: "#ea580c"
    },
    go: {
        path: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 14H8v-2h5Zm3-4H8v-2h8Zm0-4H8V6h8Z",
        minimalistPath: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4-5H8v-2h8v2zm0-4H8V9h8v2z",
        color: "#00add8"
    },
    kubernetes: {
        path: "M12 2 2 7v10l10 5 10-5V7Zm0 3.3 7 3.5v6.4l-7 3.5-7-3.5V8.8Z",
        minimalistPath: "M12 2L2 7.5v9L12 22l10-5.5v-9L12 2zm0 3.3l6.5 3.2v6l-6.5 3-6.5-3v-6L12 5.3z",
        color: "#326ce5"
    },
    redis: {
        path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5h-2v-2h2v2zm0-3.5h-2V7h2v6z",
        minimalistPath: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-5.5h-2V7h2v7.5z",
        color: "#dc2626"
    }
};

export const CustomTechStackNode = ({ id, data }: any) => {
    const { flavor, setActiveNodeId, activeNodeId, globalKinetic, updateNodeData } = useCanvasState();
    const styles = FlavorTokens[flavor];
    const isSelected = activeNodeId === id;
    const techList = (data.techs || []).filter(Boolean);
    const iconStyle = data.iconographyStyle || 'MAX_FIDELITY_STANDARD';
    const width = data.width || 280;
    const height = data.height || 110;

    return (
        <div 
            onClick={(e) => { e.stopPropagation(); setActiveNodeId(id); }}
            className={`group ${styles.panel} p-4 rounded-lg transition-all duration-200 select-none border border-[#a855f7] shadow-[0_0_12px_rgba(168,85,247,0.15)] ${isSelected ? 'ring-2 ring-[#a855f7]/80 ring-offset-2 ring-offset-[#0b0a14]' : ''} ${getKineticClasses(globalKinetic, flavor)}`}
            style={{ width, height, isolation: 'isolate', transform: 'translate3d(0, 0, 0)' }}
        >
            <NodeResizer 
                color="#8b5cf6" 
                minWidth={220} 
                minHeight={80} 
                isVisible={isSelected} 
                onResize={(e: any, params: any) => {}}
                onResizeStop={(e: any, params: any) => updateNodeData(id, { width: params.width, height: params.height })} 
            />
            {renderKineticLayers(data, globalKinetic)}
            <Handle type="target" position={Position.Top} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 !bg-[#8b5cf6] !w-2.5 !h-2.5 !border border-zinc-950 !z-30" />
            <div className="space-y-2 relative z-10">
                <div className="flex justify-between items-center">
                    <h4 className={`text-[10px] uppercase font-bold tracking-wider opacity-60 ${styles.text}`}>Stack Matrix</h4>
                    <span className="text-[7px] font-mono font-bold bg-zinc-900 text-zinc-500 px-1 py-0.5 rounded">
                        {iconStyle === 'MAX_FIDELITY_STANDARD' ? 'STANDARD' : 'MINIMALIST'}
                    </span>
                </div>
                <div 
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: '8px',
                        width: '100%',
                        height: '100%',
                        maxHeight: 'calc(100% - 28px)',
                        overflow: 'hidden'
                    }}
                >
                    {techList.length > 0 ? techList.map((tech: string) => {
                        const key = tech.toLowerCase();
                        const normKey = key === 'node.js' || key === 'node' ? 'nodejs' : (key === 'postgresql' ? 'postgres' : key);
                        const glyph = TECH_GLYPHS[normKey];
                        
                        const activePath = glyph 
                            ? (iconStyle === 'MAX_FIDELITY_MINIMALIST' ? glyph.minimalistPath : glyph.path)
                            : "M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z";
                        
                        const fillHex = glyph
                            ? (iconStyle === 'MAX_FIDELITY_MINIMALIST' ? '#a1a1aa' : glyph.color)
                            : '#a1a1aa';

                        const bgColor = glyph
                            ? (iconStyle === 'MAX_FIDELITY_MINIMALIST' ? 'rgba(39,39,42,0.5)' : `${glyph.color}0d`)
                            : 'rgba(39,39,42,0.5)';

                        const borderColor = glyph
                            ? (iconStyle === 'MAX_FIDELITY_MINIMALIST' ? 'rgba(63,63,70,0.4)' : `${glyph.color}33`)
                            : 'rgba(63,63,70,0.4)';

                        return (
                            <span 
                                key={tech} 
                                onClick={(e) => e.stopPropagation()}
                                onPointerDown={(e) => e.stopPropagation()}
                                onMouseDown={(e) => e.stopPropagation()}
                                onDragStart={(e) => e.stopPropagation()}
                                onKeyDown={(e) => e.stopPropagation()}
                                className="border px-2.5 py-1 text-[10px] rounded font-semibold font-mono flex items-center gap-1.5 transition-all duration-200"
                                style={{
                                    backgroundColor: bgColor,
                                    borderColor: borderColor,
                                    color: fillHex
                                }}
                            >
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d={activePath} />
                                </svg>
                                <span className="dominant-baseline-central">{tech}</span>
                            </span>
                        );
                    }) : <span className="text-[10px] italic text-zinc-600">No tools listed</span>}
                </div>
            </div>
            <Handle type="source" position={Position.Bottom} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 !bg-[#8b5cf6] !w-2.5 !h-2.5 !border border-zinc-950 !z-30" />
            <NodeOverlayControls id={id} isSelected={isSelected} />
        </div>
    );
};

export const CustomActiveProjectsNode = ({ id, data }: any) => {
    const { flavor, setActiveNodeId, activeNodeId, globalKinetic, updateNodeData } = useCanvasState();
    const styles = FlavorTokens[flavor];
    const isSelected = activeNodeId === id;
    const progressPercent = data.progress || 0;
    const width = data.width || 280;
    const height = data.height || 92;

    return (
        <div 
            onClick={(e) => { e.stopPropagation(); setActiveNodeId(id); }}
            className={`group ${styles.panel} p-4 rounded-lg transition-all duration-200 select-none ${isSelected ? 'ring-2 ring-cyan-500/80 ring-offset-2 ring-offset-[#09090b]' : ''} ${getKineticClasses(globalKinetic, flavor)}`}
            style={{ width, height, isolation: 'isolate', transform: 'translate3d(0, 0, 0)' }}
        >
            <NodeResizer 
                color="#8b5cf6" 
                minWidth={200} 
                minHeight={70} 
                isVisible={isSelected} 
                onResize={(e: any, params: any) => {}}
                onResizeStop={(e: any, params: any) => updateNodeData(id, { width: params.width, height: params.height })} 
            />
            {renderKineticLayers(data, globalKinetic)}
            <Handle type="target" position={Position.Top} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 !bg-[#8b5cf6] !w-2.5 !h-2.5 !border border-zinc-950 !z-30" />
            <div className="space-y-2 relative z-10">
                <h4 className={`text-[10px] uppercase font-bold tracking-wider opacity-60 ${styles.text}`}>Active Engineering Pipelines</h4>
                <div className="text-xs font-bold text-zinc-100 font-mono">{data.name || 'Project Name'}</div>
                <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden mt-1">
                    <div className={`h-full ${styles.accent.split(' ')[0]}`} style={{ width: `${progressPercent}%` }}></div>
                </div>
            </div>
            <Handle type="source" position={Position.Bottom} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 !bg-[#8b5cf6] !w-2.5 !h-2.5 !border border-zinc-950 !z-30" />
            <NodeOverlayControls id={id} isSelected={isSelected} />
        </div>
    );
};

export const CustomPackageReleaseNode = ({ id, data }: any) => {
    const { flavor, setActiveNodeId, activeNodeId, globalKinetic, updateNodeData } = useCanvasState();
    const styles = FlavorTokens[flavor];
    const isSelected = activeNodeId === id;
    const width = data.width || 320;
    const height = data.height || 128;

    const isLive = data.hydrationMode === 'LIVE_API';
    const pkgName = data.packageName || 'express';
    const registry = data.registry || 'NPM';
    const displayLicense = data.displayLicense !== false;

    const version = isLive ? (data.hydrated_values?.version || '0.0.0') : (data.static_values?.version || '1.0.0');
    const downloads = isLive ? (data.hydrated_values?.downloads || 0) : (data.static_values?.downloads || '1.2M');

    return (
        <div 
            onClick={(e) => { e.stopPropagation(); setActiveNodeId(id); }}
            className={`group ${styles.panel} p-4 rounded-lg flex flex-col justify-between transition-all duration-200 select-none ${isSelected ? 'ring-2 ring-cyan-500/80 ring-offset-2 ring-offset-[#050507]' : ''} ${getKineticClasses(globalKinetic, flavor)}`}
            style={{ width, height, isolation: 'isolate', transform: 'translate3d(0, 0, 0)' }}
        >
            <NodeResizer 
                color="#8b5cf6" 
                minWidth={240} 
                minHeight={100} 
                isVisible={isSelected} 
                onResize={(e: any, params: any) => {}}
                onResizeStop={(e: any, params: any) => updateNodeData(id, { width: params.width, height: params.height })} 
            />
            {renderKineticLayers(data, globalKinetic)}
            <Handle type="target" position={Position.Top} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 !bg-[#8b5cf6] !w-2.5 !h-2.5 !border border-zinc-950 !z-30" />
            
            <div className="flex justify-between items-start relative z-10">
                <span className={`text-[8px] font-bold tracking-wider px-1.5 py-0.5 rounded border border-zinc-700/50 bg-zinc-900/80 text-zinc-300 font-mono`}>
                    {registry}
                </span>
                {displayLicense && (
                    <span className="text-[8px] font-bold tracking-wider text-zinc-500 uppercase font-mono">
                        MIT LICENSE
                    </span>
                )}
            </div>

            <div className="flex-1 flex flex-col justify-center min-w-0 relative z-10">
                <h4 className="text-xs font-bold text-zinc-200 truncate font-mono">{pkgName}</h4>
                <div className="flex items-baseline gap-2 mt-1">
                    <span className={`text-xl font-black ${styles.text} font-mono`}>v{version}</span>
                    <span className="text-[10px] text-zinc-500 font-bold font-mono">({downloads} dl)</span>
                </div>
            </div>

            <Handle type="source" position={Position.Bottom} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 !bg-[#8b5cf6] !w-2.5 !h-2.5 !border border-zinc-950 !z-30" />
            <NodeOverlayControls id={id} isSelected={isSelected} />
        </div>
    );
};

export const CustomTestSuiteNode = ({ id, data }: any) => {
    const { flavor, setActiveNodeId, activeNodeId, globalKinetic, updateNodeData } = useCanvasState();
    const styles = FlavorTokens[flavor];
    const isSelected = activeNodeId === id;
    const width = data.width || 320;
    const height = data.height || 128;

    const isLive = data.hydrationMode === 'LIVE_API';
    const repo = data.repositoryPath || 'facebook/react';
    const branch = data.branchTarget || 'main';

    const passing = isLive ? (data.hydrated_values?.passingTests ?? 0) : parseInt(data.static_values?.passingTests || '94', 10);
    const total = isLive ? (data.hydrated_values?.totalTests ?? 100) : parseInt(data.static_values?.totalTests || '100', 10);
    const status = isLive ? (data.hydrated_values?.suiteStatus || 'PASSING') : (data.static_values?.suiteStatus || 'PASSING');

    const percent = total > 0 ? Math.round((passing / total) * 100) : 0;
    const isPending = status === 'PENDING' || status === 'RUNNING';

    const getStatusColor = (s: string) => {
        switch (s) {
            case 'PASSING': return '#10b981';
            case 'FAILING': return '#ef4444';
            default: return '#8b5cf6';
        }
    };

    return (
        <div 
            onClick={(e) => { e.stopPropagation(); setActiveNodeId(id); }}
            className={`group ${styles.panel} p-4 rounded-lg flex flex-col justify-between transition-all duration-200 select-none ${
                isSelected ? 'ring-2 ring-cyan-500/80 ring-offset-2 ring-offset-[#050507]' : ''
            } ${isPending ? 'animate-pulse border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.25)]' : ''} ${getKineticClasses(globalKinetic, flavor)}`}
            style={{ width, height, isolation: 'isolate', transform: 'translate3d(0, 0, 0)' }}
        >
            <NodeResizer 
                color="#8b5cf6" 
                minWidth={240} 
                minHeight={100} 
                isVisible={isSelected} 
                onResize={(e: any, params: any) => {}}
                onResizeStop={(e: any, params: any) => updateNodeData(id, { width: params.width, height: params.height })} 
            />
            {renderKineticLayers(data, globalKinetic)}
            <Handle type="target" position={Position.Top} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 !bg-[#8b5cf6] !w-2.5 !h-2.5 !border border-zinc-950 !z-30" />

            <div className="flex justify-between items-start relative z-10">
                <h4 className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">CI Telemetry Suite</h4>
                <span className={`text-[8px] font-black tracking-wider px-1.5 py-0.5 rounded font-mono ${
                    status === 'FAILING' ? 'bg-red-950/40 text-red-400 border border-red-500/20' : (isPending ? 'bg-indigo-950/40 text-indigo-400 border border-indigo-500/20 animate-pulse' : 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20')
                }`}>
                    {status}
                </span>
            </div>

            <div className="flex-1 flex flex-col justify-center min-w-0 relative z-10">
                <div className="text-xs font-bold text-zinc-200 truncate font-mono">{repo}</div>
                <div className="text-[9px] text-zinc-500 font-mono">branch: {branch}</div>
            </div>

            <div className="space-y-1 mt-1 relative z-10">
                <div className="flex justify-between items-center text-[9px] font-mono font-bold text-zinc-400">
                    <span>Passing: {passing}/{total}</span>
                    <span className={`${styles.text}`}>{percent}%</span>
                </div>
                <div className="w-full bg-zinc-800/80 rounded-full h-1.5 overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-300 ${isPending ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-zinc-600 animate-pulse' : ''}`} 
                        style={{ 
                            width: `${percent}%`, 
                            ...(!isPending ? { backgroundColor: getStatusColor(status) } : {}) 
                        }}
                    ></div>
                </div>
            </div>

            <Handle type="source" position={Position.Bottom} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 !bg-[#8b5cf6] !w-2.5 !h-2.5 !border border-zinc-950 !z-30" />
            <NodeOverlayControls id={id} isSelected={isSelected} />
        </div>
    );
};

export const CustomLeetCodeNode = ({ id, data }: any) => {
    const { flavor, setActiveNodeId, activeNodeId, globalKinetic, updateNodeData } = useCanvasState();
    const styles = FlavorTokens[flavor];
    const isSelected = activeNodeId === id;
    const width = data.width || 320;
    const height = data.height || 128;

    const isLive = data.hydrationMode === 'LIVE_API';
    const username = data.leetcodeUsername || 'calyx-dev';

    const solved = isLive ? (data.hydrated_values?.solvedCount || 0) : parseInt(data.static_values?.solvedCount || '432', 10);
    const ranking = isLive ? (data.hydrated_values?.activeRanking || 0) : parseInt(data.static_values?.activeRanking || '124500', 10);

    return (
        <div 
            onClick={(e) => { e.stopPropagation(); setActiveNodeId(id); }}
            className={`group ${styles.panel} p-4 rounded-lg flex justify-between transition-all duration-200 select-none ${isSelected ? 'ring-2 ring-cyan-500/80 ring-offset-2 ring-offset-[#050507]' : ''} ${getKineticClasses(globalKinetic, flavor)}`}
            style={{ width, height, isolation: 'isolate', transform: 'translate3d(0, 0, 0)' }}
        >
            <NodeResizer 
                color="#8b5cf6" 
                minWidth={240} 
                minHeight={100} 
                isVisible={isSelected} 
                onResize={(e: any, params: any) => {}}
                onResizeStop={(e: any, params: any) => updateNodeData(id, { width: params.width, height: params.height })} 
            />
            {renderKineticLayers(data, globalKinetic)}
            <Handle type="target" position={Position.Top} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 !bg-[#8b5cf6] !w-2.5 !h-2.5 !border border-zinc-950 !z-30" />

            <div className="flex-1 flex flex-col justify-center min-w-0 relative z-10">
                <span className={`text-2xl font-black ${styles.text} font-mono`}>{solved}</span>
                <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold mt-1">Solved Milestones</div>
                <div className="text-[8px] text-zinc-600 font-mono mt-0.5">handle: {username}</div>
            </div>

            <div className="w-[1px] h-14 mx-4 self-center bg-zinc-800/80 relative z-10" />

            <div className="flex-1 flex flex-col justify-center min-w-0 relative z-10">
                <span className="text-xl font-black text-zinc-100 font-mono">#{ranking.toLocaleString()}</span>
                <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold mt-1">Active Ranking</div>
            </div>

            <Handle type="source" position={Position.Bottom} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 !bg-[#8b5cf6] !w-2.5 !h-2.5 !border border-zinc-950 !z-30" />
            <NodeOverlayControls id={id} isSelected={isSelected} />
        </div>
    );
};

export const CustomWakaTimeNode = ({ id, data }: any) => {
    const { flavor, setActiveNodeId, activeNodeId, globalKinetic, updateNodeData } = useCanvasState();
    const styles = FlavorTokens[flavor];
    const isSelected = activeNodeId === id;
    const width = data.width || 320;
    const height = data.height || 128;

    const isLive = data.hydrationMode === 'LIVE_API';

    const rawLanguages = isLive ? (data.hydrated_values?.languages || {}) : (data.static_values?.languages || { TypeScript: 45, Rust: 30, Go: 15, Python: 10 });
    const weeklyHours = isLive ? (data.hydrated_values?.weeklyTotalHours || 0) : 34.5;

    const clamped = clampLanguages(rawLanguages, 3);

    return (
        <div 
            onClick={(e) => { e.stopPropagation(); setActiveNodeId(id); }}
            className={`group ${styles.panel} p-4 rounded-lg flex flex-col justify-between transition-all duration-200 select-none ${isSelected ? 'ring-2 ring-cyan-500/80 ring-offset-2 ring-offset-[#050507]' : ''} ${getKineticClasses(globalKinetic, flavor)}`}
            style={{ width, height, isolation: 'isolate', transform: 'translate3d(0, 0, 0)' }}
        >
            <NodeResizer 
                color="#8b5cf6" 
                minWidth={240} 
                minHeight={100} 
                isVisible={isSelected} 
                onResize={(e: any, params: any) => {}}
                onResizeStop={(e: any, params: any) => updateNodeData(id, { width: params.width, height: params.height })} 
            />
            {renderKineticLayers(data, globalKinetic)}
            <Handle type="target" position={Position.Top} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 !bg-[#8b5cf6] !w-2.5 !h-2.5 !border border-zinc-950 !z-30" />

            <div className="flex justify-between items-start relative z-10">
                <h4 className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Developer Code Velocity</h4>
                <span className="text-[9px] text-zinc-400 font-mono font-bold">{weeklyHours} hrs/wk</span>
            </div>

            <div className="w-full h-3 bg-zinc-800 rounded overflow-hidden flex self-center my-1.5 relative z-10">
                {clamped.map((item) => (
                    <div 
                        key={item.lang} 
                        className="h-full transition-all" 
                        style={{ width: `${item.pct}%`, backgroundColor: getLanguageColorHash(item.lang) }} 
                        title={`${item.lang}: ${item.pct}%`}
                    />
                ))}
            </div>

            <div className="flex justify-between items-center text-[8px] font-mono font-bold text-zinc-500 px-1 relative z-10">
                {clamped.map((item) => (
                    <span key={item.lang} className="truncate max-w-[80px] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getLanguageColorHash(item.lang) }} />
                        <span>
                            {item.lang}: <span className={`${styles.text}`}>{item.pct}%</span>
                        </span>
                    </span>
                ))}
            </div>

            <Handle type="source" position={Position.Bottom} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 !bg-[#8b5cf6] !w-2.5 !h-2.5 !border border-zinc-950 !z-30" />
            <NodeOverlayControls id={id} isSelected={isSelected} />
        </div>
    );
};

export const CustomProductShowcaseNode = ({ id, data }: any) => {
    const { flavor, setActiveNodeId, activeNodeId, globalKinetic, updateNodeData } = useCanvasState();
    const styles = FlavorTokens[flavor];
    const isSelected = activeNodeId === id;
    const width = data.width || 320;
    const height = data.height || 256;

    const projectTitle = data.projectTitle || 'Product Showcase';
    const externalUrl = data.externalUrl || 'github.com/adityaarchsystems/project-snap';
    const projectDescription = data.projectDescription || 'A high-fidelity automated system orchestration engine showcasing reactive telemetry dashboards.';
    const displayFlavor = data.displayFlavor || 'MINI_BROWSER';
    const staticValues = data.static_values || {};
    const rawTags = staticValues.stackTags || [];
    
    const tags = rawTags.length > 0 ? rawTags : ['OSS'];
    const visibleTags = tags.slice(0, 3);
    const remainingCount = tags.length - 3;

    return (
        <div 
            onClick={(e) => { e.stopPropagation(); setActiveNodeId(id); }}
            className={`group ${styles.panel} rounded-lg flex flex-col justify-between transition-all duration-200 select-none overflow-hidden border border-[#a855f7] shadow-[0_0_12px_rgba(168,85,247,0.15)] ${isSelected ? 'ring-2 ring-[#a855f7]/80 ring-offset-2 ring-offset-[#0b0a14]' : ''} ${getKineticClasses(globalKinetic, flavor)}`}
            style={{ width, height, isolation: 'isolate', transform: 'translate3d(0, 0, 0)' }}
        >
            <NodeResizer 
                color="#8b5cf6" 
                minWidth={240} 
                minHeight={180} 
                isVisible={isSelected} 
                onResize={(e: any, params: any) => {}}
                onResizeStop={(e: any, params: any) => updateNodeData(id, { width: params.width, height: params.height })} 
            />
            {renderKineticLayers(data, globalKinetic)}
            <Handle type="target" position={Position.Top} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 !bg-[#8b5cf6] !w-2.5 !h-2.5 !border border-zinc-950 !z-30" />

            {displayFlavor === 'MINI_BROWSER' ? (
                <div className="flex-1 flex flex-col min-h-0 relative z-10">
                    <div className="flex items-center gap-1.5 px-3 py-2 bg-white/[0.04] border-b border-zinc-800/60 shrink-0 select-none">
                        <div className="flex items-center gap-1">
                            <span 
                                onClick={(e) => e.stopPropagation()}
                                onPointerDown={(e) => e.stopPropagation()}
                                onMouseDown={(e) => e.stopPropagation()}
                                onDragStart={(e) => e.stopPropagation()}
                                onKeyDown={(e) => e.stopPropagation()}
                                className="w-2 h-2 rounded-full bg-red-500/70 cursor-pointer" 
                            />
                            <span 
                                onClick={(e) => e.stopPropagation()}
                                onPointerDown={(e) => e.stopPropagation()}
                                onMouseDown={(e) => e.stopPropagation()}
                                onDragStart={(e) => e.stopPropagation()}
                                onKeyDown={(e) => e.stopPropagation()}
                                className="w-2 h-2 rounded-full bg-yellow-500/70 cursor-pointer" 
                            />
                            <span 
                                onClick={(e) => e.stopPropagation()}
                                onPointerDown={(e) => e.stopPropagation()}
                                onMouseDown={(e) => e.stopPropagation()}
                                onDragStart={(e) => e.stopPropagation()}
                                onKeyDown={(e) => e.stopPropagation()}
                                className="w-2 h-2 rounded-full bg-green-500/70 cursor-pointer" 
                            />
                        </div>

                        <div className="flex items-center gap-0.5 ml-2">
                            <button
                                onClick={(e) => e.stopPropagation()}
                                onPointerDown={(e) => e.stopPropagation()}
                                onMouseDown={(e) => e.stopPropagation()}
                                onDragStart={(e) => e.stopPropagation()}
                                onKeyDown={(e) => e.stopPropagation()}
                                className="p-0.5 rounded hover:bg-zinc-800/50 text-zinc-500 hover:text-zinc-300 transition"
                            >
                                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <path d="M15 18l-6-6 6-6" />
                                </svg>
                            </button>
                            <button
                                onClick={(e) => e.stopPropagation()}
                                onPointerDown={(e) => e.stopPropagation()}
                                onMouseDown={(e) => e.stopPropagation()}
                                onDragStart={(e) => e.stopPropagation()}
                                onKeyDown={(e) => e.stopPropagation()}
                                className="p-0.5 rounded hover:bg-zinc-800/50 text-zinc-500 hover:text-zinc-300 transition"
                            >
                                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <path d="M9 18l6-6-6-6" />
                                </svg>
                            </button>
                        </div>

                        <input
                            type="text"
                            value={externalUrl}
                            readOnly
                            onClick={(e) => e.stopPropagation()}
                            onPointerDown={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                            onDragStart={(e) => e.stopPropagation()}
                            onKeyDown={(e) => e.stopPropagation()}
                            className="nodrag flex-1 ml-2 bg-zinc-900/60 border border-zinc-800/40 rounded px-2 py-0.5 text-[8px] font-mono text-zinc-400 outline-none focus:border-purple-500/40 cursor-text select-text"
                        />
                    </div>

                    <div className="flex-1 p-4 flex flex-col justify-between min-h-0 bg-[#0b0a14]/20">
                        <div className="space-y-1.5 min-h-0 flex-1 overflow-hidden">
                            <h3 className={`text-sm font-black ${styles.text} truncate`}>{projectTitle}</h3>
                            <p className="text-[10px] text-zinc-400 font-sans leading-relaxed line-clamp-3 overflow-hidden select-text">
                                {projectDescription}
                            </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-zinc-800/40 shrink-0">
                            <div className="text-[9px] font-mono text-zinc-500">
                                {staticValues.linesOfCode ? (
                                    <span>LOC: <span className="text-zinc-300 font-bold">{staticValues.linesOfCode}</span></span>
                                ) : (
                                    <span className="opacity-50">Active Showcase</span>
                                )}
                            </div>
                            <div className="flex items-center gap-1">
                                {visibleTags.map((tag: string, i: number) => (
                                    <span key={i} className="text-[8px] font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 px-1.5 py-0.5 rounded">
                                        {tag}
                                    </span>
                                ))}
                                {remainingCount > 0 && (
                                    <span className="text-[8px] font-mono font-bold bg-zinc-800 text-zinc-400 border border-zinc-700/40 px-1 py-0.5 rounded">
                                        +{remainingCount} more
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 p-5 flex flex-col justify-between min-h-0 relative z-10">
                    <div className="space-y-2 min-h-0 flex-1 overflow-hidden">
                        <div className="flex justify-between items-start">
                            <h3 className={`text-base font-black ${styles.text} truncate`}>{projectTitle}</h3>
                            <span className="text-[8px] font-mono uppercase font-bold tracking-widest text-zinc-500">FLAT CARD</span>
                        </div>
                        <p className="text-xs text-zinc-400 font-sans leading-relaxed line-clamp-4 overflow-hidden select-text">
                            {projectDescription}
                        </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-zinc-800/40 shrink-0">
                        <div className="text-[9px] font-mono text-zinc-500">
                            {staticValues.linesOfCode ? (
                                <span>LOC: <span className="text-zinc-300 font-bold">{staticValues.linesOfCode}</span></span>
                            ) : (
                                <span className="text-zinc-500">Showcase Widget</span>
                            )}
                        </div>
                        <div className="flex items-center gap-1">
                            {visibleTags.map((tag: string, i: number) => (
                                <span key={i} className="text-[8px] font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 px-1.5 py-0.5 rounded">
                                    {tag}
                                </span>
                            ))}
                            {remainingCount > 0 && (
                                <span className="text-[8px] font-mono font-bold bg-zinc-800 text-zinc-400 border border-zinc-700/40 px-1 py-0.5 rounded">
                                    +{remainingCount} more
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <Handle type="source" position={Position.Bottom} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 !bg-[#8b5cf6] !w-2.5 !h-2.5 !border border-zinc-950 !z-30" />
            <NodeOverlayControls id={id} isSelected={isSelected} />
        </div>
    );
};

export const CustomLiveGuestbookNode = ({ id, data }: any) => {
    const { flavor, setActiveNodeId, activeNodeId, globalKinetic, updateNodeData } = useCanvasState();
    const styles = FlavorTokens[flavor];
    const isSelected = activeNodeId === id;
    const width = data.width || 320;
    const height = data.height || 192;

    const staticValues = data.static_values || {};
    const logs = staticValues.logs || [
        { timestamp: '03:22', handle: 'admin', msg: '@calyx-dev linked' },
        { timestamp: '04:10', handle: 'guest', msg: 'amazing portfolio!' },
        { timestamp: '04:55', handle: 'dev', msg: '🚀 terminal node loaded' }
    ];

    const clampedLogs = logs.slice(0, 5).map((log: any) => ({
        ...log,
        msg: log.msg.length > 32 ? log.msg.slice(0, 29) + '...' : log.msg
    }));

    return (
        <div 
            onClick={(e) => { e.stopPropagation(); setActiveNodeId(id); }}
            className={`group ${styles.panel} p-4 rounded-lg flex flex-col justify-between transition-all duration-200 select-none ${isSelected ? 'ring-2 ring-purple-500/80 ring-offset-2 ring-offset-[#050507]' : ''} bg-[#0b0a14] border border-zinc-800/80 shadow-2xl ${getKineticClasses(globalKinetic, flavor)}`}
            style={{ width, height, isolation: 'isolate', transform: 'translate3d(0, 0, 0)' }}
        >
            <NodeResizer 
                color="#8b5cf6" 
                minWidth={240} 
                minHeight={120} 
                isVisible={isSelected} 
                onResize={(e: any, params: any) => {}}
                onResizeStop={(e: any, params: any) => updateNodeData(id, { width: params.width, height: params.height })} 
            />
            {renderKineticLayers(data, globalKinetic)}
            <Handle type="target" position={Position.Top} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 !bg-[#8b5cf6] !w-2.5 !h-2.5 !border border-zinc-950 !z-30" />

            <div className="flex justify-between items-center border-b border-zinc-800/50 pb-1.5 shrink-0 relative z-10">
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500/60 animate-pulse" />
                    <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase tracking-wider">guestbook.sh</span>
                </div>
                <span className="text-[8px] font-mono text-zinc-600 font-bold">interactive shell v1.0</span>
            </div>

            <div className="flex-1 py-2 overflow-hidden flex flex-col gap-1 select-text relative z-10">
                {clampedLogs.map((log: any, i: number) => (
                    <div key={i} className="text-[10px] font-mono flex items-start gap-1 leading-relaxed">
                        <span className="text-zinc-600 font-bold shrink-0">[{log.timestamp}]</span>
                        <span className="text-purple-400 font-extrabold shrink-0">{log.handle}:</span>
                        <span className="text-zinc-300 font-medium truncate">{log.msg}</span>
                    </div>
                ))}
                {clampedLogs.length === 0 && (
                    <div className="text-[10px] font-mono text-zinc-600 italic">No signatures recorded.</div>
                )}
            </div>

            <div className="flex items-center gap-1 border-t border-zinc-800/30 pt-1.5 shrink-0 text-[10px] font-mono relative z-10">
                <span className="text-emerald-400 font-bold font-mono">guest@calyx-matrix:~$</span>
                <span className={`w-1.5 h-3 bg-emerald-400/80 inline-block shrink-0 ${globalKinetic?.enableTerminalCursorBlink ? 'animate-pulse' : ''}`} />
            </div>

            <Handle type="source" position={Position.Bottom} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 !bg-[#8b5cf6] !w-2.5 !h-2.5 !border border-zinc-950 !z-30" />
            <NodeOverlayControls id={id} isSelected={isSelected} />
        </div>
    );
};

export const CustomBioNode = ({ id, data }: any) => {
    const { flavor, setActiveNodeId, activeNodeId, globalKinetic, updateNodeData } = useCanvasState();
    const styles = FlavorTokens[flavor];
    const isSelected = activeNodeId === id;
    const width = data.width || 320;
    const height = data.height || 128;

    const rawBio = data.hydrated_values?.github_bio || data.static_values?.bio || '';
    const bioText = rawBio.trim() !== '' ? rawBio.trim() : "Systems Architect & Full Stack Engineer specializing in high-performance decentralized systems.";

    return (
        <div 
            onClick={(e) => { e.stopPropagation(); setActiveNodeId(id); }}
            className={`group ${styles.panel} p-4 rounded-lg flex flex-col justify-between transition-all duration-200 select-none ${isSelected ? 'ring-2 ring-purple-500/80 ring-offset-2 ring-offset-[#050507]' : ''} bg-[#0b0a14] border border-zinc-800/80 shadow-2xl ${getKineticClasses(globalKinetic, flavor)}`}
            style={{ width, height, isolation: 'isolate', transform: 'translate3d(0, 0, 0)' }}
        >
            <NodeResizer 
                color="#8b5cf6" 
                minWidth={240} 
                minHeight={100} 
                isVisible={isSelected} 
                onResize={(e: any, params: any) => {}}
                onResizeStop={(e: any, params: any) => updateNodeData(id, { width: params.width, height: params.height })} 
            />
            {renderKineticLayers(data, globalKinetic)}
            <Handle type="target" position={Position.Top} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 !bg-[#8b5cf6] !w-2.5 !h-2.5 !border border-zinc-950 !z-30" />
            
            <div className="flex flex-col gap-1.5 h-full justify-between relative z-10">
                <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full bg-purple-500 ${globalKinetic?.enableTerminalCursorBlink ? 'animate-ping' : ''}`} />
                    <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase tracking-wider">BIOGRAPHY / PROFILE</span>
                </div>
                
                <p className="text-[10px] text-zinc-300 font-mono leading-relaxed overflow-hidden text-ellipsis line-clamp-3 select-text pr-2">
                    {bioText}
                </p>

                <div className="text-[8px] font-mono text-zinc-500 text-right mt-1">
                    Status: {data.hydrated_values?.github_bio ? "Live Synced" : "Static Archetype"}
                </div>
            </div>

            <Handle type="source" position={Position.Bottom} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 !bg-[#8b5cf6] !w-2.5 !h-2.5 !border border-zinc-950 !z-30" />
            <NodeOverlayControls id={id} isSelected={isSelected} />
        </div>
    );
};

export const CustomProjectModalSliderNode = ({ id, data }: any) => {
    const { flavor, setActiveNodeId, activeNodeId, globalKinetic, updateNodeData } = useCanvasState();
    const styles = FlavorTokens[flavor];
    const isSelected = activeNodeId === id;
    const width = data.width || 320;
    const height = data.height || 192;

    const projects = data.projects || [
        { name: 'Calyx Core', desc: 'Secure enterprise gateway' },
        { name: 'V8 Engine Bridge', desc: 'Stateless cloud sync tunnel' },
        { name: 'Vector Compiler', desc: 'High density proxy evader' }
    ];

    const [currentIndex, setCurrentIndex] = React.useState(0);

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setCurrentIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setCurrentIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
    };

    const activeProject = projects[currentIndex] || projects[0];

    return (
        <div 
            onClick={(e) => { e.stopPropagation(); setActiveNodeId(id); }}
            className={`group ${styles.panel} p-4 rounded-lg flex flex-col justify-between transition-all duration-200 select-none ${isSelected ? 'ring-2 ring-purple-500/80 ring-offset-2 ring-offset-[#050507]' : ''} bg-[#0b0a14] border border-zinc-800/80 shadow-2xl ${getKineticClasses(globalKinetic, flavor)}`}
            style={{ width, height, isolation: 'isolate', transform: 'translate3d(0, 0, 0)' }}
        >
            <NodeResizer 
                color="#8b5cf6" 
                minWidth={240} 
                minHeight={120} 
                isVisible={isSelected} 
                onResize={(e: any, params: any) => {}}
                onResizeStop={(e: any, params: any) => updateNodeData(id, { width: params.width, height: params.height })} 
            />
            {renderKineticLayers(data, globalKinetic)}
            <Handle type="target" position={Position.Top} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 !bg-[#8b5cf6] !w-2.5 !h-2.5 !border border-zinc-950 !z-30" />
            
            <div className="flex flex-col gap-1 h-full justify-between relative z-10">
                <div className="flex justify-between items-center border-b border-zinc-800/50 pb-1.5">
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase tracking-wider">PROJECT CAROUSEL</span>
                    </div>
                    <span className="text-[8px] font-mono text-zinc-500">{currentIndex + 1} / {projects.length}</span>
                </div>

                <div className="flex-1 py-3 flex flex-col justify-center gap-1.5">
                    <h4 className="text-[12px] font-bold text-white uppercase tracking-wide font-mono truncate">
                        {activeProject?.name}
                    </h4>
                    <p className="text-[9.5px] text-zinc-400 font-mono leading-relaxed line-clamp-2">
                        {activeProject?.desc}
                    </p>
                </div>

                <div className="flex justify-between items-center border-t border-zinc-800/30 pt-2">
                    <button 
                        onClick={handlePrev}
                        onMouseDown={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()}
                        className="px-3 py-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-700/60 rounded text-[9px] font-mono text-zinc-400 font-extrabold transition-all duration-150 uppercase"
                    >
                        &lt; Prev
                    </button>
                    <button 
                        onClick={handleNext}
                        onMouseDown={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()}
                        className="px-3 py-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-700/60 rounded text-[9px] font-mono text-zinc-400 font-extrabold transition-all duration-150 uppercase"
                    >
                        Next &gt;
                    </button>
                </div>
            </div>

            <Handle type="source" position={Position.Bottom} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 !bg-[#8b5cf6] !w-2.5 !h-2.5 !border border-zinc-950 !z-30" />
            <NodeOverlayControls id={id} isSelected={isSelected} />
        </div>
    );
};

export const CustomFilterableTimelineNode = ({ id, data }: any) => {
    const { flavor, setActiveNodeId, activeNodeId, globalKinetic, updateNodeData } = useCanvasState();
    const styles = FlavorTokens[flavor];
    const isSelected = activeNodeId === id;
    const width = data.width || 320;
    const height = data.height || 224;

    const milestones = data.milestones || [
        { year: '2023', title: 'Founded Calyx', tag: 'WORK' },
        { year: '2024', title: 'Open Sourced CPM', tag: 'OSS' },
        { year: '2025', title: 'Secured Seed Round', tag: 'WORK' }
    ];

    const [activeTag, setActiveTag] = React.useState('ALL');

    const handleFilter = (tag: string, e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setActiveTag(tag);
    };

    const filteredMilestones = milestones.filter(
        (m: any) => activeTag === 'ALL' || m.tag?.toUpperCase() === activeTag
    );

    return (
        <div 
            onClick={(e) => { e.stopPropagation(); setActiveNodeId(id); }}
            className={`group ${styles.panel} p-4 rounded-lg flex flex-col justify-between transition-all duration-200 select-none ${isSelected ? 'ring-2 ring-purple-500/80 ring-offset-2 ring-offset-[#050507]' : ''} bg-[#0b0a14] border border-zinc-800/80 shadow-2xl ${getKineticClasses(globalKinetic, flavor)}`}
            style={{ width, height, isolation: 'isolate', transform: 'translate3d(0, 0, 0)' }}
        >
            <NodeResizer 
                color="#8b5cf6" 
                minWidth={240} 
                minHeight={150} 
                isVisible={isSelected} 
                onResize={(e: any, params: any) => {}}
                onResizeStop={(e: any, params: any) => updateNodeData(id, { width: params.width, height: params.height })} 
            />
            {renderKineticLayers(data, globalKinetic)}
            <Handle type="target" position={Position.Top} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 !bg-[#8b5cf6] !w-2.5 !h-2.5 !border border-zinc-950 !z-30" />
            
            <div className="flex flex-col gap-1.5 h-full justify-between relative z-10">
                <div className="flex justify-between items-center border-b border-zinc-800/50 pb-1.5">
                    <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full bg-emerald-500 ${globalKinetic?.enableTerminalCursorBlink ? 'animate-ping' : ''}`} />
                        <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase tracking-wider">FILTER TIMELINE</span>
                    </div>
                    
                    <div className="flex gap-1">
                        {['ALL', 'WORK', 'OSS'].map((tag) => (
                            <button
                                key={tag}
                                onClick={(e) => handleFilter(tag, e)}
                                onMouseDown={(e) => e.stopPropagation()}
                                onPointerDown={(e) => e.stopPropagation()}
                                className={`px-1.5 py-0.5 rounded text-[8px] font-bold font-mono transition-all duration-150 ${
                                    activeTag === tag
                                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                                        : 'bg-zinc-900 text-zinc-500 border border-zinc-800 hover:text-zinc-400'
                                }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 py-2 overflow-y-auto flex flex-col gap-2 scrollbar-none pr-1">
                    {filteredMilestones.map((m: any, idx: number) => (
                        <div key={idx} className="flex gap-2.5 items-start text-[10px] font-mono leading-relaxed">
                            <span className="text-purple-400 font-extrabold shrink-0">{m.year}</span>
                            <span className="text-zinc-500 shrink-0 font-bold">[{m.tag?.toUpperCase()}]</span>
                            <span className="text-zinc-300 truncate">{m.title}</span>
                        </div>
                    ))}
                    {filteredMilestones.length === 0 && (
                        <div className="text-[9px] font-mono text-zinc-600 italic py-4 text-center">No timeline events found.</div>
                    )}
                </div>
            </div>

            <Handle type="source" position={Position.Bottom} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 !bg-[#8b5cf6] !w-2.5 !h-2.5 !border border-zinc-950 !z-30" />
            <NodeOverlayControls id={id} isSelected={isSelected} />
        </div>
    );
};

export const CustomEndorsementsCarouselNode = ({ id, data }: any) => {
    const { flavor, setActiveNodeId, activeNodeId, globalKinetic, updateNodeData } = useCanvasState();
    const styles = FlavorTokens[flavor];
    const isSelected = activeNodeId === id;
    const width = data.width || 320;
    const height = data.height || 176;

    const endorsements = data.endorsements || [
        { name: 'Sarah Connor', text: 'Absolute game changer for portfolio pages!' },
        { name: 'John Doe', text: 'The vector animations look incredibly premium.' }
    ];

    const [activeIndex, setActiveIndex] = React.useState(0);

    const handleCycle = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setActiveIndex((prev) => (prev === endorsements.length - 1 ? 0 : prev + 1));
    };

    const activeEndorsement = endorsements[activeIndex] || endorsements[0];

    return (
        <div 
            onClick={(e) => { e.stopPropagation(); setActiveNodeId(id); }}
            className={`group ${styles.panel} p-4 rounded-lg flex flex-col justify-between transition-all duration-200 select-none ${isSelected ? 'ring-2 ring-purple-500/80 ring-offset-2 ring-offset-[#050507]' : ''} bg-[#0b0a14] border border-zinc-800/80 shadow-2xl ${getKineticClasses(globalKinetic, flavor)}`}
            style={{ width, height, isolation: 'isolate', transform: 'translate3d(0, 0, 0)' }}
        >
            <NodeResizer 
                color="#8b5cf6" 
                minWidth={240} 
                minHeight={120} 
                isVisible={isSelected} 
                onResize={(e: any, params: any) => {}}
                onResizeStop={(e: any, params: any) => updateNodeData(id, { width: params.width, height: params.height })} 
            />
            {renderKineticLayers(data, globalKinetic)}
            <Handle type="target" position={Position.Top} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 !bg-[#8b5cf6] !w-2.5 !h-2.5 !border border-zinc-950 !z-30" />
            
            <div className="flex flex-col gap-1 h-full justify-between relative z-10">
                <div className="flex justify-between items-center border-b border-zinc-800/50 pb-1.5">
                    <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full bg-amber-500 ${globalKinetic?.enableTerminalCursorBlink ? 'animate-pulse' : ''}`} />
                        <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase tracking-wider">ENDORSEMENTS</span>
                    </div>
                    <span className="text-[8px] font-mono text-zinc-500">Testimonial {activeIndex + 1} / {endorsements.length}</span>
                </div>

                <div className="flex-1 py-2.5 flex flex-col justify-center">
                    <p className="text-[10px] text-zinc-300 font-mono italic leading-relaxed line-clamp-2 pr-2">
                        "{activeEndorsement?.text}"
                    </p>
                    <span className="text-[9px] text-purple-400 font-bold font-mono mt-1 text-right block">
                        — {activeEndorsement?.name}
                    </span>
                </div>

                <div className="border-t border-zinc-800/30 pt-1.5 flex justify-end">
                    <button 
                        onClick={handleCycle}
                        onMouseDown={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()}
                        className="px-3 py-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-700/60 rounded text-[9px] font-mono text-zinc-400 font-extrabold transition-all duration-150 uppercase"
                    >
                        Cycle Testimonial
                    </button>
                </div>
            </div>

            <Handle type="source" position={Position.Bottom} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 !bg-[#8b5cf6] !w-2.5 !h-2.5 !border border-zinc-950 !z-30" />
            <NodeOverlayControls id={id} isSelected={isSelected} />
        </div>
    );
};

export const CustomContributionsMatrix = ({ id, data }: any) => {
    const { flavor, setActiveNodeId, activeNodeId, globalKinetic, isPreviewingCriticalGlow, updateNodeData } = useCanvasState();
    const styles = FlavorTokens[flavor];
    const isSelected = activeNodeId === id;
    const width = data.width || 320;
    const height = data.height || 176;

    const totalCommits = data.totalYearlyCommits || 2480;
    const rows = 7;
    const cols = 52;
    
    // Seeded pseudo-random generation of bento matrix on client for fallback editor consistency
    const seed = data.userId || 'contributor';
    const seededGrid = React.useMemo(() => {
        if (data.gridIntensityMap) return data.gridIntensityMap;
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            hash = seed.charCodeAt(i) + ((hash << 5) - hash);
        }
        const generated: number[][] = [];
        for (let r = 0; r < rows; r++) {
            const rowArr: number[] = [];
            for (let c = 0; c < cols; c++) {
                hash = (hash * 1664525 + 1013904223) | 0;
                rowArr.push(Math.abs(hash % 4));
            }
            generated.push(rowArr);
        }
        return generated;
    }, [data.gridIntensityMap, seed]);

    const getHeatmapColor = (intensity: number) => {
        if (isPreviewingCriticalGlow) {
            return ['#1e293b', 'rgba(239, 68, 68, 0.2)', 'rgba(239, 68, 68, 0.5)', '#ef4444'][intensity] || '#1e293b';
        }
        switch (flavor) {
            case 'LUXURY_GLASSMORPHISM':
                return ['#1e293b', 'rgba(6, 182, 212, 0.25)', 'rgba(6, 182, 212, 0.55)', '#22d3ee'][intensity] || '#1e293b';
            case 'RETRO_TERMINAL':
                return ['#1e293b', 'rgba(217, 119, 6, 0.25)', 'rgba(245, 158, 11, 0.55)', '#fbbf24'][intensity] || '#1e293b';
            case 'SCANDI_MINIMALIST':
                return ['#1e293b', 'rgba(228, 228, 230, 0.15)', 'rgba(228, 228, 230, 0.45)', '#ffffff'][intensity] || '#1e293b';
            case 'EIGHT_BIT_GIT':
                return ['#161b22', '#0e4429', '#006d32', '#39d353'][intensity] || '#161b22';
            default:
                return ['#1e293b', '#0e4429', '#006d32', '#39d353'][intensity] || '#1e293b';
        }
    };

    const hasEdgeGlow = globalKinetic?.enableAmbientEdgeGlow;

    return (
        <div 
            onClick={(e) => { e.stopPropagation(); setActiveNodeId(id); }}
            className={`group ${styles.panel} p-4 rounded-lg flex flex-col justify-between transition-all duration-200 select-none ${
                isSelected ? 'ring-2 ring-purple-500/80 ring-offset-2 ring-offset-[#050507]' : ''
            } ${
                isPreviewingCriticalGlow 
                    ? '!bg-red-500/10 !text-red-400 !border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.15)] animate-pulse' 
                    : ''
            } bg-[#0b0a14] border border-zinc-800/80 shadow-2xl ${getKineticClasses(globalKinetic, flavor)}`}
            style={{ width, height, isolation: 'isolate', transform: 'translate3d(0, 0, 0)' }}
        >
            <NodeResizer 
                color="#8b5cf6" 
                minWidth={240} 
                minHeight={120} 
                isVisible={isSelected} 
                onResize={(e: any, params: any) => {}}
                onResizeStop={(e: any, params: any) => updateNodeData(id, { width: params.width, height: params.height })} 
            />
            {renderKineticLayers(data, globalKinetic)}
            <Handle type="target" position={Position.Top} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 !bg-[#8b5cf6] !w-2.5 !h-2.5 !border border-zinc-950 !z-30" />
            
            <div className="flex flex-col gap-1.5 h-full justify-between relative z-10">
                <div className="flex justify-between items-center border-b border-zinc-800/50 pb-1.5">
                    <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${isPreviewingCriticalGlow ? (globalKinetic?.enableTerminalCursorBlink ? 'bg-red-500 animate-ping' : 'bg-red-500') : (globalKinetic?.enableTerminalCursorBlink ? 'bg-emerald-400 animate-ping' : 'bg-emerald-400')}`} />
                        <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase tracking-wider">Contributions Matrix</span>
                    </div>
                    <span className={`text-[9px] font-mono font-black ${isPreviewingCriticalGlow ? 'text-red-400' : 'text-purple-400'}`}>
                        {totalCommits} Commits / Yr
                    </span>
                </div>

                <div className="flex-1 py-1 flex items-center justify-start overflow-x-auto scrollbar-none pr-1">
                    <div className="grid grid-flow-col gap-[3px] auto-cols-max bg-[#12111f]/60 p-2 rounded border border-zinc-900">
                        {seededGrid.map((row: number[], rIdx: number) => (
                            <div key={rIdx} className="grid gap-[3px]">
                                {row.map((intensity: number, cIdx: number) => {
                                    const color = getHeatmapColor(intensity);
                                    return (
                                        <div 
                                            key={cIdx} 
                                            className="w-[7px] h-[7px] rounded-[1px] transition-colors duration-150"
                                            style={{ backgroundColor: color }}
                                            title={`Activity index: ${intensity}`}
                                        />
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t border-zinc-800/30 pt-1.5 flex justify-between items-center text-[8px] text-zinc-500 font-mono">
                    <span>Less</span>
                    <div className="flex gap-[2px] items-center">
                        <div className="w-[6px] h-[6px] rounded-[1px]" style={{ backgroundColor: getHeatmapColor(0) }} />
                        <div className="w-[6px] h-[6px] rounded-[1px]" style={{ backgroundColor: getHeatmapColor(1) }} />
                        <div className="w-[6px] h-[6px] rounded-[1px]" style={{ backgroundColor: getHeatmapColor(2) }} />
                        <div className="w-[6px] h-[6px] rounded-[1px]" style={{ backgroundColor: getHeatmapColor(3) }} />
                    </div>
                    <span>More</span>
                </div>
            </div>

            <Handle type="source" position={Position.Bottom} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 !bg-[#8b5cf6] !w-2.5 !h-2.5 !border border-zinc-950 !z-30" />
            <NodeOverlayControls id={id} isSelected={isSelected} />
        </div>
    );
};

export const CustomKineticMediaBox = ({ id, data }: any) => {
    const { flavor, setActiveNodeId, activeNodeId, globalKinetic, updateNodeData } = useCanvasState();
    const styles = FlavorTokens[flavor];
    const isSelected = activeNodeId === id;
    const width = data.width || 208;
    const height = data.height || 208;
    
    const mediaAssetUrl = data.mediaAssetUrl || '/assets/kinetic-loops/matrix_stream.gif';
    const scalingRatio = data.scalingRatio || 'CONTAIN';
    
    const fitClass = scalingRatio === 'CONTAIN' ? 'object-contain' : scalingRatio === 'COVER' ? 'object-cover' : 'object-scale-down';

    return (
        <div 
            onClick={(e) => { e.stopPropagation(); setActiveNodeId(id); }}
            onDragStart={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            className={`group ${styles.panel} p-3 rounded-lg flex flex-col justify-between transition-all duration-200 select-none border border-[#a855f7] shadow-[0_0_12px_rgba(168,85,247,0.15)] ${isSelected ? 'ring-2 ring-[#a855f7]/80 ring-offset-2 ring-offset-[#0b0a14]' : ''} ${getKineticClasses(globalKinetic, flavor)}`}
            style={{ width, height, isolation: 'isolate', transform: 'translate3d(0, 0, 0)' }}
        >
            <NodeResizer 
                color="#8b5cf6" 
                minWidth={120} 
                minHeight={120} 
                isVisible={isSelected} 
                onResize={(e: any, params: any) => {}}
                onResizeStop={(e: any, params: any) => updateNodeData(id, { width: params.width, height: params.height })} 
            />
            <Handle type="target" position={Position.Top} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 !bg-[#8b5cf6] !w-2.5 !h-2.5 !border border-zinc-950 !z-30" />
            <div className="flex flex-col h-full justify-between space-y-2 relative z-10">
                <div className="flex justify-between items-center">
                    <span className="text-[8px] font-mono font-bold tracking-widest text-zinc-500 uppercase">KINETIC MEDIA BOX</span>
                    <span className="text-[7px] font-mono bg-zinc-800 text-zinc-400 px-1 py-0.5 rounded uppercase">{scalingRatio}</span>
                </div>
                
                <div 
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                    onDragStart={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                    className="flex-1 w-full bg-zinc-950/60 rounded border border-zinc-900 flex items-center justify-center overflow-hidden relative"
                >
                    {/* Hardware-accelerated stacked kinetic image loops inside a screen blended isolation block */}
                    <div 
                        className="absolute inset-0 w-full h-full pointer-events-none" 
                        style={{ 
                            isolation: 'isolate', 
                            mixBlendMode: 'screen', 
                            willChange: 'transform, opacity',
                            transform: 'translate3d(0, 0, 0)',
                            zIndex: 20
                        }}
                    >
                        {(() => {
                            const tokens = data.selectedAssetTokens || data.activeKineticTokens || [];
                            if (Array.isArray(tokens)) {
                                return tokens.map((token: string) => {
                                    const asset = KINETIC_ASSET_MAP[token as keyof typeof KINETIC_ASSET_MAP];
                                    if (!asset) return null;
                                    return (
                                        <img 
                                            key={token} 
                                            src={asset.url} 
                                            alt={asset.name} 
                                            className="absolute inset-0 w-full h-full object-cover" 
                                            style={{ 
                                                isolation: 'isolate',
                                                mixBlendMode: 'screen', 
                                                willChange: 'transform, opacity',
                                                transform: 'translate3d(0,0,0)',
                                                zIndex: 0, 
                                                opacity: 0.65 
                                            }} 
                                            onClick={(e) => e.stopPropagation()}
                                            onMouseDown={(e) => e.stopPropagation()}
                                            onPointerDown={(e) => e.stopPropagation()}
                                            onDragStart={(e) => e.stopPropagation()}
                                            onKeyDown={(e) => e.stopPropagation()}
                                        />
                                    );
                                });
                            }
                            return null;
                        })()}
                    </div>

                    {mediaAssetUrl ? (
                        <img 
                            src={mediaAssetUrl} 
                            alt="Kinetic Media asset preview" 
                            className={`w-full h-full ${fitClass}`}
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                            onPointerDown={(e) => e.stopPropagation()}
                            onDragStart={(e) => e.stopPropagation()}
                            onKeyDown={(e) => e.stopPropagation()}
                        />
                    ) : (
                        <span className="text-[9px] font-mono text-zinc-600">No asset loaded</span>
                    )}
                </div>
                
                <div className="text-[7px] text-zinc-600 truncate font-mono text-center">
                    {mediaAssetUrl}
                </div>
            </div>
            <Handle type="source" position={Position.Bottom} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 !bg-[#8b5cf6] !w-2.5 !h-2.5 !border border-zinc-950 !z-30" />
            <NodeOverlayControls id={id} isSelected={isSelected} />
        </div>
    );
};
