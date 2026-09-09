import Image from "next/image";
export default function Loading() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070812]">
      <div className="absolute h-64 w-64 rounded-full bg-cyan-400/10 blur-[100px]" />

      <div className="relative text-center">
        <div className="relative mx-auto h-14 w-14">
          <div className="absolute inset-0 animate-ping rounded-full bg-cyan-400/10" />

          <div className="relative flex h-14 w-14 animate-spin items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/5 shadow-[0_0_30px_rgba(34,211,238,0.15)]">
            <span className="text-xl font-bold text-cyan-300">
             <Image
  src="/icon.png"
  alt="DevConnect"
  width={56}
  height={56}
  className="h-full w-full object-cover"
 />
            </span>
          </div>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Loading DevConnect...
        </p>

        <div className="mx-auto mt-4 h-1 w-32 overflow-hidden rounded-full bg-white/5">
          <div className="h-full w-1/2 animate-[loadingBar_1.2s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500" />
        </div>
      </div>
    </div>
  );
}