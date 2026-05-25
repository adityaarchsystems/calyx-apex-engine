"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const StudioCanvas = dynamic(() => import('./StudioCanvas'), { ssr: false });

export default function StudioCanvasOverlay() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey) && !e.shiftKey) {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        const handleCloseEvent = () => {
            setIsOpen(false);
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('calyx-close-studio', handleCloseEvent);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('calyx-close-studio', handleCloseEvent);
        };
    }, []);

    return (
        <div 
            className={`fixed inset-0 z-[9999] bg-[#0b0a14] transition-all duration-500 ease-in-out transform ${
                isOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-full opacity-0 pointer-events-none'
            }`}
        >


            {/* Render Canvas Only When Open to Conserve Performance */}
            {isOpen && (
                <div className="w-full h-full relative">
                    <StudioCanvas />
                </div>
            )}
        </div>
    );
}
