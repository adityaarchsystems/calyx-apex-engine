"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CanvasNode, CalyxMatrixDeploymentPayload } from '@cpm/types';

interface CanvasContextType {
    nodes: CanvasNode[];
    flavor: 'LUXURY_GLASSMORPHISM' | 'RETRO_TERMINAL' | 'SCANDI_MINIMALIST' | 'EIGHT_BIT_GIT';
    isDeploying: boolean;
    activeNodeId: string | null;
    setFlavor: (flavor: 'LUXURY_GLASSMORPHISM' | 'RETRO_TERMINAL' | 'SCANDI_MINIMALIST' | 'EIGHT_BIT_GIT') => void;
    setActiveNodeId: (id: string | null) => void;
    addNode: (nodeType: string, position: { x: number; y: number }) => void;
    updateNodePosition: (id: string, position: { x: number; y: number }) => void;
    updateNodeData: (id: string, newConfig: any) => void;
    deployStateToEdge: (username: string, widgetId: string) => Promise<void>;
    setNodes: (nodes: CanvasNode[]) => void;
    hydrateCanvasNodes: () => Promise<void>;
    deleteNode: (id: string) => void;
    globalKinetic: {
        enableTerminalCursorBlink: boolean;
        enableAmbientEdgeGlow: boolean;
        enableWaveMotionVectors: boolean;
    };
    setGlobalKinetic: React.Dispatch<React.SetStateAction<{
        enableTerminalCursorBlink: boolean;
        enableAmbientEdgeGlow: boolean;
        enableWaveMotionVectors: boolean;
    }>>;
    isPreviewingCriticalGlow: boolean;
    setIsPreviewingCriticalGlow: React.Dispatch<React.SetStateAction<boolean>>;
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export const CanvasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [nodes, setNodes] = useState<CanvasNode[]>([]);
    const [flavor, setFlavor] = useState<CanvasContextType['flavor']>('SCANDI_MINIMALIST');
    const [isDeploying, setIsDeploying] = useState<boolean>(false);
    const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
    const [globalKinetic, setGlobalKinetic] = useState({
        enableTerminalCursorBlink: true,
        enableAmbientEdgeGlow: true,
        enableWaveMotionVectors: true
    });
    const [isPreviewingCriticalGlow, setIsPreviewingCriticalGlow] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const cached = localStorage.getItem("calyx_canvas_nodes");
            if (cached) {
                try {
                    const parsed = JSON.parse(cached);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        setNodes(parsed);
                    }
                } catch (e) {
                    console.error("Failed to parse cached canvas nodes:", e);
                }
            }
        }
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined" && nodes.length > 0) {
            localStorage.setItem("calyx_canvas_nodes", JSON.stringify(nodes));
        }
    }, [nodes]);

    const addNode = useCallback((nodeType: string, position: { x: number; y: number }) => {
        // Determine unique non-duplicate parameter tracks for new StatsNodes out-of-the-box
        let customStatsConfig = {
            hydrationMode: 'STATIC',
            static_values: {
                stat1Val: '1,280',
                stat1Label: 'Total Repository Stars',
                stat2Val: '840',
                stat2Label: 'Commits Heatmap Index'
            },
            column1Mapping: 'totalStarsCount',
            column2Mapping: 'totalCommitContributions'
        };

        if (nodeType === 'StatsNode') {
            const assigned = new Set<string>();
            nodes.forEach((n) => {
                if (n.node_type === 'StatsNode' && n.config_data) {
                    if (n.config_data.column1Mapping) assigned.add(n.config_data.column1Mapping);
                    if (n.config_data.column2Mapping) assigned.add(n.config_data.column2Mapping);
                }
            });

            const priority = ['totalStarsCount', 'totalCommitContributions', 'openSourceContributionCount', 'github_repos'];
            const resolvedCol1 = priority.find((p) => !assigned.has(p)) || 'openSourceContributionCount';
            assigned.add(resolvedCol1);
            const resolvedCol2 = priority.find((p) => !assigned.has(p)) || 'github_repos';

            const labels: Record<string, { val: string; label: string }> = {
                totalStarsCount: { val: '1,280', label: 'Total Repository Stars' },
                totalCommitContributions: { val: '840', label: 'Commits Heatmap Index' },
                openSourceContributionCount: { val: '158', label: 'Open Source Contributions' },
                github_repos: { val: '42', label: 'Public Repositories' }
            };

            customStatsConfig = {
                hydrationMode: 'STATIC',
                static_values: {
                    stat1Val: labels[resolvedCol1]?.val || '1,280',
                    stat1Label: labels[resolvedCol1]?.label || 'Total Repository Stars',
                    stat2Val: labels[resolvedCol2]?.val || '840',
                    stat2Label: labels[resolvedCol2]?.label || 'Commits Heatmap Index'
                },
                column1Mapping: resolvedCol1 as any,
                column2Mapping: resolvedCol2 as any
            };
        }

        // Generate functional data blueprints matching node architecture patterns
        const defaultData: Record<string, any> = {
            HeaderNode: { title: 'Frontend Architect', org: 'Calyx Studios Ecosystem' },
            StatsNode: customStatsConfig,
            BioNode: {
                hydrationMode: 'LIVE_API',
                apiUsername: '',
                static_values: {
                    bio: 'Systems Architect & Full Stack Engineer specializing in high-performance decentralized systems.'
                }
            },
            ProjectModalSliderNode: {
                projects: [
                    { name: 'Calyx Core', desc: 'Secure enterprise gateway' },
                    { name: 'V8 Engine Bridge', desc: 'Stateless cloud sync tunnel' },
                    { name: 'Vector Compiler', desc: 'High density proxy evader' }
                ]
            },
            FilterableTimelineNode: {
                milestones: [
                    { year: '2023', title: 'Founded Calyx', tag: 'WORK' },
                    { year: '2024', title: 'Open Sourced CPM', tag: 'OSS' },
                    { year: '2025', title: 'Secured Seed Round', tag: 'WORK' }
                ]
            },
            EndorsementsCarouselNode: {
                endorsements: [
                    { name: 'Sarah Connor', text: 'Absolute game changer for portfolio pages!' },
                    { name: 'John Doe', text: 'The vector animations look incredibly premium.' }
                ]
            },
            TechStackNode: { techs: ['React', 'TypeScript', 'Tailwind', 'Postgres'] },
            ActiveProjectsNode: { name: 'Calyx Profile Matrix (CPM)', progress: 82 },
            ContributionsMatrix: {
                totalYearlyCommits: 2480,
                gridIntensityMap: Array.from({ length: 7 }, () => 
                    Array.from({ length: 52 }, () => Math.floor(Math.random() * 4))
                ),
                colorPaletteFlavor: 'DEFAULT'
            },
            PackageReleaseNode: {
                hydrationMode: 'STATIC',
                registry: 'NPM',
                packageName: 'express',
                static_values: { version: '4.18.2', downloads: '28M' }
            },
            TestSuiteNode: {
                hydrationMode: 'STATIC',
                repositoryPath: 'facebook/react',
                branchTarget: 'main',
                static_values: { passingTests: '94', totalTests: '100', suiteStatus: 'PASSING' }
            },
            LeetCodeNode: {
                hydrationMode: 'STATIC',
                leetcodeUsername: 'calyx-dev',
                static_values: { solvedCount: '432', activeRanking: '124500' }
            },
            WakaTimeNode: {
                hydrationMode: 'STATIC',
                wakatimeProfilePointer: 'INTEGRATION_PERSONAL',
                static_values: { languages: { TypeScript: 45, Rust: 30, Go: 15, Python: 10 } }
            },
            KineticMediaBox: {
                mediaAssetUrl: '/assets/kinetic-loops/matrix_stream.gif',
                scalingRatio: 'CONTAIN'
            },
            CustomKineticMediaBox: {
                mediaAssetUrl: '/assets/kinetic-loops/matrix_stream.gif',
                scalingRatio: 'CONTAIN'
            }
        };

        const newNode: CanvasNode = {
            id: crypto.randomUUID(),
            profile_id: 'default-profile-uuid',
            node_type: nodeType,
            position_x: position.x,
            position_y: position.y,
            config_data: defaultData[nodeType] || {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        setNodes((prev) => [...prev, newNode]);
        setActiveNodeId(newNode.id);
    }, [nodes]);

    const updateNodePosition = useCallback((id: string, position: { x: number; y: number }) => {
        setNodes((prev) =>
            prev.map((n) => (n.id === id ? { ...n, position_x: position.x, position_y: position.y } : n))
        );
    }, []);

    const updateNodeData = useCallback((id: string, newConfig: any) => {
        setNodes((prev) =>
            prev.map((n) => {
                if (n.id === id) {
                    const updatedNode = { ...n, config_data: { ...n.config_data, ...newConfig } };
                    if (newConfig.width !== undefined) {
                        updatedNode.width = newConfig.width;
                        updatedNode.config_data.width = newConfig.width;
                    }
                    if (newConfig.height !== undefined) {
                        updatedNode.height = newConfig.height;
                        updatedNode.config_data.height = newConfig.height;
                    }
                    return updatedNode;
                }
                return n;
            })
        );
    }, []);

    const deleteNode = useCallback((id: string) => {
        setNodes((prev) => prev.filter((n) => n.id !== id));
        if (activeNodeId === id) setActiveNodeId(null);
    }, [activeNodeId]);

    const hydrateCanvasNodes = useCallback(async () => {
        const statsNode = nodes.find(n => n.node_type === 'StatsNode' && n.config_data?.hydrationMode === 'LIVE_API');
        const bioNode = nodes.find(n => n.node_type === 'BioNode' && n.config_data?.hydrationMode === 'LIVE_API');
        const username = statsNode?.config_data?.apiUsername || bioNode?.config_data?.apiUsername;
        if (!username) return;

        try {
            const response = await fetch('/api/sync/hydrate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username })
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success && result.data) {
                    setNodes((prev) =>
                        prev.map((n) => {
                            if (n.node_type === 'StatsNode' && n.config_data?.hydrationMode === 'LIVE_API') {
                                return {
                                    ...n,
                                    config_data: {
                                        ...n.config_data,
                                        hydrated_values: result.data
                                    }
                                };
                            }
                            if (n.node_type === 'BioNode' && n.config_data?.hydrationMode === 'LIVE_API') {
                                return {
                                    ...n,
                                    config_data: {
                                        ...n.config_data,
                                        hydrated_values: result.data
                                    }
                                };
                            }
                            return n;
                        })
                    );
                }
            }
        } catch (err) {
            console.error('Failed to trigger API hydration:', err);
        }
    }, [nodes]);

    const deployStateToEdge = useCallback(async (username: string, widgetId: string) => {
        setIsDeploying(true);
        try {
            let currentNodes = [...nodes];

            const statsNode = nodes.find(n => n.node_type === 'StatsNode' && n.config_data?.hydrationMode === 'LIVE_API');
            const bioNode = nodes.find(n => n.node_type === 'BioNode' && n.config_data?.hydrationMode === 'LIVE_API');
            const activeUsername = statsNode?.config_data?.apiUsername || bioNode?.config_data?.apiUsername;

            if (activeUsername) {
                try {
                    const responseHydrate = await fetch('/api/sync/hydrate', {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'X-Calyx-Cache-Buster': 'true',
                            'X-Calyx-Force-Write-Through': 'true',
                            'X-Calyx-Trigger-Source': 'manual-deploy'
                        },
                        body: JSON.stringify({ username: activeUsername })
                    });
                    if (responseHydrate.ok) {
                        const resultHydrate = await responseHydrate.json();
                        if (resultHydrate.success && resultHydrate.data) {
                            currentNodes = nodes.map((n) => {
                                if (n.node_type === 'StatsNode' && n.config_data?.hydrationMode === 'LIVE_API') {
                                    return {
                                        ...n,
                                        config_data: {
                                            ...n.config_data,
                                            hydrated_values: resultHydrate.data
                                        }
                                    };
                                }
                                if (n.node_type === 'BioNode' && n.config_data?.hydrationMode === 'LIVE_API') {
                                    return {
                                        ...n,
                                        config_data: {
                                            ...n.config_data,
                                            hydrated_values: resultHydrate.data
                                        }
                                    };
                                }
                                return n;
                            });
                            setNodes(currentNodes);
                        }
                    }
                } catch (hydrateErr) {
                    console.error('Failed to sync node statistics on deployment:', hydrateErr);
                }
            }

            const rawJsonString = JSON.stringify({ nodes: currentNodes, flavor, synchronizedAt: new Date().toISOString() });
            const secureBase64Payload = btoa(encodeURIComponent(rawJsonString).replace(/%([0-9A-F]{2})/g, (_, p1) => {
                return String.fromCharCode(parseInt(p1, 16));
            }));

            const payload = { username, widgetId, svgBase64: secureBase64Payload };

            const response = await fetch('/api/sync/publish', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-Calyx-Cache-Buster': 'true',
                    'X-Calyx-Force-Write-Through': 'true',
                    'X-Calyx-Trigger-Source': 'manual-deploy'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Edge connection rejection anomaly captured.');
            console.log('--- SYSTEM UPDATE FLUSHED CLEANLY INTO UPSTASH EDGE STREAM ---');

            if (typeof window !== "undefined") {
                const stored = localStorage.getItem("calyx_active_matrices");
                let list = stored ? JSON.parse(stored) : [];

                const matrixName = username === "calyx-dev" ? "Primary GitHub Portfolio" : `${username.charAt(0).toUpperCase() + username.slice(1)} Matrix`;
                const targetEndpoint = `${username}.calyx.nexus`;
                const existingIdx = list.findIndex((m: any) => m.endpoint === targetEndpoint);

                const newItem = {
                    name: matrixName,
                    endpoint: targetEndpoint,
                    nodes: currentNodes.length,
                    syncTime: "Just now",
                    status: "ACTIVE" as const
                };

                if (existingIdx > -1) {
                    list[existingIdx] = {
                        ...list[existingIdx],
                        nodes: currentNodes.length,
                        syncTime: "Just now",
                        status: "ACTIVE"
                    };
                } else {
                    list.unshift(newItem);
                }

                localStorage.setItem("calyx_active_matrices", JSON.stringify(list));

                const deploymentPayload: CalyxMatrixDeploymentPayload = {
                    matrixId: matrixName,
                    nodeCount: currentNodes.length,
                    layerCards: currentNodes.length,
                    timestamp: new Date().toISOString(),
                    latencyDelta: Math.floor(Math.random() * 8) + 8,
                    activeNodesSummary: currentNodes.map((n) => n.node_type)
                };

                const deployEvent = new CustomEvent('calyx-matrix-deployed', { detail: deploymentPayload });
                window.dispatchEvent(deployEvent);
            }
        } catch (err) {
            console.error('ASYNCHRONOUS EXCEPTION DETECTED AT CLIENT LAYER:', err);
        } finally {
            setIsDeploying(false);
        }
    }, [nodes, flavor]);

    return (
        <CanvasContext.Provider value={{
            nodes,
            flavor,
            isDeploying,
            activeNodeId,
            setFlavor,
            setActiveNodeId,
            addNode,
            updateNodePosition,
            updateNodeData,
            deployStateToEdge,
            setNodes,
            hydrateCanvasNodes,
            deleteNode,
            globalKinetic,
            setGlobalKinetic,
            isPreviewingCriticalGlow,
            setIsPreviewingCriticalGlow
        }}>
            {children}
        </CanvasContext.Provider>
    );
};

export const useCanvasState = () => {
    const context = useContext(CanvasContext);
    if (!context) throw new Error('useCanvasState must scale securely inside a validated CanvasProvider tree loop.');
    return context;
};
