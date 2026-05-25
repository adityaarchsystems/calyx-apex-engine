
import credentialsData from "@/config/credentials.json";

interface Credential {
  id: string;
  issuer: string;
  title: string;
  date: string;
  validationHash: string;
}

const credentials = credentialsData as Credential[];

export default async function EcosystemVaultModule() {
  return (
    <div className="relative flex flex-col h-full p-6 border border-calyx-border bg-calyx-surface overflow-hidden group">
      {/* Header Physics */}
      <div className="flex justify-between items-start mb-6">
        <span className="text-[10px] font-mono tracking-widest text-calyx-slate uppercase">Module 04</span>
        <div className="w-1.5 h-1.5 bg-[var(--calyx-accent)]/40 group-hover:bg-[var(--calyx-accent)] transition-colors duration-300"></div>
      </div>
      
      {/* Title Typography */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-calyx-platinum tracking-tight mb-2">Google / GEAR Tracker</h2>
        <p className="text-sm text-calyx-slate max-w-2xl">
          Cloud certifications, GEAR agent badges, Wear OS telemetry, and Material You tonal adherence — unified via Developer Connect.
        </p>
      </div>

      {/* INJECTION ZONE: DYNAMIC DATA */}
      <div className="flex flex-wrap gap-2 mt-auto pt-4">
        {credentials.map((cred) => (
          <div 
            key={cred.id}
            className="px-2 py-1 text-[10px] font-mono border border-calyx-border text-calyx-slate uppercase tracking-wider"
          >
            {cred.title}
          </div>
        ))}
      </div>

      {/* Footer Telemetry */}
      <div className="mt-8 pt-4 border-t border-calyx-border/20 flex justify-end">
        <span className="text-[9px] font-mono tracking-widest text-calyx-slate uppercase">
          PEOPLE API . CREDLY . VAULT
        </span>
      </div>
    </div>
  );
}
