"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Globe from "react-globe.gl";
import * as THREE from 'three';

export default function ImpactGlobe() {
    const containerRef = useRef<HTMLDivElement>(null);
    const globeRef = useRef<any>(null);
    const orbitControlsRef = useRef<any>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [countries, setCountries] = useState({ features: [] });

    // 1. Vector Topology Loader (Mandate 1.1)
    useEffect(() => {
        const hydrateGlobeDecks = async () => {
            try {
                const url = 'https://unpkg.com/globe.gl/example/datasets/ne_110m_admin_0_countries.geojson';
                const res = await fetch(url);
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const topologyPayload = await res.json();
                setCountries(topologyPayload);
            } catch (error) {
                console.error("System connection failure:", error);
            }
        };
        hydrateGlobeDecks();
    }, []);

    // 2. Spatial Telemetry (Phase 4.13 Protocol)
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        timeoutId = setTimeout(() => {
            if (!containerRef.current) return;
            const { clientWidth, clientHeight } = containerRef.current;
            if (clientWidth > 0 && clientHeight > 0) {
                setDimensions((prev) => {
                    const diffW = Math.abs(prev.width - clientWidth);
                    const diffH = Math.abs(prev.height - clientHeight);
                    if (diffW > 1.5 || diffH > 1.5) {
                        return { width: clientWidth, height: clientHeight };
                    }
                    return prev;
                });
            } else {
                setDimensions((prev) => (prev.width === 800 && prev.height === 450) ? prev : { width: 800, height: 450 });
            }
        }, 100);

        const observer = new ResizeObserver((entries) => {
            if (entries[0] && entries[0].contentRect.width > 0) {
                const { width, height } = entries[0].contentRect;
                setDimensions((prev) => {
                    const diffW = Math.abs(prev.width - width);
                    const diffH = Math.abs(prev.height - height);
                    if (diffW > 1.5 || diffH > 1.5) {
                        return { width, height };
                    }
                    return prev;
                });
            }
        });
        
        if (containerRef.current) observer.observe(containerRef.current);
        return () => { clearTimeout(timeoutId); observer.disconnect(); };
    }, []);

    // Asynchronous Polling Engine & Hardware Sync - Mandate 1.1
    useEffect(() => {
        let animationFrameId: number;
        let isIgnited = false;

        // Execute a 100ms telemetry poll to bypass network latency and mount delays
        const ignitionPoll = setInterval(() => {
            // Check if WebGL instance and its internal OrbitControls have successfully mounted
            if (globeRef.current && globeRef.current.controls() && !isIgnited) {
                isIgnited = true;
                clearInterval(ignitionPoll); // Terminate the polling engine immediately upon connection

                const controls = globeRef.current.controls();
                orbitControlsRef.current = controls;
                
                // 1. Execute Permanent Zoom Lobotomy
                controls.enableZoom = false;
                
                // 2. Inject Kinetic Rotation Parameters
                controls.autoRotate = true;
                controls.autoRotateSpeed = 1.5; // Calyx cinematic velocity

                // 3. Ignite Hardware Synchronization Loop
                const animate = () => {
                    if (orbitControlsRef.current) {
                        orbitControlsRef.current.update(); // CRITICAL: Force GPU to draw rotation state
                    }
                    animationFrameId = requestAnimationFrame(animate);
                };

                animate(); // Start the loop
            }
        }, 100); // 100ms aggressive polling frequency

        // Memory cleanup sequence
        return () => {
            clearInterval(ignitionPoll);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, []);

    // Global Desktop Event Severance (Kills Native Page Zoom from Canvas Bubbling) - Mandate 2.1
    useEffect(() => {
        const handleGlobalWheel = (e: WheelEvent) => {
            if (e.ctrlKey) {
                e.preventDefault(); // Physically blocks Chrome/Edge document zoom
            }
        };

        // MUST attach to window to intercept deeply nested WebGL canvas bubbling
        window.addEventListener('wheel', handleGlobalWheel, { passive: false });

        return () => {
            window.removeEventListener('wheel', handleGlobalWheel);
        };
    }, []);

    // 3. Kinetic Arc Data Generator (Mandate 3.1)
    const arcsData = useMemo(() => {
        const N = 8; // Restricted orbital traffic
        return [...Array(N).keys()].map(() => ({
            startLat: (Math.random() - 0.5) * 180,
            startLng: (Math.random() - 0.5) * 360,
            endLat: (Math.random() - 0.5) * 180,
            endLng: (Math.random() - 0.5) * 360,
            color: ['#a855f7', '#10b981'] // neon-purple and emerald
        }));
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden pointer-events-auto touch-action-none">
            {dimensions.width > 0 && (
                <>
                    {/* Symmetrical Bleed Wrapper - Mandate 2.1 */}
                    <div className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing z-0">
                        <Globe
                            ref={globeRef}
                            width={dimensions.width * 1.3} 
                            height={dimensions.height * 1.3}
                            backgroundColor="rgba(0,0,0,0)"
                            polygonsData={countries.features}
                            polygonCapColor={() => '#0b0a14'}
                            polygonSideColor={() => '#05050a'}
                            polygonStrokeColor={() => 'rgba(168, 85, 247, 0.25)'}
                            globeMaterial={new THREE.MeshStandardMaterial({ color: '#0b0a14', roughness: 0.9, metalness: 0.1 })}
                            atmosphereColor="#a855f7"
                            atmosphereAltitude={0.12}
                            arcsData={arcsData}
                            arcColor="color"
                            arcDashLength={0.4}
                            arcDashGap={0.2}
                            arcDashAnimateTime={4000}
                            arcStroke={0.2}
                            arcAltitudeAutoScale={0.3}
                            rendererConfig={{ antialias: true, powerPreference: "high-performance" }}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
