import React from "react";

export default function GatewayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col min-h-screen">
      <main id="strata-content-wrapper" className="relative flex-grow overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
