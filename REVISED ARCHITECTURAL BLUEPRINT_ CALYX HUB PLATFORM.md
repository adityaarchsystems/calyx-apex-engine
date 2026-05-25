# **REVISED ARCHITECTURAL BLUEPRINT: CALYX HUB PLATFORM**

## **SYSTEM STAGE: SAAS PLATFORM SHELL EVOLUTION & MONOREPO COMPILATION FIX**

## **ARCHITECTURAL RUNTIME: SPRINT 11 / MULTI-ROOM HUB & CORE REFACTOR**

The Calyx Profile Matrix (CPM) is transitioning from a standalone, single-view configuration playground into an industry-standard, multi-room developer platform application workspace. This revised master blueprint outlines the structural re-routing, advanced visual style modifications inspired by elite developer tooling, universal component form fixes, and backend monorepo compilation alignments required for Sprint 11 execution.

---

## **🏗️ SECTION 1: THE MULTI-ROOM APPSHELL ROUTER ENGINE**

To elevate the user flow to production parameters, the application entry framework within apps/web-canvas will be refactored into a persistent AppShell layout wrapping client-side routes handled by react-router-dom. The visual canvas grid drops down from being the main homepage to a dedicated sub-workspace reached with intentional navigation.

                          \+-----------------------------------+  
                           |    APP SHELL SIDEBAR MATRIX NAV   |  
                           \+-----------------------------------+  
                                             |  
         \+--------------------+--------------+--------------+--------------------+  
         |                    |                             |                    |  
         ▼                    ▼                             ▼                    ▼  
    \`/dashboard\`           \`/canvas\`                   \`/analytics\`        \`/integrations\`  
   (Command Hub)       (Visual Studio Grid)          (Project FOLIO)     (Webhooks & Billing)

### **1\. Route A: The Command Hub Dashboard (/dashboard)**

The new application entry path. This view instantiates a high-density, asymmetric Bento Grid layout composition mimicking deep-dark production developer consoles:

* **The Active Matrix Inventory Display:** A clean data-collection view tracking active saved project profiles (e.g., "Primary GitHub Portfolio", "Calyx Studios Corporate Matrix"). Each entity container card displays a small configuration flavor preview tag, last-synchronized timestamps, and an interactive Launch Workspace action shortcut that maps clean navigation straight to the corresponding /canvas context.  
* **Infrastructure Telemetry Metrics:** Real-time mock data components tracking edge layer infrastructure health parameters:  
  * Cache Sync Rate graph trackers (e.g., modeling 1,600 requests/sec / Upstash Latency: 12ms).  
  * Active Data Storage Volume tracking metrics (e.g., tracking current storage limits).  
  * A beautiful, styled syntax code block module displaying a minified snapshot mockup of the active vector JSON transiting your server paths.

### **2\. Route B: The Creative Visual Studio Canvas (/canvas)**

The interactive React Flow canvas customizing viewport layout. Developers navigate here to arrange node components, switch design presets, and update property fields for a specific profile layer.

### **3\. Route C: The Analytics Engine Layer (/analytics)**

The future home for our upcoming GA4 Project FOLIO data visualization integration, rendering view counts and visitor tracking metrics using custom chart components.

### **4\. Route D: The Integrations Control Hub (/integrations)**

A clean dashboard center where developers can connect repository app app access permissions, configure public incoming webhook tokens, and track Stripe commercial payment plans.

---

## **✨ SECTION 2: THE VISUAL STYLE SYSTEM OVERHAUL (THE CALYX SPARK)**

To transition our interfaces from flat layouts into a highly polished design system, we are abandoning generic neutral values for a deeply layered, violet-infused color palette directly inspired by premium telemetry dashboards:

### **1\. Core Color Token Space**

* **Application Canvas Floor:** Background color \#050507 (Deep pure black)  
* **Elevated Container Cards:** Background color \#0b0a14 (Deep midnight violet)  
* **Interactive Tooling Surfaces:** Background color \#12111f (Elevated slate violet)

### **2\. Structural Layering & Border Highlights**

* **Micro-Glow Borders:** All component card frames will discard solid borders and employ semi-transparent, low-opacity linear gradient strings combined with subtle glowing drop shadows:  
* CSS

border: 1px solid rgba(139, 92, 246, 0.15);  
box-shadow: 0 0 20px rgba(139, 92, 246, 0.05);

*   
*   
* **Interactive Controls Polish:** Form components will use subtle background color transitions and custom colored slider tracks to maximize interface feedback.

---

## **🛠️ SECTION 3: WORKSPACE REFACTORING & RECOVERY MANIFEST**

To clear the layout regressions and compile errors tracking through our codebase, you must implement the following code-level modifications precisely during this pass:

### **1\. Eradicate the StatsNode Blinding White Box Bug**

The solid white background rectangles blocking the numerical values **"27"** and **"5TB"** are caused by unstyled native elements. You must inject clear layout style utility parameters directly into the display primitives inside /apps/web-canvas/src/components/nodes/CustomNodes.tsx to force text frames to inherit color sets cleanly:

TypeScript

className="bg-transparent border-none outline-none text-current"

### **2\. Synchronize Edge Asset Server Workspace Compilation**

The @cpm/edge-asset-server workspace is currently throwing missing outputs errors during global task compilation passes. You must correct the output directories and script maps within its package file structures to ensure running pnpm build flags a completely green compilation trace under Turborepo caching:

* Reconfigure tsconfig.json output configurations to build cleanly to ./dist.  
* Verify all local package inter-links resolve workspace dependencies cleanly.

### **3\. Deploy the Edge SVG Compiler Code**

Now that custom client-side form parameters are securely processing multi-byte safe data clusters, deploy the complete layout calculation rendering logic inside apps/edge-asset-server/src/utils/svgCompiler.ts. This module must ingest cached node coordinate maps from Upstash, map layout dimensions accurately, and output standalone scalable vector graphics string assets (.svg) for deployment.

---

## **📊 SECTION 4: CORE PIPELINE VERIFICATION TARGETS**

Following script generation execution, the system state parameters must be actively evaluated against these strict functional testing guidelines:

* **Global Compile Integrity:** Running pnpm build from the root directory must successfully execute across all workspaces (@cpm/api-sync-worker, @cpm/web-canvas, and @cpm/edge-asset-server) with zero errors.  
* **Client Route Switching:** Navigating from /dashboard into /canvas must happen immediately without throwing unhandled exceptions or losing global context node configurations.  
* **Style Engine Overhaul Validation:** Visual inspection must verify that the StatsNode white background boxes are dead, card structures adhere to deep violet design specifications, and the dropdown menu preserves layered z-index elevation.

