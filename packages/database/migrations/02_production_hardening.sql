-- ========================================================
-- Calyx Profile Matrix (CPM) - Production Hardening Schema
-- SPRINT 20: Cloud Staging & Row-Level Security
-- ========================================================

-- Enable UUID extension if not already present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table structure mapping 'user_profiles'
CREATE TABLE IF NOT EXISTS user_profiles (
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

-- Optimize queries with B-Tree indices
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- Enforce strict Row-Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Idempotently deploy tenant boundary policies
DROP POLICY IF EXISTS "Enforce strict multi-tenant boundary parameters" ON user_profiles;
CREATE POLICY "Enforce strict multi-tenant boundary parameters" ON user_profiles 
FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Align canvas_nodes table RLS rules to point to user_profiles
ALTER TABLE canvas_nodes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enforce canvas nodes tenant isolation" ON canvas_nodes;
CREATE POLICY "Enforce canvas nodes tenant isolation" ON canvas_nodes
FOR ALL TO authenticated USING (
  profile_id IN (SELECT id FROM user_profiles WHERE user_id = auth.uid())
);

-- Add width and height dimensions columns to canvas_nodes table
ALTER TABLE canvas_nodes ADD COLUMN IF NOT EXISTS width INTEGER DEFAULT 280;
ALTER TABLE canvas_nodes ADD COLUMN IF NOT EXISTS height INTEGER DEFAULT 180;
