'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import InfrastructureSubNav from '@/components/navigation/InfrastructureSubNav';

export default function NexusLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    const showSubNav = ['/nexus/vault', '/nexus/cloud-run', '/nexus/gear', '/nexus/vertex'].includes(pathname);
    const isDailyDev = pathname === '/nexus/dailydev';

    // Global Escape Hatch - Returns to Apex Dashboard
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                router.push('/');
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [router]);

    return (
        <div className={`min-h-screen w-full bg-[#070e16] text-slate-200 font-sans selection:bg-[var(--calyx-accent)]/30 flex flex-col relative overflow-hidden ${
            isDailyDev ? 'pt-[40px]' : 'pt-0'
        }`}>
            {/* Global Sub-Level Header */}
            <header className={`w-full flex items-center justify-between p-6 absolute left-0 z-40 gap-4 ${
                isDailyDev ? 'top-[40px]' : 'top-0'
            }`}>
                <div className="flex items-center gap-3 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--calyx-accent)] animate-pulse"></span>
                    <span className="text-[10px] font-mono tracking-[0.25em] text-slate-400 uppercase">
                        [ ESC : RETURN_TO_APEX ]
                    </span>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                    {showSubNav && <InfrastructureSubNav />}

                    <span className="text-[9px] font-mono tracking-[0.25em] text-slate-500 uppercase">
                        NEXUS ROUTING ENGINE // V0.1
                    </span>
                </div>
            </header>

            {/* Dynamic Page Content Injection */}
            <main className="flex-grow flex items-center justify-center relative z-10 w-full h-full pt-20">
                {children}
            </main>
        </div>
    );
}
