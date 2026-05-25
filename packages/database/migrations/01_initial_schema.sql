-- ==========================================
-- Calyx Profile Matrix (CPM) - Initial Schema
-- SPRINT 1: Scaffolding & Database Migration
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- TABLE: profiles
-- ==========================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    github_username VARCHAR(255) UNIQUE NOT NULL,
    github_installation_id BIGINT,
    subscription_tier VARCHAR(50) DEFAULT 'FREE' CHECK (subscription_tier IN ('FREE', 'PREMIUM', 'ELITE')),
    theme_flavor VARCHAR(50) DEFAULT 'SCANDI_MINIMALIST',
    last_sync_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- B-Tree Index for RLS Optimization
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Explicit Segregated Policies for profiles
CREATE POLICY "profiles_select_own" ON profiles 
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "profiles_insert_own" ON profiles 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "profiles_update_own" ON profiles 
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "profiles_delete_own" ON profiles 
    FOR DELETE USING (auth.uid() = user_id);

-- ==========================================
-- TABLE: canvas_nodes
-- ==========================================
CREATE TABLE IF NOT EXISTS canvas_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    node_type VARCHAR(100) NOT NULL, -- e.g., 'header', 'stats', 'tech_stack'
    position_x FLOAT NOT NULL,
    position_y FLOAT NOT NULL,
    config_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- B-Tree Index for RLS Optimization
CREATE INDEX IF NOT EXISTS idx_canvas_nodes_profile_id ON canvas_nodes(profile_id);

-- Enable RLS
ALTER TABLE canvas_nodes ENABLE ROW LEVEL SECURITY;

-- Explicit Segregated Policies for canvas_nodes
CREATE POLICY "canvas_nodes_select_own" ON canvas_nodes 
    FOR SELECT USING (
        profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    );

CREATE POLICY "canvas_nodes_insert_own" ON canvas_nodes 
    FOR INSERT WITH CHECK (
        profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    );

CREATE POLICY "canvas_nodes_update_own" ON canvas_nodes 
    FOR UPDATE USING (
        profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    ) WITH CHECK (
        profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    );

CREATE POLICY "canvas_nodes_delete_own" ON canvas_nodes 
    FOR DELETE USING (
        profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    );

-- ==========================================
-- TABLE: sync_logs
-- ==========================================
CREATE TABLE IF NOT EXISTS sync_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    sync_status VARCHAR(50) NOT NULL CHECK (sync_status IN ('SUCCESS', 'PENDING', 'FAILED')),
    commit_sha VARCHAR(40),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- B-Tree Index for RLS Optimization
CREATE INDEX IF NOT EXISTS idx_sync_logs_profile_id ON sync_logs(profile_id);

-- Enable RLS
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;

-- Explicit Segregated Policies for sync_logs
CREATE POLICY "sync_logs_select_own" ON sync_logs 
    FOR SELECT USING (
        profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    );

-- Note: backend service role usually inserts these, but for RLS safety:
CREATE POLICY "sync_logs_insert_service" ON sync_logs 
    FOR INSERT WITH CHECK (
        profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    );
