import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { ReactFlow, Controls, Background, BackgroundVariant, NodeChange, ReactFlowProvider, applyNodeChanges } from '@xyflow/react';
import { useCanvasState } from '@/context/CanvasContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { X } from 'lucide-react';
import { 
  CustomHeaderNode, 
  CustomStatsNode, 
  CustomTechStackNode, 
  CustomActiveProjectsNode,
  CustomPackageReleaseNode,
  CustomTestSuiteNode,
  CustomLeetCodeNode,
  CustomWakaTimeNode,
  CustomProductShowcaseNode,
  CustomLiveGuestbookNode,
  CustomBioNode,
  CustomProjectModalSliderNode,
  CustomFilterableTimelineNode,
  CustomEndorsementsCarouselNode,
  CustomContributionsMatrix,
  CustomKineticMediaBox,
  KINETIC_ASSET_MAP
} from './nodes/CustomNodes';
import '@xyflow/react/dist/style.css';

const FLAVORS = ['LUXURY_GLASSMORPHISM', 'RETRO_TERMINAL', 'SCANDI_MINIMALIST', 'EIGHT_BIT_GIT'] as const;

const initializeBlueprintNode = (node: any) => {
    const defaultWidths: Record<string, number> = {
        HeaderNode: 400,
        StatsNode: 280,
        TechStackNode: 280,
        ActiveProjectsNode: 320,
        PackageReleaseNode: 280,
        TestSuiteNode: 280,
        LeetCodeNode: 280,
        WakaTimeNode: 280,
        ProductShowcaseNode: 360,
        LiveGuestbookNode: 320,
        BioNode: 320,
        ProjectModalSliderNode: 400,
        FilterableTimelineNode: 360,
        EndorsementsCarouselNode: 360,
        ContributionsMatrix: 500,
        KineticMediaBox: 208,
    };
    const defaultHeights: Record<string, number> = {
        HeaderNode: 120,
        StatsNode: 180,
        TechStackNode: 180,
        ActiveProjectsNode: 200,
        PackageReleaseNode: 180,
        TestSuiteNode: 180,
        LeetCodeNode: 180,
        WakaTimeNode: 180,
        ProductShowcaseNode: 240,
        LiveGuestbookNode: 240,
        BioNode: 200,
        ProjectModalSliderNode: 240,
        FilterableTimelineNode: 240,
        EndorsementsCarouselNode: 240,
        ContributionsMatrix: 240,
        KineticMediaBox: 208,
    };

    const node_type = node.node_type || "HeaderNode";
    const nodeWidth = node.width || defaultWidths[node_type] || 280;
    const nodeHeight = node.height || defaultHeights[node_type] || 180;
    return {
        id: node.id || crypto.randomUUID(),
        profile_id: node.profile_id || "default-profile-uuid",
        node_type: node_type,
        position_x: node.position_x !== undefined ? node.position_x : 100,
        position_y: node.position_y !== undefined ? node.position_y : 100,
        width: nodeWidth,
        height: nodeHeight,
        config_data: {
            title: node.config_data?.title || "",
            org: node.config_data?.org || "",
            techs: node.config_data?.techs || [],
            name: node.config_data?.name || "",
            progress: node.config_data?.progress !== undefined ? node.config_data?.progress : 50,
            static_values: {
                stat1Val: "",
                stat1Label: "",
                stat2Val: "",
                stat2Label: "",
                passingTests: "",
                totalTests: "",
                suiteStatus: "UNKNOWN",
                version: "",
                downloads: "",
                ...(node.config_data?.static_values || {})
            },
            mediaAssetUrl: node.config_data?.mediaAssetUrl || "",
            scalingRatio: node.config_data?.scalingRatio || "CONTAIN",
            assetType: node.config_data?.assetType || "GIF",
            width: nodeWidth,
            height: nodeHeight,
            ...(node.config_data || {})
        },
        created_at: node.created_at || new Date().toISOString(),
        updated_at: node.updated_at || new Date().toISOString()
    };
};

function CanvasInner() {
    const { 
        nodes, flavor, isDeploying, activeNodeId, setFlavor, setActiveNodeId, 
        addNode, updateNodePosition, updateNodeData, deployStateToEdge, setNodes, 
        hydrateCanvasNodes, globalKinetic, setGlobalKinetic, isPreviewingCriticalGlow, 
        setIsPreviewingCriticalGlow
    } = useCanvasState();
    
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isInspectorOpen, setIsInspectorOpen] = useState(true);
    const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
    const [activeAssetFolder, setActiveAssetFolder] = useState<'SVGS' | 'LOTTIES' | 'GIFS' | 'TEMPLATES'>('GIFS');
    const [isHydrated, setIsHydrated] = useState(false);
    const [hasExistingNodes, setHasExistingNodes] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const cached = localStorage.getItem("calyx_canvas_nodes");
            if (cached) {
                try {
                    const parsed = JSON.parse(cached);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        setHasExistingNodes(true);
                    }
                } catch (e) {
                    console.error("Failed to parse cached nodes:", e);
                }
            }
            setIsHydrated(true);
        }
    }, []);

    const triggerToastMessage = useCallback((message: string, type: 'HEALTHY' | 'PENDING' | 'FAILURE') => {
        // Helper to bridge to the inner triggerToast since it is declared below
        triggerToast(message, type);
    }, []);

    const handleMountAsset = useCallback((assetUrl: string, assetName: string, type: 'SVG' | 'LOTTIE' | 'GIF') => {
        const id = crypto.randomUUID();
        const newNode = {
            id,
            profile_id: 'default-profile-uuid',
            node_type: 'KineticMediaBox',
            position_x: 200,
            position_y: 200,
            width: 208,
            height: 208,
            config_data: {
                mediaAssetUrl: assetUrl,
                scalingRatio: 'CONTAIN',
                assetType: type,
                name: assetName
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        setNodes([...nodes, newNode]);
        setActiveNodeId(id);
    }, [nodes, setNodes, setActiveNodeId]);

    const handleMountTemplate = useCallback((templateType: 'CLASSIC_DEVELOPER' | 'MINIMALIST_METRICS' | 'ADVANCED_DEVOPS') => {
        setNodes([]);
        setTimeout(() => {
            if (templateType === 'CLASSIC_DEVELOPER') {
                const blueprint = [
                    {
                        id: crypto.randomUUID(),
                        profile_id: 'default-profile-uuid',
                        node_type: 'HeaderNode',
                        position_x: 80,
                        position_y: 40,
                        config_data: { title: 'Frontend Architect', org: 'Calyx Studios Ecosystem' },
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    },
                    {
                        id: crypto.randomUUID(),
                        profile_id: 'default-profile-uuid',
                        node_type: 'StatsNode',
                        position_x: 80,
                        position_y: 200,
                        config_data: {
                            hydrationMode: 'STATIC',
                            static_values: {
                                stat1Val: '1,280',
                                stat1Label: 'Total Repository Stars',
                                stat2Val: '840',
                                stat2Label: 'Commits Heatmap Index'
                            },
                            column1Mapping: 'totalStarsCount',
                            column2Mapping: 'totalCommitContributions'
                        },
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    },
                    {
                        id: crypto.randomUUID(),
                        profile_id: 'default-profile-uuid',
                        node_type: 'ActiveProjectsNode',
                        position_x: 440,
                        position_y: 40,
                        config_data: { name: 'Calyx Profile Matrix (CPM)', progress: 82 },
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    },
                    {
                        id: crypto.randomUUID(),
                        profile_id: 'default-profile-uuid',
                        node_type: 'TechStackNode',
                        position_x: 440,
                        position_y: 240,
                        config_data: { techs: ['React', 'TypeScript', 'Tailwind', 'Postgres'] },
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }
                ];
                setNodes(blueprint.map(initializeBlueprintNode));
            } else if (templateType === 'MINIMALIST_METRICS') {
                const blueprint = [
                    {
                        id: crypto.randomUUID(),
                        profile_id: 'default-profile-uuid',
                        node_type: 'HeaderNode',
                        position_x: 80,
                        position_y: 40,
                        config_data: { title: 'Quant Systems Developer', org: 'High-Frequency Core' },
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    },
                    {
                        id: crypto.randomUUID(),
                        profile_id: 'default-profile-uuid',
                        node_type: 'StatsNode',
                        position_x: 80,
                        position_y: 200,
                        config_data: {
                            hydrationMode: 'STATIC',
                            static_values: {
                                stat1Val: '840',
                                stat1Label: 'Commits Heatmap Index',
                                stat2Val: '158',
                                stat2Label: 'Open Source Contributions'
                            },
                            column1Mapping: 'totalCommitContributions',
                            column2Mapping: 'openSourceContributionCount'
                        },
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    },
                    {
                        id: crypto.randomUUID(),
                        profile_id: 'default-profile-uuid',
                        node_type: 'TechStackNode',
                        position_x: 440,
                        position_y: 40,
                        config_data: { techs: ['Rust', 'Go', 'Redis', 'Kubernetes'] },
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }
                ];
                setNodes(blueprint.map(initializeBlueprintNode));
            } else if (templateType === 'ADVANCED_DEVOPS') {
                const blueprint = [
                    {
                        id: crypto.randomUUID(),
                        profile_id: 'default-profile-uuid',
                        node_type: 'HeaderNode',
                        position_x: 80,
                        position_y: 40,
                        config_data: { title: 'Principal DevOps Lead', org: 'Infrastructure Controls' },
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    },
                    {
                        id: crypto.randomUUID(),
                        profile_id: 'default-profile-uuid',
                        node_type: 'TestSuiteNode',
                        position_x: 80,
                        position_y: 200,
                        config_data: {
                            hydrationMode: 'STATIC',
                            repositoryPath: 'kubernetes/kubernetes',
                            branchTarget: 'master',
                            static_values: { passingTests: '982', totalTests: '1000', suiteStatus: 'PASSING' }
                        },
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    },
                    {
                        id: crypto.randomUUID(),
                        profile_id: 'default-profile-uuid',
                        node_type: 'TechStackNode',
                        position_x: 440,
                        position_y: 40,
                        config_data: { techs: ['Kubernetes', 'Docker', 'Go', 'Rust', 'Terraform'] },
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    },
                    {
                        id: crypto.randomUUID(),
                        profile_id: 'default-profile-uuid',
                        node_type: 'PackageReleaseNode',
                        position_x: 440,
                        position_y: 240,
                        config_data: {
                            hydrationMode: 'STATIC',
                            registry: 'NPM',
                            packageName: 'helm',
                            static_values: { version: '3.12.0', downloads: '1.2M' }
                        },
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }
                ];
                setNodes(blueprint.map(initializeBlueprintNode));
            }
        }, 50);
    }, [setNodes]);

    const router = useRouter();

    const handleCloseStudio = useCallback((e?: React.MouseEvent) => {
        if (typeof window !== 'undefined') {
            if (window.location.pathname === '/studio') {
                // Let the Link navigate to '/' naturally
            } else {
                if (e) {
                    e.preventDefault();
                }
                window.dispatchEvent(new Event("calyx-close-studio"));
            }
        }
    }, []);

  // Elegant Micro-Toast Notification state with status classifications
  const [toast, setToast] = useState<{ message: string; visible: boolean; type: 'HEALTHY' | 'PENDING' | 'FAILURE' }>({ 
    message: '', 
    visible: false, 
    type: 'FAILURE' 
  });

  const triggerToast = useCallback((message: string, type: 'HEALTHY' | 'PENDING' | 'FAILURE' = 'FAILURE') => {
    setToast({ message, visible: true, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 4000);
  }, []);

  // Website builder sections management helper routines have been purged.

  const nodeTypes = useMemo(() => ({
    HeaderNode: CustomHeaderNode,
    StatsNode: CustomStatsNode,
    TechStackNode: CustomTechStackNode,
    ActiveProjectsNode: CustomActiveProjectsNode,
    PackageReleaseNode: CustomPackageReleaseNode,
    TestSuiteNode: CustomTestSuiteNode,
    LeetCodeNode: CustomLeetCodeNode,
    WakaTimeNode: CustomWakaTimeNode,
    ProductShowcaseNode: CustomProductShowcaseNode,
    LiveGuestbookNode: CustomLiveGuestbookNode,
    BioNode: CustomBioNode,
    ProjectModalSliderNode: CustomProjectModalSliderNode,
    FilterableTimelineNode: CustomFilterableTimelineNode,
    EndorsementsCarouselNode: CustomEndorsementsCarouselNode,
    ContributionsMatrix: CustomContributionsMatrix,
    KineticMediaBox: CustomKineticMediaBox
  }), []);

    const [localNodes, setLocalNodes] = useState<any[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (!isDragging) {
            setLocalNodes(
                nodes.map((n) => ({
                    id: n.id,
                    type: n.node_type,
                    position: { x: n.position_x, y: n.position_y },
                    data: n.config_data,
                    width: n.width || 280,
                    height: n.height || 180,
                    measured: { width: n.width || 280, height: n.height || 180 }
                }))
            );
        }
    }, [nodes, isDragging]);

    const activeNode = useMemo(() => nodes.find(n => n.id === activeNodeId), [nodes, activeNodeId]);

    const onNodesChange = useCallback((changes: NodeChange[]) => {
        setLocalNodes((nds) => applyNodeChanges(changes, nds));
    }, []);

    const onNodeDragStart = useCallback(() => {
        setIsDragging(true);
    }, []);

    const onNodeDragStop = useCallback((event: React.MouseEvent, node: any) => {
        setIsDragging(false);
        const snap = (v: number) => Math.round(v / 16) * 16;
        let targetX = snap(node.position.x);
        let targetY = snap(node.position.y);

        const w = node.measured?.width || node.width || 280;
        const h = node.measured?.height || node.height || 180;

        const threshold = 4;
        nodes.forEach((other) => {
            if (other.id === node.id) return;
            const otherX = other.position_x;
            const otherY = other.position_y;
            const otherW = other.width || 280;
            const otherH = other.height || 180;

            const collides = 
                targetX + threshold < otherX + otherW &&
                targetX + w - threshold > otherX &&
                targetY + threshold < otherY + otherH &&
                targetY + h - threshold > otherY;

            if (collides) {
                const distL = Math.abs((otherX - w) - targetX);
                const distR = Math.abs((otherX + otherW) - targetX);
                const distT = Math.abs((otherY - h) - targetY);
                const distB = Math.abs((otherY + otherH) - targetY);

                const minDist = Math.min(distL, distR, distT, distB);
                if (minDist === distL) targetX = snap(otherX - w);
                else if (minDist === distR) targetX = snap(otherX + otherW);
                else if (minDist === distT) targetY = snap(otherY - h);
                else targetY = snap(otherY + otherH);
            }
        });

        updateNodePosition(node.id, { x: targetX, y: targetY });
    }, [nodes, updateNodePosition]);

  const onDragStart = (e: React.DragEvent, nodeType: string) => {
    e.dataTransfer.setData('application/reactflow', nodeType);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!reactFlowInstance) return;

    const nodeType = e.dataTransfer.getData('application/reactflow');
    if (!nodeType) return;

    const position = reactFlowInstance.screenToFlowPosition({ x: e.clientX, y: e.clientY });
    addNode(nodeType, position);
  }, [reactFlowInstance, addNode]);

  const onSlotDrop = useCallback((e: React.DragEvent, slotId: 'NAV_BAR' | 'HERO_SECTION' | 'PROJECTS_GALLERY' | 'CONTACT_FOOTER') => {
    e.preventDefault();
    e.stopPropagation();

    const nodeType = e.dataTransfer.getData('application/reactflow');
    if (!nodeType) return;

    // Validate type compatibility:
    const isCompatible = (slotId === 'NAV_BAR' && nodeType === 'HeaderNode') ||
                         (slotId === 'HERO_SECTION' && nodeType === 'BioNode') ||
                         (slotId === 'PROJECTS_GALLERY' && ['ProjectModalSliderNode', 'FilterableTimelineNode', 'ActiveProjectsNode'].includes(nodeType)) ||
                         (slotId === 'CONTACT_FOOTER' && ['EndorsementsCarouselNode', 'LiveGuestbookNode'].includes(nodeType));
    
    if (!isCompatible) {
      triggerToast(`Component type "${nodeType.replace('Node', '')}" is not compatible with slot "${slotId}".`, 'FAILURE');
      return;
    }

    // Filter out existing node of matching types for this slot from nodes list:
    const compatibleTypes = {
      NAV_BAR: ['HeaderNode'],
      HERO_SECTION: ['BioNode'],
      PROJECTS_GALLERY: ['ProjectModalSliderNode', 'FilterableTimelineNode', 'ActiveProjectsNode'],
      CONTACT_FOOTER: ['EndorsementsCarouselNode', 'LiveGuestbookNode']
    }[slotId];

    const updatedNodes = nodes.filter(n => !compatibleTypes.includes(n.node_type));

    // Define fixed 16px snapping vertical positions for slots:
    const slotPositions = {
      NAV_BAR: { x: 80, y: 32 },
      HERO_SECTION: { x: 80, y: 192 },
      PROJECTS_GALLERY: { x: 80, y: 480 },
      CONTACT_FOOTER: { x: 80, y: 832 }
    };

    let defaultData: any = {};
    if (nodeType === 'HeaderNode') {
      defaultData = { title: 'Systems Architect', org: 'Calyx Studios' };
    } else if (nodeType === 'BioNode') {
      defaultData = { 
        hydrationMode: 'STATIC', 
        static_values: { bio: 'Systems Architect & Full Stack Engineer specializing in high-performance decentralized systems.' } 
      };
    } else if (nodeType === 'ProjectModalSliderNode') {
      defaultData = { 
        projects: [
          { name: 'Calyx Core', desc: 'Secure enterprise gateway' },
          { name: 'V8 Engine Bridge', desc: 'Stateless cloud sync tunnel' },
          { name: 'Vector Compiler', desc: 'High density proxy evader' }
        ] 
      };
    } else if (nodeType === 'FilterableTimelineNode') {
      defaultData = {
        milestones: [
          { year: '2023', title: 'Founded Calyx', tag: 'WORK' },
          { year: '2024', title: 'Open Sourced CPM', tag: 'OSS' },
          { year: '2025', title: 'Secured Seed Round', tag: 'WORK' }
        ]
      };
    } else if (nodeType === 'EndorsementsCarouselNode') {
      defaultData = {
        endorsements: [
          { name: 'Sarah Connor', text: 'Absolute game changer for portfolio pages!' },
          { name: 'John Doe', text: 'The vector animations look incredibly premium.' }
        ]
      };
    }

    const newNode = {
      id: crypto.randomUUID(),
      profile_id: 'default-profile-uuid',
      node_type: nodeType,
      position_x: slotPositions[slotId].x,
      position_y: slotPositions[slotId].y,
      config_data: defaultData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setNodes([...updatedNodes, newNode]);
    setActiveNodeId(newNode.id);
  }, [nodes, setNodes, setActiveNodeId]);

  const renderSlot = (slotId: 'NAV_BAR' | 'HERO_SECTION' | 'PROJECTS_GALLERY' | 'CONTACT_FOOTER') => {
    const compatibleTypes = {
      NAV_BAR: ['HeaderNode'],
      HERO_SECTION: ['BioNode'],
      PROJECTS_GALLERY: ['ProjectModalSliderNode', 'FilterableTimelineNode', 'ActiveProjectsNode'],
      CONTACT_FOOTER: ['EndorsementsCarouselNode', 'LiveGuestbookNode']
    }[slotId];

    const slotNode = nodes.find(n => compatibleTypes.includes(n.node_type));

    // CSS Heights and padding are locked precisely to multiples of 16px to prevent grid-line visual bleeding!
    const slotHeights = {
      NAV_BAR: 'h-32',
      HERO_SECTION: 'h-64',
      PROJECTS_GALLERY: 'h-80',
      CONTACT_FOOTER: 'h-64'
    };

    const slotNames = {
      NAV_BAR: 'Global Navigation Bar [HeaderNode]',
      HERO_SECTION: 'Hero Narrative Block [BioNode]',
      PROJECTS_GALLERY: 'Interactive Projects Gallery [Project Carousel / Timeline]',
      CONTACT_FOOTER: 'Contact Relay Footer [Endorsements / Guestbook]'
    };

    const slotInstruction = {
      NAV_BAR: 'Drop a Header Component here',
      HERO_SECTION: 'Drop a Biography Component here',
      PROJECTS_GALLERY: 'Drop a Project Carousel, Filterable Timeline, or Active Progress Component here',
      CONTACT_FOOTER: 'Drop an Endorsements Carousel or Live Guestbook Component here'
    };

    if (slotNode) {
      const NodeComponent = nodeTypes[slotNode.node_type as keyof typeof nodeTypes];
      return (
        <div 
          key={slotNode.id}
          className={`relative w-full ${slotHeights[slotId]} rounded-xl overflow-hidden flex items-center justify-center p-4 border border-[rgba(139,92,246,0.15)] bg-[#0b0a14] group/slot transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.08)] pointer-events-auto`}
          onDragOver={onDragOver}
          onDrop={(e) => onSlotDrop(e, slotId)}
        >
          {/* Overlay tag indicator */}
          <div className="absolute top-2 left-2 z-10 text-[8px] font-mono bg-purple-950/80 border border-purple-500/20 text-purple-400 font-extrabold uppercase px-1.5 py-0.5 rounded flex items-center gap-1 shadow-md">
            <span>{slotId}</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setNodes(nodes.filter(n => n.id !== slotNode.id));
                if (activeNodeId === slotNode.id) setActiveNodeId(null);
              }}
              className="text-red-400 hover:text-red-300 ml-1 font-sans font-bold"
            >
              ×
            </button>
          </div>
          
          <div className="scale-95 transition-transform duration-300 group-hover/slot:scale-[0.98]">
            <NodeComponent id={slotNode.id} data={slotNode.config_data} />
          </div>
        </div>
      );
    }

    return (
      <div
        key={slotId}
        onDragOver={onDragOver}
        onDrop={(e) => onSlotDrop(e, slotId)}
        className={`w-full ${slotHeights[slotId]} border border-dashed border-[rgba(139,92,246,0.25)] bg-[#0b0a14]/20 hover:bg-[#12111f]/35 rounded-xl flex flex-col items-center justify-center p-6 transition-all duration-300 group cursor-pointer text-center relative pointer-events-auto`}
        style={{
          border: '1px dashed rgba(139, 92, 246, 0.25)',
          boxShadow: '0 0 20px rgba(139, 92, 246, 0.02)'
        }}
      >
        <div className="absolute inset-0 bg-radial-gradient(circle, rgba(139,92,246,0.03)_0%,_transparent_70%) opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute top-2 left-2 text-[8px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-500 font-extrabold uppercase px-1.5 py-0.5 rounded shadow">
          {slotId}
        </div>

        <div className="space-y-2 pointer-events-none relative z-10">
          <div className="w-10 h-10 rounded-full bg-purple-950/30 border border-purple-500/10 flex items-center justify-center mx-auto text-purple-400 group-hover:scale-110 group-hover:border-purple-500/30 group-hover:bg-purple-950/50 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400/80"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
          </div>
          <div className="text-[10px] font-mono text-zinc-300 font-bold uppercase tracking-wider">{slotNames[slotId]}</div>
          <div className="text-[9px] font-mono text-zinc-500 max-w-[280px] leading-relaxed">{slotInstruction[slotId]}</div>
        </div>
      </div>
    );
  };

  const loadTemplate = useCallback((templateType: 'CLASSIC_DEVELOPER' | 'MINIMALIST_METRICS') => {
    if (nodes.length > 0) return; // safety guard preventing overwrites

    if (templateType === 'CLASSIC_DEVELOPER') {
      const blueprint = [
        {
          id: crypto.randomUUID(),
          profile_id: 'default-profile-uuid',
          node_type: 'HeaderNode',
          position_x: 80,
          position_y: 40,
          config_data: { title: 'Frontend Architect', org: 'Calyx Studios Ecosystem' },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: crypto.randomUUID(),
          profile_id: 'default-profile-uuid',
          node_type: 'StatsNode',
          position_x: 80,
          position_y: 200,
          config_data: {
            hydrationMode: 'STATIC',
            static_values: {
              stat1Val: '1,280',
              stat1Label: 'Total Repository Stars',
              stat2Val: '840',
              stat2Label: 'Commits Heatmap Index'
            },
            column1Mapping: 'totalStarsCount',
            column2Mapping: 'totalCommitContributions'
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: crypto.randomUUID(),
          profile_id: 'default-profile-uuid',
          node_type: 'ActiveProjectsNode',
          position_x: 440,
          position_y: 40,
          config_data: { name: 'Calyx Profile Matrix (CPM)', progress: 82 },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: crypto.randomUUID(),
          profile_id: 'default-profile-uuid',
          node_type: 'TechStackNode',
          position_x: 440,
          position_y: 240,
          config_data: { techs: ['React', 'TypeScript', 'Tailwind', 'Postgres'] },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      setNodes(blueprint.map(initializeBlueprintNode));
    } else if (templateType === 'MINIMALIST_METRICS') {
      const blueprint = [
        {
          id: crypto.randomUUID(),
          profile_id: 'default-profile-uuid',
          node_type: 'HeaderNode',
          position_x: 80,
          position_y: 40,
          config_data: { title: 'Quant Systems Developer', org: 'High-Frequency Core' },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: crypto.randomUUID(),
          profile_id: 'default-profile-uuid',
          node_type: 'StatsNode',
          position_x: 80,
          position_y: 200,
          config_data: {
            hydrationMode: 'STATIC',
            static_values: {
              stat1Val: '840',
              stat1Label: 'Commits Heatmap Index',
              stat2Val: '158',
              stat2Label: 'Open Source Contributions'
            },
            column1Mapping: 'totalCommitContributions',
            column2Mapping: 'openSourceContributionCount'
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: crypto.randomUUID(),
          profile_id: 'default-profile-uuid',
          node_type: 'TechStackNode',
          position_x: 440,
          position_y: 40,
          config_data: { techs: ['Rust', 'Go', 'Redis', 'Kubernetes'] },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      setNodes(blueprint.map(initializeBlueprintNode));
    }
  }, [nodes, setNodes]);

  return (
    <div className="w-full h-screen bg-[#050507] text-slate-200 flex overflow-hidden font-sans select-none" onClick={() => setActiveNodeId(null)}>
      {/* Main Core Infinite Grid Viewport */}
      <div className="flex-1 h-full relative bg-[#050507]" onDragOver={onDragOver} onDrop={onDrop}>
        {/* Elegant Micro-Toast Notification Banner */}
        {toast.visible && (
            <div className={`absolute top-16 right-4 z-50 transform translate-y-0 transition-all duration-300 ease-out shadow-lg rounded-lg px-4 py-3 text-xs font-mono flex items-center gap-2 max-w-sm ${
                toast.type === 'HEALTHY'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)] animate-pulse'
                    : toast.type === 'PENDING'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.15)] animate-pulse'
                    : 'bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.15)] animate-pulse'
            }`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                <span>{toast.message}</span>
            </div>
        )}

        <ReactFlow
            nodes={localNodes}
            edges={[]}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onNodeDragStart={onNodeDragStart}
            onNodeDragStop={onNodeDragStop}
            onInit={setReactFlowInstance}
            fitView={true}
            snapToGrid={true}
            snapGrid={[16, 16]}
            zoomOnScroll={true}
            zoomOnPinch={true}
            zoomOnDoubleClick={true}
            panOnScroll={true}
            panOnDrag={true}
            preventScrolling={false}
            nodesDraggable={true}
            nodesConnectable={false}
            elementsSelectable={true}
            className=""
        >
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#27272a" />
            <Controls className="!bg-[#12111f] !border-[rgba(139,92,246,0.2)] !shadow-2xl [&_button]:!border-zinc-800 [&_button]:!bg-[#12111f] [&_svg]:!fill-zinc-400" />
        </ReactFlow>

        {/* Isolated Floating Close Controller Card */}
        <Link
            href="/"
            onClick={handleCloseStudio}
            className="absolute top-4 right-4 z-50 bg-[#090810]/60 border border-[rgba(139,92,246,0.15)] rounded p-1.5 backdrop-blur-md group cursor-pointer transition-all duration-150 transform-gpu hover:border-green-500/50 hover:shadow-[0_0_12px_rgba(34,197,94,0.3)] hover:scale-102 active:scale-98 flex items-center justify-center"
            title="Close Studio"
        >
            <X className="w-4 h-4 text-neutral-400 group-hover:text-green-400 transition-colors" />
        </Link>

        {/* Crisp, Floating Inspector Toggle Button */}
        <button
            onClick={(e) => { e.stopPropagation(); setIsInspectorOpen(!isInspectorOpen); }}
            className="absolute top-4 right-16 z-30 p-2 rounded-md bg-[#12111f] border border-[rgba(139,92,246,0.25)] text-zinc-300 hover:text-white hover:border-[rgba(139,92,246,0.45)] hover:bg-[#12111f]/90 shadow-[0_0_15px_rgba(139,92,246,0.15)] transition-all duration-200 flex items-center justify-center transform-gpu hover:scale-102 active:scale-98"
            title={isInspectorOpen ? "Collapse Inspector" : "Expand Inspector"}
        >
            {isInspectorOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M15 3v18"/><path d="m8 9 3 3-3 3"/></svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M15 3v18"/><path d="m10 15-3-3 3-3"/></svg>
            )}
        </button>

        {/* Onboarding Template Overlay */}
        {isHydrated && !hasExistingNodes && nodes.length === 0 && (
          <div className="absolute inset-0 bg-[#050507]/85 backdrop-blur-md z-10 flex items-center justify-center p-6">
            <div className="bg-[#0b0a14] border border-[rgba(139,92,246,0.15)] shadow-[0_0_30px_rgba(139,92,246,0.1)] rounded-xl p-8 max-w-md w-full text-center space-y-6">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto text-purple-400 text-lg font-black font-mono-premium">CX</div>
                <h2 className="text-lg font-black text-zinc-100 font-sans">Initialize Profile Matrix</h2>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  Your custom GitHub profile layout matrix is currently empty. Drop elements from the components palette on the right or initialize a pre-configured boilerplate blueprint below.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => loadTemplate('CLASSIC_DEVELOPER')}
                  className="w-full bg-[#12111f] border border-[rgba(139,92,246,0.15)] hover:border-[rgba(139,92,246,0.4)] text-xs text-zinc-200 hover:text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-md flex items-center justify-between font-sans group cursor-pointer"
                >
                  <span>🚀 Initialize Calyx Architectural Core Layout Canvas</span>
                  <span className="text-[9px] uppercase tracking-wider bg-purple-500/15 px-2 py-0.5 rounded text-purple-400 font-mono font-bold group-hover:bg-purple-500/20 transition-all duration-200">Default</span>
                </button>
              </div>

              <div className="text-[10px] text-zinc-500 font-sans">
                Drag nodes from the Palette Sidebar to create an entirely custom setup.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Property Editor & Inspector Panel (Docked to the RIGHT - Collapsable Drawer) */}
      <div 
        className={`bg-[#0b0a14] border-l border-[rgba(139,92,246,0.15)] shadow-[0_0_20px_rgba(139,92,246,0.03)] z-20 overflow-y-auto ease-in-out duration-200 transition-all flex flex-col justify-between ${
          isInspectorOpen 
            ? 'w-80 opacity-100 p-6' 
            : 'w-0 opacity-0 p-0 border-l-0 pointer-events-none'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-5 relative">
          <div>
            <h1 className="text-sm font-black tracking-normal text-zinc-200">Inspector Panel</h1>
            <p className="text-[11px] text-zinc-500">Calyx Profile Matrix Editor</p>
          </div>

          {/* Live Telemetry Health Check Previewer */}
          <div className="space-y-1.5 pt-1">
            <button 
              onClick={() => setIsPreviewingCriticalGlow(!isPreviewingCriticalGlow)}
              className={`w-full py-2.5 px-3 rounded-md text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 border flex items-center justify-center gap-2 ${
                isPreviewingCriticalGlow 
                  ? 'bg-red-500/25 text-red-400 border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.15)] animate-pulse'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-500/15'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${isPreviewingCriticalGlow ? 'bg-red-400' : 'bg-emerald-400'} animate-ping`} />
              {isPreviewingCriticalGlow ? 'DISABLE HEALTH PREVIEW' : 'LIVE TELEMETRY PREVIEW'}
            </button>
          </div>

          {/* Animated Kinetics Management Track */}
          <div className="space-y-2 pt-2 border-t border-zinc-800/80">
            <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 block">Kinetics Motion Track</label>
            <div className="bg-[#12111f] border border-[rgba(139,92,246,0.15)] rounded-md p-3 space-y-2.5 shadow-inner">
              
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-300">Terminal Cursor Blink</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={globalKinetic.enableTerminalCursorBlink}
                    onChange={(e) => setGlobalKinetic(prev => ({ ...prev, enableTerminalCursorBlink: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-7 h-4 bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:border-zinc-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-300">Ambient Edge Glow</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={globalKinetic.enableAmbientEdgeGlow}
                    onChange={(e) => setGlobalKinetic(prev => ({ ...prev, enableAmbientEdgeGlow: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-7 h-4 bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:border-zinc-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-300">Wave Motion Vectors</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={globalKinetic.enableWaveMotionVectors}
                    onChange={(e) => setGlobalKinetic(prev => ({ ...prev, enableWaveMotionVectors: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-7 h-4 bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:border-zinc-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

            </div>
          </div>

          {/* Identity Variant Dropdown */}
          <div className="space-y-1.5 relative border-t border-zinc-800/80 pt-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Design Identity</label>
              <button 
                onClick={() => window.confirm("Are you sure you want to clear the canvas? All unsaved modifications will be permanently lost.") && setNodes([])}
                className="text-[9px] uppercase font-black tracking-widest text-red-500/80 hover:text-red-400 transition"
              >
                Clear Canvas
              </button>
            </div>
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-[#12111f] border border-[rgba(139,92,246,0.15)] text-xs px-3 py-2.5 rounded-md flex justify-between items-center text-zinc-300 hover:border-[rgba(139,92,246,0.3)] transition"
              >
                <span>{flavor.replace(/_/g, ' ')}</span>
                <span className="text-[10px] opacity-40 text-purple-400">▼</span>
              </button>
              {isDropdownOpen && (
                <div className="absolute left-0 right-0 mt-1 bg-[#12111f] border border-[rgba(139,92,246,0.25)] rounded-md shadow-[0_10px_30px_rgba(0,0,0,0.7)] z-50 overflow-hidden max-h-60">
                  {FLAVORS.map((f) => (
                    <div 
                      key={f}
                      onClick={() => { setFlavor(f); setIsDropdownOpen(false); }}
                      className={`text-xs px-3 py-2.5 cursor-pointer hover:bg-purple-900/20 transition ${flavor === f ? 'text-purple-400 bg-purple-900/30 font-bold' : 'text-zinc-400'}`}
                    >
                      {f.replace(/_/g, ' ')}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

            {/* Elements Palette */}
            <div className="space-y-3">
                <div>
                    <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 block">Tier 1: Core Layouts</label>
                    <div className="grid grid-cols-2 gap-2 mt-1.5">
                        {['HeaderNode', 'StatsNode', 'BioNode', 'TechStackNode', 'ActiveProjectsNode', 'ContributionsMatrix'].map((type) => (
                            <div
                                key={type}
                                draggable
                                onDragStart={(e) => onDragStart(e, type)}
                                className="bg-[#12111f] border border-[rgba(139,92,246,0.15)] rounded-md p-2 flex flex-col items-center gap-1 cursor-grab hover:border-[rgba(139,92,246,0.35)] active:cursor-grabbing hover:bg-purple-950/15 transition group text-center"
                            >
                                <span className="text-[11px] font-semibold text-zinc-300 group-hover:text-purple-400 transition">
                                    {type === 'ContributionsMatrix' ? 'Commit Matrix' : type.replace('Node', '')}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="text-[10px] uppercase font-bold tracking-widest text-purple-400 block">Tier 2: Infrastructure Telemetry</label>
                    <div className="grid grid-cols-2 gap-2 mt-1.5">
                        {['PackageReleaseNode', 'TestSuiteNode', 'LeetCodeNode', 'WakaTimeNode'].map((type) => (
                            <div
                                key={type}
                                draggable
                                onDragStart={(e) => onDragStart(e, type)}
                                className="bg-[#12111f] border border-[rgba(139,92,246,0.15)] rounded-md p-2 flex flex-col items-center gap-1 cursor-grab hover:border-[rgba(139,92,246,0.35)] active:cursor-grabbing hover:bg-purple-950/15 transition group text-center border-purple-500/10 hover:border-purple-500/30"
                            >
                                <span className="text-[11px] font-semibold text-zinc-300 group-hover:text-purple-400 transition">{type.replace('Node', '')}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="text-[10px] uppercase font-bold tracking-widest text-amber-500 block">Tier 3: Premium Showcase</label>
                    <div className="grid grid-cols-2 gap-2 mt-1.5">
                        {['ProductShowcaseNode', 'LiveGuestbookNode'].map((type) => (
                            <div
                                key={type}
                                draggable
                                onDragStart={(e) => onDragStart(e, type)}
                                className="bg-[#12111f] border border-[rgba(139,92,246,0.15)] rounded-md p-2 flex flex-col items-center gap-1 cursor-grab hover:border-[rgba(139,92,246,0.35)] active:cursor-grabbing hover:bg-purple-950/15 transition group text-center border-amber-500/10 hover:border-amber-500/30"
                            >
                                <span className="text-[11px] font-semibold text-zinc-300 group-hover:text-amber-400 transition">
                                    {type === 'ProductShowcaseNode' ? 'Product Showcase' : 'Live Guestbook'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800/80">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 block mb-2">
                        Tier 4: Design Asset Directory
                    </label>
                    
                    {/* Folder Tab Selectors */}
                    <div className="flex gap-1 bg-[#12111f] p-1 rounded border border-zinc-800/80 mb-3 overflow-x-auto whitespace-nowrap scrollbar-thin">
                        {(['GIFS', 'SVGS', 'LOTTIES', 'TEMPLATES'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveAssetFolder(tab)}
                                className={`px-2 py-1 text-[9px] font-mono tracking-wider rounded transition-all duration-150 cursor-pointer ${
                                    activeAssetFolder === tab
                                        ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30'
                                        : 'text-zinc-500 hover:text-zinc-400 hover:bg-zinc-800/40 border border-transparent'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Active Directory Folder Content */}
                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                        
                        {/* 1. KINETIC GIFS */}
                        {activeAssetFolder === 'GIFS' && (
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { name: 'Matrix Stream', url: '/assets/kinetic-loops/matrix_stream.gif' },
                                    { name: 'Telemetry Halo', url: '/assets/kinetic-loops/telemetry_halo.webp' },
                                    { name: 'Terminal Cursor', url: '/assets/kinetic-loops/terminal_blink.gif' },
                                    { name: 'Expressive Character', url: '/assets/kinetic-loops/character_cutout.webp' }
                                ].map((gif) => (
                                    <div
                                        key={gif.name}
                                        onClick={() => handleMountAsset(gif.url, gif.name, 'GIF')}
                                        className="group bg-[#12111f] border border-zinc-800/60 rounded-md p-1.5 flex flex-col justify-between h-24 hover:border-emerald-500/40 hover:bg-emerald-950/5 transition cursor-pointer select-none"
                                    >
                                        <div className="w-full h-12 bg-zinc-950/80 rounded overflow-hidden flex items-center justify-center border border-zinc-900">
                                            <img
                                                src={gif.url}
                                                alt={gif.name}
                                                className="w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-opacity"
                                                style={{ mixBlendMode: 'screen' }}
                                            />
                                        </div>
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-[8px] font-mono text-zinc-400 group-hover:text-emerald-400 transition truncate w-24">
                                                {gif.name}
                                            </span>
                                            <span className="text-[7px] font-mono text-emerald-500/80 font-black">+</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* 2. CUSTOM VECTOR SVGS */}
                        {activeAssetFolder === 'SVGS' && (
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { name: 'React Node', url: '/assets-vault/tech-iconography/react.svg' },
                                    { name: 'Rust Cargo', url: '/assets-vault/tech-iconography/rust.svg' },
                                    { name: 'Kubernetes Mesh', url: '/assets-vault/tech-iconography/kubernetes.svg' },
                                    { name: 'Go Monochrome', url: '/assets-vault/tech-iconography/go-monochrome.svg' }
                                ].map((svg) => (
                                    <div
                                        key={svg.name}
                                        onClick={() => handleMountAsset(svg.url, svg.name, 'SVG')}
                                        className="group bg-[#12111f] border border-zinc-800/60 rounded-md p-1.5 flex flex-col justify-between h-20 hover:border-emerald-500/40 hover:bg-emerald-950/5 transition cursor-pointer select-none"
                                    >
                                        <div className="w-full h-9 bg-zinc-950/80 rounded overflow-hidden flex items-center justify-center p-1 border border-zinc-900">
                                            <img
                                                src={svg.url}
                                                alt={svg.name}
                                                className="w-8 h-8 object-contain opacity-50 group-hover:opacity-90 group-hover:scale-105 transition"
                                            />
                                        </div>
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-[8px] font-mono text-zinc-400 group-hover:text-emerald-400 transition truncate w-24">
                                                {svg.name}
                                            </span>
                                            <span className="text-[7px] font-mono text-emerald-500/80 font-black">+</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* 3. LOTTIE GRAPHICS */}
                        {activeAssetFolder === 'LOTTIES' && (
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { name: 'Quantum Sphere', url: '/assets/lottie/quantum_sphere.json' },
                                    { name: 'Tech Radar Loop', url: '/assets/lottie/tech_radar.json' },
                                    { name: 'Core Sync Ripple', url: '/assets/lottie/core_sync.json' }
                                ].map((lottie) => (
                                    <div
                                        key={lottie.name}
                                        onClick={() => handleMountAsset(lottie.url, lottie.name, 'LOTTIE')}
                                        className="group bg-[#12111f] border border-zinc-800/60 rounded-md p-2 flex flex-col justify-between h-16 hover:border-emerald-500/40 hover:bg-emerald-950/5 transition cursor-pointer select-none"
                                    >
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[8.5px] font-mono text-zinc-300 group-hover:text-emerald-400 transition truncate w-24">
                                                {lottie.name}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-[7.5px] font-mono text-zinc-500 uppercase tracking-widest mt-1.5">
                                            <span>Lottie Node</span>
                                            <span className="text-emerald-500/80 font-black">+ ADD</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* 4. CORE LAYOUT TEMPLATES */}
                        {activeAssetFolder === 'TEMPLATES' && (
                            <div className="space-y-1.5">
                                {[
                                    { id: 'CLASSIC_DEVELOPER', name: 'Classic Developer Blueprint', desc: 'Standard 4-card stack layout with GitHub commits matrix.' },
                                    { id: 'MINIMALIST_METRICS', name: 'Minimalist Metrics Matrix', desc: 'Dense data grids targeting quantitative profile tracking.' },
                                    { id: 'ADVANCED_DEVOPS', name: 'Advanced DevOps Dashboard', desc: 'CI/CD pipeline test status and npm release metrics.' }
                                ].map((template) => (
                                    <div
                                        key={template.id}
                                        onClick={() => handleMountTemplate(template.id as any)}
                                        className="group bg-[#12111f] border border-zinc-800/60 rounded-md p-2.5 flex flex-col justify-between hover:border-emerald-500/40 hover:bg-emerald-950/5 transition cursor-pointer select-none"
                                    >
                                        <div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[9px] font-mono font-bold text-zinc-300 group-hover:text-emerald-400 transition">
                                                    {template.name}
                                                </span>
                                                <span className="text-[7.5px] font-mono text-zinc-500 bg-zinc-950 px-1 py-0.5 rounded border border-zinc-900">
                                                    BLUEPRINT
                                                </span>
                                            </div>
                                            <p className="text-[8px] text-zinc-500 leading-normal mt-1">
                                                {template.desc}
                                            </p>
                                        </div>
                                        <div className="flex justify-end items-center mt-2 border-t border-zinc-900 pt-1.5">
                                            <span className="text-[8px] font-mono text-emerald-500 font-bold group-hover:underline">
                                                LOAD BLUEPRINT →
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>

                    {/* Empty blank KineticMediaBox container helper */}
                    <div className="mt-2 flex justify-between items-center text-[8px] font-mono text-zinc-500">
                        <span>Need a blank asset container?</span>
                        <div
                            draggable
                            onDragStart={(e) => onDragStart(e, 'KineticMediaBox')}
                            className="bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded cursor-grab active:cursor-grabbing text-emerald-400 font-mono"
                        >
                            Drag Kinetic Media Box
                        </div>
                    </div>

                    {/* daily.dev Proactive Suggestions */}
                    <div className="mt-4 pt-3 border-t border-zinc-800/80">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-[#a855f7] block mb-2">
                            daily.dev Agentic Suggestions
                        </label>
                        <div className="bg-[#0b0a14] border border-[#a855f7]/20 rounded-md p-3 space-y-2 text-[10px] font-mono leading-relaxed">
                            <div className="text-zinc-500 uppercase text-[9px] mb-1">
                                Reading Telemetry Match:
                            </div>
                            <div className="text-zinc-300">
                                ➔ <span className="text-[#a855f7]">AI-assisted (33%)</span>: Try adding <span className="text-emerald-400 font-bold cursor-pointer hover:underline" onClick={() => addNode('KineticMediaBox', { x: 200, y: 150 })}>Kinetic Media Box</span>
                            </div>
                            <div className="text-zinc-300">
                                ➔ <span className="text-[#a855f7]">ChatGPT (17%)</span>: Try adding <span className="text-emerald-400 font-bold cursor-pointer hover:underline" onClick={() => addNode('BioNode', { x: 200, y: 150 })}>Bio Card</span>
                            </div>
                            <div className="text-zinc-300">
                                ➔ <span className="text-[#a855f7]">Design-systems (17%)</span>: Try adding <span className="text-emerald-400 font-bold cursor-pointer hover:underline" onClick={() => addNode('TechStackNode', { x: 200, y: 150 })}>Tech Stack Panel</span>
                            </div>
                            <div className="text-zinc-300">
                                ➔ <span className="text-[#a855f7]">DevTools (17%)</span>: Try adding <span className="text-emerald-400 font-bold cursor-pointer hover:underline" onClick={() => addNode('TestSuiteNode', { x: 200, y: 150 })}>DevOps Test Suite</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

          {/* Dynamic Value Mutation Panel Form */}
          {activeNode ? (
              <div className="space-y-4">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-purple-400">Modify Properties</div>

                  {activeNode.node_type === 'ContributionsMatrix' && (
                <div className="space-y-2.5">
                  <div>
                    <label className="text-[9px] uppercase font-medium text-zinc-500 block mb-1">Total Yearly Commits</label>
                    <input 
                      type="number" 
                      value={activeNode.config_data.totalYearlyCommits || 2480} 
                      onChange={(e) => updateNodeData(activeNode.id, { totalYearlyCommits: parseInt(e.target.value, 10) || 0 })}
                      className="w-full bg-[#12111f] border border-[rgba(139,92,246,0.15)] focus:border-purple-500 text-xs px-2.5 py-1.5 rounded text-zinc-200 outline-none font-mono"
                    />
                  </div>
                </div>
              )}

              {activeNode.node_type === 'HeaderNode' && (
                <div className="space-y-2.5">
                  <div>
                    <label className="text-[9px] uppercase font-medium text-zinc-500 block mb-1">Title</label>
                    <input 
                      type="text" 
                      value={activeNode.config_data.title || ''} 
                      onChange={(e) => updateNodeData(activeNode.id, { title: e.target.value })}
                      className="w-full bg-[#12111f] border border-[rgba(139,92,246,0.15)] focus:border-purple-500 text-xs px-2.5 py-1.5 rounded text-zinc-200 outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-medium text-zinc-500 block mb-1">Organization</label>
                    <input 
                      type="text" 
                      value={activeNode.config_data.org || ''} 
                      onChange={(e) => updateNodeData(activeNode.id, { org: e.target.value })}
                      className="w-full bg-[#12111f] border border-[rgba(139,92,246,0.15)] focus:border-purple-500 text-xs px-2.5 py-1.5 rounded text-zinc-200 outline-none font-mono"
                    />
                  </div>
                </div>
              )}

              {activeNode.node_type === 'BioNode' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-500 block mb-1.5">Data Hydration Mode</label>
                    <select
                      value={activeNode.config_data.hydrationMode || 'LIVE_API'}
                      onChange={(e) => updateNodeData(activeNode.id, { hydrationMode: e.target.value })}
                      className="w-full bg-[#12111f] border border-[rgba(139,92,246,0.15)] focus:border-purple-500 text-xs px-2.5 py-2 rounded text-zinc-300 outline-none font-sans"
                    >
                      <option value="STATIC">Static Input (Manual)</option>
                      <option value="LIVE_API">Live API Sync (GitHub Biography)</option>
                    </select>
                  </div>

                  {activeNode.config_data.hydrationMode === 'LIVE_API' ? (
                    <div className="space-y-3 p-3 bg-emerald-950/10 border border-emerald-500/20 rounded-md">
                      <div>
                        <label className="text-[9px] uppercase font-medium text-emerald-500 block mb-1">GitHub Account Target</label>
                        <input 
                          type="text" 
                          placeholder="e.g. aditya-sharma"
                          value={activeNode.config_data.apiUsername || ''} 
                          onChange={(e) => updateNodeData(activeNode.id, { apiUsername: e.target.value })}
                          className="w-full bg-[#12111f] border border-emerald-500/30 focus:border-emerald-500 text-xs px-2.5 py-1.5 rounded text-zinc-200 outline-none font-mono"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[9px] uppercase font-medium text-zinc-500 block mb-1">Static Biography String</label>
                        <textarea 
                          rows={4}
                          value={activeNode.config_data.static_values?.bio || ''} 
                          onChange={(e) => updateNodeData(activeNode.id, { 
                            static_values: { ...activeNode.config_data.static_values, bio: e.target.value } 
                          })}
                          className="w-full bg-[#12111f] border border-[rgba(139,92,246,0.15)] focus:border-purple-500 text-xs px-2.5 py-1.5 rounded text-zinc-200 outline-none font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeNode.node_type === 'ProjectModalSliderNode' && (
                <div className="space-y-4">
                  <div className="text-[10px] font-bold text-zinc-400">Modify Project Details:</div>
                  {(activeNode.config_data.projects || []).map((project: any, idx: number) => (
                    <div key={idx} className="space-y-2 p-2.5 bg-zinc-900/60 border border-zinc-800 rounded">
                      <div className="text-[9px] text-zinc-500 font-bold uppercase">Project #{idx + 1}</div>
                      <div>
                        <label className="text-[8px] uppercase font-medium text-zinc-500 block mb-1">Name</label>
                        <input 
                          type="text" 
                          value={project.name || ''} 
                          onChange={(e) => {
                            const updated = [...(activeNode.config_data.projects || [])];
                            updated[idx] = { ...updated[idx], name: e.target.value };
                            updateNodeData(activeNode.id, { projects: updated });
                          }}
                          className="w-full bg-[#12111f] border border-zinc-800 text-xs px-2 py-1 rounded text-zinc-200 outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[8px] uppercase font-medium text-zinc-500 block mb-1">Description</label>
                        <input 
                          type="text" 
                          value={project.desc || ''} 
                          onChange={(e) => {
                            const updated = [...(activeNode.config_data.projects || [])];
                            updated[idx] = { ...updated[idx], desc: e.target.value };
                            updateNodeData(activeNode.id, { projects: updated });
                          }}
                          className="w-full bg-[#12111f] border border-zinc-800 text-xs px-2 py-1 rounded text-zinc-200 outline-none font-mono"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeNode.node_type === 'FilterableTimelineNode' && (
                <div className="space-y-4">
                  <div className="text-[10px] font-bold text-zinc-400">Modify Timeline Milestones:</div>
                  {(activeNode.config_data.milestones || []).map((m: any, idx: number) => (
                    <div key={idx} className="space-y-2 p-2.5 bg-zinc-900/60 border border-zinc-800 rounded">
                      <div className="text-[9px] text-zinc-500 font-bold uppercase">Milestone #{idx + 1}</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[8px] uppercase font-medium text-zinc-500 block mb-1">Year</label>
                          <input 
                            type="text" 
                            value={m.year || ''} 
                            onChange={(e) => {
                              const updated = [...(activeNode.config_data.milestones || [])];
                              updated[idx] = { ...updated[idx], year: e.target.value };
                              updateNodeData(activeNode.id, { milestones: updated });
                            }}
                            className="w-full bg-[#12111f] border border-zinc-800 text-xs px-2 py-1 rounded text-zinc-200 outline-none font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[8px] uppercase font-medium text-zinc-500 block mb-1">Tag (WORK/OSS)</label>
                          <input 
                            type="text" 
                            value={m.tag || ''} 
                            onChange={(e) => {
                              const updated = [...(activeNode.config_data.milestones || [])];
                              updated[idx] = { ...updated[idx], tag: e.target.value.toUpperCase() };
                              updateNodeData(activeNode.id, { milestones: updated });
                            }}
                            className="w-full bg-[#12111f] border border-zinc-800 text-xs px-2 py-1 rounded text-zinc-200 outline-none font-mono"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[8px] uppercase font-medium text-zinc-500 block mb-1">Title</label>
                        <input 
                          type="text" 
                          value={m.title || ''} 
                          onChange={(e) => {
                            const updated = [...(activeNode.config_data.milestones || [])];
                            updated[idx] = { ...updated[idx], title: e.target.value };
                            updateNodeData(activeNode.id, { milestones: updated });
                          }}
                          className="w-full bg-[#12111f] border border-zinc-800 text-xs px-2 py-1 rounded text-zinc-200 outline-none font-mono"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeNode.node_type === 'EndorsementsCarouselNode' && (
                <div className="space-y-4">
                  <div className="text-[10px] font-bold text-zinc-400">Modify Endorsements:</div>
                  {(activeNode.config_data.endorsements || []).map((endorsement: any, idx: number) => (
                    <div key={idx} className="space-y-2 p-2.5 bg-zinc-900/60 border border-zinc-800 rounded">
                      <div className="text-[9px] text-zinc-500 font-bold uppercase">Endorsement #{idx + 1}</div>
                      <div>
                        <label className="text-[8px] uppercase font-medium text-zinc-500 block mb-1">Author Name</label>
                        <input 
                          type="text" 
                          value={endorsement.name || ''} 
                          onChange={(eVal) => {
                            const updated = [...(activeNode.config_data.endorsements || [])];
                            updated[idx] = { ...updated[idx], name: eVal.target.value };
                            updateNodeData(activeNode.id, { endorsements: updated });
                          }}
                          className="w-full bg-[#12111f] border border-zinc-800 text-xs px-2 py-1 rounded text-zinc-200 outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[8px] uppercase font-medium text-zinc-500 block mb-1">Testimonial Text</label>
                        <input 
                          type="text" 
                          value={endorsement.text || ''} 
                          onChange={(eVal) => {
                            const updated = [...(activeNode.config_data.endorsements || [])];
                            updated[idx] = { ...updated[idx], text: eVal.target.value };
                            updateNodeData(activeNode.id, { endorsements: updated });
                          }}
                          className="w-full bg-[#12111f] border border-zinc-800 text-xs px-2 py-1 rounded text-zinc-200 outline-none font-mono"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeNode.node_type === 'StatsNode' && (() => {
                const staticValues = activeNode.config_data.static_values || {
                  stat1Val: activeNode.config_data.stat1Val || '27',
                  stat1Label: activeNode.config_data.stat1Label || 'Systems Built',
                  stat2Val: activeNode.config_data.stat2Val || '5TB',
                  stat2Label: activeNode.config_data.stat2Label || 'Vault Stream'
                };

                return (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-500 block mb-1.5">Data Hydration Mode</label>
                      <select
                        value={activeNode.config_data.hydrationMode || 'STATIC'}
                        onChange={(e) => updateNodeData(activeNode.id, { hydrationMode: e.target.value })}
                        className="w-full bg-[#12111f] border border-[rgba(139,92,246,0.15)] focus:border-purple-500 text-xs px-2.5 py-2 rounded text-zinc-300 outline-none font-sans"
                      >
                        <option value="STATIC">Static Inputs (Manual)</option>
                        <option value="LIVE_API">Live API Sync (GitHub)</option>
                      </select>
                    </div>

                    {activeNode.config_data.hydrationMode === 'LIVE_API' ? (
                      <div className="space-y-3 p-3 bg-emerald-950/10 border border-emerald-500/20 rounded-md">
                        <div>
                          <label className="text-[9px] uppercase font-medium text-emerald-500 block mb-1">GitHub Account Target</label>
                          <input 
                            type="text" 
                            placeholder="e.g. aditya-sharma"
                            value={activeNode.config_data.apiUsername || ''} 
                            onChange={(e) => updateNodeData(activeNode.id, { apiUsername: e.target.value })}
                            className="w-full bg-[#12111f] border border-[rgba(139,92,246,0.15)] focus:border-emerald-500/40 text-xs px-2.5 py-1.5 rounded text-zinc-200 outline-none font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-[9px] uppercase font-medium text-zinc-500 block mb-1">Column 1 Parameter Map</label>
                          <select
                            value={activeNode.config_data.column1Mapping || 'totalStarsCount'}
                            onChange={(e) => updateNodeData(activeNode.id, { column1Mapping: e.target.value })}
                            className="w-full bg-[#12111f] border border-[rgba(139,92,246,0.15)] text-xs p-1.5 rounded text-zinc-300 outline-none font-mono"
                          >
                            <option value="totalStarsCount">Total Repository Stars</option>
                            <option value="totalCommitContributions">Commits Heatmap Index</option>
                            <option value="openSourceContributionCount">Open Source Contributions</option>
                            <option value="github_repos">Public Repositories</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[9px] uppercase font-medium text-zinc-500 block mb-1">Column 2 Parameter Map</label>
                          <select
                            value={activeNode.config_data.column2Mapping || 'totalCommitContributions'}
                            onChange={(e) => updateNodeData(activeNode.id, { column2Mapping: e.target.value })}
                            className="w-full bg-[#12111f] border border-[rgba(139,92,246,0.15)] text-xs p-1.5 rounded text-zinc-300 outline-none font-mono"
                          >
                            <option value="totalStarsCount">Total Repository Stars</option>
                            <option value="totalCommitContributions">Commits Heatmap Index</option>
                            <option value="openSourceContributionCount">Open Source Contributions</option>
                            <option value="github_repos">Public Repositories</option>
                          </select>
                        </div>

                        <button 
                          onClick={() => hydrateCanvasNodes()}
                          className="w-full text-[10px] font-bold py-1.5 mt-2 rounded bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 transition-all flex justify-center items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Sync with GitHub
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9px] uppercase font-medium text-zinc-500 block mb-1">Val 1</label>
                            <input 
                              type="text" 
                              value={staticValues.stat1Val} 
                              onChange={(e) => updateNodeData(activeNode.id, { static_values: { ...staticValues, stat1Val: e.target.value } })}
                              className="w-full bg-[#12111f] border border-[rgba(139,92,246,0.15)] focus:border-purple-500 text-xs p-1.5 rounded text-zinc-200 outline-none font-mono"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] uppercase font-medium text-zinc-500 block mb-1">Label 1</label>
                            <input 
                              type="text" 
                              value={staticValues.stat1Label} 
                              onChange={(e) => updateNodeData(activeNode.id, { static_values: { ...staticValues, stat1Label: e.target.value } })}
                              className="w-full bg-[#12111f] border border-[rgba(139,92,246,0.15)] focus:border-purple-500 text-xs p-1.5 rounded text-zinc-200 outline-none font-mono"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9px] uppercase font-medium text-zinc-500 block mb-1">Val 2</label>
                            <input 
                              type="text" 
                              value={staticValues.stat2Val} 
                              onChange={(e) => updateNodeData(activeNode.id, { static_values: { ...staticValues, stat2Val: e.target.value } })}
                              className="w-full bg-[#12111f] border border-[rgba(139,92,246,0.15)] focus:border-purple-500 text-xs p-1.5 rounded text-zinc-200 outline-none font-mono"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] uppercase font-medium text-zinc-500 block mb-1">Label 2</label>
                            <input 
                              type="text" 
                              value={staticValues.stat2Label} 
                              onChange={(e) => updateNodeData(activeNode.id, { static_values: { ...staticValues, stat2Label: e.target.value } })}
                              className="w-full bg-[#12111f] border border-[rgba(139,92,246,0.15)] focus:border-purple-500 text-xs p-1.5 rounded text-zinc-200 outline-none font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {activeNode.node_type === 'TechStackNode' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] uppercase font-medium text-zinc-500 block mb-1">Technologies (Comma Separated)</label>
                    <input 
                      type="text" 
                      value={activeNode.config_data.techs?.join(', ') || ''} 
                      onChange={(e) => updateNodeData(activeNode.id, { techs: e.target.value.split(',').map(t => t.trim()) })}
                      className="w-full bg-[#12111f] border border-[rgba(139,92,246,0.15)] focus:border-purple-500 text-xs px-2.5 py-1.5 rounded text-zinc-200 outline-none font-mono"
                      placeholder="React, Next.js, TypeScript"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-medium text-zinc-500 block mb-1">Iconography Style Tier</label>
                    <select
                      value={activeNode.config_data.iconographyStyle || 'MAX_FIDELITY_STANDARD'}
                      onChange={(e) => updateNodeData(activeNode.id, { iconographyStyle: e.target.value })}
                      className="w-full bg-[#12111f] border border-[rgba(139,92,246,0.15)] focus:border-purple-500 text-xs px-2.5 py-2 rounded text-zinc-300 outline-none font-sans"
                    >
                      <option value="MAX_FIDELITY_STANDARD">Standard (High Fidelity Brand)</option>
                      <option value="MAX_FIDELITY_MINIMALIST">Minimalist (Monochromatic Badge)</option>
                    </select>
                  </div>
                </div>
              )}

              {activeNode.node_type === 'ActiveProjectsNode' && (
                <div className="space-y-2.5">
                  <div>
                    <label className="text-[9px] uppercase font-medium text-zinc-500 block mb-1">Project Name</label>
                    <input 
                      type="text" 
                      value={activeNode.config_data.name || ''} 
                      onChange={(e) => updateNodeData(activeNode.id, { name: e.target.value })}
                      className="w-full bg-[#12111f] border border-[rgba(139,92,246,0.15)] focus:border-purple-500 text-xs px-2.5 py-1.5 rounded text-zinc-200 outline-none font-mono"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[9px] uppercase font-medium text-zinc-500 block">Progress Weight</label>
                      <span className="text-[10px] font-mono font-bold text-purple-400">{activeNode.config_data.progress || 0}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      step="1"
                      value={activeNode.config_data.progress || 0} 
                      onChange={(e) => updateNodeData(activeNode.id, { progress: parseInt(e.target.value, 10) })}
                      className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500 outline-none"
                    />
                  </div>
                </div>
              )}

              {activeNode.node_type === 'PackageReleaseNode' && (() => {
                const staticVals = activeNode.config_data.static_values || { version: '1.0.0', downloads: '1.2M' };
                return (
                  <div className="space-y-4" onKeyDown={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
                    <div>
                      <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-500 block mb-1">Data Hydration Mode</label>
                      <select
                        value={activeNode.config_data.hydrationMode || 'STATIC'}
                        onChange={(e) => updateNodeData(activeNode.id, { hydrationMode: e.target.value })}
                        className="w-full bg-[#12111f] border border-[rgba(139,92,246,0.15)] focus:border-purple-500 text-xs px-2.5 py-2 rounded text-zinc-300 outline-none font-sans"
                      >
                        <option value="STATIC">Static Inputs (Manual)</option>
                        <option value="LIVE_API">Live API Sync</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[9px] uppercase font-medium text-zinc-500 block mb-1">Package Registry</label>
                      <select
                        value={activeNode.config_data.registry || 'NPM'}
                        onChange={(e) => updateNodeData(activeNode.id, { registry: e.target.value })}
                        className="w-full bg-[#12111f] border border-[rgba(139,92,246,0.15)] focus:border-purple-500 text-xs p-1.5 rounded text-zinc-300 outline-none font-mono"
                      >
                        <option value="NPM">npm (Node.js)</option>
                        <option value="PYPI">PyPI (Python)</option>
                        <option value="CRATES_IO">crates.io (Rust)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[9px] uppercase font-medium text-zinc-500 block mb-1">Package Name</label>
                      <input 
                        type="text" 
                        value={activeNode.config_data.packageName || ''} 
                        onChange={(e) => updateNodeData(activeNode.id, { packageName: e.target.value })}
                        className="w-full bg-[#12111f] border border-[rgba(139,92,246,0.15)] focus:border-purple-500 text-xs px-2.5 py-1.5 rounded text-zinc-200 outline-none font-mono"
                        placeholder="e.g. express"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox"
                        id="displayLicense"
                        checked={activeNode.config_data.displayLicense !== false}
                        onChange={(e) => updateNodeData(activeNode.id, { displayLicense: e.target.checked })}
                        className="bg-[#12111f] border border-[rgba(139,92,246,0.15)] rounded text-purple-500 focus:ring-0 cursor-pointer"
                      />
                      <label htmlFor="displayLicense" className="text-[10px] text-zinc-400 font-bold cursor-pointer select-none">Display License Tag</label>
                    </div>

                    {activeNode.config_data.hydrationMode !== 'LIVE_API' && (
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800/80">
                        <div>
                          <label className="text-[9px] uppercase font-medium text-zinc-500 block mb-1">Static Version</label>
                          <input 
                            type="text" 
                            value={staticVals.version}
                            onChange={(e) => updateNodeData(activeNode.id, { static_values: { ...staticVals, version: e.target.value } })}
                            className="w-full bg-[#12111f] border border-[rgba(139,92,246,0.15)] focus:border-purple-500 text-xs p-1.5 rounded text-zinc-200 outline-none font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] uppercase font-medium text-zinc-500 block mb-1">Static Downloads</label>
                          <input 
                            type="text" 
                            value={staticVals.downloads}
                            onChange={(e) => updateNodeData(activeNode.id, { static_values: { ...staticVals, downloads: e.target.value } })}
                            className="w-full bg-[#12111f] border border-[rgba(139,92,246,0.15)] focus:border-purple-500 text-xs p-1.5 rounded text-zinc-200 outline-none font-mono"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {activeNode.node_type === 'TestSuiteNode' && (() => {
                const staticVals = activeNode.config_data.static_values || { passingTests: '94', totalTests: '100', suiteStatus: 'PASSING' };
                return (
                  <div className="space-y-4" onKeyDown={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
                    <div>
                      <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-500 block mb-1">Data Hydration Mode</label>
                      <select
                        value={activeNode.config_data.hydrationMode || 'STATIC'}
                        onChange={(e) => updateNodeData(activeNode.id, { hydrationMode: e.target.value })}
                        className="w-full bg-[#12111f] border border-[rgba(139,92,246,0.15)] focus:border-purple-500 text-xs px-2.5 py-2 rounded text-zinc-300 outline-none font-sans"
                      >
                        <option value="STATIC">Static Inputs (Manual)</option>
                        <option value="LIVE_API">Live API Sync</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[9px] uppercase font-medium text-zinc-500 block mb-1">Repository Path</label>
                      <input 
                        type="text" 
                        value={activeNode.config_data.repositoryPath || ''} 
                        onChange={(e) => updateNodeData(activeNode.id, { repositoryPath: e.target.value })}
                        className="w-full bg-[#12111f] border border-[rgba(139,92,246,0.15)] focus:border-purple-500 text-xs px-2.5 py-1.5 rounded text-zinc-200 outline-none font-mono"
                        placeholder="e.g. facebook/react"
                      />
                    </div>

                    <div>
                      <label className="text-[9px] uppercase font-medium text-zinc-500 block mb-1">Target Branch</label>
                      <input 
                        type="text" 
                        value={activeNode.config_data.branchTarget || ''} 
                        onChange={(e) => updateNodeData(activeNode.id, { branchTarget: e.target.value })}
                        className="w-full bg-[#12111f] border border-[rgba(139,92,246,0.15)] focus:border-purple-500 text-xs px-2.5 py-1.5 rounded text-zinc-200 outline-none font-mono"
                        placeholder="e.g. main"
                      />
                    </div>

                    {activeNode.config_data.hydrationMode !== 'LIVE_API' && (
                      <div className="space-y-3 pt-2 border-t border-zinc-800/80">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9px] uppercase font-medium text-zinc-500 block mb-1">Passing Tests</label>
                            <input 
                              type="text" 
                              value={staticVals.passingTests}
                              onChange={(e) => updateNodeData(activeNode.id, { static_values: { ...staticVals, passingTests: e.target.value } })}
                              className="w-full bg-[#12111f] border border-[rgba(139,92,246,0.15)] focus:border-purple-500 text-xs p-1.5 rounded text-zinc-200 outline-none font-mono"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] uppercase font-medium text-zinc-500 block mb-1">Total Tests</label>
                            <input 
                              type="text" 
                              value={staticVals.totalTests}
                              onChange={(e) => updateNodeData(activeNode.id, { static_values: { ...staticVals, totalTests: e.target.value } })}
                              className="w-full bg-[#12111f] border border-[rgba(139,92,246,0.15)] focus:border-purple-500 text-xs p-1.5 rounded text-zinc-200 outline-none font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[9px] uppercase font-medium text-zinc-500 block mb-1">Static Suite Status</label>
                          <select
                            value={staticVals.suiteStatus}
                            onChange={(e) => updateNodeData(activeNode.id, { static_values: { ...staticVals, suiteStatus: e.target.value } })}
                            className="w-full bg-[#12111f] border border-[rgba(139,92,246,0.15)] focus:border-purple-500 text-xs p-1.5 rounded text-zinc-300 outline-none font-mono"
                          >
                            <option value="PASSING">PASSING</option>
                            <option value="FAILING">FAILING</option>
                            <option value="PENDING">PENDING</option>
                            <option value="RUNNING">RUNNING</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {activeNode.node_type === 'LeetCodeNode' && (() => {
                const staticVals = activeNode.config_data.static_values || { solvedCount: '432', activeRanking: '124500' };
                return (
                  <div className="space-y-4" onKeyDown={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
                    <div>
                      <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-500 block mb-1">Data Hydration Mode</label>
                      <select
                        value={activeNode.config_data.hydrationMode || 'STATIC'}
                        onChange={(e) => updateNodeData(activeNode.id, { hydrationMode: e.target.value })}
                        className="w-full bg-[#12111f] border border-[rgba(139,92,246,0.15)] focus:border-purple-500 text-xs px-2.5 py-2 rounded text-zinc-300 outline-none font-sans"
                      >
                        <option value="STATIC">Static Inputs (Manual)</option>
                        <option value="LIVE_API">Live API Sync</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[9px] uppercase font-medium text-zinc-500 block mb-1">LeetCode Username</label>
                      <input 
                        type="text" 
                        value={activeNode.config_data.leetcodeUsername || ''} 
                        onChange={(e) => updateNodeData(activeNode.id, { leetcodeUsername: e.target.value })}
                        className="w-full bg-[#12111f] border border-[rgba(139,92,246,0.15)] focus:border-purple-500 text-xs px-2.5 py-1.5 rounded text-zinc-200 outline-none font-mono"
                        placeholder="e.g. calyx-dev"
                      />
                    </div>

                    {activeNode.config_data.hydrationMode !== 'LIVE_API' && (
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800/80">
                        <div>
                          <label className="text-[9px] uppercase font-medium text-zinc-500 block mb-1">Static Solved</label>
                          <input 
                            type="text" 
                            value={staticVals.solvedCount}
                            onChange={(e) => updateNodeData(activeNode.id, { static_values: { ...staticVals, solvedCount: e.target.value } })}
                            className="w-full bg-[#12111f] border border-[rgba(139,92,246,0.15)] focus:border-purple-500 text-xs p-1.5 rounded text-zinc-200 outline-none font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] uppercase font-medium text-zinc-500 block mb-1">Static Ranking</label>
                          <input 
                            type="text" 
                            value={staticVals.activeRanking}
                            onChange={(e) => updateNodeData(activeNode.id, { static_values: { ...staticVals, activeRanking: e.target.value } })}
                            className="w-full bg-[#12111f] border border-[rgba(139,92,246,0.15)] focus:border-purple-500 text-xs p-1.5 rounded text-zinc-200 outline-none font-mono"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {activeNode.node_type === 'WakaTimeNode' && (() => {
                const staticVals = activeNode.config_data.static_values || { languages: { TypeScript: 45, Rust: 30, Go: 15, Python: 10 } };
                return (
                  <div className="space-y-4" onKeyDown={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
                    <div>
                      <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-500 block mb-1">Data Hydration Mode</label>
                      <select
                        value={activeNode.config_data.hydrationMode || 'STATIC'}
                        onChange={(e) => updateNodeData(activeNode.id, { hydrationMode: e.target.value })}
                        className="w-full bg-[#12111f] border border-[rgba(139,92,246,0.15)] focus:border-purple-500 text-xs px-2.5 py-2 rounded text-zinc-300 outline-none font-sans"
                      >
                        <option value="STATIC">Static Inputs (Manual)</option>
                        <option value="LIVE_API">Live API Sync</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[9px] uppercase font-medium text-zinc-500 block mb-1">WakaTime Vault Integration</label>
                      <select
                        value={activeNode.config_data.wakatimeProfilePointer || 'INTEGRATION_PERSONAL'}
                        onChange={(e) => updateNodeData(activeNode.id, { wakatimeProfilePointer: e.target.value })}
                        className="w-full bg-[#12111f] border border-[rgba(139,92,246,0.15)] focus:border-purple-500 text-xs px-2.5 py-2 rounded text-zinc-300 outline-none font-sans"
                      >
                        <option value="INTEGRATION_PERSONAL">Personal Profile (Secure Vault Link)</option>
                        <option value="INTEGRATION_PROFESSIONAL">Professional Profile (Secure Vault Link)</option>
                      </select>
                    </div>

                    {activeNode.config_data.hydrationMode !== 'LIVE_API' && (
                      <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                        <label className="text-[9px] uppercase font-medium text-zinc-500 block">Static Languages Mix</label>
                        <div className="text-[10px] text-zinc-400 font-mono">
                          TypeScript: 45%, Rust: 30%, Go: 15%, Python: 10%
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {activeNode.node_type === 'ProductShowcaseNode' && (() => {
                const staticVals = activeNode.config_data.static_values || { linesOfCode: '', stackTags: ['OSS'] };
                return (
                  <div className="space-y-4" onKeyDown={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
                    <div>
                      <label className="text-[9px] uppercase font-medium text-zinc-500 block mb-1">Project Title</label>
                      <input 
                        type="text" 
                        value={activeNode.config_data.projectTitle || ''} 
                        onChange={(e) => updateNodeData(activeNode.id, { projectTitle: e.target.value })}
                        className="w-full bg-[#12111f] border border-[rgba(139,92,246,0.15)] focus:border-purple-500 text-xs px-2.5 py-1.5 rounded text-zinc-200 outline-none font-sans"
                        placeholder="e.g. Project Snap"
                      />
                    </div>

                    <div>
                      <label className="text-[9px] uppercase font-medium text-zinc-500 block mb-1">External URL</label>
                      <input 
                        type="text" 
                        value={activeNode.config_data.externalUrl || ''} 
                        onChange={(e) => updateNodeData(activeNode.id, { externalUrl: e.target.value })}
                        className="w-full bg-[#12111f] border border-[rgba(139,92,246,0.15)] focus:border-purple-500 text-xs px-2.5 py-1.5 rounded text-zinc-200 outline-none font-mono"
                        placeholder="e.g. github.com/.../..."
                      />
                    </div>

                    <div>
                      <label className="text-[9px] uppercase font-medium text-zinc-500 block mb-1">Project Description</label>
                      <textarea 
                        value={activeNode.config_data.projectDescription || ''} 
                        onChange={(e) => updateNodeData(activeNode.id, { projectDescription: e.target.value })}
                        rows={3}
                        className="w-full bg-[#12111f] border border-[rgba(139,92,246,0.15)] focus:border-purple-500 text-xs px-2.5 py-1.5 rounded text-zinc-200 outline-none font-sans resize-none"
                        placeholder="Brief summary of what this is..."
                      />
                    </div>

                    <div>
                      <label className="text-[9px] uppercase font-medium text-zinc-500 block mb-1">Display Flavor</label>
                      <select
                        value={activeNode.config_data.displayFlavor || 'MINI_BROWSER'}
                        onChange={(e) => updateNodeData(activeNode.id, { displayFlavor: e.target.value })}
                        className="w-full bg-[#12111f] border border-[rgba(139,92,246,0.15)] focus:border-purple-500 text-xs px-2.5 py-2 rounded text-zinc-300 outline-none font-sans"
                      >
                        <option value="MINI_BROWSER">Mini Browser Chrome</option>
                        <option value="FLAT_CARD">Flat Design Card</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800/80">
                      <div>
                        <label className="text-[9px] uppercase font-medium text-zinc-500 block mb-1">Lines of Code</label>
                        <input 
                          type="text" 
                          value={staticVals.linesOfCode || ''}
                          onChange={(e) => updateNodeData(activeNode.id, { static_values: { ...staticVals, linesOfCode: e.target.value } })}
                          className="w-full bg-[#12111f] border border-[rgba(139,92,246,0.15)] focus:border-purple-500 text-xs p-1.5 rounded text-zinc-200 outline-none font-mono"
                          placeholder="e.g. 42k LOC"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase font-medium text-zinc-500 block mb-1">Stack Tags</label>
                        <input 
                          type="text" 
                          value={(staticVals.stackTags || []).join(', ')}
                          onChange={(e) => updateNodeData(activeNode.id, { static_values: { ...staticVals, stackTags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) } })}
                          className="w-full bg-[#12111f] border border-[rgba(139,92,246,0.15)] focus:border-purple-500 text-xs p-1.5 rounded text-zinc-200 outline-none font-mono"
                          placeholder="e.g. OSS, Rust"
                        />
                      </div>
                    </div>
                  </div>
                );
              })()}

              {activeNode.node_type === 'LiveGuestbookNode' && (() => {
                return (
                  <div className="space-y-4" onKeyDown={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
                    <div>
                      <label className="text-[9px] uppercase font-medium text-zinc-500 block mb-1">Max Rolling Logs</label>
                      <input 
                        type="number" 
                        min={1}
                        max={10}
                        value={activeNode.config_data.maxRollingLogs || 5} 
                        onChange={(e) => updateNodeData(activeNode.id, { maxRollingLogs: parseInt(e.target.value, 10) })}
                        className="w-full bg-[#12111f] border border-[rgba(139,92,246,0.15)] focus:border-purple-500 text-xs px-2.5 py-1.5 rounded text-zinc-200 outline-none font-mono"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/80">
                      <input 
                        type="checkbox"
                        id="allowAnonymousSignatures"
                        checked={activeNode.config_data.allowAnonymousSignatures !== false}
                        onChange={(e) => updateNodeData(activeNode.id, { allowAnonymousSignatures: e.target.checked })}
                        className="bg-[#12111f] border border-[rgba(139,92,246,0.15)] rounded text-purple-500 focus:ring-0 cursor-pointer"
                      />
                      <label htmlFor="allowAnonymousSignatures" className="text-[10px] text-zinc-400 font-bold cursor-pointer select-none">Allow Anonymous Signatures</label>
                    </div>
                  </div>
                );
              })()}

              {activeNode.node_type === 'KineticMediaBox' && (() => {
                return (
                  <div className="space-y-4" onKeyDown={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
                    <div>
                      <label className="text-[9px] uppercase font-medium text-zinc-500 block mb-1">Media Asset URL</label>
                      <input 
                        type="text" 
                        value={activeNode.config_data.mediaAssetUrl || ''} 
                        onChange={(e) => updateNodeData(activeNode.id, { mediaAssetUrl: e.target.value })}
                        className="w-full bg-[#12111f] border border-[rgba(139,92,246,0.15)] focus:border-purple-500 text-xs px-2.5 py-1.5 rounded text-zinc-200 outline-none font-mono"
                        placeholder="https://..."
                      />
                    </div>

                    <div>
                      <label className="text-[9px] uppercase font-medium text-zinc-500 block mb-1">Scaling Ratio</label>
                      <select
                        value={activeNode.config_data.scalingRatio || 'CONTAIN'}
                        onChange={(e) => updateNodeData(activeNode.id, { scalingRatio: e.target.value })}
                        className="w-full bg-[#12111f] border border-[rgba(139,92,246,0.15)] focus:border-purple-500 text-xs px-2.5 py-2 rounded text-zinc-300 outline-none font-sans"
                      >
                        <option value="CONTAIN">CONTAIN</option>
                        <option value="COVER">COVER</option>
                        <option value="SCALE_DOWN">SCALE DOWN</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[9px] uppercase font-medium text-zinc-500 block mb-1">Frame Rate Cap (FPS)</label>
                      <input 
                        type="number" 
                        min={1}
                        max={120}
                        value={activeNode.config_data.frameRateCap || 60} 
                        onChange={(e) => updateNodeData(activeNode.id, { frameRateCap: parseInt(e.target.value, 10) })}
                        className="w-full bg-[#12111f] border border-[rgba(139,92,246,0.15)] focus:border-purple-500 text-xs px-2.5 py-1.5 rounded text-zinc-200 outline-none font-mono"
                      />
                    </div>
                  </div>
                );
              })()}

              {/* Kinetic Asset Gallery (Tier 4 Accordion Style) */}
              <div className="space-y-3 pt-4 border-t border-zinc-800/80 mt-4" onKeyDown={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">Tier 4: Kinetic Asset Gallery</label>
                  <span className="text-[8px] font-mono text-zinc-500">Layered Animations</span>
                </div>
                
                <div className="space-y-2">
                  <div className="text-[9px] uppercase font-bold text-zinc-500 font-sans">Transparent Loop Graphics</div>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(KINETIC_ASSET_MAP).map(([token, asset]) => {
                      const activeTokens = activeNode.config_data.activeKineticTokens || [];
                      const isSelected = activeTokens.includes(token);
                      
                      const handleToggleToken = () => {
                        const newTokens = isSelected
                          ? activeTokens.filter((t: string) => t !== token)
                          : [...activeTokens, token];
                        updateNodeData(activeNode.id, { activeKineticTokens: newTokens });
                      };

                      return (
                        <button
                          key={token}
                          onClick={handleToggleToken}
                          className={`text-left p-2 rounded-lg border text-[10px] font-mono transition-all duration-200 flex flex-col justify-between h-14 cursor-pointer select-none ${
                            isSelected
                              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-bold shadow-[0_0_15px_rgba(16,185,129,0.05)]'
                              : 'bg-[#12111f] border-zinc-800 text-zinc-500 hover:text-zinc-400 hover:border-zinc-700/60'
                          }`}
                        >
                          <span className="truncate w-full">{asset.name}</span>
                          <span className="text-[7.5px] uppercase tracking-wider opacity-60 text-right w-full block mt-1">
                            {isSelected ? '✓ ACTIVE' : '+ LAYER'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-[11px] text-zinc-600 text-center pt-8 italic font-mono border-t border-zinc-800/80">Select a grid card component node parameter to edit settings.</div>
          )}
        </div>

        {/* Global Dispatch Footers */}
        <div className="space-y-2 pt-4 border-t border-zinc-800/80">
            <button 
                disabled={isDeploying}
                onClick={() => {
                    deployStateToEdge('calyx-dev', 'main-matrix');
                }}
                className={`w-full text-xs font-bold py-2.5 rounded-md flex justify-center items-center gap-2 active:scale-[0.97] transition-all transform will-change-transform transform-gpu ${
                    isDeploying 
                        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black shadow-[0_0_15px_rgba(139,92,246,0.15)]'
                }`}
            >
                {isDeploying ? 'Syncing Layers...' : 'Deploy to Profile'}
            </button>
        </div>
      </div>
    </div>
  );
}

export default function StudioCanvas() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
}
