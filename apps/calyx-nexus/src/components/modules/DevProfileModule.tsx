"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DailyDevIdentityProfile } from '@cpm/types';

interface DevProfileModuleProps {
    username?: string;
}

export default function DevProfileModule({ username = "calyx" }: DevProfileModuleProps) {
    const [profile, setProfile] = useState<DailyDevIdentityProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [fetchTime, setFetchTime] = useState<number | null>(null);
    const [secondsElapsed, setSecondsElapsed] = useState<number>(0);

    useEffect(() => {
        let isMounted = true;
        
        async function fetchProfile() {
            try {
                setLoading(true);
                const response = await fetch(`/api/dailydev/${username}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const resData = await response.json();
                if (resData.success && isMounted) {
                    setProfile(resData.data);
                    setFetchTime(Date.now());
                } else if (isMounted) {
                    throw new Error(resData.error || 'Failed to fetch daily.dev profile');
                }
            } catch (err: any) {
                if (isMounted) {
                    setError(err.message || 'Unknown network error');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchProfile();

        return () => {
            isMounted = false;
        };
    }, [username]);

    useEffect(() => {
        if (!fetchTime) {
            return;
        }
        const interval = setInterval(() => {
            setSecondsElapsed(Math.floor((Date.now() - fetchTime) / 1000));
        }, 1000);
        return () => clearInterval(interval);
    }, [fetchTime]);

    return (
        <div className="relative flex flex-col h-full p-6 sm:p-8 border border-[#a855f7]/30 bg-[#0b0a14]/65 hover:border-[#a855f7]/60 shadow-[0_0_12px_rgba(168,85,247,0.15)] rounded-sm overflow-hidden group transition-all duration-300">
            {/* Ambient Purple Grid Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.08),transparent_50%)] pointer-events-none" />

            {/* Header Physics */}
            <div className="flex justify-between items-start mb-4 relative z-10">
                <span className="text-[10px] font-mono tracking-widest text-[#a855f7]/85 uppercase">
                    Module 05
                </span>
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
                    </span>
                    <span className="text-[9px] font-mono tracking-widest text-[#10b981] uppercase">
                        Edge Cache Sync
                    </span>
                </div>
            </div>

            {/* Title Typography */}
            <div className="mb-6 relative z-10">
                <h2 className="text-xl font-medium tracking-tight text-slate-200 uppercase flex items-center gap-2">
                    daily.dev Matrix Identity
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">
                    Edge-caching ingestion pipeline proxying developer reading habits, community reputation, and active research trajectories.
                </p>
            </div>

            {/* Core Content Layout */}
            {loading ? (
                <div className="flex-grow flex flex-col items-center justify-center py-8 relative z-10">
                    <div className="w-8 h-8 border-2 border-t-transparent border-[#a855f7] rounded-full animate-spin mb-3" />
                    <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Hydrating Data Pipeline...</span>
                </div>
            ) : error ? (
                <div className="flex-grow flex flex-col items-center justify-center py-8 text-center relative z-10">
                    <div className="text-rose-500 text-sm font-mono uppercase mb-2">Sync Error</div>
                    <p className="text-xs text-slate-500 max-w-md">{error}</p>
                </div>
            ) : profile ? (
                <div className="flex-grow flex flex-col gap-6 relative z-10">
                    {/* Metrics Row */}
                    <div className="grid grid-cols-3 gap-4 w-full">
                        {/* Streak Metric */}
                        <Link href="/nexus/dailydev?metric=streak" className="flex flex-col p-3 bg-slate-900/40 border border-slate-800/60 rounded-sm hover:border-[#10b981]/40 transition-colors">
                            <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">
                                Reading Streak
                            </span>
                            <div className="flex items-baseline gap-1 mt-1">
                                <span className="text-2xl font-bold text-[#10b981] font-mono">
                                    {profile.readingStreak}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">days</span>
                            </div>
                        </Link>

                        {/* Bookmarks Metric */}
                        <Link href="/nexus/dailydev?metric=bookmarks" className="flex flex-col p-3 bg-slate-900/40 border border-slate-800/60 rounded-sm hover:border-[#a855f7]/40 transition-colors">
                            <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">
                                Saved Items
                            </span>
                            <div className="flex items-baseline gap-1 mt-1">
                                <span className="text-2xl font-bold text-[#a855f7] font-mono">
                                    {profile.bookmarksCount}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">articles</span>
                            </div>
                        </Link>

                        {/* Reputation Metric */}
                        <Link href="/nexus/dailydev?metric=reputation" className="flex flex-col p-3 bg-slate-900/40 border border-slate-800/60 rounded-sm hover:border-[#a855f7]/40 transition-colors">
                            <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">
                                Reputation
                            </span>
                            <div className="flex items-baseline gap-1 mt-1">
                                <span className="text-2xl font-bold text-slate-200 font-mono">
                                    {profile.reputation}
                                </span>
                                <span className="text-[10px] text-[#a855f7] font-mono">pts</span>
                            </div>
                        </Link>
                    </div>

                    {/* Technology Matrices Grid */}
                    <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">
                            Favorite Technology Matrix
                        </span>
                        <div className="flex flex-wrap gap-2">
                            {profile.favoriteTags.map((tag, idx) => (
                                <span 
                                    key={tag} 
                                    className="px-2.5 py-1 text-[11px] font-mono border border-slate-800 bg-slate-950/80 text-slate-300 rounded-sm uppercase tracking-wider hover:border-[#a855f7]/50 hover:text-white hover:bg-slate-900/80 transition-all duration-200 cursor-default"
                                    style={{
                                        willChange: 'transform, opacity',
                                        transform: 'translate3d(0,0,0)'
                                    }}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Sync Verification Timestamp */}
                    <div className="mt-auto pt-4 border-t border-slate-800/50 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">
                                User: @{profile.username}
                            </span>
                            <a 
                                href="https://app.daily.dev/adityaarchsystems"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3 border border-[#a855f7]/60 hover:border-[#a855f7] hover:bg-[#a855f7]/10 shadow-[0_0_12px_rgba(168,85,247,0.3)] rounded text-xs font-mono text-zinc-300 hover:text-white transition-all uppercase tracking-wider"
                            >
                                VIEW PROFILE ↗
                            </a>
                        </div>
                        <span className="text-[9px] font-mono text-slate-500">
                            {secondsElapsed === 0 
                                ? "Sync State: Active // Verified Just Now" 
                                : `Cache Age: ${secondsElapsed}s ago`}
                        </span>
                    </div>
                </div>
            ) : (
                <div className="flex-grow flex items-center justify-center py-8 text-slate-500 text-xs font-mono">
                    No data pipeline active.
                </div>
            )}
        </div>
    );
}
