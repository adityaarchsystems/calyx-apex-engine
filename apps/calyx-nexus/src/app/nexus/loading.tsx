export default function NexusLoading() {
  return (
    <div className="w-full h-[60vh] flex flex-col items-center justify-center">
      <div className="w-48 h-[1px] bg-calyx-border overflow-hidden">
        <div className="w-full h-full bg-calyx-turquoise animate-[pulse_1.5s_ease-in-out_infinite] origin-left scale-x-50"></div>
      </div>
      <p className="mt-6 font-mono text-[10px] text-calyx-slate tracking-[0.2em] uppercase">
        [ ESTABLISHING SIPHON UPLINK ]
      </p>
    </div>
  );
}
