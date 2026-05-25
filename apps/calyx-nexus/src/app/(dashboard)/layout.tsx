import React from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import CalyxTelemetryBroker from "@/components/CalyxTelemetryBroker";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-[#050507] text-slate-200 selection:bg-purple-500/30 selection:text-white font-sans">
            {/* Left Sidebar Shell */}
            <DashboardSidebar />

            {/* Main Content Area */}
            <main className="flex-1 pl-64 min-h-screen flex flex-col">
                <div className="flex-1 max-w-[1280px] w-full mx-auto p-8 md:p-12 space-y-8">
                    {children}
                </div>
            </main>

            {/* Decoupled Telemetry Event Toast Notification Broker */}
            <CalyxTelemetryBroker />
        </div>
    );
}
