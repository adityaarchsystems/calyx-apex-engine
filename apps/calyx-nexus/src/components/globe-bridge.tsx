
"use client";

import dynamic from "next/dynamic";
import React from "react";

// The dynamic import with ssr: false must live inside a Client Component
const GlobeClient = dynamic(() => import("./impact-globe"), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-calyx-surface animate-pulse" />
});

export default function GlobeBridge(props: any) {
  return <GlobeClient {...props} />;
}
