import "./globals.css";
import { Kanit } from "next/font/google";
import Link from "next/link";

const kanit = Kanit({ 
  subsets: ["latin", "thai"], 
  weight: ["300", "400", "500", "600", "700"] 
});

export const metadata = {
  title: "ระบบสร้างใบงานภาษาไทยอัตโนมัติ",
  description: "สร้างใบงานการศึกษาด้วย AI อัจฉริยะ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body className={`${kanit.className} antialiased min-h-screen flex flex-col relative overflow-x-hidden`}>
        {/* Dynamic Background */}
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-pink-50 via-white to-blue-50" />
        <div className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pink-300/20 rounded-full blur-[100px] -z-10" />
        <div className="fixed bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-[600px] h-[600px] bg-blue-300/20 rounded-full blur-[100px] -z-10" />

        <header className="glass-panel sticky top-0 z-50 border-b border-pink-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-pink-500/30">
                  ก
                </div>
                <Link href="/" className="font-bold text-2xl text-slate-800 tracking-tight">
                  ระบบสร้าง<span className="text-pink-500">ใบงาน</span>
                </Link>
              </div>
              <nav className="flex gap-6">
                <Link href="/" className="text-slate-600 hover:text-pink-600 font-medium transition-colors">แม่แบบใบงาน</Link>
                <Link href="/logs" className="text-slate-600 hover:text-pink-600 font-medium transition-colors">ประวัติการใช้งาน</Link>
              </nav>
            </div>
          </div>
        </header>

        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          {children}
        </main>

        <footer className="py-6 text-center text-slate-500 text-sm border-t border-pink-100 glass-panel mt-auto">
          สร้างสรรค์ด้วย AI เพื่อคุณครูประถมศึกษาไทย 🇹🇭
        </footer>
      </body>
    </html>
  );
}
