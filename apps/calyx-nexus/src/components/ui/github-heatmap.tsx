"use client";

import React from "react";

interface ContributionDay {
    contributionCount: number;
    date: string;
}

interface ContributionWeek {
    contributionDays: ContributionDay[];
}

interface GitHubHeatmapProps {
    weeks: ContributionWeek[];
}

export function GitHubHeatmap({ weeks }: GitHubHeatmapProps) {
    if (!weeks || weeks.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-calyx-slate font-mono text-[10px] uppercase">
                [ NO_HEATMAP_DATA ]
            </div>
        );
    }

    const allDays = weeks.flatMap((week) => week.contributionDays || []);
    const trailing35Days = allDays.slice(-35);

    // Normalize data array to exactly 35 cells total
    const paddedDays = [
        ...Array(35 - trailing35Days.length).fill({ contributionCount: 0, date: "" }),
        ...trailing35Days
    ];

    const getOpacity = (count: number) => {
        if (count === 0) return 0.08;
        return Math.min(1.0, 0.2 + (count / 10) * 0.8);
    };

    return (
        <div 
            className="grid grid-cols-7 grid-rows-5 gap-2 justify-center items-center select-none"
            style={{ 
                gridTemplateRows: "repeat(5, minmax(0, 1fr))",
                gridTemplateColumns: "repeat(7, minmax(0, 1fr))"
            }}
        >
            {paddedDays.map((day, index) => {
                const opacity = getOpacity(day.contributionCount);
                return (
                    <div
                        key={index}
                        title={day.date ? `${day.date}: ${day.contributionCount} contributions` : "No contributions"}
                        className="w-5 h-5 md:w-6 md:h-6 border border-purple-500/10 rounded-sm transition-all duration-200 hover:scale-105 hover:border-purple-500/40 cursor-help"
                        style={{
                            backgroundColor: day.date ? `rgba(168, 85, 247, ${opacity})` : "rgba(168, 85, 247, 0.08)",
                        }}
                    />
                );
            })}
        </div>
    );
}
