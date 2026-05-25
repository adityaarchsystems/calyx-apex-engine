
"use client";

import React from "react";
import { Credential } from "@/lib/google/tracker";

interface CredentialVaultProps {
  credentials: Credential[];
}

const CredentialVault: React.FC<CredentialVaultProps> = ({ credentials }) => {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {credentials.map((cred) => (
        <div
          key={cred.id}
          className={`
            relative px-3 py-1.5 border font-mono text-[10px] tracking-widest uppercase transition-all duration-300
            ${cred.isVerified 
              ? "bg-calyx-turquoise/15 border-calyx-turquoise text-calyx-platinum" 
              : "bg-[#152233] border-[#1e3348] text-calyx-text-muted"}
          `}
          style={{ borderRadius: "0px" }}
        >
          <div className="flex items-center gap-2">
            {cred.isVerified && (
              <div className="h-1 w-1 bg-calyx-turquoise animate-pulse" style={{ borderRadius: "0px" }} />
            )}
            {cred.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CredentialVault;
