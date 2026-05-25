"use client";

import React, { useLayoutEffect, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { BaroqueFiligree } from "@/components/ui/BaroqueFiligree";
import { useRouter } from "next/navigation";
import { Trophy, Zap, Target, Layers, AlertCircle, Download } from "lucide-react";

interface Idea {
  rank: number;
  origNum: number;
  title: string;
  description: string;
  price: string;
  tier: "A" | "B" | "C" | "D";
  synergy: string;
  ragePoint: string;
  whyForYou?: string;
  competition: string;
  buildStack: string;
  firstCustomers?: string;
  differentiation?: string;
    scores: {
      build: number;
      revenue: number;
      compete: number;
      synergy: number;
      scale: number;
      stability: number;
    };
  verdict: string;
}

const IDEAS: Idea[] = [
  {
    rank: 1,
    origNum: 23,
    title: "GA4 Explainer for Agencies",
    description: "Plain-English reporting layer on top of Google Analytics 4 data",
    price: "$79/mo",
    tier: "A",
    synergy: "Calyx Studios ★★★",
    ragePoint: "Agencies send clients GA4 dashboards packed with jargon. Clients have no idea what any of it means. The agency spends 2–3 hours/month per client writing summaries by hand.",
    whyForYou: "You run Calyx Studios. You ARE this customer. You can dogfood it, generate a beautiful sample report, and use it as your demo immediately.",
    competition: "AgencyAnalytics targets 20+ client agencies. The 1–10 client boutique agency is massively underserved.",
    buildStack: "GA4 Data API, Anthropic API for commentary, Supabase, Vercel, Resend. 95% margin.",
    firstCustomers: "DM 10 web agency owners on LinkedIn with a sample report. It sells itself visually.",
    scores: { build: 9, revenue: 9, compete: 8, synergy: 10, scale: 9, stability: 9 },
    verdict: "This is the simplest build with the highest ROI. Build the GA4 version first, validate, then expand to Meta/Google Ads."
  },
  {
    rank: 2,
    origNum: 4,
    title: "Brand Voice Analyzer",
    description: "AI tool that scores new content for brand consistency against a trained voice profile",
    price: "$79/mo",
    tier: "A",
    synergy: "Omni-Ad ★★★",
    ragePoint: "Thousands spent on tone-of-voice guidelines, then social media managers post off-brand. No lightweight tool scores new copy for consistency.",
    whyForYou: "Omni-Ad Vibe Spy users are marketers who obsess over brand messaging. This is a natural adjacent product cross-sell.",
    competition: "Jasper has a brand voice feature but it's buried in a writing assistant. No dedicated standalone tool at micro-price.",
    buildStack: "Claude API extracts tone markers → scores new content. No scraping, pure text I/O. Extremely stable.",
    firstCustomers: "Post in r/marketing and LinkedIn. Offer free profile creation + 3 scores. Marketing managers convert on accuracy.",
    scores: { build: 9, revenue: 8, compete: 9, synergy: 9, scale: 8, stability: 10 },
    verdict: "Cleanest AI wrapper on the list. Cross-sell directly to Omni-Ad users. Build time ~7 days."
  },
  {
    rank: 3,
    origNum: 13,
    title: "Review Response Generator",
    description: "AI tool to write unique, personalized Google/Yelp review responses at scale",
    price: "$29/mo",
    tier: "A",
    synergy: "Calyx (Medical) ★★★",
    ragePoint: "Responding to reviews matters for local SEO. Small businesses (dentists, etc.) get 20+ reviews/month and writing unique replies is mind-numbing.",
    whyForYou: "Calyx Studios serves medical practices. You can walk into existing client relationships and offer this as an upsell TODAY.",
    competition: "Birdeye ($299/mo) and Podium ($400/mo) are overpriced. No focused sub-$50 tool exists for single locations.",
    buildStack: "Google Business Profile API, Claude generates personalized responses in business voice. 99% margin.",
    firstCustomers: "Email existing Calyx medical clients. Frame it as saving front desk 2 hours a month. 3/5 will say yes immediately.",
    scores: { build: 9, revenue: 10, compete: 8, synergy: 10, scale: 7, stability: 9 },
    verdict: "Fastest path to revenue because of your warm medical-client relationships. Build in 4-5 days."
  },
  {
    rank: 4,
    origNum: 20,
    title: "Contract Template Generator for Freelance Designers",
    description: "AI-generated design-specific contracts with revision limits and asset ownership clauses",
    price: "$29/mo",
    tier: "A",
    synergy: "Calyx (Designers) ★★",
    ragePoint: "Freelance designers use generic contracts that don't cover revision rounds, source file ownership, or kill fees. Bad templates or no contracts are common.",
    competition: "Bonsai is a full CRM. Most designers just want a clean contract generator. Gap for a focused 60-second experience.",
    buildStack: "Intake form → Claude API → PDF export. Build time 4-6 days. Zero ongoing compute cost.",
    firstCustomers: "Post in r/graphic_design and r/web_design. Offer free beta. Designers feel this pain deeply.",
    scores: { build: 9, revenue: 8, compete: 8, synergy: 7, scale: 6, stability: 8 },
    verdict: "Fastest build on the list. Could be live in a weekend. Consider $10/contract pay-per-use model."
  },
  {
    rank: 5,
    origNum: 12,
    title: "Automated Invoice Follow-Up",
    description: "Smart, escalating payment reminder sequences that stop automatically when paid",
    price: "$19/mo",
    tier: "A",
    synergy: "All portfolios ★★",
    ragePoint: "Freelancers hate chasing invoices. Emotional labor of 'friendly reminders' is draining. Existing tools only work if you use their platform to invoice.",
    competition: "RemindFox just launched but lacks aesthetic and deep Stripe integration. Differentiation on UX and auto-detection.",
    buildStack: "Invoice upload → Claude extracts data → Resend.com sequences → Stripe webhook auto-stop.",
    firstCustomers: "Position as add-on or standalone. Reach out to existing freelance network.",
    scores: { build: 9, revenue: 8, compete: 6, synergy: 7, scale: 8, stability: 9 },
    verdict: "Near 100% margin. Build as feature in ProofKit or standalone. High synergy with freelancer workflows."
  },
  {
    rank: 6,
    origNum: 22,
    title: "SaaS Competitor Price Tracker",
    description: "Monitor competitor SaaS pricing pages for changes and feature moves",
    price: "$39/mo",
    tier: "B",
    synergy: "Omni-Ad ★★",
    ragePoint: "Founders manually check competitors. Generic scrapers break. No tool provides AI-powered strategic analysis of pricing moves.",
    competition: "saaspricetracker.com is in early beta. Prisync/Priceva target retail, not SaaS.",
    buildStack: "Playwright snapshots → Diff → Claude analysis. Mitigate fragility with visual comparison.",
    scores: { build: 7, revenue: 7, compete: 7, synergy: 9, scale: 9, stability: 8 },
    verdict: "Natural cross-sell for Omni-Ad Vibe Spy users. Build as Venture #2."
  },
  {
    rank: 7,
    origNum: 7,
    title: "Technical Debt Tracker",
    description: "Quantify and justify refactoring work to product managers",
    price: "$79/mo",
    tier: "B",
    synergy: "Weak ★",
    ragePoint: "Engineering managers struggle to justify refactoring. Jira/Linear handle features, not 'fire hazards.' Invisible debt bites later.",
    competition: "CodeClimate/SonarQube are developer-focused. No tool builds the 'ROI argument for PMs'.",
    buildStack: "GitHub/GitLab OAuth integration for codebase analysis. Complex infrastructure.",
    scores: { build: 6, revenue: 7, compete: 8, synergy: 5, scale: 10, stability: 7 },
    verdict: "Real money, low competition. Complexity makes it Venture #3 or #4. Start with manual-entry MVP."
  },
  {
    rank: 8,
    origNum: 27,
    title: "Form Abandonment Recovery",
    description: "Saves partial form data and sends recovery emails for static sites",
    price: "$29/mo",
    tier: "B",
    synergy: "Weak ★",
    ragePoint: "Static site owners lose leads when users leave mid-form. No 'cart abandonment' equivalent for lead forms exists for static sites.",
    competition: "Hotjar/Bouncer don't target this niche at this price. Novel positioning for static sites.",
    buildStack: "JS snippet (2-3KB) → Capture keystrokes → Supabase storage → Resend recovery email.",
    scores: { build: 9, revenue: 7, compete: 8, synergy: 5, scale: 7, stability: 9 },
    verdict: "Elegant build, clean problem. Weak synergy but indie hacker community is a warm acquisition channel."
  },
  {
    rank: 9,
    origNum: 21,
    title: "Website Carbon Footprint + ESG Reporting",
    description: "Analyze emissions and generate compliance-grade ESG reports",
    price: "$29-99/mo",
    tier: "B",
    synergy: "Calyx (EU) ★★",
    ragePoint: "ESG reporting is mandatory in EU/UK. Mid-sized companies can't afford enterprise tools but legally must report digital carbon footprints.",
    competition: "Free tools exist but don't generate compliance reports or scan full sites. Compliance angle is the wedge.",
    buildStack: "Website Carbon API + Lighthouse data → Claude narrative → Branded PDF output.",
    scores: { build: 7, revenue: 7, compete: 8, synergy: 7, scale: 8, stability: 10 },
    verdict: "Strongest EU-specific opportunity. Regulatory driven demand. Target UK/EU agencies."
  },
  {
    rank: 10,
    origNum: 15,
    title: "Inventory Forecasting for Small Retailers",
    description: "Predict stockouts 2 weeks ahead and suggest reorder quantities",
    price: "$49/mo",
    tier: "B",
    synergy: "Weak ★",
    ragePoint: "Enterprise tools are $999/mo. Shopify inventory doesn't predict. Small retailers lose sales to stockouts without affordable forecasting.",
    competition: "Shopify ecosystem has Inventory Planner ($99+). Requires 3+ months of history.",
    buildStack: "Shopify/Etsy API + Statistical forecasting algorithms (Exponential Smoothing).",
    scores: { build: 6, revenue: 7, compete: 7, synergy: 5, scale: 8, stability: 7 },
    verdict: "Built-in distribution via Shopify App Store. Good 3rd or 4th venture."
  },
  {
    rank: 11,
    origNum: 11,
    title: "Context Switcher for Freelancers",
    description: "Saves 'project states' (bookmarks, apps, notes) and switches between them instantly",
    price: "$15/mo",
    tier: "C",
    synergy: "Weak ★",
    ragePoint: "Context-switching tax for freelancers juggling 3–5 clients is real. Reopening tools wastes 20 min/switch.",
    competition: "No dominant player. Browser extensions exist but none manage the full 'project state' concept.",
    buildStack: "Electron or complex browser extension. Higher build time (3-4 weeks).",
    scores: { build: 6, revenue: 5, compete: 7, synergy: 4, scale: 5, stability: 6 },
    verdict: "Real problem, but wrong price point and stack for your current comfort zone."
  },
  {
    rank: 12,
    origNum: 25,
    title: "Webhook Tester with Replay",
    description: "Test webhooks with payload editing and team collaboration",
    price: "$29/mo",
    tier: "C",
    synergy: "Very Weak ★",
    ragePoint: "Developers need to replay payloads to multiple endpoints or modify them. RequestBin is free but limited.",
    competition: "RequestBin, webhook.site, Mockoon. Developer culture favors free.",
    buildStack: "Node.js proxy/collector + React Dashboard. Straightforward build.",
    scores: { build: 8, revenue: 5, compete: 5, synergy: 3, scale: 6, stability: 8 },
    verdict: "Good technical product, wrong market culture for monetization. Build as open-source instead."
  },
  {
    rank: 13,
    origNum: 24,
    title: "Stripe → Sheets Connector",
    description: "Stripe payments to Google Sheets with 10x better filtering than Zapier",
    price: "$19/mo",
    tier: "C",
    synergy: "Very Weak ★",
    ragePoint: "Zapier's filtering is primitive. Founders need complex conditional logic for financial dashboards.",
    competition: "Zapier, n8n. Undersized revenue per customer for the maintenance burden.",
    buildStack: "Stripe API + Google Sheets API + conditional logic engine.",
    scores: { build: 7, revenue: 5, compete: 6, synergy: 3, scale: 4, stability: 9 },
    verdict: "Only pursue if priced at $49+ and positioned as 'financial data pipelines'."
  },
  {
    rank: 14,
    origNum: 19,
    title: "Meal Planning for Fitness Coaches",
    description: "Coach-facing tool to create and track meal plans for 20+ clients",
    price: "$79/mo",
    tier: "C",
    synergy: "None",
    ragePoint: "Coaches use manual Excel sheets. Trainerize/TrueCoach have weak meal planning.",
    competition: "Saturated space (MyPTHub, Trainerize). Requires mobile app for quality experience.",
    buildStack: "React Native or PWA for client portal. High build complexity.",
    scores: { build: 5, revenue: 7, compete: 6, synergy: 2, scale: 8, stability: 5 },
    verdict: "Attractive price point but high complexity and zero synergy with your network."
  },
  {
    rank: 15,
    origNum: 14,
    title: "Profit Calculator for Etsy/Shopify",
    description: "Chrome extension calculating true profit margin including all fees",
    price: "$15/mo",
    tier: "C",
    synergy: "None",
    ragePoint: "Etsy fee structure is confusing. Sellers don't know their true margins per product.",
    competition: "Free online calculators exist. Low revenue ceiling due to consumer pricing.",
    buildStack: "Chrome extension with fee logic scraper. technically straightforward.",
    scores: { build: 8, revenue: 5, compete: 5, synergy: 2, scale: 4, stability: 7 },
    verdict: "Easy build, low revenue ceiling. Good side project but not a core venture."
  },
  {
    rank: 16,
    origNum: 10,
    title: "Async Standup for Niche Teams",
    description: "Vertical-specific standup tool with role-relevant questions",
    price: "$39/mo",
    tier: "C",
    synergy: "None",
    ragePoint: "Generic standup tools don't ask the right questions for specialized teams (design/UX).",
    competition: "Geekbot ($2.50/user), Standuply. Crowded market with free tiers.",
    buildStack: "Slack/Teams integration + Dashboard. Build time ~10 days.",
    scores: { build: 7, revenue: 5, compete: 4, synergy: 2, scale: 6, stability: 7 },
    verdict: "Only viable if you niche down to an extremely specific vertical like UX Research."
  },
  {
    rank: 17,
    origNum: 1,
    title: "Screenshot-to-Social Post",
    description: "Ray.so alternative for social media asset production",
    price: "$12/mo",
    tier: "D",
    synergy: "None",
    ragePoint: "Designers/Founders want beautiful code/text screenshots for social sharing.",
    competition: "Ray.so (free), Carbon (free), Shots.so (free), Pika ($8).",
    buildStack: "Canvas-based image generator or Puppeteer screenshotting service.",
    scores: { build: 8, revenue: 3, compete: 2, synergy: 2, scale: 3, stability: 5 },
    verdict: "Avoid. Impossible to compete with high-quality free incumbents."
  },
  {
    rank: 18,
    origNum: 3,
    title: "Bulk Subtitle Generator",
    description: "Subtitle generation for course creators using AI",
    price: "$29/mo",
    tier: "D",
    synergy: "None",
    ragePoint: "Manual subtitling is slow. Existing tools are complex or expensive.",
    competition: "OpenAI Whisper (free), YouTube (free), Descript ($12).",
    buildStack: "Whisper API wrapper + Simple UI. High compute costs.",
    scores: { build: 7, revenue: 4, compete: 2, synergy: 2, scale: 5, stability: 4 },
    verdict: "Avoid. Competing against free, high-accuracy alternatives from Big Tech."
  },
  {
    rank: 19,
    origNum: 9,
    title: "Meeting Cost Calculator",
    description: "Calendar integration to show real-time cost of meetings",
    price: "$49/mo",
    tier: "D",
    synergy: "None",
    ragePoint: "Companies waste millions on unnecessary meetings without seeing the price tag.",
    competition: "Vitamin, not painkiller. Political discomfort leads to low retention.",
    buildStack: "Google/Outlook Calendar OAuth + Salary data integration.",
    scores: { build: 6, revenue: 3, compete: 5, synergy: 1, scale: 2, stability: 3 },
    verdict: "Avoid. This tool makes users uncomfortable, which leads to cancellations."
  },
  {
    rank: 20,
    origNum: 5,
    title: "Non-Technical API Playground",
    description: "Postman alternative designed for non-technical teams",
    price: "$49/mo",
    tier: "D",
    synergy: "None",
    ragePoint: "Postman is too complex for marketing/sales teams trying to test simple webhooks.",
    competition: "Postman (free/standard), Insomnia (free). High switching costs.",
    buildStack: "Simplified UI wrapper for standard HTTP requests.",
    scores: { build: 7, revenue: 4, compete: 4, synergy: 2, scale: 5, stability: 6 },
    verdict: "Avoid. Engineering leaders won't pay for a second tool when Postman works."
  },
  {
    rank: 21,
    origNum: 26,
    title: "Healthcare Email Parser",
    description: "HIPAA-compliant email parsing for medical records",
    price: "$99/mo",
    tier: "D",
    synergy: "Medical ★",
    ragePoint: "Medical offices manually enter data from legacy system emails.",
    competition: "High legal friction. HIPAA compliance is not $0 upfront.",
    buildStack: "HIPAA-compliant hosting + E2E encryption. Expensive.",
    scores: { build: 3, revenue: 7, compete: 5, synergy: 6, scale: 8, stability: 4 },
    verdict: "Avoid. Legal/compliance hurdles destroy the micro-SaaS ROI."
  },
  {
    rank: 22,
    origNum: 16,
    title: "Return Label Generator",
    description: "DTC brand return management and label printing",
    price: "$29/mo",
    tier: "D",
    synergy: "None",
    ragePoint: "Small brands struggle with return workflows and shipping labels.",
    competition: "Loop Returns, Narvar, Shopify (free). Saturated market.",
    buildStack: "Carrier APIs (UPS/FedEx) which have high setup costs.",
    scores: { build: 4, revenue: 5, compete: 3, synergy: 1, scale: 6, stability: 5 },
    verdict: "Avoid. High build complexity and massive competition."
  },
  {
    rank: 23,
    origNum: 2,
    title: "AI Content Detector",
    description: "Specialized detection for AI-generated text in specific niches",
    price: "$15/mo",
    tier: "D",
    synergy: "None",
    ragePoint: "Education/Editorial teams need to verify content authenticity.",
    competition: "GPTZero, Originality.ai, Turnitin. Fundamental accuracy issues.",
    buildStack: "Classifier models trained on niche datasets. High data reqs.",
    scores: { build: 5, revenue: 4, compete: 3, synergy: 2, scale: 4, stability: 3 },
    verdict: "Avoid. Accuracy is contested and market is saturated with funded startups."
  },
  {
    rank: 24,
    origNum: 8,
    title: "Env Variable Manager",
    description: "Secrets management for small engineering teams",
    price: "$10/mo",
    tier: "D",
    synergy: "None",
    ragePoint: "Sharing .env files in Slack is insecure. Small teams need a shared vault.",
    competition: "Doppler (standard), Infisical (free/OS). Trust deficit for new entrants.",
    buildStack: "E2E encrypted vault service. High security burden.",
    scores: { build: 4, revenue: 4, compete: 2, synergy: 2, scale: 5, stability: 4 },
    verdict: "Avoid. Security trust hurdle is insurmountable for a new micro-SaaS."
  },
  {
    rank: 25,
    origNum: 6,
    title: "Localhost-to-Live Tunnel",
    description: "Better ngrok alternative for URL sharing",
    price: "$8/mo",
    tier: "D",
    synergy: "None",
    ragePoint: "ngrok is expensive for persistent URLs. Developers want simpler sharing.",
    competition: "Cloudflare Tunnel (free), ngrok, Bore.pub. Infrastructure play.",
    buildStack: "Global proxy infrastructure. High scale required.",
    scores: { build: 3, revenue: 3, compete: 2, synergy: 1, scale: 2, stability: 2 },
    verdict: "Avoid. Cannot compete with free infra from Cloudflare."
  },
  {
    rank: 26,
    origNum: 17,
    title: "Therapist Questionnaire Builder",
    description: "HIPAA-compliant patient intake forms for therapists",
    price: "$29/mo",
    tier: "D",
    synergy: "None",
    ragePoint: "Therapists need secure intake but find specialized EHRs too expensive.",
    competition: "SimplePractice, TherapyNotes. High legal risk.",
    buildStack: "HIPAA-compliant stack. Expensive to start.",
    scores: { build: 2, revenue: 6, compete: 4, synergy: 2, scale: 7, stability: 3 },
    verdict: "Avoid. HIPAA compliance sinks the ROI before line one."
  },
  {
    rank: 27,
    origNum: 18,
    title: "Sermon Note-Taking App",
    description: "B2C niche app for church members to take sermon notes",
    price: "$5/mo",
    tier: "D",
    synergy: "None",
    ragePoint: "Members want a dedicated place for church notes and scripture references.",
    competition: "Apple Notes, Bible apps (free). B2C is high CAC/low LTV.",
    buildStack: "Simple notes app. No AI angle.",
    scores: { build: 8, revenue: 2, compete: 2, synergy: 1, scale: 2, stability: 4 },
    verdict: "Avoid. Passion project, not a Micro-SaaS venture. scores 0/10 on B2B focus."
  }
];

export default function IntelPage() {
  const [isFounder, setIsFounder] = useState(false);
  const router = useRouter();

  useLayoutEffect(() => {
    const founder = localStorage.getItem("isFounder");
    if (founder === "true") {
      setIsFounder(true);
    } else {
      router.replace("/gateway");
    }
  }, [router]);

  if (!isFounder) return (
    <div className="min-h-screen bg-[#070e16] flex items-center justify-center font-mono text-[var(--calyx-accent)]">
      VERIFYING_ROOT_AUTHORITY...
    </div>
  );

  return (
    <div className="relative min-h-screen bg-[#070e16] text-white p-4 md:p-12 font-sans silk-grain overflow-x-hidden">
      <BaroqueFiligree />
      
      <div className="relative z-10 max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <header className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 text-[var(--calyx-accent)] font-mono text-xs uppercase tracking-widest"
          >
            <Trophy className="w-4 h-4" />
            Strategic Intelligence Report // 27 Micro-SaaS Artifacts
          </motion.div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-8xl font-['DM_Serif_Display'] leading-none">
                27 Micro-SaaS Ideas <br />
                <span className="text-white/40 italic">Ranked & Dissected</span>
              </h1>
              <div className="flex flex-wrap gap-6 text-white/60 font-mono text-[10px] uppercase tracking-wider">
                <span className="flex items-center gap-2 text-[var(--tier-b)]"><Layers className="w-3 h-3" /> 27 IDEAS EVALUATED</span>
                <span className="flex items-center gap-2 text-[var(--tier-b)]"><Zap className="w-3 h-3" /> 6-DIMENSION SCORING</span>
                <span className="flex items-center gap-2 text-[var(--tier-b)]"><Target className="w-3 h-3" /> B2B GLOBAL NORTH FOCUS</span>
              </div>
            </div>
            
            {/* ── VAULT KEY ── */}
            <motion.a
              href="/artifacts/27_MicroSaaS_Ranked_Analysis.html"
              download
              whileHover={{ y: -4, boxShadow: "0 0 24px rgba(200,241,53,0.12)" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="group relative flex items-center gap-5 px-6 py-4 overflow-hidden"
              style={{ border: "0.3px solid rgba(200,241,53,0.2)", background: "rgba(255,255,255,0.02)", backdropFilter: "blur(16px)" }}
            >
              {/* Hover fill */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#C8F135]/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              {/* Key icon */}
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center" style={{ border: "0.3px solid rgba(200,241,53,0.3)", background: "rgba(200,241,53,0.06)" }}>
                <Download className="w-3.5 h-3.5 text-[#C8F135] group-hover:translate-y-0.5 transition-transform" />
              </div>
              {/* Labels */}
              <div className="flex flex-col gap-1.5 min-w-0">
                <span className="font-mono text-[11px] tracking-[0.12em] text-white/90 uppercase" style={{ fontFamily: "'DM Mono', monospace" }}>
                  [ DECRYPT_&amp;_DOWNLOAD_SOURCE_ARTIFACT.HTML ]
                </span>
                <div className="flex items-center gap-3" style={{ fontFamily: "'DM Mono', monospace" }}>
                  <span className="font-mono text-[10px] tracking-[0.1em] text-white/30">Size: 92.4kb</span>
                  <span className="w-px h-3 bg-white/10" />
                  <span className="font-mono text-[10px] tracking-[0.1em] text-white/30">Format: HTML</span>
                  <span className="w-px h-3 bg-white/10" />
                  <span className="font-mono text-[10px] tracking-[0.1em] text-[#C8F135]/60">Status: SECURE</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C8F135] animate-pulse" />
                </div>
              </div>
            </motion.a>
          </div>
        </header>

        {/* Critical Alert */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/5 border border-red-500/20 p-6 flex gap-6 items-start"
        >
          <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
          <div className="space-y-2">
            <div className="text-red-500 font-mono text-xs uppercase font-bold tracking-widest">Critical Market Update</div>
            <p className="text-sm text-white/80 leading-relaxed font-['Outfit']">
              The AI search visibility space (CiteSight) is now <strong>severely crowded</strong>. Peec AI raised €5.2M, HubSpot has tools, and 9+ dedicated startups exist. We recommend prioritizing the Tier A ideas below.
            </p>
          </div>
        </motion.div>

        {/* Ideas Grid */}
        <section className="space-y-12">
          <div className="text-white/40 font-mono text-[10px] uppercase tracking-widest">// Master Artifacts (Top 10 Displayed)</div>
          
          <div className="space-y-12">
            {IDEAS.map((idea, idx) => (
              <motion.div
                key={idea.rank}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <GlassCard className="p-8 group overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 w-1 h-full" 
                    style={{ backgroundColor: `var(--tier-${idea.tier.toLowerCase()})` }} 
                  />
                  
                  <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                    <div className="flex-1 space-y-8">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 font-mono text-[10px] text-white/40">
                          <span>RANK #{idea.rank}</span>
                          <span>//</span>
                          <span className="text-[var(--calyx-accent)] uppercase tracking-widest">ORIGINAL FILE #{idea.origNum}</span>
                        </div>
                        <h3 className="text-4xl font-['DM_Serif_Display'] text-white group-hover:text-[var(--calyx-accent)] transition-colors">
                          {idea.title}
                        </h3>
                        <p className="text-white/60 text-lg font-light leading-relaxed">{idea.description}</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-12 border-t border-white/5 pt-8">
                        <div className="space-y-6">
                          <div>
                            <label className="block font-mono text-[9px] uppercase text-white/40 tracking-[0.2em] mb-2">The Rage-Point</label>
                            <p className="text-sm text-white/80 leading-relaxed font-['Outfit']">{idea.ragePoint}</p>
                          </div>
                          {idea.whyForYou && (
                            <div>
                              <label className="block font-mono text-[9px] uppercase text-white/40 tracking-[0.2em] mb-2">Why It's For You</label>
                              <p className="text-sm text-white/80 leading-relaxed font-['Outfit']">{idea.whyForYou}</p>
                            </div>
                          )}
                          <div>
                            <label className="block font-mono text-[9px] uppercase text-white/40 tracking-[0.2em] mb-2">Competition Reality</label>
                            <p className="text-sm text-white/80 leading-relaxed font-['Outfit']">{idea.competition}</p>
                          </div>
                        </div>
                        <div className="space-y-6">
                          <div>
                            <label className="block font-mono text-[9px] uppercase text-white/40 tracking-[0.2em] mb-2">Build Stack ($0)</label>
                            <p className="text-sm text-white/80 leading-relaxed font-['Outfit']">{idea.buildStack}</p>
                          </div>
                          {idea.firstCustomers && (
                            <div>
                              <label className="block font-mono text-[9px] uppercase text-white/40 tracking-[0.2em] mb-2">First 10 Customers</label>
                              <p className="text-sm text-white/80 leading-relaxed font-['Outfit']">{idea.firstCustomers}</p>
                            </div>
                          )}
                          {/* Scores */}
                          <div className="flex gap-4 pt-4">
                            {Object.entries(idea.scores).map(([key, val]) => (
                              <div key={key} className="flex flex-col items-center bg-white/[0.03] border border-white/10 p-3 min-w-[70px] font-mono">
                                <span className="text-[9px] uppercase text-white/30 tracking-widest">{key.slice(0, 4)}</span>
                                <span className="text-lg text-[var(--calyx-accent)]">{val}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/[0.03] p-6 border-l-2 border-[var(--calyx-accent)]/30 backdrop-blur-sm">
                        <label className="block font-mono text-[9px] uppercase text-[var(--calyx-accent)] tracking-[0.2em] mb-2">Final Verdict</label>
                        <p className="text-sm text-white/70 italic font-['Outfit'] leading-relaxed">{idea.verdict}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-6 min-w-[160px]">
                      <div className={`px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] border-2`} style={{ 
                        backgroundColor: `var(--tier-${idea.tier.toLowerCase()})10`, 
                        borderColor: `var(--tier-${idea.tier.toLowerCase()})30`,
                        color: `var(--tier-${idea.tier.toLowerCase()})`
                      }}>
                        Tier {idea.tier} — {idea.tier === 'A' ? 'Priority Build' : 'Strong Candidate'}
                      </div>
                      <div className="text-3xl font-mono text-[var(--calyx-accent)] tracking-tighter">{idea.price}</div>
                      <div className="text-[11px] font-mono text-white/30 text-right uppercase tracking-widest">{idea.synergy}</div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        <footer className="pt-20 pb-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-white/20 uppercase tracking-[0.4em]">
          <span>Generated by Calyx Nexus // Intel Strata v4.0</span>
          <div className="flex items-center gap-4">
            <span className="w-2 h-2 bg-[var(--calyx-accent)] rounded-full animate-pulse" />
            <span className="text-[var(--calyx-accent)]">Root Authority Verified</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
