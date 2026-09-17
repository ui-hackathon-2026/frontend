import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#fafbfc] flex flex-col items-center justify-center p-6 text-slate-800">
      <div className="max-w-md w-full text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-[#0018a8] font-bold text-xl">
          P
        </div>
        <h1 className="text-xl font-bold text-[#0a192f]">Paragon Formulation Studio</h1>
        <p className="text-sm text-slate-500">
          Halaman utama sementara dikosongkan. Komponen showcase dan design system telah dipindahkan ke halaman contoh.
        </p>
        <div className="pt-2">
          <Link
            href="/contoh-halaman"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[#001299] text-white hover:bg-[#000e7a] shadow-xs transition-all"
          >
            <span>Buka Showcase Komponen (/contoh-halaman)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </main>
  );
}
