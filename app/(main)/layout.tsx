import Navbar from "@/components/Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#070812] text-white">
      <div className="ambient-background" />

      <Navbar />

      <main className="relative">
        {children}
      </main>
    </div>
  );
}