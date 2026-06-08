"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function WorkflowExecution() {
  const params = useParams();
  const router = useRouter();
  const filename = params.filename;
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  
  const [workflow, setWorkflow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [curriculum, setCurriculum] = useState({ subjects: [] });

  useEffect(() => {
    fetch(`${apiUrl}/api/workflows`)
      .then(res => res.json())
      .then(data => {
        const wf = data.find(w => w.filename === filename);
        if (wf) {
          setWorkflow(wf);
          const inputStep = wf.steps.find(s => s.type === "input");
          if (inputStep) {
            setFormData(inputStep.params || {});
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch(`${apiUrl}/api/curriculum`)
      .then(res => res.json())
      .then(data => setCurriculum(data))
      .catch(console.error);
  }, [filename, apiUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };

    // Auto-fill indicator details if indicator is selected
    if (name === "indicatorCode") {
      const subjectObj = curriculum.subjects.find(s => s.id === formData.subject);
      if (subjectObj) {
        const gradeObj = subjectObj.grades.find(g => g.grade === formData.grade);
        if (gradeObj) {
          const ind = gradeObj.indicators.find(i => i.code === value);
          if (ind) {
            newData.indicatorDescription = ind.description;
            newData.topic = ind.description;
          }
        }
      }
    }
    
    // Reset indicator if subject or grade changes
    if (name === "subject" || name === "grade") {
      newData.indicatorCode = "";
      newData.indicatorDescription = "";
      newData.topic = "";
    }

    setFormData(newData);
  };

  const handleExecute = async (e) => {
    e.preventDefault();
    setExecuting(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`${apiUrl}/api/workflows/${filename}/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Execution failed");
      
      setResult(data.result);
    } catch (err) {
      setError(err.message);
    } finally {
      setExecuting(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin"></div></div>;
  if (!workflow) return <div className="text-center py-20 text-slate-500 text-lg">ไม่พบแม่แบบใบงาน</div>;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link href="/" className="inline-flex items-center text-pink-600 hover:text-pink-800 mb-6 font-medium bg-pink-50 px-4 py-2 rounded-full transition-colors">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        กลับไปหน้าหลัก
      </Link>

      <div className="glass-panel rounded-3xl p-8 md:p-10 mb-8 border border-white/60 relative overflow-hidden bg-white/40 shadow-xl shadow-pink-900/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-pink-200 to-transparent rounded-bl-full -z-10 opacity-40"></div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-3 tracking-tight">{workflow.name}</h1>
        <p className="text-slate-500 mb-10 text-lg">ตั้งค่าตัวเลือกด้านล่าง แล้วให้ AI ช่วยสร้างใบงานที่สมบูรณ์แบบสำหรับคุณ</p>

        <form onSubmit={handleExecute} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/60 p-8 rounded-3xl border border-white/80 shadow-[inset_0_2px_10px_rgba(255,255,255,1)]">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">วิชา (Subject)</label>
              <select name="subject" value={formData.subject || ""} onChange={handleChange} className="w-full rounded-2xl border-0 bg-slate-50/50 px-5 py-4 outline-none focus:ring-4 focus:ring-pink-500/20 focus:bg-white transition-all shadow-sm">
                <option value="">เลือกวิชา...</option>
                {curriculum.subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">ระดับชั้น (Grade)</label>
              <select name="grade" value={formData.grade || ""} onChange={handleChange} className="w-full rounded-2xl border-0 bg-slate-50/50 px-5 py-4 outline-none focus:ring-4 focus:ring-pink-500/20 focus:bg-white transition-all shadow-sm">
                <option value="">เลือกระดับชั้น...</option>
                <option value="P1">ประถมศึกษาปีที่ 1</option>
                <option value="P2">ประถมศึกษาปีที่ 2</option>
                <option value="P3">ประถมศึกษาปีที่ 3</option>
                <option value="P4">ประถมศึกษาปีที่ 4</option>
                <option value="P5">ประถมศึกษาปีที่ 5</option>
                <option value="P6">ประถมศึกษาปีที่ 6</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                {formData.subject === 'thai_phatee' ? 'บทเรียนหนังสือภาษาพาที' : 'ตัวชี้วัด (Indicator)'}
              </label>
              <select name="indicatorCode" value={formData.indicatorCode || ""} onChange={handleChange} disabled={!formData.subject || !formData.grade} className={`w-full rounded-2xl border-0 px-5 py-4 outline-none focus:ring-4 transition-all shadow-sm disabled:opacity-50 ${formData.subject === 'thai_phatee' ? 'bg-pink-50/50 focus:ring-pink-500/30 focus:bg-pink-50' : 'bg-slate-50/50 focus:ring-pink-500/20 focus:bg-white'}`}>
                <option value="">{formData.subject === 'thai_phatee' ? 'เลือกบทเรียน...' : 'เลือกตัวชี้วัด...'}</option>
                {formData.subject && formData.grade && curriculum.subjects
                  .find(s => s.id === formData.subject)?.grades
                  .find(g => g.grade === formData.grade)?.indicators
                  .map(ind => (
                    <option key={ind.code} value={ind.code}>
                      {formData.subject === 'thai_phatee' ? `${ind.code}: ${ind.description}` : `[${ind.code}] ${ind.description}`}
                    </option>
                  ))
                }
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">หัวข้อเรื่อง (Topic - อัตโนมัติ)</label>
              <input type="text" name="topic" value={formData.topic || ""} onChange={handleChange} placeholder="เช่น สระอา" className="w-full rounded-2xl border-0 bg-slate-50/50 px-5 py-4 outline-none focus:ring-4 focus:ring-pink-500/20 focus:bg-white transition-all shadow-sm" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">จำนวนข้อ (Number of Questions)</label>
              <input type="number" name="questionCount" value={formData.questionCount || 5} onChange={handleChange} min="1" max="50" className="w-full rounded-2xl border-0 bg-slate-50/50 px-5 py-4 outline-none focus:ring-4 focus:ring-pink-500/20 focus:bg-white transition-all shadow-sm" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">รูปแบบแบบฝึกหัด (Worksheet Type)</label>
              <select name="type" value={formData.type || ""} onChange={handleChange} className="w-full rounded-2xl border-0 bg-slate-50/50 px-5 py-4 outline-none focus:ring-4 focus:ring-pink-500/20 focus:bg-white transition-all shadow-sm">
                <option value="copy_words">คัดลายมือตัวบรรจง</option>
                <option value="make_sentences">แต่งประโยคจากคำที่กำหนด</option>
                <option value="fill_sentences">นำคำไปเติมในประโยคให้สมบูรณ์</option>
                <option value="write_pronunciation">เขียนคำอ่าน</option>
                <option value="matching">จับคู่คำกับความหมาย</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={executing} className="w-full bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold py-5 rounded-2xl shadow-xl shadow-pink-500/20 transition-all disabled:opacity-70 disabled:cursor-wait flex items-center justify-center text-xl transform hover:-translate-y-1 active:translate-y-0">
            {executing ? (
              <><div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin mr-3"></div> ระบบกำลังใช้ AI สร้างใบงาน...</>
            ) : (
              <><svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg> สร้างใบงานทันที</>
            )}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-5 rounded-3xl mb-8 flex items-start shadow-sm animate-in fade-in zoom-in-95">
          <svg className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <div>
            <h4 className="font-bold text-lg">เกิดข้อผิดพลาด</h4>
            <p className="text-sm mt-1 opacity-90">{error}</p>
          </div>
        </div>
      )}

      {result && (
        <div className="glass-panel rounded-3xl p-8 md:p-10 animate-in fade-in slide-in-from-bottom-8 duration-700 border border-white/60 shadow-xl bg-white/50">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-pink-100">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4 shadow-inner">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              สร้างใบงานสำเร็จแล้ว!
            </h2>
          </div>
          
          <h3 className="text-sm font-bold uppercase tracking-wider text-pink-400 mb-4">ดาวน์โหลดไฟล์ (Download Files)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {Object.entries(result.outputs).map(([stepId, data]) => {
              if (data.format && data.path) {
                const filename = data.path.split(/[\/\\]/).pop();
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
                return (
                  <a key={stepId} href={`${apiUrl}/data/${filename}`} download target="_blank" rel="noopener noreferrer" className="flex items-center p-5 bg-white/80 rounded-3xl border border-pink-100 hover:border-pink-400 hover:shadow-xl hover:shadow-pink-500/10 transition-all group">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl mr-4 group-hover:scale-110 transition-transform shadow-inner ${data.format === 'pdf' ? 'bg-red-50 text-red-500' : data.format === 'docx' ? 'bg-blue-50 text-blue-500' : 'bg-slate-100 text-slate-600'}`}>
                      {data.format}
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-bold text-slate-800 group-hover:text-pink-600 transition-colors">ดาวน์โหลด {data.format.toUpperCase()}</div>
                      <div className="text-xs text-slate-500 truncate mt-1">{filename}</div>
                    </div>
                  </a>
                );
              }
              return null;
            })}
          </div>

          <div className="bg-white/60 rounded-3xl p-6 md:p-8 border border-white shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]">
            <h3 className="text-sm font-bold uppercase tracking-wider text-pink-400 mb-6">ตัวอย่างเนื้อหา (Preview)</h3>
            {Object.values(result.outputs).map((out, idx) => {
              if (out.title && out.questions) {
                return (
                  <div key={idx} className="text-slate-700">
                    <h4 className="text-2xl font-bold text-slate-900 mb-3">{out.title}</h4>
                    <p className="mb-6 text-slate-600 bg-pink-50/50 p-4 rounded-2xl border border-pink-100 font-medium text-lg">"{out.instructions}"</p>
                    
                    <div className="space-y-4">
                      {out.questions.map((q, qidx) => (
                        <div key={qidx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                          <p className="font-medium text-lg mb-2"><span className="text-pink-500 font-bold mr-2">ข้อ {qidx + 1}.</span> {q.q}</p>
                          <div className="flex items-start">
                            <span className="text-green-500 font-bold mr-2 mt-0.5">ตอบ</span>
                            <p className="text-green-700 bg-green-50 px-3 py-1 rounded-lg inline-block">{q.a}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
