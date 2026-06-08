"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    fetch(`${apiUrl}/api/workflows`)
      .then((res) => res.json())
      .then((data) => {
        setWorkflows(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const scrollToWorkflows = () => {
    document.getElementById('workflows-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="animate-in fade-in duration-700 ease-out translate-y-0 pb-20">
      
      {/* Hero Section */}
      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12 mt-10 mb-24">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
            เตรียมการสอนง่ายๆ <br className="hidden md:block" />
            ให้ <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-400">AI ช่วยคุณสิ!</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-10 leading-relaxed max-w-2xl">
            สร้างใบงานภาษาไทยสวยๆ ตรงตามเนื้อหา "ภาษาพาที" ป.1 - ป.6 ได้ภายใน 5 วินาที ไม่ต้องนั่งพิมพ์เองอีกต่อไป
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button onClick={scrollToWorkflows} className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white rounded-2xl font-bold text-xl shadow-xl shadow-pink-500/30 transform hover:-translate-y-1 transition-all flex items-center justify-center">
              เริ่มสร้างใบงานฟรี
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
          </div>
        </div>
        <div className="flex-1 relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-pink-200 to-blue-200 rounded-full blur-[80px] opacity-60 -z-10 animate-pulse"></div>
          <img src="/hero.png" alt="Teacher using AI" className="w-full max-w-lg mx-auto transform hover:scale-105 transition-transform duration-700 drop-shadow-2xl" />
        </div>
      </div>

      {/* Pain Points Section */}
      <div className="mb-24 bg-white/40 rounded-3xl p-10 border border-white/60 shadow-lg">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-12">เคยเจอปัญหาเหล่านี้ไหมเวลาเตรียมสอน?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel p-8 rounded-3xl border border-red-100 bg-red-50/30 text-center">
            <div className="w-16 h-16 mx-auto bg-red-100 text-red-500 rounded-2xl flex items-center justify-center mb-6 text-3xl shadow-sm">🕒</div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">เสียเวลาวันหยุด</h3>
            <p className="text-slate-600">ต้องใช้เวลาหลายชั่วโมงเพื่อหาแบบฝึกหัดในเน็ต หรือมานั่งพิมพ์ทีละคำเพื่อสร้างใบงานเอง</p>
          </div>
          <div className="glass-panel p-8 rounded-3xl border border-orange-100 bg-orange-50/30 text-center">
            <div className="w-16 h-16 mx-auto bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center mb-6 text-3xl shadow-sm">📚</div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">คำศัพท์ไม่ตรงบทเรียน</h3>
            <p className="text-slate-600">ใบงานในเน็ตมักมีคำยากๆ ปะปนมา ไม่ตรงกับเนื้อหาหนังสือ "ภาษาพาที" ที่กำลังสอนอยู่</p>
          </div>
          <div className="glass-panel p-8 rounded-3xl border border-blue-100 bg-blue-50/30 text-center">
            <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-500 rounded-2xl flex items-center justify-center mb-6 text-3xl shadow-sm">🥱</div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">หน้าตาไม่น่าสนใจ</h3>
            <p className="text-slate-600">ใบงานดูจืดชืด น่าเบื่อ ไม่มีภาพประกอบที่ดึงดูดใจ ทำให้เด็กๆ ไม่อยากทำ</p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-32">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-4">ให้ AI ของเราช่วยจัดการให้คุณ!</h2>
        <p className="text-xl text-center text-slate-500 mb-12">ระบบถูกออกแบบมาเพื่อคุณครูประถมไทยโดยเฉพาะ</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="glass-panel p-8 rounded-3xl bg-white/60 border border-white flex items-start">
            <div className="w-14 h-14 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center shrink-0 mr-6 shadow-sm">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">สร้างใบงานใน 5 วินาที</h3>
              <p className="text-slate-600 leading-relaxed">เพียงแค่เลือกวิชาและระดับชั้น ระบบ AI อัจฉริยะจะสร้างโจทย์พร้อมเฉลยให้คุณทันที ประหยัดเวลาไปได้มหาศาล</p>
            </div>
          </div>
          
          <div className="glass-panel p-8 rounded-3xl bg-white/60 border border-white flex items-start">
            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center shrink-0 mr-6 shadow-sm">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">ตรงตาม "ภาษาพาที" 100%</h3>
              <p className="text-slate-600 leading-relaxed">มีฐานข้อมูลคำศัพท์และสระแยกตามบทเรียน (ป.1 - ป.6) มั่นใจได้ว่าโจทย์ทุกข้อจะมีแต่คำที่เด็กๆ เรียนมาแล้วเท่านั้น</p>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl bg-white/60 border border-white flex items-start">
            <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center shrink-0 mr-6 shadow-sm">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">ภาพระบายสีสุดน่ารัก</h3>
              <p className="text-slate-600 leading-relaxed">ตกแต่งใบงานด้วยภาพวาดลายเส้นสุ่ม 4 มุมกระดาษ ให้เด็กๆ ได้สนุกกับการระบายสีหลังทำโจทย์เสร็จ</p>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl bg-white/60 border border-white flex items-start">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 mr-6 shadow-sm">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">พร้อมพิมพ์ใช้งานได้เลย</h3>
              <p className="text-slate-600 leading-relaxed">ระบบจัดหน้ากระดาษแบบ A4 ให้เรียบร้อย ส่งออกเป็นไฟล์ PDF พร้อมสั่งพิมพ์ หรือนำไปปรับแก้ต่อในไฟล์ DOCX ได้</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent my-16"></div>

      {/* Workflows Section */}
      <div id="workflows-section" className="scroll-mt-24 text-center mb-12">
        <span className="bg-pink-100 text-pink-600 font-bold px-4 py-1.5 rounded-full text-sm uppercase tracking-wider mb-4 inline-block">เริ่มต้นใช้งาน</span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">เลือกรูปแบบใบงานที่คุณต้องการ</h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto">
          {workflows.length > 0 ? (
            workflows.map((wf) => (
              <div key={wf.id} className="glass-panel rounded-3xl p-8 md:p-12 border border-white/80 bg-white/50 shadow-2xl shadow-pink-900/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-pink-200/50 to-transparent rounded-bl-full -z-10 transition-transform duration-700 group-hover:scale-110"></div>
                
                <div className="flex flex-col md:flex-row items-center gap-10">
                  {/* Preview Image */}
                  <div className="w-full md:w-1/2 flex justify-center">
                    <div className="relative w-full max-w-sm aspect-[3/4] bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden transform group-hover:-rotate-2 group-hover:scale-105 transition-all duration-500">
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-white/10 z-10"></div>
                      <img src="/worksheet_preview.png" alt="Sample Worksheet" className="w-full h-full object-cover" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="w-full md:w-1/2 text-center md:text-left">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-100 to-rose-50 flex items-center justify-center text-pink-500 mb-6 mx-auto md:mx-0 shadow-sm border border-white">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-800 mb-4">{wf.name}</h3>
                    <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                      เข้าสู่หน้าตั้งค่าเพื่อเลือกระดับชั้น ตัวชี้วัด และรูปแบบของใบงาน ระบบจะสุ่มสร้างโจทย์ที่ตรงกับความต้องการของคุณทันที พร้อมส่งออกเป็น PDF ทันที
                    </p>
                    
                    <Link href={`/workflow/${wf.filename}`} className="inline-flex items-center px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-lg shadow-lg shadow-slate-900/20 transform hover:-translate-y-1 transition-all">
                      ตั้งค่าและสร้างใบงาน
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </Link>
                    
                    <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-8">
                      {wf.steps.map(s => (
                        <span key={s.id} className="text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 bg-pink-50 text-pink-600 rounded-lg border border-pink-100">
                          {s.type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white/50 rounded-3xl border border-dashed border-slate-300">
              <p className="text-slate-500 text-lg">ไม่พบแม่แบบใบงานในระบบ</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
