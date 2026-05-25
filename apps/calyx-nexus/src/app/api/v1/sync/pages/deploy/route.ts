import { NextResponse } from 'next/server';
import { supabase } from '@/lib/api-clients';

const KINETIC_ASSET_MAP: Record<string, { name: string; url: string }> = {
    MATRIX_STREAM: {
        name: 'Matrix Code Streams',
        url: 'https://assets.calyx.dev/kinetics/matrix_stream.gif'
    },
    TELEMETRY_HALO: {
        name: 'Pulsing Telemetry Halos',
        url: 'https://assets.calyx.dev/kinetics/telemetry_halo.webp'
    },
    TERMINAL_BLINK: {
        name: 'Terminal Cursors',
        url: 'https://assets.calyx.dev/kinetics/terminal_blink.gif'
    },
    CHARACTER_CUTOUT: {
        name: 'Expressive Character Cutouts',
        url: 'https://assets.calyx.dev/kinetics/character_cutout.webp'
    }
};

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, sections } = body;
        if (!username) {
            return NextResponse.json(
                { error: 'Missing username parameter.' },
                { status: 400 }
            );
        }

        const token = process.env.GITHUB_TOKEN;
        if (!token) {
            return NextResponse.json(
                { error: 'GitHub authentication token not configured in system environment.' },
                { status: 500 }
            );
        }

        const ghHeaders: Record<string, string> = {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Calyx-Profile-Matrix-Sync-Engine',
            'Authorization': `token ${token}`
        };

        const repoName = `${username}.github.io`;

        let componentsHtml = '';
        const scriptsList: string[] = [];

        // 1. Fetch user's profile and active theme flavor from database
        const { data: profileRecord, error: dbError } = await supabase
            .from('profiles')
            .select('id, theme_flavor')
            .eq('github_username', username)
            .maybeSingle();

        if (dbError) throw dbError;

        const activeFlavor = sections && sections.length > 0 
            ? (sections[0].componentVariant || 'LUXURY_GLASSMORPHISM')
            : (profileRecord?.theme_flavor || 'SCANDI_MINIMALIST');

        if (sections && Array.isArray(sections) && sections.length > 0) {
            // Sort sections by displayOrder
            const sortedSections = [...sections].sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0));
            
            sortedSections.forEach((section: any) => {
                const props = section.properties || {};
                const variant = section.componentVariant || 'LUXURY_GLASSMORPHISM';
                
                const width = section.width || props.width || 800;
                const height = section.height || props.height || 'auto';
                const widthStyle = typeof width === 'number' ? `${width}px` : width;
                const heightStyle = typeof height === 'number' ? `${height}px` : height;
                const sizeStyle = `width: ${widthStyle}; height: ${heightStyle}; max-width: 100%;`;

                if (section.sectionId === 'GLOBAL_NAV') {
                    const brandTitle = props.brandTitle || 'Calyx Portfolio Matrix';
                    const enableBlur = props.enableBlur !== false;
                    
                    if (variant === 'RETRO_TERMINAL') {
                        componentsHtml += `
                            <nav id="widget-${section.sectionId}" class="w-full flex items-center justify-between border border-green-500/30 bg-black/60 p-4 rounded font-mono text-green-400 text-xs mb-8" style="${sizeStyle}">
                                <span>[CPM // ${brandTitle.toUpperCase()}]</span>
                                <div class="flex gap-4">
                                    <span class="hover:underline">/home</span>
                                    <span class="hover:underline">/projects</span>
                                    <span class="hover:underline">/contact</span>
                                </div>
                            </nav>
                        `;
                    } else if (variant === 'SCANDI_MINIMALIST') {
                        componentsHtml += `
                            <nav id="widget-${section.sectionId}" class="w-full flex items-center justify-between border-b border-zinc-800 pb-4 mb-8 text-zinc-100 font-sans text-xs tracking-tight" style="${sizeStyle}">
                                <span class="font-extrabold tracking-widest">${brandTitle}</span>
                                <div class="flex gap-6 text-zinc-400 text-[11px] font-medium">
                                    <span class="hover:text-white transition">Index</span>
                                    <span class="hover:text-white transition">Showcase</span>
                                    <span class="hover:text-white transition">Reach Out</span>
                                </div>
                            </nav>
                        `;
                    } else {
                        componentsHtml += `
                            <nav id="widget-${section.sectionId}" class="w-full flex items-center justify-between ${enableBlur ? 'backdrop-blur-md bg-white/[0.03]' : 'bg-[#0f0e1a]'} border border-white/5 p-4 rounded-xl mb-8" style="${sizeStyle}">
                                <span class="text-sm font-black bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">${brandTitle}</span>
                                <div class="flex gap-6 text-xs font-bold text-zinc-300">
                                    <span class="hover:text-purple-400 transition cursor-pointer">Overview</span>
                                    <span class="hover:text-purple-400 transition cursor-pointer">Projects</span>
                                    <span class="hover:text-purple-400 transition cursor-pointer">Contact</span>
                                </div>
                            </nav>
                        `;
                    }
                } else if (section.sectionId === 'HERO_NARRATIVE' || section.sectionId === 'BIOGRAPHY_BLOCK') {
                    const headline = props.headline || 'Engineering High-Density Vectors';
                    const paragraph = props.paragraph || 'We build proxy-evading vector graphics frameworks.';
                    const actionLabel = props.actionLabel || 'Explore Matrix';
                    const iconographyStyle = props.iconographyStyle || 'STANDARD';
                    const kineticBackgroundUrl = props.kineticBackgroundUrl || '';
                    const activeKineticTokens = props.activeKineticTokens || [];
                    
                    const isMinimal = iconographyStyle === 'MINIMALIST';
                    const iconThemeStyle = isMinimal ? 'filter: grayscale(1) opacity(0.85);' : '';
                    
                    let mediaLoopHtml = '';
                    if (Array.isArray(activeKineticTokens) && activeKineticTokens.length > 0) {
                        mediaLoopHtml = `
                            <div class="absolute inset-0 w-full h-full pointer-events-none overflow-hidden opacity-30 z-0" style="isolation: isolate;">
                                ${activeKineticTokens.map((token: string) => {
                                    const asset = KINETIC_ASSET_MAP[token];
                                    if (!asset) return '';
                                    return `<img src="${asset.url}" class="absolute inset-0 w-full h-full object-cover" style="mix-blend-mode: screen; width: 100%; height: 100%;" alt="Kinetic Layer ${token}">`;
                                }).join('')}
                            </div>
                        `;
                    } else if (kineticBackgroundUrl) {
                        mediaLoopHtml = `
                            <div class="absolute inset-0 w-full h-full pointer-events-none overflow-hidden opacity-30 z-0" style="isolation: isolate;">
                                <img src="${kineticBackgroundUrl}" class="absolute inset-0 w-full h-full object-cover" style="mix-blend-mode: screen; width: 100%; height: 100%;" alt="Kinetic Media Loop">
                            </div>
                        `;
                    }

                    if (variant === 'RETRO_TERMINAL') {
                        componentsHtml += `
                            <div id="widget-${section.sectionId}" class="w-full border border-green-500/20 bg-black/85 p-8 rounded font-mono text-green-400 space-y-4 mb-8 relative overflow-hidden" style="${sizeStyle}">
                                ${mediaLoopHtml}
                                <div class="relative z-10 space-y-4">
                                    <div class="text-sm font-black border-b border-green-500/10 pb-2 flex justify-between">
                                        <span>$ run ${section.sectionId.toLowerCase()}.sh</span>
                                        <span class="animate-pulse">_</span>
                                    </div>
                                    <h2 class="text-lg uppercase tracking-tight" style="${iconThemeStyle}">${headline}</h2>
                                    <p class="text-xs text-green-500/80 leading-relaxed">${paragraph}</p>
                                    <button class="border border-green-500/45 hover:bg-green-500/10 px-4 py-1.5 text-[10px] uppercase font-bold tracking-widest transition">${actionLabel}</button>
                                </div>
                            </div>
                        `;
                    } else if (variant === 'SCANDI_MINIMALIST') {
                        componentsHtml += `
                            <div id="widget-${section.sectionId}" class="w-full py-8 px-4 space-y-4 text-zinc-100 font-sans max-w-lg mb-8 relative overflow-hidden" style="${sizeStyle}">
                                ${mediaLoopHtml}
                                <div class="relative z-10 space-y-4">
                                    <h1 class="text-3xl font-light tracking-tighter leading-none" style="${iconThemeStyle}">${headline}</h1>
                                    <p class="text-xs text-zinc-400 font-normal leading-relaxed">${paragraph}</p>
                                    <button class="border-b border-zinc-200 hover:border-zinc-400 text-xs py-1 transition">${actionLabel} &rarr;</button>
                                </div>
                            </div>
                        `;
                    } else {
                        componentsHtml += `
                            <div id="widget-${section.sectionId}" class="w-full relative overflow-hidden rounded-xl border border-purple-500/10 bg-[#0b0a14] p-8 space-y-4 flex flex-col justify-center items-start shadow-[0_0_20px_rgba(139,92,246,0.05)] mb-8" style="${sizeStyle}">
                                <div class="absolute -top-10 -left-10 w-32 h-32 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
                                ${mediaLoopHtml}
                                <div class="relative z-10 space-y-4">
                                    <h2 class="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent leading-snug" style="${iconThemeStyle}">${headline}</h2>
                                    <p class="text-xs text-zinc-400 font-medium leading-relaxed">${paragraph}</p>
                                    <button class="bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-[10px] tracking-wider uppercase px-4 py-2 rounded shadow-[0_0_15px_rgba(147,51,234,0.3)] transition duration-200">${actionLabel}</button>
                                </div>
                            </div>
                        `;
                    }
                } else if (section.sectionId === 'PROJECTS_BENEDICT' || section.sectionId === 'PROJECT_CAROUSEL') {
                    const projectTitle = props.projectTitle || 'Project Benedict';
                    const projects = props.projects || ['Calyx Canvas', 'Asset Server', 'Sync Worker'];
                    const iconographyStyle = props.iconographyStyle || 'STANDARD';
                    
                    const isMinimal = iconographyStyle === 'MINIMALIST';
                    const iconThemeStyle = isMinimal ? 'filter: grayscale(1) opacity(0.85);' : '';
                    
                    if (variant === 'RETRO_TERMINAL') {
                        componentsHtml += `
                            <div id="widget-${section.sectionId}" class="w-full border border-green-500/25 bg-black/75 p-6 rounded font-mono text-green-400 space-y-4 mb-8" style="${sizeStyle}">
                                <div class="text-[10px] uppercase font-bold tracking-wider text-green-500 border-b border-green-500/10 pb-1.5">
                                    [DIRECTORY LISTING: /var/log/projects]
                                </div>
                                <div class="grid grid-cols-1 gap-2.5">
                                    ${projects.map((proj: string) => `
                                        <div class="flex justify-between items-center text-xs p-2 border border-green-500/10 bg-black/40">
                                            <span style="${iconThemeStyle}">${proj}</span>
                                            <span class="text-[9px] bg-green-950/80 px-2 py-0.5 border border-green-500/25 font-bold uppercase text-[8px]">STABLE</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `;
                    } else if (variant === 'SCANDI_MINIMALIST') {
                        componentsHtml += `
                            <div id="widget-${section.sectionId}" class="w-full space-y-6 font-sans text-zinc-100 mb-8" style="${sizeStyle}">
                                <h2 class="text-xs font-bold uppercase tracking-widest text-zinc-500">${projectTitle}</h2>
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    ${projects.map((proj: string) => `
                                        <div class="border border-zinc-800/80 p-5 rounded-lg bg-zinc-950/20 hover:border-zinc-700 transition">
                                            <div class="text-xs font-extrabold" style="${iconThemeStyle}">${proj}</div>
                                            <div class="text-[10px] text-zinc-500 mt-1">Open source build component</div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `;
                    } else {
                        componentsHtml += `
                            <div id="widget-${section.sectionId}" class="w-full space-y-4 bg-[#0b0a14] rounded-xl border border-purple-500/10 p-8 mb-8 shadow-[0_0_20px_rgba(139,92,246,0.03)]" style="${sizeStyle}">
                                <h3 class="text-sm font-black text-purple-300 uppercase tracking-widest">${projectTitle}</h3>
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    ${projects.map((proj: string) => `
                                        <div class="relative group/card bg-[#12111f] border border-purple-500/10 rounded-lg p-5 transition-all duration-300 hover:border-purple-500/40 hover:bg-purple-950/10 hover:shadow-[0_0_15px_rgba(139,92,246,0.08)]">
                                            <div class="text-sm font-black text-zinc-100" style="${iconThemeStyle}">${proj}</div>
                                            <p class="text-[10px] text-zinc-500 mt-2 leading-snug">Enterprise-ready high utility static site generator component.</p>
                                            <div class="mt-3.5 flex flex-wrap gap-1">
                                                <span class="text-[8px] bg-purple-500/10 text-purple-400 font-bold px-1.5 py-0.5 rounded font-mono border border-purple-500/20">V28</span>
                                                <span class="text-[8px] bg-cyan-500/10 text-cyan-400 font-bold px-1.5 py-0.5 rounded font-mono border border-cyan-500/20">OSS</span>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `;
                    }
                } else if (section.sectionId === 'CONTACT_FOOTER') {
                    const email = props.email || 'developer@calyx.io';
                    const allowSignatures = props.allowSignatures !== false;
                    
                    if (variant === 'RETRO_TERMINAL') {
                        componentsHtml += `
                            <div id="widget-${section.sectionId}" class="w-full border border-green-500/20 bg-black/90 p-5 rounded font-mono text-green-400 text-xs flex justify-between items-center mb-8" style="${sizeStyle}">
                                <span>CPM_DAEMON@ROOT:~# mail -s "hello" ${email}</span>
                                <span class="text-[9px] bg-green-500/10 px-2.5 py-1 border border-green-500/30 uppercase font-black tracking-widest">SUBMIT SIGNATURE</span>
                            </div>
                        `;
                    } else if (variant === 'SCANDI_MINIMALIST') {
                        componentsHtml += `
                            <div id="widget-${section.sectionId}" class="w-full border-t border-zinc-800 pt-6 flex justify-between items-center text-zinc-100 font-sans text-xs mb-8" style="${sizeStyle}">
                                <span class="text-zinc-500">Reach out at <span class="text-zinc-300 hover:underline">${email}</span></span>
                                ${allowSignatures ? `<span class="text-zinc-400 text-[10px]">Anonymous signatures allowed</span>` : ''}
                            </div>
                        `;
                    } else {
                        componentsHtml += `
                            <div id="widget-${section.sectionId}" class="w-full p-6 rounded-xl border border-white/5 bg-[#0b0a14] flex justify-between items-center text-white mb-8" style="${sizeStyle}">
                                <div class="space-y-1">
                                    <div class="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">Connect with me</div>
                                    <span class="text-xs font-extrabold text-purple-300 hover:text-purple-200 transition cursor-pointer">${email}</span>
                                </div>
                                ${allowSignatures ? `
                                    <div id="sign-guestbook-trigger" class="bg-[#12111f] border border-purple-500/10 hover:border-purple-500/40 text-[9px] font-black uppercase tracking-wider text-purple-400 px-3 py-1.5 rounded transition cursor-pointer">
                                        Sign Guestbook
                                    </div>
                                ` : ''}
                            </div>
                        `;
                    }
                }
            });
        } else {
            let dbNodes: any[] = [];
            if (profileRecord) {
                const { data: fetchedNodes, error: nodesError } = await supabase
                    .from('canvas_nodes')
                    .select('*')
                    .eq('profile_id', profileRecord.id);
                if (nodesError) throw nodesError;
                dbNodes = fetchedNodes || [];
            }

            const slotPriorities: Record<string, number> = {
                HeaderNode: 1,
                BioNode: 2,
                ProjectModalSliderNode: 3,
                FilterableTimelineNode: 3,
                ActiveProjectsNode: 3,
                EndorsementsCarouselNode: 4,
                LiveGuestbookNode: 4
            };

            const sortedNodes = [...dbNodes].sort((a, b) => {
                const prioA = slotPriorities[a.node_type] || 5;
                const prioB = slotPriorities[b.node_type] || 5;
                return prioA - prioB;
            });

            sortedNodes.forEach((node) => {
                const nodeId = node.id;
                const data = node.config_data || {};

                const width = node.width || data.width || 800;
                const height = node.height || data.height || 'auto';
                const widthStyle = typeof width === 'number' ? `${width}px` : width;
                const heightStyle = typeof height === 'number' ? `${height}px` : height;
                const sizeStyle = `width: ${widthStyle}; height: ${heightStyle}; max-width: 100%;`;

                if (node.node_type === 'HeaderNode') {
                    const title = data.title || 'Systems Architect';
                    const org = data.org || 'Calyx Studios';
                    componentsHtml += `
                        <nav class="w-full flex items-center justify-between border-b border-zinc-800 pb-6 mb-8 shrink-0" style="${sizeStyle}">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-extrabold text-sm">CPM</div>
                                <div>
                                    <div class="text-sm font-extrabold text-zinc-100">${title}</div>
                                    <div class="text-xs text-zinc-500">${org}</div>
                                </div>
                            </div>
                            <div class="flex items-center gap-4">
                                <a href="https://github.com/${username}" target="_blank" rel="noopener noreferrer" class="text-xs font-mono text-zinc-400 hover:text-zinc-200 transition">github.com/${username}</a>
                            </div>
                        </nav>
                    `;
                } else if (node.node_type === 'BioNode') {
                    const bio = data.static_values?.bio || data.bio || 'Systems Architect & Full Stack Engineer specializing in high-performance decentralized systems.';
                    componentsHtml += `
                        <div class="w-full card mb-8 p-8 bg-[#0b0a14] border border-zinc-800/80 rounded-xl relative overflow-hidden group" style="${sizeStyle}">
                            <div class="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div class="relative z-10 space-y-4">
                                <div class="flex items-center gap-2">
                                    <span class="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.5)]"></span>
                                    <span class="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-wider">Biography Profile</span>
                                </div>
                                <h2 class="text-xl font-extrabold text-white leading-tight">About Coder</h2>
                                <p class="text-zinc-300 text-sm leading-relaxed">${bio}</p>
                            </div>
                        </div>
                    `;
                } else if (node.node_type === 'ProjectModalSliderNode') {
                    const projects = data.projects || [
                        { name: 'Calyx Core', desc: 'Secure enterprise gateway' },
                        { name: 'V8 Engine Bridge', desc: 'Stateless cloud sync tunnel' }
                    ];
                    componentsHtml += `
                        <div id="widget-${nodeId}" class="w-full card mb-8 p-8 bg-[#0b0a14] border border-zinc-800/80 rounded-xl relative overflow-hidden group" style="${sizeStyle}">
                            <div class="absolute inset-0 bg-radial-gradient(circle, rgba(139,92,246,0.03)_0%,_transparent_70%) opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div class="relative z-10 space-y-6">
                                <div class="flex justify-between items-center pb-2 border-b border-zinc-800/50">
                                    <div class="flex items-center gap-2">
                                        <span class="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
                                        <span class="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-wider">Project Showcases</span>
                                    </div>
                                    <span class="slide-indicator text-[10px] font-mono text-zinc-500">1 / ${projects.length}</span>
                                </div>
                                
                                <div class="slides-container relative min-h-[120px]">
                                    ${projects.map((p: any, idx: number) => `
                                        <div class="slide-item absolute inset-0 flex flex-col justify-center gap-2 transform ${idx === 0 ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 translate-x-4 pointer-events-none'}" data-slide-index="${idx}">
                                            <h3 class="text-base font-extrabold text-white tracking-wide font-mono uppercase">${p.name}</h3>
                                            <p class="text-xs text-zinc-400 font-mono leading-relaxed line-clamp-3">${p.desc}</p>
                                        </div>
                                    `).join('')}
                                </div>

                                <div class="flex justify-between items-center pt-4 border-t border-zinc-800/30">
                                    <button class="prev-btn px-4 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700/60 rounded text-[10px] font-mono text-zinc-400 font-extrabold hover:text-white uppercase transition-all duration-150">
                                        &lt; Prev
                                    </button>
                                    <button class="next-btn px-4 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700/60 rounded text-[10px] font-mono text-zinc-400 font-extrabold hover:text-white uppercase transition-all duration-150">
                                        Next &gt;
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                    scriptsList.push(`
                        (() => {
                            const widget = document.getElementById('widget-${nodeId}');
                            if (!widget) return;
                            const slides = widget.querySelectorAll('.slide-item');
                            const indicator = widget.querySelector('.slide-indicator');
                            let current = 0;
                            const total = ${projects.length};

                            const updateSlide = (nextIndex) => {
                                slides.forEach((slide, idx) => {
                                    if (idx === nextIndex) {
                                        slide.classList.remove('opacity-0', 'translate-x-4', 'pointer-events-none');
                                        slide.classList.add('opacity-100', 'translate-x-0', 'pointer-events-auto');
                                    } else {
                                        slide.classList.remove('opacity-100', 'translate-x-0', 'pointer-events-auto');
                                        slide.classList.add('opacity-0', 'translate-x-4', 'pointer-events-none');
                                    }
                                });
                                current = nextIndex;
                                indicator.textContent = (current + 1) + ' / ' + total;
                            };

                            widget.querySelector('.prev-btn').addEventListener('click', (e) => {
                                e.preventDefault();
                                const targetIdx = current === 0 ? total - 1 : current - 1;
                                updateSlide(targetIdx);
                            });

                            widget.querySelector('.next-btn').addEventListener('click', (e) => {
                                e.preventDefault();
                                const targetIdx = current === total - 1 ? 0 : current + 1;
                                updateSlide(targetIdx);
                            });
                        })();
                    `);
                } else if (node.node_type === 'FilterableTimelineNode') {
                    const milestones = data.milestones || [
                        { year: '2024', title: 'Initialized CPM architecture', tag: 'WORK' },
                        { year: '2025', title: 'Open sourced vector kinetic engine', tag: 'OSS' }
                    ];
                    componentsHtml += `
                        <div id="widget-${nodeId}" class="w-full card mb-8 p-8 bg-[#0b0a14] border border-zinc-800/80 rounded-xl relative overflow-hidden group" style="${sizeStyle}">
                            <div class="absolute inset-0 bg-radial-gradient(circle, rgba(16,185,129,0.02)_0%,_transparent_70%) opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div class="relative z-10 space-y-6">
                                <div class="flex justify-between items-center pb-2 border-b border-zinc-800/50">
                                    <div class="flex items-center gap-2">
                                        <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                                        <span class="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-wider">Milestone Timeline</span>
                                    </div>
                                    
                                    <div class="flex gap-1.5">
                                        ${['ALL', 'WORK', 'OSS'].map(tag => `
                                            <button data-tag="${tag}" class="filter-btn px-2 py-0.5 rounded text-[9px] font-bold font-mono transition-all duration-150 ${tag === 'ALL' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' : 'bg-zinc-900 text-zinc-500 border border-zinc-800 hover:text-zinc-400'}">
                                                ${tag}
                                            </button>
                                        `).join('')}
                                    </div>
                                </div>

                                <div class="timeline-container flex flex-col gap-3 max-h-[220px] overflow-y-auto pr-2 scrollbar-thin">
                                    ${milestones.map((m: any) => `
                                        <div class="timeline-item flex gap-3 items-start text-xs font-mono leading-relaxed transition-opacity duration-300" data-tag="${m.tag?.toUpperCase() || 'WORK'}">
                                            <span class="text-purple-400 font-extrabold shrink-0">${m.year}</span>
                                            <span class="text-zinc-500 shrink-0 font-bold">[${m.tag?.toUpperCase()}]</span>
                                            <span class="text-zinc-300 truncate">${m.title}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    `;
                    scriptsList.push(`
                        (() => {
                            const widget = document.getElementById('widget-${nodeId}');
                            if (!widget) return;
                            const buttons = widget.querySelectorAll('.filter-btn');
                            const items = widget.querySelectorAll('.timeline-item');

                            buttons.forEach(btn => {
                                btn.addEventListener('click', (e) => {
                                    e.preventDefault();
                                    const selectedTag = btn.getAttribute('data-tag');
                                    
                                    buttons.forEach(b => {
                                        if (b.getAttribute('data-tag') === selectedTag) {
                                            b.className = 'filter-btn px-2 py-0.5 rounded text-[9px] font-bold font-mono transition-all duration-150 bg-purple-500/20 text-purple-400 border border-purple-500/40';
                                        } else {
                                            b.className = 'filter-btn px-2 py-0.5 rounded text-[9px] font-bold font-mono transition-all duration-150 bg-zinc-900 text-zinc-500 border border-zinc-800 hover:text-zinc-400';
                                        }
                                    });

                                    items.forEach(item => {
                                        const itemTag = item.getAttribute('data-tag');
                                        if (selectedTag === 'ALL' || itemTag === selectedTag) {
                                            item.style.display = 'flex';
                                            setTimeout(() => { item.style.opacity = '1'; }, 10);
                                        } else {
                                            item.style.opacity = '0';
                                            setTimeout(() => { item.style.display = 'none'; }, 150);
                                        }
                                    });
                                });
                            });
                        })();
                    `);
                } else if (node.node_type === 'EndorsementsCarouselNode') {
                    const endorsements = data.endorsements || [
                        { name: 'Sarah Connor', text: 'Absolute game changer for portfolio pages!' },
                        { name: 'John Doe', text: 'The vector animations look incredibly premium.' }
                    ];
                    componentsHtml += `
                        <div id="widget-${nodeId}" class="w-full card mb-8 p-8 bg-[#0b0a14] border border-zinc-800/80 rounded-xl relative overflow-hidden group" style="${sizeStyle}">
                            <div class="absolute inset-0 bg-radial-gradient(circle, rgba(245,158,11,0.02)_0%,_transparent_70%) opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div class="relative z-10 space-y-6">
                                <div class="flex justify-between items-center pb-2 border-b border-zinc-800/50">
                                    <div class="flex items-center gap-2">
                                        <span class="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                                        <span class="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-wider">Endorsements</span>
                                    </div>
                                    <span class="endorsement-indicator text-[10px] font-mono text-zinc-500">1 / ${endorsements.length}</span>
                                </div>

                                <div class="endorsements-container relative min-h-[90px] flex items-center">
                                    ${endorsements.map((e: any, idx: number) => `
                                        <div class="endorsement-item absolute inset-0 flex flex-col justify-center transform ${idx === 0 ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 translate-x-4 pointer-events-none'}" data-slide-index="${idx}">
                                            <p class="text-sm text-zinc-300 font-mono italic leading-relaxed pr-2">"${e.text}"</p>
                                            <span class="text-xs text-purple-400 font-bold font-mono mt-2 text-right block">— ${e.name}</span>
                                        </div>
                                    `).join('')}
                                </div>

                                <div class="border-t border-zinc-800/30 pt-4 flex justify-end">
                                    <button class="cycle-btn px-4 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700/60 rounded text-[10px] font-mono text-zinc-400 font-extrabold hover:text-white uppercase transition-all duration-150">
                                        Cycle Testimonial
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                    scriptsList.push(`
                        (() => {
                            const widget = document.getElementById('widget-${nodeId}');
                            if (!widget) return;
                            const slides = widget.querySelectorAll('.endorsement-item');
                            const indicator = widget.querySelector('.endorsement-indicator');
                            let current = 0;
                            const total = ${endorsements.length};

                            const updateSlide = (nextIndex) => {
                                slides.forEach((slide, idx) => {
                                    if (idx === nextIndex) {
                                        slide.classList.remove('opacity-0', 'translate-x-4', 'pointer-events-none');
                                        slide.classList.add('opacity-100', 'translate-x-0', 'pointer-events-auto');
                                    } else {
                                        slide.classList.remove('opacity-100', 'translate-x-0', 'pointer-events-auto');
                                        slide.classList.add('opacity-0', 'translate-x-4', 'pointer-events-none');
                                    }
                                });
                                current = nextIndex;
                                indicator.textContent = (current + 1) + ' / ' + total;
                            };

                            widget.querySelector('.cycle-btn').addEventListener('click', (e) => {
                                e.preventDefault();
                                const targetIdx = current === total - 1 ? 0 : current + 1;
                                updateSlide(targetIdx);
                            });
                        })();
                    `);
                }
            });
        }

        const deployHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${username.toUpperCase()} | Calyx Studio Page</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
    <style>body { opacity: 0; transition: opacity 0.2s ease; }</style>
    <script src="https://cdn.tailwindcss.com" onload="document.body.style.opacity='1'"></script>
    
    <style>
        body {
            background-color: #050507;
            color: #f4f4f5;
            font-family: 'Outfit', sans-serif;
            margin: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            min-height: 100vh;
            box-sizing: border-box;
            background-image: radial-gradient(circle, rgba(139, 92, 246, 0.04) 1px, transparent 1px);
            background-size: 24px 24px;
        }
        .container {
            max-width: 800px;
            width: 100%;
            padding: 60px 20px;
        }

        /* Luxury Glassmorphism inline definitions */
        \${activeFlavor === 'LUXURY_GLASSMORPHISM' ? \`
        .card {
            background: #0b0a14;
            border: 1px solid rgba(139, 92, 246, 0.15);
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.05);
            backdrop-filter: blur(8px);
            border-radius: 16px;
            padding: 32px;
            position: relative;
        }
        .slide-item {
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        \` : ''}

        /* Retro Terminal inline definitions */
        \${activeFlavor === 'RETRO_TERMINAL' ? \`
        body {
            font-family: 'JetBrains Mono', monospace;
        }
        .card {
            background: #050507;
            border: 1px solid #10b981;
            box-shadow: 0 0 15px rgba(16, 185, 129, 0.15);
            border-radius: 4px;
            padding: 32px;
            position: relative;
        }
        .slide-item {
            transition: opacity 0.075s;
        }
        \` : ''}

        /* Scandi Minimalist inline definitions */
        \${activeFlavor === 'SCANDI_MINIMALIST' ? \`
        .card {
            background: #050507;
            border: 1px solid #12111f;
            box-shadow: none;
            border-radius: 0px;
            padding: 32px;
            position: relative;
        }
        .slide-item {
            transition: opacity 0.3s ease-out;
        }
        \` : ''}
    </style>
</head>
<body>
    <div class="container">
        <!-- Rendered SSG Canvas components stack -->
        ${componentsHtml}

        <!-- Secure contact relay capture form -->
        <div class="card p-8 bg-[#0b0a14] border border-zinc-800/80 rounded-xl relative overflow-hidden group mb-8">
            <div class="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="relative z-10 space-y-4">
                <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse"></span>
                    <span class="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-wider">Secure Contact Capture</span>
                </div>
                
                <form id="contact-form" class="space-y-4">
                    <!-- Invisible Honeypot Field -->
                    <input type="text" name="_calyx_hp" style="display:none" tabindex="-1" autocomplete="off">
                    
                    <div>
                        <label class="block text-[9px] uppercase font-bold tracking-widest text-zinc-500 mb-1">Your Handle</label>
                        <input type="text" id="form-handle" name="handle" required placeholder="e.g. anonymous-coder" class="w-full bg-[#12111f] border border-[rgba(139,92,246,0.1)] focus:border-purple-500 text-xs px-3 py-2 rounded text-zinc-200 outline-none font-mono">
                    </div>
                    <div>
                        <label class="block text-[9px] uppercase font-bold tracking-widest text-zinc-500 mb-1">Secure Message</label>
                        <textarea id="form-msg" name="msg" rows="4" required placeholder="Type secure transmission here..." class="w-full bg-[#12111f] border border-[rgba(139,92,246,0.1)] focus:border-purple-500 text-xs px-3 py-2 rounded text-zinc-200 outline-none font-sans resize-none"></textarea>
                    </div>
                    <button type="submit" class="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold py-2.5 rounded shadow-[0_0_15px_rgba(139,92,246,0.15)] transition-all duration-200">
                        Relay Secure Message
                    </button>
                </form>
                <div id="form-status" class="mt-4 text-[10px] font-mono"></div>
            </div>
        </div>
    </div>

    <!-- Namespaced standalone components script queries -->
    <script>
        ${scriptsList.join('\n')}
    </script>

    <!-- Contact Form capturer interconnect script -->
    <script>
        document.getElementById('contact-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const hp = e.target.querySelector('input[name="_calyx_hp"]').value;
            const handle = document.getElementById('form-handle').value;
            const msg = document.getElementById('form-msg').value;
            const statusDiv = document.getElementById('form-status');
            
            statusDiv.style.color = '#8b5cf6';
            statusDiv.textContent = 'TRANSMITTING MESSAGE VIA EDGE INTERCONNECT...';
            
            try {
                // Point to same port/host route for integrated backend
                const baseUrl = window.location.origin;
                const url = baseUrl + '/api/v1/forms/capture/${username}';
                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ _calyx_hp: hp, handle, msg })
                });
                const data = await res.json();
                if (res.ok && data.success) {
                    statusDiv.style.color = '#10b981';
                    statusDiv.textContent = 'MESSAGE RELAYED SUCCESSFULLY VIA EDGE INTERCONNECT!';
                    document.getElementById('form-handle').value = '';
                    document.getElementById('form-msg').value = '';
                } else {
                    statusDiv.style.color = '#ef4444';
                    statusDiv.textContent = 'TRANSMISSION FAILED: ' + (data.error || 'Server error');
                }
            } catch (err) {
                statusDiv.style.color = '#ef4444';
                statusDiv.textContent = 'CONNECTION TIMEOUT: CAPTURED RELAY EXCEPTION';
            }
        });
    </script>
</body>
</html>`;

        const base64Html = Buffer.from(deployHtml).toString('base64');

        console.log(`--- [GIT DEPLOY] CHECKING REPOSITORY EXISTANCE: ${username}/${repoName} ---`);
        let repoExists = false;
        try {
            const checkRes = await fetch(`https://api.github.com/repos/${username}/${repoName}`, {
                headers: ghHeaders
            });
            if (checkRes.status === 200) {
                repoExists = true;
            }
        } catch (err) {
            console.warn('Repository check error:', err);
        }

        if (!repoExists) {
            console.log(`--- [GIT DEPLOY] REPOSITORY NOT FOUND. PROVISIONING NEW REPO: ${repoName} ---`);
            const createRes = await fetch('https://api.github.com/user/repos', {
                method: 'POST',
                headers: {
                    ...ghHeaders,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: repoName,
                    auto_init: true,
                    private: false,
                    description: 'Calyx Profile Matrix - Automated SSG Page Deployment Portfolio'
                })
            });

            if (!createRes.ok) {
                const errBody = await createRes.text();
                throw new Error(`Failed to create repository: ${errBody}`);
            }

            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        let htmlSha: string | undefined;
        try {
            const getHtmlRes = await fetch(`https://api.github.com/repos/${username}/${repoName}/contents/index.html`, {
                headers: ghHeaders
            });
            if (getHtmlRes.status === 200) {
                const htmlData: any = await getHtmlRes.json();
                htmlSha = htmlData.sha;
            }
        } catch (err) {
            console.warn('index.html SHA lookup failed:', err);
        }

        console.log('--- [GIT DEPLOY] COMMITTING INDEX.HTML PRODUCTION ASSET ---');
        const commitHtmlRes = await fetch(`https://api.github.com/repos/${username}/${repoName}/contents/index.html`, {
            method: 'PUT',
            headers: {
                ...ghHeaders,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'Deploy static web matrix portfolio via CPM automated SSG compiler',
                content: base64Html,
                sha: htmlSha
            })
        });

        if (!commitHtmlRes.ok) {
            const errText = await commitHtmlRes.text();
            throw new Error(`Failed to commit index.html: ${errText}`);
        }

        const workflowYaml = `name: CPM Self Hydrate
on:
  schedule:
    - cron: '0 */6 * * *'
  workflow_dispatch:
jobs:
  hydrate:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Hydration
        run: |
          curl -X POST \${window.location.origin}/api/sync/hydrate -H "Content-Type: application/json" -d '{"username": "${username}"}'
`;
        const base64Workflow = Buffer.from(workflowYaml).toString('base64');

        let workflowSha: string | undefined;
        try {
            const getWfRes = await fetch(`https://api.github.com/repos/${username}/${repoName}/contents/.github/workflows/cpm_self_hydrate.yml`, {
                headers: ghHeaders
            });
            if (getWfRes.status === 200) {
                const wfData: any = await getWfRes.json();
                workflowSha = wfData.sha;
            }
        } catch (err) {
            console.warn('Workflow lookup failed:', err);
        }

        console.log('--- [GIT DEPLOY] COMMITTING CPM_SELF_HYDRATE.YML WORKFLOW ---');
        await fetch(`https://api.github.com/repos/${username}/${repoName}/contents/.github/workflows/cpm_self_hydrate.yml`, {
            method: 'PUT',
            headers: {
                ...ghHeaders,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'Provision Avenue B automated self hydration workflow',
                content: base64Workflow,
                sha: workflowSha
            })
        });

        return NextResponse.json({
            success: true,
            message: 'Automated Git Pages portfolio provisioned and deployed successfully.',
            repository: `https://github.com/${username}/${repoName}`,
            pagesUrl: `https://${username}.github.io/`
        });
    } catch (error: any) {
        console.error('❌ PAGES DEPLOY PIPELINE EXCEPTION:', error);
        return NextResponse.json(
            { error: 'Git Pages provisioning workflow failed.', message: error.message },
            { status: 500 }
        );
    }
}
