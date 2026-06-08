"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/api/logs")
      .then(res => res.json())
      .then(data => {
        setLogs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8 mt-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">Execution Logs</h1>
          <p className="text-slate-500 mt-2">History of all generated worksheets.</p>
        </div>
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-5 py-2.5 rounded-full transition-colors">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Workflows
        </Link>
      </div>

      {logs.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center text-slate-500 border border-white/60">
          <svg className="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          <h3 className="text-xl font-bold text-slate-700 mb-2">No logs found</h3>
          <p>Run a workflow to see its execution history here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {logs.map((logItem, index) => (
            <div key={index} className="glass-panel rounded-2xl p-6 border border-white/60 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${logItem.data.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {logItem.data.status}
                    </span>
                    <span className="font-mono text-sm text-slate-500">{logItem.data.workflowId}</span>
                  </div>
                  <div className="text-sm text-slate-400">
                    {new Date(logItem.data.timestamp).toLocaleString()}
                  </div>
                </div>
                {logItem.data.status === 'SUCCESS' && logItem.data.context && (
                  <div className="mt-4 md:mt-0 flex gap-2">
                    {Object.values(logItem.data.context.outputs || {}).map((out, idx) => {
                      if (out.format && out.path) {
                        const filename = out.path.split(/[\/\\]/).pop();
                        return (
                          <a key={idx} href={`http://localhost:3001/data/${filename}`} download target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:text-blue-600 hover:border-blue-300 transition-colors">
                            {out.format.toUpperCase()}
                          </a>
                        );
                      }
                      return null;
                    })}
                  </div>
                )}
              </div>
              
              {logItem.data.status === 'FAILED' ? (
                <div className="text-red-600 text-sm font-mono bg-red-50 p-4 rounded-xl overflow-x-auto">
                  {logItem.data.error}
                </div>
              ) : (
                <div className="text-sm text-slate-600">
                  {Object.values(logItem.data.context.outputs || {}).find(o => o.title) && (
                    <p className="font-medium text-slate-800">
                      Generated: "{Object.values(logItem.data.context.outputs).find(o => o.title).title}"
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
