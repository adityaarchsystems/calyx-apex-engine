import { ThemeFlavor } from '@cpm/types';
import { FlavorColors } from './flavors.js';
import fs from 'fs';
import path from 'path';

const getTechSvgPath = (tech: string, isMinimalist: boolean): string | null => {
    const key = tech.toLowerCase().replace(/[^a-z0-9]/g, '');
    let vaultDir = path.join(process.cwd(), 'assets-vault', 'tech-iconography');
    if (!fs.existsSync(vaultDir)) {
        vaultDir = path.join(process.cwd(), '../../assets-vault', 'tech-iconography');
    }
    
    const fileOptions = isMinimalist
        ? [`${key}-monochrome.svg`, `${key}.svg`]
        : [`${key}.svg`, `${key}-monochrome.svg`];

    for (const file of fileOptions) {
        const fullPath = path.join(vaultDir, file);
        if (fs.existsSync(fullPath)) {
            try {
                const content = fs.readFileSync(fullPath, 'utf8');
                const match = content.match(/<path[^>]+d="([^"]+)"/i) || content.match(/d="([^"]+)"/i);
                if (match && match[1]) {
                    return match[1];
                }
            } catch (err) {
                console.error(`Failed to read or parse SVG path for tech ${tech}:`, err);
            }
        }
    }
    return null;
};

const TECH_GLYPHS: Record<string, { color: string }> = {
    react: {
        color: "#61dafb"
    },
    typescript: {
        color: "#3178c6"
    },
    tailwind: {
        color: "#38bdf8"
    },
    nodejs: {
        color: "#339933"
    },
    postgres: {
        color: "#336791"
    },
    rust: {
        color: "#ea580c"
    },
    go: {
        color: "#00add8"
    },
    kubernetes: {
        color: "#326ce5"
    },
    redis: {
        color: "#dc2626"
    }
};

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

interface PackageLanguageMap {
  [languageName: string]: number;
}

interface LanguageData {
  lang: string;
  pct: number;
}

/**
 * Shared mathematical utility to clamp raw language metrics to top N elements
 * and aggregate remaining minor records under 'Other' to protect layout dimensions.
 */
function clampLanguages(languages: PackageLanguageMap | undefined | null, maxLanguages: number = 3): LanguageData[] {
  if (!languages) return [];
  
  const list = Object.entries(languages).map(([lang, pct]) => ({
    lang,
    pct: Number(pct)
  }));
  
  // Sort descending by percentage
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


// =========================================================
// ATOMIC PRIMITIVE SVG FACTORY MACROS
// =========================================================

export function drawBadgePill(
  x: number,
  y: number,
  text: string,
  badgeBg: string,
  badgeStroke: string,
  badgeColor: string,
  fontStack: string
): string {
  const charWidth = 6.2;
  const badgeW = Math.max(45, text.length * charWidth + 14);
  return `
    <rect x="${x}" y="${y}" width="${badgeW}" height="18" rx="4" fill="${badgeBg}" stroke="${badgeStroke}" stroke-width="1" />
    <text x="${x + badgeW / 2}" y="${y + 9}" fill="${badgeColor}" font-size="7.5" font-weight="900" font-family="${fontStack}" text-anchor="middle" dominant-baseline="central">${text.toUpperCase()}</text>
  `;
}

export function drawProgressBar(
  x: number,
  y: number,
  width: number,
  height: number,
  progress: number,
  accentColor: string,
  trackBg: string
): string {
  const filledWidth = Math.round((width * Math.min(100, Math.max(0, progress))) / 100);
  return `
    <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${height / 2}" fill="${trackBg}" />
    <rect x="${x}" y="${y}" width="${filledWidth}" height="${height}" rx="${height / 2}" fill="${accentColor}" />
  `;
}

export function drawMetricRow(
  x: number,
  y: number,
  label: string,
  value: string,
  textPrimary: string,
  textSecondary: string,
  fontStack: string,
  valFont: string
): string {
  return `
    <text x="${x}" y="${y}" fill="${textSecondary}" font-size="9" font-weight="bold" font-family="${fontStack}" dominant-baseline="central">${label.toUpperCase()}</text>
    <text x="${x + 130}" y="${y}" fill="${textPrimary}" font-size="11" font-weight="bold" font-family="${valFont}" dominant-baseline="central">${value}</text>
  `;
}

// Implement a jitter-protected cryptographic string hashing utility to eliminate color clashing parameters
export const getLanguageColorHash = (name: string): string => {
  if (name.toLowerCase() === 'other') {
    return '#71717a';
  }
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  // Step-Jitter: Use length and character variance to derive high-contrast Saturation and Lightness
  const saturation = 60 + (name.length % 4) * 8;
  const lightness = 45 + (name.charCodeAt(0) % 3) * 5;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

// Injection of Proxy-Safe Declarative SVG Animation Node elements
export const drawNativePulsingTrack = (x: number, y: number, width: number, height: number): string => {
  return `
    <rect x="${x}" y="${y}" width="${width}" height="${height}" fill="#8b5cf6" opacity="0.8" rx="${height / 2}" style="animation: serverGlowPulse 2s infinite ease-in-out;">
      <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2s" repeatCount="indefinite" />
    </rect>
  `;
};

export function drawHorizontalBarGraph(
  x: number,
  y: number,
  width: number,
  height: number,
  data: { lang: string; pct: number }[],
  colorMap: Record<string, string>,
  trackBg: string
): string {
  let segments = `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="4" fill="${trackBg}" />`;
  let currentX = x;
  
  data.forEach((item) => {
    const segW = Math.round((width * item.pct) / 100);
    if (segW > 0) {
      const color = getLanguageColorHash(item.lang);
      segments += `<rect x="${currentX}" y="${y}" width="${segW}" height="${height}" rx="1" fill="${color}" />`;
      currentX += segW;
    }
  });
  return segments;
}

export function compileCanvasToSvg(payload: { nodes: any[]; flavor: string }): string {
    const { nodes, flavor } = payload;
    
    if (!nodes || nodes.length === 0) {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200" width="100%" height="100%" style="background:#0d0c18; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
            <rect width="100%" height="100%" fill="#0d0c18" />
            <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" fill="#a855f7" font-size="15" font-weight="bold">No Matrix Nodes Configured</text>
        </svg>`;
    }

  // Dynamic boundary calculation to avoid cropping issues
  const padding = 40;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  nodes.forEach((node) => {
    const x = node.position_x || 0;
    const y = node.position_y || 0;
    
    let w = 280;
    let h = 90;
    
    if (
      node.node_type === 'StatsNode' || 
      node.node_type === 'PackageReleaseNode' || 
      node.node_type === 'TestSuiteNode' || 
      node.node_type === 'LeetCodeNode' || 
      node.node_type === 'WakaTimeNode' ||
      node.node_type === 'BioNode'
    ) {
      w = 320;
      h = 128;
    } else if (node.node_type === 'TechStackNode' || node.node_type === 'KineticMediaBox' || node.node_type === 'CustomKineticMediaBox') {
      h = 95;
    } else if (node.node_type === 'ActiveProjectsNode') {
      h = 95;
    } else if (node.node_type === 'HeaderNode') {
      h = 80;
    } else if (node.node_type === 'ProductShowcaseNode') {
      w = 320;
      h = 256;
    } else if (node.node_type === 'LiveGuestbookNode') {
      w = 320;
      h = 192;
    } else if (node.node_type === 'ProjectModalSliderNode') {
      w = 320;
      h = 192;
    } else if (node.node_type === 'FilterableTimelineNode') {
      w = 320;
      h = 224;
    } else if (node.node_type === 'EndorsementsCarouselNode') {
      w = 320;
      h = 176;
    }
    
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x + w > maxX) maxX = x + w;
    if (y + h > maxY) maxY = y + h;
  });

  const width = (maxX - minX) + padding * 2;
  const height = (maxY - minY) + padding * 2;
  const viewBoxX = minX - padding;
  const viewBoxY = minY - padding;

  // Premium typography stacks
  const fontStackSans = "'Inter', 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  const fontStackMono = "'JetBrains Mono', 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";

  // Choose active stack based on flavor identity
  const activeFontStack = (flavor === 'RETRO_TERMINAL' || flavor === 'EIGHT_BIT_GIT')
    ? fontStackMono
    : fontStackSans;

  const theme = FlavorColors[flavor as keyof typeof FlavorColors] || FlavorColors.LUXURY_GLASSMORPHISM;
  let panelBg = theme.panelBg;
  let borderStroke = theme.borderStroke;
  let textPrimary = theme.textPrimary;
  let textSecondary = theme.textSecondary;
  let accentColor = theme.accentColor;
  let glowFilter = '';

  if (flavor === 'LUXURY_GLASSMORPHISM') {
    glowFilter = 'filter="url(#glowFilter)"';
  }

    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBoxX} ${viewBoxY} ${width} ${height}" width="${width}" height="${height}" style="background:#0d0c18; font-family:${activeFontStack};">`;
    
    svgContent += `<defs>`;
    svgContent += `
        <style>
            @keyframes serverGlowPulse {
                0% { opacity: 0.4; }
                50% { opacity: 0.9; }
                100% { opacity: 0.4; }
            }
            @keyframes serverBorderPulse {
                0% { stroke-opacity: 0.3; }
                50% { stroke-opacity: 0.9; }
                100% { stroke-opacity: 0.3; }
            }
            @keyframes serverBadgePulse {
                0% { opacity: 0.5; }
                50% { opacity: 1.0; }
                100% { opacity: 0.5; }
            }
            @keyframes pulseGlow {
                0% { filter: drop-shadow(0 0 2px rgba(168, 85, 247, 0.3)); }
                50% { filter: drop-shadow(0 0 8px rgba(168, 85, 247, 0.6)); }
                100% { filter: drop-shadow(0 0 2px rgba(168, 85, 247, 0.3)); }
            }
            @keyframes typingEffect {
                from { width: 0; }
                to { width: 100%; }
            }
        </style>
    `;
    if (flavor === 'LUXURY_GLASSMORPHISM') {
        svgContent += `
            <linearGradient id="glassBorder" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#a855f7" stop-opacity="0.5" />
                <stop offset="100%" stop-color="#10b981" stop-opacity="0.1" />
            </linearGradient>
            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
        `;
        borderStroke = 'url(#glassBorder)';
    }
    svgContent += `
        <clipPath id="mediaClip">
            <rect x="2" y="2" width="276" height="91" rx="6" />
        </clipPath>
    </defs>`;

    // Draw pure black backplane floor
    svgContent += `<rect x="${viewBoxX}" y="${viewBoxY}" width="${width}" height="${height}" fill="#0d0c18" />`;

  // Draw node configurations
  nodes.forEach((node) => {
    const x = node.position_x || 0;
    const y = node.position_y || 0;
    const data = node.config_data || {};

    svgContent += `<g transform="translate(${x}, ${y})" ${glowFilter}>`;

    if (node.node_type === 'HeaderNode') {
      const title = data.title || 'Profile Header';
      const org = data.org || 'Organization';
      
      svgContent += `<rect width="280" height="80" rx="8" fill="${panelBg}" stroke="${borderStroke}" stroke-width="1.5" />`;
      svgContent += `<text x="20" y="32" fill="${textPrimary}" font-size="15" font-weight="900" font-family="${activeFontStack}" dominant-baseline="central">${title}</text>`;
      svgContent += `<text x="20" y="54" fill="${textSecondary}" font-size="9" font-weight="bold" letter-spacing="1.5" opacity="0.8" font-family="${activeFontStack}" dominant-baseline="central">${org.toUpperCase()}</text>`;
    
    } else if (node.node_type === 'StatsNode') {
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

      const getMetric = (columnNum: 1 | 2) => {
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

      const col1 = getMetric(1);
      const col2 = getMetric(2);

      const val1 = col1.val;
      const label1 = col1.label;
      const val2 = col2.val;
      const label2 = col2.label;

      let cardBg = panelBg;
      let cardStroke = borderStroke;
      let valColor = textPrimary;
      
      let badgeBg = '#0d1612';
      let badgeStroke = 'rgba(16, 185, 129, 0.2)';
      let badgeColor = '#34d399';

      if (isLive) {
        cardBg = theme.badgeBg;
        cardStroke = theme.badgeStroke;
        valColor = theme.badgeColor;
        badgeBg = theme.badgeBg;
        badgeStroke = theme.badgeStroke;
        badgeColor = theme.badgeColor;
      }

      svgContent += `<rect width="320" height="128" rx="8" fill="${cardBg}" stroke="${cardStroke}" stroke-width="1.5" />`;
      
      if (isLive) {
        svgContent += `<rect x="24" y="-8" width="64" height="16" rx="4" fill="${badgeBg}" stroke="${badgeStroke}" stroke-width="1" />`;
        svgContent += `<circle cx="34" cy="0" r="2.5" fill="${badgeColor}" />`;
        svgContent += `<text x="42" y="0" fill="${badgeColor}" font-size="7" font-weight="900" font-family="${activeFontStack}" letter-spacing="1" dominant-baseline="central">LIVE SYNC</text>`;
      }

      svgContent += `<text x="24" y="54" fill="${valColor}" font-size="28" font-weight="900" font-family="${fontStackMono}" letter-spacing="-0.04em" dominant-baseline="central">${val1}</text>`;
      svgContent += `<text x="24" y="88" fill="${textSecondary}" font-size="9" font-weight="bold" letter-spacing="1" opacity="0.6" font-family="${activeFontStack}" dominant-baseline="central">${label1.toUpperCase()}</text>`;
      
      svgContent += `<line x1="160" y1="32" x2="160" y2="96" stroke="${isLive ? badgeStroke : (flavor === 'RETRO_TERMINAL' ? borderStroke : 'rgba(255,255,255,0.06)')}" stroke-width="1" />`;
      
      svgContent += `<text x="184" y="54" fill="${valColor}" font-size="28" font-weight="900" font-family="${fontStackMono}" letter-spacing="-0.04em" dominant-baseline="central">${val2}</text>`;
      svgContent += `<text x="184" y="88" fill="${textSecondary}" font-size="9" font-weight="bold" letter-spacing="1" opacity="0.6" font-family="${activeFontStack}" dominant-baseline="central">${label2.toUpperCase()}</text>`;
    
    } else if (node.node_type === 'TechStackNode') {
        const techs = (data.techs || []).filter(Boolean);
        const iconographyStyle = data.iconographyStyle || 'MAX_FIDELITY_STANDARD';
        const isMinimalist = iconographyStyle === 'MAX_FIDELITY_MINIMALIST';
        
        svgContent += `<rect width="280" height="95" rx="8" fill="${panelBg}" stroke="${borderStroke}" stroke-width="1.5" />`;
        svgContent += `<text x="20" y="24" fill="${textSecondary}" font-size="9" font-weight="bold" letter-spacing="1" opacity="0.7" font-family="${activeFontStack}" dominant-baseline="central">STACK MATRIX</text>`;
        
        if (techs.length > 0) {
            let currentX = 20;
            let currentY = 40;
            techs.forEach((tech: string) => {
                const key = tech.toLowerCase();
                const normKey = key === 'node.js' || key === 'node' ? 'nodejs' : (key === 'postgresql' ? 'postgres' : key);
                const glyph = TECH_GLYPHS[normKey];
                
                // Calculate dynamic pill width: tech.length * 6.2 + 24
                const badgeW = tech.length * 6.2 + 24;
                
                if (currentX + badgeW > 260) {
                    currentX = 20;
                    currentY += 24;
                }
                if (currentY < 85) {
                    const badgeBgColor = flavor === 'RETRO_TERMINAL' ? '#000' : 'rgba(255,255,255,0.03)';
                    const badgeStrokeColor = isMinimalist ? 'rgba(255,255,255,0.08)' : (glyph ? glyph.color : borderStroke);
                    
                    svgContent += `<rect x="${currentX}" y="${currentY}" width="${badgeW}" height="18" rx="4" fill="${badgeBgColor}" stroke="${badgeStrokeColor}" stroke-width="1" opacity="0.85" />`;
                    
                    const activePath = getTechSvgPath(tech, isMinimalist);
                    const iconColor = isMinimalist ? textSecondary : (glyph ? glyph.color : '#a1a1aa');
                    
                    if (activePath) {
                        svgContent += `
                            <g transform="translate(${currentX + 6}, ${currentY + 4}) scale(0.45)">
                                <path d="${activePath}" fill="${iconColor}" />
                            </g>
                        `;
                        svgContent += `<text x="${currentX + 18}" y="${currentY + 9}" fill="${iconColor}" font-size="8" font-weight="bold" font-family="${activeFontStack}" dominant-baseline="central">${tech}</text>`;
                    } else {
                        svgContent += `<text x="${currentX + (badgeW / 2)}" y="${currentY + 9}" fill="${iconColor}" font-size="8" font-weight="bold" font-family="${activeFontStack}" text-anchor="middle" dominant-baseline="central">${tech}</text>`;
                    }
                    
                    currentX += badgeW + 6;
                }
            });
        } else {
            svgContent += `<text x="20" y="48" fill="${textSecondary}" font-size="10" font-style="italic" font-family="${activeFontStack}" dominant-baseline="central">No tools listed</text>`;
        }
      
    } else if (node.node_type === 'ActiveProjectsNode') {
      const name = data.name || 'Project Name';
      const progress = Math.min(100, Math.max(0, parseInt(data.progress, 10) || 0));

      svgContent += `<rect width="280" height="95" rx="8" fill="${panelBg}" stroke="${borderStroke}" stroke-width="1.5" />`;
      svgContent += `<text x="20" y="24" fill="${textSecondary}" font-size="9" font-weight="bold" letter-spacing="1" opacity="0.7" font-family="${activeFontStack}" dominant-baseline="central">ACTIVE ENGINEERING PIPELINE</text>`;
      svgContent += `<text x="20" y="44" fill="${textPrimary}" font-size="12" font-weight="black" font-family="${activeFontStack}" dominant-baseline="central">${name}</text>`;
      svgContent += `<text x="260" y="24" fill="${accentColor}" font-size="10" font-weight="black" font-family="${fontStackMono}" text-anchor="end" dominant-baseline="central">${progress}%</text>`;
      
      svgContent += drawProgressBar(20, 64, 240, 6, progress, accentColor, flavor === 'RETRO_TERMINAL' ? '#000' : 'rgba(255,255,255,0.06)');

    } else if (node.node_type === 'PackageReleaseNode') {
      const isLive = data.hydrationMode === 'LIVE_API';
      const pkgName = data.packageName || 'express';
      const registry = data.registry || 'NPM';
      const displayLicense = data.displayLicense !== false;

      const version = isLive ? (data.hydrated_values?.version || '0.0.0') : (data.static_values?.version || '1.0.0');
      const downloads = isLive ? (data.hydrated_values?.downloads || 0) : (data.static_values?.downloads || '1.2M');

      svgContent += `<rect width="320" height="128" rx="8" fill="${panelBg}" stroke="${borderStroke}" stroke-width="1.5" />`;
      svgContent += drawBadgePill(24, 20, registry, flavor === 'RETRO_TERMINAL' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255,255,255,0.06)', borderStroke, textPrimary, activeFontStack);

      if (displayLicense) {
        svgContent += `<text x="296" y="29" fill="${textSecondary}" font-size="8" font-weight="bold" font-family="${activeFontStack}" text-anchor="end" letter-spacing="1" dominant-baseline="central">MIT LICENSE</text>`;
      }

      svgContent += `<text x="24" y="60" fill="${textPrimary}" font-size="13" font-weight="black" font-family="${fontStackMono}" dominant-baseline="central">${pkgName}</text>`;
      svgContent += `<text x="24" y="96" fill="${accentColor}" font-size="22" font-weight="900" font-family="${fontStackMono}" dominant-baseline="central">v${version}</text>`;
      svgContent += `<text x="296" y="96" fill="${textSecondary}" font-size="10" font-weight="bold" font-family="${activeFontStack}" text-anchor="end" dominant-baseline="central">(${downloads} dl)</text>`;

    } else if (node.node_type === 'TestSuiteNode') {
      const isLive = data.hydrationMode === 'LIVE_API';
      const repo = data.repositoryPath || 'facebook/react';
      const branch = data.branchTarget || 'main';

      const passing = isLive ? (data.hydrated_values?.passingTests ?? 0) : parseInt(data.static_values?.passingTests || '94', 10);
      const total = isLive ? (data.hydrated_values?.totalTests ?? 100) : parseInt(data.static_values?.totalTests || '100', 10);
      const status = isLive ? (data.hydrated_values?.suiteStatus || 'PASSING') : (data.static_values?.suiteStatus || 'PASSING');

      const percent = total > 0 ? Math.round((passing / total) * 100) : 0;
      const isPending = status === 'PENDING' || status === 'RUNNING';

      let statusColor = '#10b981';
      let statusBg = 'rgba(16, 185, 129, 0.1)';
      let statusStroke = 'rgba(16, 185, 129, 0.3)';

      if (status === 'FAILING') {
        statusColor = '#ef4444';
        statusBg = 'rgba(239, 68, 68, 0.1)';
        statusStroke = 'rgba(239, 68, 68, 0.3)';
      } else if (isPending) {
        statusColor = '#8b5cf6';
        statusBg = 'rgba(139, 92, 246, 0.1)';
        statusStroke = 'rgba(139, 92, 246, 0.3)';
      }

      let customBorder = borderStroke;
      if (isPending) {
        customBorder = '#8b5cf6';
      }

      if (isPending) {
        svgContent += `
          <rect width="320" height="128" rx="8" fill="${panelBg}" stroke="#8b5cf6" stroke-width="1.5" style="animation: serverBorderPulse 2s infinite ease-in-out;">
            <animate attributeName="stroke-opacity" values="0.3;0.9;0.3" dur="2s" repeatCount="indefinite" />
          </rect>
        `;
      } else {
        svgContent += `<rect width="320" height="128" rx="8" fill="${panelBg}" stroke="${customBorder}" stroke-width="1.5" />`;
      }
      svgContent += `<text x="24" y="24" fill="${textSecondary}" font-size="8" font-weight="bold" letter-spacing="1" font-family="${activeFontStack}" dominant-baseline="central">CI TELEMETRY SUITE</text>`;
      
      if (isPending) {
        const badgeW = Math.max(45, status.length * 6.2 + 14);
        svgContent += `
          <g>
            <rect x="236" y="15" width="${badgeW}" height="18" rx="4" fill="${statusBg}" stroke="${statusStroke}" stroke-width="1" style="animation: serverBadgePulse 1.5s infinite ease-in-out;">
              <animate attributeName="opacity" values="0.5;1.0;0.5" dur="1.5s" repeatCount="indefinite" />
            </rect>
            <text x="${236 + badgeW / 2}" y="${15 + 9}" fill="${statusColor}" font-size="7.5" font-weight="900" font-family="${fontStackMono}" text-anchor="middle" dominant-baseline="central">${status.toUpperCase()}</text>
          </g>
        `;
      } else {
        svgContent += drawBadgePill(236, 15, status, statusBg, statusStroke, statusColor, fontStackMono);
      }

      svgContent += `<text x="24" y="52" fill="${textPrimary}" font-size="11" font-weight="bold" font-family="${fontStackMono}" dominant-baseline="central">${repo}</text>`;
      svgContent += `<text x="24" y="70" fill="${textSecondary}" font-size="8" font-family="${activeFontStack}" dominant-baseline="central">branch: ${branch}</text>`;

      svgContent += `<text x="24" y="92" fill="${textSecondary}" font-size="8" font-weight="bold" font-family="${activeFontStack}" dominant-baseline="central">Passing: ${passing}/${total}</text>`;
      svgContent += `<text x="296" y="92" fill="${statusColor}" font-size="9" font-weight="bold" font-family="${fontStackMono}" text-anchor="end" dominant-baseline="central">${percent}%</text>`;

      if (isPending) {
        svgContent += `<rect x="24" y="104" width="272" height="6" rx="3" fill="${flavor === 'RETRO_TERMINAL' ? '#000' : 'rgba(255,255,255,0.06)'}" />`;
        svgContent += drawNativePulsingTrack(24, 104, Math.round((272 * percent) / 100), 6);
      } else {
        svgContent += drawProgressBar(24, 104, 272, 6, percent, statusColor, flavor === 'RETRO_TERMINAL' ? '#000' : 'rgba(255,255,255,0.06)');
      }

    } else if (node.node_type === 'LeetCodeNode') {
      const isLive = data.hydrationMode === 'LIVE_API';
      const username = data.leetcodeUsername || 'calyx-dev';

      const solved = isLive ? (data.hydrated_values?.solvedCount || 0) : parseInt(data.static_values?.solvedCount || '432', 10);
      const ranking = isLive ? (data.hydrated_values?.activeRanking || 0) : parseInt(data.static_values?.activeRanking || '124500', 10);

      svgContent += `<rect width="320" height="128" rx="8" fill="${panelBg}" stroke="${borderStroke}" stroke-width="1.5" />`;

      svgContent += `<text x="24" y="38" fill="${accentColor}" font-size="28" font-weight="900" font-family="${fontStackMono}" dominant-baseline="central">${solved}</text>`;
      svgContent += `<text x="24" y="72" fill="${textSecondary}" font-size="8" font-weight="bold" letter-spacing="1" font-family="${activeFontStack}" dominant-baseline="central">SOLVED MILESTONES</text>`;
      svgContent += `<text x="24" y="90" fill="${textSecondary}" font-size="7" opacity="0.6" font-family="${fontStackMono}" dominant-baseline="central">handle: ${username}</text>`;

      svgContent += `<line x1="160" y1="24" x2="160" y2="104" stroke="${flavor === 'RETRO_TERMINAL' ? borderStroke : 'rgba(255,255,255,0.06)'}" stroke-width="1" />`;

      svgContent += `<text x="184" y="38" fill="${textPrimary}" font-size="20" font-weight="900" font-family="${fontStackMono}" dominant-baseline="central">#${ranking.toLocaleString()}</text>`;
      svgContent += `<text x="184" y="72" fill="${textSecondary}" font-size="8" font-weight="bold" letter-spacing="1" font-family="${activeFontStack}" dominant-baseline="central">ACTIVE RANKING</text>`;

    } else if (node.node_type === 'WakaTimeNode') {
      const isLive = data.hydrationMode === 'LIVE_API';
      const rawLanguages = isLive ? (data.hydrated_values?.languages || {}) : (data.static_values?.languages || { TypeScript: 45, Rust: 30, Go: 15, Python: 10 });
      const weeklyHours = isLive ? (data.hydrated_values?.weeklyTotalHours || 0) : 34.5;

      const clamped = clampLanguages(rawLanguages, 3);

      svgContent += `<rect width="320" height="128" rx="8" fill="${panelBg}" stroke="${borderStroke}" stroke-width="1.5" />`;
      svgContent += `<text x="24" y="24" fill="${textSecondary}" font-size="8" font-weight="bold" letter-spacing="1" font-family="${activeFontStack}" dominant-baseline="central">DEVELOPER CODE VELOCITY</text>`;
      svgContent += `<text x="296" y="24" fill="${textPrimary}" font-size="9" font-weight="bold" font-family="${fontStackMono}" text-anchor="end" dominant-baseline="central">${weeklyHours} hrs/wk</text>`;

      svgContent += drawHorizontalBarGraph(24, 48, 272, 12, clamped, {}, flavor === 'RETRO_TERMINAL' ? '#000' : 'rgba(255,255,255,0.06)');

      if (clamped.length > 0) {
        const spacing = 272 / clamped.length;
        clamped.forEach((item, index) => {
          const itemX = 24 + index * spacing + 6;
          const bulletColor = getLanguageColorHash(item.lang);
          svgContent += `<circle cx="${itemX}" cy="96" r="3.5" fill="${bulletColor}" />`;
          svgContent += `<text x="${itemX + 8}" y="96" fill="${textPrimary}" font-size="8" font-family="${fontStackMono}" dominant-baseline="central">${item.lang}: <tspan fill="${accentColor}" font-weight="bold">${item.pct}%</tspan></text>`;
        });
      }
    } else if (node.node_type === 'ProductShowcaseNode') {
      const projectTitle = data.projectTitle || 'Developer Portfolio Matrix';
      const externalUrl = data.externalUrl || 'github.com/calyx-dev/portfolio-matrix';
      const projectDescription = data.projectDescription || 'A high-fidelity automated open-source profile widget compiler and dynamic SVG rendering engine.';
      const displayFlavor = data.displayFlavor || 'MINI_BROWSER';
      const staticValues = data.static_values || {};
      const rawTags = staticValues.stackTags || [];
      const tags = rawTags.length > 0 ? rawTags : ['OSS'];
      const visibleTags = tags.slice(0, 3);
      const remainingCount = tags.length - 3;
      const loc = staticValues.linesOfCode || 'Active Showcase';

      if (displayFlavor === 'MINI_BROWSER') {
        svgContent += `<rect width="320" height="256" rx="8" fill="${panelBg}" stroke="${borderStroke}" stroke-width="1.5" />`;
        
        svgContent += `
          <rect x="0" y="0" width="320" height="28" rx="8" fill="rgba(255,255,255,0.03)" />
          <rect x="0" y="27" width="320" height="1" fill="rgba(255,255,255,0.06)" />
          <circle cx="14" cy="14" r="3" fill="#ef4444" opacity="0.8" />
          <circle cx="24" cy="14" r="3" fill="#f59e0b" opacity="0.8" />
          <circle cx="34" cy="14" r="3" fill="#10b981" opacity="0.8" />
          <rect x="52" y="5" width="250" height="18" rx="4" fill="rgba(0,0,0,0.4)" stroke="rgba(255,255,255,0.05)" stroke-width="1" />
          <text x="60" y="14" fill="${textSecondary}" font-size="7.5" font-family="${fontStackMono}" dominant-baseline="central">${externalUrl}</text>
        `;

        svgContent += `<text x="24" y="60" fill="${textPrimary}" font-size="13" font-weight="black" font-family="${activeFontStack}" dominant-baseline="central">${projectTitle}</text>`;

        const descLines = wordWrapText(projectDescription, 42).slice(0, 3);
        descLines.forEach((line, index) => {
          const lineY = 96 + index * 13;
          svgContent += `<text x="24" y="${lineY}" fill="${textSecondary}" font-size="9" font-family="${activeFontStack}" dominant-baseline="central">${line}</text>`;
        });

        svgContent += `<line x1="0" y1="210" x2="320" y2="210" stroke="rgba(255,255,255,0.06)" stroke-width="1" />`;
        svgContent += `
          <text x="24" y="233" fill="${textSecondary}" font-size="8.5" font-weight="bold" font-family="${fontStackMono}" dominant-baseline="central">LOC:</text>
          <text x="50" y="233" fill="${textPrimary}" font-size="8.5" font-weight="black" font-family="${fontStackMono}" dominant-baseline="central">${loc}</text>
        `;

        let currentTagX = 140;
        visibleTags.forEach((tag: string) => {
          const tagW = tag.length * 6 + 10;
          if (currentTagX + tagW < 270) {
            svgContent += `
              <rect x="${currentTagX}" y="224" width="${tagW}" height="16" rx="3" fill="rgba(139, 92, 246, 0.08)" stroke="rgba(139, 92, 246, 0.2)" stroke-width="1" />
              <text x="${currentTagX + tagW / 2}" y="232" fill="${accentColor}" font-size="7.5" font-weight="black" font-family="${fontStackMono}" text-anchor="middle" dominant-baseline="central">${tag.toUpperCase()}</text>
            `;
            currentTagX += tagW + 4;
          }
        });
        if (remainingCount > 0) {
          svgContent += `
            <rect x="${currentTagX}" y="224" width="34" height="16" rx="3" fill="#18181b" stroke="rgba(255,255,255,0.05)" stroke-width="1" />
            <text x="${currentTagX + 17}" y="232" fill="${textSecondary}" font-size="7" font-weight="bold" font-family="${fontStackMono}" text-anchor="middle" dominant-baseline="central">+${remainingCount}</text>
          `;
        }
      } else {
        svgContent += `<rect width="320" height="256" rx="8" fill="${panelBg}" stroke="${borderStroke}" stroke-width="1.5" />`;
        
        svgContent += `
          <text x="24" y="32" fill="${textPrimary}" font-size="14" font-weight="black" font-family="${activeFontStack}" dominant-baseline="central">${projectTitle}</text>
          <rect x="236" y="20" width="60" height="15" rx="3" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.05)" stroke-width="1" />
          <text x="266" y="27.5" fill="${textSecondary}" font-size="7" font-weight="black" font-family="${fontStackMono}" text-anchor="middle" dominant-baseline="central">FLAT CARD</text>
        `;

        const descLinesFlat = wordWrapText(projectDescription, 42).slice(0, 4);
        descLinesFlat.forEach((line, index) => {
          const lineY = 68 + index * 13;
          svgContent += `<text x="24" y="${lineY}" fill="${textSecondary}" font-size="9" font-family="${activeFontStack}" dominant-baseline="central">${line}</text>`;
        });

        svgContent += `<line x1="0" y1="210" x2="320" y2="210" stroke="rgba(255,255,255,0.06)" stroke-width="1" />`;
        svgContent += `
          <text x="24" y="233" fill="${textSecondary}" font-size="8.5" font-weight="bold" font-family="${fontStackMono}" dominant-baseline="central">LOC:</text>
          <text x="50" y="233" fill="${textPrimary}" font-size="8.5" font-weight="black" font-family="${fontStackMono}" dominant-baseline="central">${loc}</text>
        `;

        let currentTagX = 140;
        visibleTags.forEach((tag: string) => {
          const tagW = tag.length * 6 + 10;
          if (currentTagX + tagW < 270) {
            svgContent += `
              <rect x="${currentTagX}" y="224" width="${tagW}" height="16" rx="3" fill="rgba(139, 92, 246, 0.08)" stroke="rgba(139, 92, 246, 0.2)" stroke-width="1" />
              <text x="${currentTagX + tagW / 2}" y="232" fill="${accentColor}" font-size="7.5" font-weight="black" font-family="${fontStackMono}" text-anchor="middle" dominant-baseline="central">${tag.toUpperCase()}</text>
            `;
            currentTagX += tagW + 4;
          }
        });
        if (remainingCount > 0) {
          svgContent += `
            <rect x="${currentTagX}" y="224" width="34" height="16" rx="3" fill="#18181b" stroke="rgba(255,255,255,0.05)" stroke-width="1" />
            <text x="${currentTagX + 17}" y="232" fill="${textSecondary}" font-size="7" font-weight="bold" font-family="${fontStackMono}" text-anchor="middle" dominant-baseline="central">+${remainingCount}</text>
          `;
        }
      }

    } else if (node.node_type === 'LiveGuestbookNode') {
      const logs = data.static_values?.logs || [
        { timestamp: '03:22', handle: 'admin', msg: '@calyx-dev linked' },
        { timestamp: '04:10', handle: 'guest', msg: 'amazing portfolio!' },
        { timestamp: '04:55', handle: 'dev', msg: '🚀 terminal node loaded' }
      ];
      const clampedLogs = logs.slice(0, 5);

      svgContent += `<rect width="320" height="192" rx="8" fill="#0b0a14" stroke="${borderStroke}" stroke-width="1.5" />`;
      
      svgContent += `
        <circle cx="16" cy="20" r="3" fill="#f59e0b" opacity="0.8" />
        <text x="28" y="20" fill="${textSecondary}" font-size="8.5" font-weight="bold" font-family="${fontStackMono}" dominant-baseline="central">GUESTBOOK.SH</text>
        <text x="300" y="20" fill="#71717a" font-size="7.5" font-weight="bold" font-family="${fontStackMono}" text-anchor="end" dominant-baseline="central">INTERACTIVE SHELL v1.0</text>
        <line x1="0" y1="36" x2="320" y2="36" stroke="rgba(255,255,255,0.05)" stroke-width="1" />
      `;

      clampedLogs.forEach((log: any, idx: number) => {
        const rowY = 56 + idx * 20;
        const time = log.timestamp || '00:00';
        const userHandle = log.handle || 'guest';
        const message = log.msg.length > 32 ? log.msg.slice(0, 29) + '...' : log.msg;

        svgContent += `
          <text x="18" y="${rowY}" fill="${textPrimary}" font-size="9" font-family="${fontStackMono}" dominant-baseline="central">
            <tspan fill="#71717a">[${time}]</tspan>
            <tspan fill="${accentColor}" font-weight="bold"> ${userHandle}:</tspan>
            <tspan fill="${textPrimary}"> ${message}</tspan>
          </text>
        `;
      });

      const promptY = Math.min(174, 56 + clampedLogs.length * 20 + 8);
      svgContent += `
        <text x="18" y="${promptY}" fill="#10b981" font-size="9" font-weight="black" font-family="${fontStackMono}" dominant-baseline="central">
          guest@calyx-matrix:~$ <tspan fill="${textPrimary}" font-weight="normal">_</tspan>
        </text>
      `;
    } else if (node.node_type === 'BioNode') {
      const bioText = data.hydrationMode === 'LIVE_API'
        ? (data.hydrated_values?.bio || 'V8 EDGE BRIDGE ONLINE')
        : (data.static_values?.bio || 'CALYX CORE SECURE');

      svgContent += `<rect width="320" height="128" rx="8" fill="${panelBg}" stroke="${borderStroke}" stroke-width="1.5" style="animation: pulseGlow 3s infinite ease-in-out;" />`;
      svgContent += `<text x="24" y="28" fill="${accentColor}" font-size="9" font-weight="black" font-family="${fontStackMono}" letter-spacing="1.5" dominant-baseline="central">BIOGRAPHY PROFILE</text>`;
      
      const wrapped = wordWrapText(bioText, 42).slice(0, 4);
      wrapped.forEach((line, index) => {
        const lineY = 52 + index * 16;
        svgContent += `<text x="24" y="${lineY}" fill="${textPrimary}" font-size="10" font-weight="bold" font-family="${activeFontStack}" dominant-baseline="central">${line}</text>`;
      });

    } else if (node.node_type === 'ContributionsMatrix') {
      const totalCommits = data.totalYearlyCommits || 2480;
      svgContent += `<rect width="320" height="176" rx="8" fill="${panelBg}" stroke="${borderStroke}" stroke-width="1.5" />`;
      
      svgContent += `
        <text x="24" y="28" fill="${accentColor}" font-size="9" font-weight="black" font-family="${fontStackMono}" letter-spacing="1.5" dominant-baseline="central">CONTRIBUTIONS MATRIX</text>
        <text x="296" y="28" fill="${accentColor}" font-size="9" font-weight="black" font-family="${fontStackMono}" text-anchor="end" dominant-baseline="central">${totalCommits} COMMITS / YR</text>
      `;

      const getIntensityColor = (intensity: number) => {
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

      const seedStr = node.profile_id || 'default_seed';
      const getSeededIntensity = (row: number, col: number, seed: string) => {
        let h = 0;
        const combined = `${seed}_${row}_${col}`;
        for (let i = 0; i < combined.length; i++) {
          h = combined.charCodeAt(i) + ((h << 5) - h);
          h = h & h;
        }
        return Math.abs(h) % 4;
      };

      const rows = 7;
      const cols = 52;
      let gridSvg = '';
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const intensity = getSeededIntensity(r, c, seedStr);
          const rectX = 24 + c * 5;
          const rectY = 48 + r * 10;
          const color = getIntensityColor(intensity);
          gridSvg += `<rect x="${rectX}" y="${rectY}" width="4" height="8" rx="1" fill="${color}" />`;
        }
      }
      svgContent += gridSvg;

      svgContent += `
        <line x1="24" y1="130" x2="296" y2="130" stroke="rgba(255,255,255,0.06)" stroke-width="1" />
        <text x="24" y="148" fill="${textSecondary}" font-size="8.5" font-family="${fontStackMono}" dominant-baseline="central">LESS</text>
      `;

      for (let i = 0; i < 4; i++) {
        const legendX = 140 + i * 10;
        svgContent += `<rect x="${legendX}" y="144" width="7" height="7" rx="1" fill="${getIntensityColor(i)}" />`;
      }

      svgContent += `
        <text x="296" y="148" fill="${textSecondary}" font-size="8.5" font-family="${fontStackMono}" text-anchor="end" dominant-baseline="central">MORE</text>
      `;

    } else if (node.node_type === 'ProjectModalSliderNode') {
      svgContent += `<rect width="320" height="192" rx="8" fill="${panelBg}" stroke="${borderStroke}" stroke-width="1.5" />`;
      svgContent += `<text x="24" y="28" fill="${accentColor}" font-size="9" font-weight="black" font-family="${fontStackMono}" letter-spacing="1.5" dominant-baseline="central">PROJECT CAROUSEL PREVIEW</text>`;
      
      const projects = data.projects || [
        { name: 'Calyx Matrix Engine', desc: 'Dual-engine static site generator' },
        { name: 'Upstash Sync Proxy', desc: 'Secure real-time telemetry worker' }
      ];
      
      projects.slice(0, 2).forEach((proj: any, idx: number) => {
        const rowY = 56 + idx * 56;
        svgContent += `
          <circle cx="28" cy="${rowY + 12}" r="3" fill="${accentColor}" />
          <text x="40" y="${rowY + 12}" fill="${textPrimary}" font-size="11" font-weight="black" font-family="${activeFontStack}" dominant-baseline="central">${proj.name}</text>
          <text x="40" y="${rowY + 30}" fill="${textSecondary}" font-size="9" font-family="${activeFontStack}" dominant-baseline="central">${proj.desc}</text>
        `;
      });

    } else if (node.node_type === 'FilterableTimelineNode') {
      svgContent += `<rect width="320" height="224" rx="8" fill="${panelBg}" stroke="${borderStroke}" stroke-width="1.5" />`;
      svgContent += `<text x="24" y="28" fill="${accentColor}" font-size="9" font-weight="black" font-family="${fontStackMono}" letter-spacing="1.5" dominant-baseline="central">TIMELINE MILESTONES</text>`;
      
      const milestones = data.milestones || [
        { year: '2026', tag: 'OSS', title: 'Calyx Profile Matrix v2.0' },
        { year: '2025', tag: 'WORK', title: 'Staff Core Infrastructure Engineer' }
      ];
      
      milestones.slice(0, 3).forEach((m: any, idx: number) => {
        const rowY = 60 + idx * 48;
        svgContent += `
          <line x1="30" y1="${rowY}" x2="30" y2="${rowY + 40}" stroke="${borderStroke}" stroke-width="1" stroke-dasharray="2 2" />
          <circle cx="30" cy="${rowY + 12}" r="4" fill="${accentColor}" />
          <text x="44" y="${rowY + 12}" fill="${textPrimary}" font-size="9" font-weight="black" font-family="${fontStackMono}" dominant-baseline="central">${m.year} <tspan fill="${accentColor}">[${m.tag}]</tspan></text>
          <text x="44" y="${rowY + 26}" fill="${textSecondary}" font-size="9.5" font-family="${activeFontStack}" dominant-baseline="central">${m.title}</text>
        `;
      });

    } else if (node.node_type === 'EndorsementsCarouselNode') {
      svgContent += `<rect width="320" height="176" rx="8" fill="${panelBg}" stroke="${borderStroke}" stroke-width="1.5" />`;
      svgContent += `<text x="24" y="28" fill="${accentColor}" font-size="9" font-weight="black" font-family="${fontStackMono}" letter-spacing="1.5" dominant-baseline="central">ENDORSEMENT TESTIMONIAL</text>`;
      
      const endorsements = data.endorsements || [
        { name: 'Sarah Connor', text: 'Unmatched systems architect. Solved all concurrency leaks!' }
      ];
      
      if (endorsements.length > 0) {
        const end = endorsements[0];
        const textWrapped = wordWrapText(end.text, 40).slice(0, 3);
        textWrapped.forEach((line, index) => {
          const lineY = 60 + index * 16;
          svgContent += `<text x="24" y="${lineY}" fill="${textPrimary}" font-size="10" font-style="italic" font-family="${activeFontStack}" dominant-baseline="central">"${line}"</text>`;
        });
        
        svgContent += `<text x="24" y="140" fill="${accentColor}" font-size="9.5" font-weight="black" font-family="${fontStackMono}" dominant-baseline="central">— ${end.name.toUpperCase()}</text>`;
      } else {
        svgContent += `<text x="24" y="70" fill="${textSecondary}" font-size="10" font-style="italic" font-family="${activeFontStack}" dominant-baseline="central">No active recommendations received</text>`;
      }
    } else if (node.node_type === 'KineticMediaBox' || node.node_type === 'CustomKineticMediaBox') {
      const scalingRatio = data.scalingRatio || 'CONTAIN';
      const activeTokens = data.activeKineticTokens || [];
      
      let preserveAspectRatio = 'xMidYMid meet';
      if (scalingRatio === 'COVER') {
        preserveAspectRatio = 'xMidYMid slice';
      } else if (scalingRatio === 'SCALE_DOWN') {
        preserveAspectRatio = 'xMidYMid meet';
      }

      svgContent += `<rect width="280" height="95" rx="8" fill="${panelBg}" stroke="${borderStroke}" stroke-width="1.5" />`;
      
      // Wrap images natively in a stacking isolation block
      svgContent += `<g style="isolation: isolate;">`;
      
      if (Array.isArray(activeTokens) && activeTokens.length > 0) {
        activeTokens.forEach((token: string) => {
          const asset = KINETIC_ASSET_MAP[token];
          let url = asset ? asset.url : '';
          
          // Secure URL protocol sweep
          if (url) {
            if (url.startsWith('http://')) {
              url = url.replace('http://', 'https://');
            }
          } else {
            // Low-overhead fallback base64 track
            url = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
          }
          
          svgContent += `
            <image href="${url}" x="0" y="0" width="280" height="95" preserveAspectRatio="${preserveAspectRatio}" style="mix-blend-mode: screen;" />
          `;
        });
      } else {
        // Render single mediaAssetUrl
        let mediaAssetUrl = data.mediaAssetUrl || '';
        if (mediaAssetUrl) {
          if (mediaAssetUrl.startsWith('http://')) {
            mediaAssetUrl = mediaAssetUrl.replace('http://', 'https://');
          }
        } else {
          mediaAssetUrl = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        }
        
        svgContent += `
          <image href="${mediaAssetUrl}" x="0" y="0" width="280" height="95" preserveAspectRatio="${preserveAspectRatio}" style="mix-blend-mode: screen;" />
        `;
      }
      
      svgContent += `</g>`;
    }

    svgContent += `</g>`;
  });

  svgContent += `</svg>`;
  return svgContent;
}

function wordWrapText(text: string, maxLen: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length <= maxLen) {
      currentLine = (currentLine + ' ' + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

