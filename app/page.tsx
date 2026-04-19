'use client';
import { useState } from 'react';

const ACCENT = 'from-emerald-600 to-green-600';
const ACCENT_TEXT = 'text-emerald-300';

export default function CicdPipelinePage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generate = async () => {
    if (!input.trim()) return;
    setLoading(true); setError(''); setResult('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');
      setResult(data.result || '');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white flex flex-col">
      <header className="border-b border-white/10 bg-black/30 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${ACCENT} flex items-center justify-center text-lg font-bold shadow-lg`}>⚙</div>
          <div>
            <h1 className="text-xl font-bold text-white">AI CI/CD Pipeline Generator</h1>
            <p className="text-xs text-emerald-300/80">GitHub Actions / GitLab CI from repo description</p>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8 flex flex-col gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <label className={`block text-sm font-medium ${ACCENT_TEXT} mb-2`}>
            Describe your project and CI/CD needs
          </label>
          <textarea
            className="w-full h-48 bg-black/40 border border-white/15 rounded-xl p-4 text-sm text-gray-200 font-mono placeholder-gray-600 focus:outline-none focus:border-emerald-500/60 resize-none"
            placeholder={"Next.js 15 app with TypeScript and Tailwind, using Jest for tests, deployed to Vercel, need lint + test + build stages, matrix build for Node 18/20, deploy on push to main"}
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <div className="flex items-center gap-3 mt-4">
            <button onClick={generate} disabled={loading || !input.trim()}
              className={`px-6 py-2.5 bg-gradient-to-r ${ACCENT} hover:from-emerald-500 hover:to-green-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-900/30`}>
              {loading ? '🔄 Generating...' : '⚙ Generate CI/CD Pipeline'}
            </button>
            <button onClick={() => { setInput(''); setResult(''); setError(''); }}
              className="px-4 py-2.5 text-gray-400 hover:text-white transition-colors text-sm">Clear</button>
          </div>
        </div>
        {error && <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 text-red-300 text-sm">⚠️ {error}</div>}
        {result && (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="bg-black/30 px-6 py-3 border-b border-white/10 flex items-center justify-between">
              <span className="text-sm font-medium text-emerald-300">Generated CI/CD Config</span>
              <button onClick={() => navigator.clipboard.writeText(result)} className="text-xs text-gray-500 hover:text-white transition-colors">📋 Copy</button>
            </div>
            <pre className="p-6 text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed max-h-[600px] overflow-y-auto">{result}</pre>
          </div>
        )}
      </main>
    </div>
  );
}
