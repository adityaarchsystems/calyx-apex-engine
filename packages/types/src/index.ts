export type SubscriptionTier = 'FREE' | 'PREMIUM' | 'ELITE';

export type ThemeFlavor = 
    | 'LUXURY_GLASSMORPHISM' 
    | 'RETRO_TERMINAL' 
    | 'SCANDI_MINIMALIST' 
    | 'EIGHT_BIT_GIT';

export interface Profile {
    id: string;
    user_id: string;
    github_username: string;
    github_installation_id: number | null;
    subscription_tier: SubscriptionTier;
    theme_flavor: ThemeFlavor;
    last_sync_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface ApiHydrationMeta {
    source: 'GITHUB' | 'CUSTOM_REST';
    endpoint_target: string;
    sync_interval_ms: number;
    last_hydrated_at?: string;
    error_fallback_active: boolean;
}

export interface DeveloperProfileMetrics {
    totalStarsCount: number;
    totalCommitContributions: number;
    openSourceContributionCount: number;
    accountCreationDate: string;
}

export interface ApiHydrationMetrics {
    github_repos?: number;
    github_stars?: number;
    github_followers?: number;
    github_contributions?: number;
    lastHydratedAt?: string;
    developer_metrics?: DeveloperProfileMetrics;
}

export interface StatsNodeConfig {
    hydrationMode: 'STATIC' | 'LIVE_API';
    apiUsername?: string;
    column1Mapping?: 'github_repos' | 'github_stars' | 'github_followers' | 'github_contributions';
    column2Mapping?: 'github_repos' | 'github_stars' | 'github_followers' | 'github_contributions';
    static_values: {
        stat1Val: string;
        stat1Label: string;
        stat2Val: string;
        stat2Label: string;
    };
    hydrated_values?: ApiHydrationMetrics;
}

export interface CanvasNode {
    id: string;
    profile_id: string;
    node_type: string;
    position_x: number;
    position_y: number;
    config_data: Record<string, any>;
    width?: number;
    height?: number;
    api_hydration_meta?: ApiHydrationMeta;
    created_at: string;
    updated_at: string;
}

export interface SyncLog {
    id: string;
    profile_id: string;
    sync_status: 'SUCCESS' | 'PENDING' | 'FAILED';
    commit_sha: string | null;
    error_message: string | null;
    created_at: string;
}

export interface StagingDeploymentDeck {
    cfWorkerUrl: string;
    cfRouteStatus: 'ACTIVE' | 'PENDING' | 'ERROR';
    supabaseDbUrl: string;
    redisRestUrl: string;
    connectionValidated: boolean;
    lastCheckedAt: string;
    latencies: number[];
}

export interface IntegrationConfig {
    webhookUrl: string;
    webhookSecret: string;
    webhookSecretVisible: boolean;
    customDomain: string;
    customDomainStatus: 'PENDING' | 'VALID' | 'FAILED' | 'INACTIVE';
    billingTier: 'STARTER' | 'PRO' | 'ENTERPRISE';
    stagingDeck?: StagingDeploymentDeck;
}

export interface CanvasNodeDimensions {
    width: number;
    height: number;
    lockCoordinates?: boolean;
}

export interface PreCuratedKineticAsset {
    token: 'MATRIX_STREAM' | 'TELEMETRY_HALO' | 'TERMINAL_BLINK' | 'CHARACTER_CUTOUT';
    name: string;
    mediaAssetUrl: string;
    transparentLoop: boolean;
}

export interface HistoricTimeSeriesBucket {
    timestamp: string;
    pageViews: number;
    widgetRequests: number;
    cacheHitRate: number;
    compileLatency: number;
}

export interface TechStackNodeProperties {
    styleTier: 'MAX_FIDELITY_STANDARD' | 'MAX_FIDELITY_MINIMALIST';
    selectedIconTokens: string[];
    customGlowIntensity: number;
}

export interface PackageReleaseNodeConfig {
    hydrationMode: 'STATIC' | 'LIVE_API';
    registry: 'NPM' | 'PYPI' | 'CRATES_IO';
    packageName: string;
    static_values: { version: string; downloads: string };
    hydrated_values?: { version: string; downloads: number; lastUpdated: string };
}

export interface TestSuiteNodeConfig {
    hydrationMode: 'STATIC' | 'LIVE_API';
    repositoryPath: string;
    branchTarget: string;
    static_values: { passingTests: string; totalTests: string; suiteStatus: string };
    hydrated_values?: { passingTests: number; totalTests: number; suiteStatus: 'PASSING' | 'FAILING' | 'PENDING' | 'RUNNING' };
}

export interface LeetCodeNodeConfig {
    hydrationMode: 'STATIC' | 'LIVE_API';
    leetcodeUsername: string;
    static_values: { solvedCount: string; activeRanking: string };
    hydrated_values?: { solvedCount: number; totalQuestions: number; activeRanking: number };
}

export interface PackageLanguageMap {
    [languageName: string]: number;
}

export interface WakaTimeNodeConfig {
    hydrationMode: 'STATIC' | 'LIVE_API';
    wakatimeProfilePointer: string;
    static_values: { languages: PackageLanguageMap };
    hydrated_values?: { languages: PackageLanguageMap; weeklyTotalHours: number };
}

export interface LanguageData {
    lang: string;
    pct: number;
}

export interface ProductShowcaseNodeConfig {
    projectTitle: string;
    externalUrl: string;
    projectDescription: string;
    displayFlavor: 'MINI_BROWSER' | 'FLAT_CARD';
    static_values: { linesOfCode?: string; stackTags: string[] };
}

export interface LiveGuestbookNodeConfig {
    maxRollingLogs: number;
    allowAnonymousSignatures: boolean;
    static_values: { logs: Array<{ timestamp: string; handle: string; msg: string }> };
}

export interface SystemErrorLogPayload {
    logId: string;
    originatingNodeId: string;
    integrationTarget: 'GITHUB' | 'WAKATIME' | 'LEETCODE' | 'NPM';
    errorCode: 'TOKEN_EXPIRED' | 'RATE_LIMITED' | 'CONNECTION_TIMEOUT';
    rawErrorMessage: string;
    firedAt: string;
}

export interface ApiQuotaMetric {
    provider: 'GITHUB' | 'WAKATIME' | 'LEETCODE';
    requestsRemaining: number;
    totalQuotaLimit: number;
    resetTimestamp: string;
    utilizationPercentage: number;
}

export interface CustomDomainSslConfig {
    hostname: string;
    cnameTarget: string;
    isCnameValid: boolean;
    sslStatus: 'ISSUING' | 'ACTIVE' | 'EXPIRED' | 'FAILED';
    lastCheckedAt: string;
}

export interface SyncQuotaStreamPayload {
    metrics: ApiQuotaMetric[];
    updatedAt: string;
}

export interface DomainVerificationStreamPayload {
    config: CustomDomainSslConfig;
    updatedAt: string;
}

export interface TemplateDeduplicationConfig {
    primarySlotMapping: string;
    backupSlotPriorityChain: string[];
}

export interface WebsiteTemplateMeta {
    templateId: 'LUXURY_GLASSMORPHISM' | 'RETRO_TERMINAL' | 'SCANDI_MINIMALIST';
    isActive: boolean;
    customCnameRoute?: string;
    formCaptureEndpoint: string;
}

export interface FlexboxSlotAllocation {
    slotId: 'NAV_BAR' | 'HERO_SECTION' | 'PROJECTS_GALLERY' | 'CONTACT_FOOTER';
    nodeId: string;
    componentType: string;
    serializedProperties: Record<string, any>;
}

export interface WebsiteDocumentStack {
    userId: string;
    activeFlavor: 'LUXURY_GLASSMORPHISM' | 'RETRO_TERMINAL' | 'SCANDI_MINIMALIST';
    customHostname?: string;
    sections: FlexboxSlotAllocation[];
    deployedAt?: string;
}

export interface ContributionsMatrixPayload {
    totalYearlyCommits: number;
    gridIntensityMap: number[][];
    colorPaletteFlavor: string;
}

export interface KineticAnimationTrack {
    nodeId: string;
    enableTerminalCursorBlink: boolean;
    enableAmbientEdgeGlow: boolean;
    enableWaveMotionVectors: boolean;
}

export interface RealPingLatencyResponse {
    status: 'OPTIMAL' | 'DEGRADED';
    latencyMs: number;
    edgeTimestamp: string;
}

export interface WebsiteSectionConfig {
    sectionId: 'GLOBAL_NAV' | 'HERO_NARRATIVE' | 'PROJECTS_BENEDICT' | 'CONTACT_FOOTER';
    componentVariant: 'LUXURY_GLASSMORPHISM' | 'RETRO_TERMINAL' | 'SCANDI_MINIMALIST';
    properties: Record<string, any>;
    displayOrder: number;
}

export interface KineticAssetRegistry {
    nodeId: string;
    mediaAssetUrl: string;
    scalingRatio: 'CONTAIN' | 'COVER' | 'SCALE_DOWN';
    frameRateCap: number;
}

export interface IconographyTierConfig {
    styleTier: 'MAX_FIDELITY_STANDARD' | 'MAX_FIDELITY_MINIMALIST';
    overrideHexColor?: string;
}

export interface IconVectorPathDefinition {
    iconToken: string;
    viewBox: string;
    svgPathStrings: string[];
    brandPrimaryHex: string;
}

export interface IntegratedMediaLayerPayload {
    mediaBoxId: string;
    assetUrl: string;
    isProxyCompliant: boolean;
}

export interface DailyDevIdentityProfile {
    username: string;
    readingStreak: number;
    bookmarksCount: number;
    favoriteTags: string[];
    reputation: number;
    lastActiveAt: string;
}

export interface NexusTelemetryPacket {
    packetId: string;
    timestamp: string;
    activeNodesCount: number;
    averageLatencyMs: number;
    cacheEfficiency: number;
    systemStatus: 'OPTIMAL' | 'DEGRADED' | 'CRITICAL';
}

export interface CalyxMatrixDeploymentPayload {
    matrixId: string;
    nodeCount: number;
    layerCards: number;
    timestamp: string;
    latencyDelta: number;
    activeNodesSummary: string[];
}

export interface CalyxBentoCellAttributes {
    id: string;
    label: string;
    type: 'core' | 'infrastructure' | 'showcase' | 'kinetic';
    weight: number;
    status: 'active' | 'standby' | 'compiled';
    lastSynchronized: string;
}

declare global {
    interface WindowEventMap {
        'calyx-matrix-deployed': CustomEvent<CalyxMatrixDeploymentPayload>;
    }
}

