import React, { useState } from 'react';

export default function SymptomChecker({ onAnalyze, onClose }: { onAnalyze: (symptoms: string[], severity?: number, duration?: string) => void, onClose: () => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [severity, setSeverity] = useState(3);
  const [duration, setDuration] = useState('short');
  const common = ['headache','fever','cough','sore throat','runny nose','sneezing','nausea','fatigue','rash','shortness of breath'];

  function toggle(sym: string) {
    setSelected(s => s.includes(sym) ? s.filter(x=>x!==sym) : [...s, sym]);
  }

  function submit() {
    if (selected.length === 0) return alert('Select at least one symptom');
    onAnalyze(selected, severity, duration);
    onClose();
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {common.map(sym => (
          <button key={sym} onClick={()=>toggle(sym)} className={`px-2 py-1 rounded ${selected.includes(sym)?'bg-blue-500 text-white':'bg-slate-100 text-slate-800'}`}>{sym}</button>
        ))}
      </div>

      <div className="mb-3">
        <div className="text-sm mb-1">Severity: {severity}</div>
        <input type="range" min={1} max={5} value={severity} onChange={e=>setSeverity(Number(e.target.value))} />
      </div>

      <div className="mb-3">
        <div className="text-sm mb-1">Duration</div>
        <select value={duration} onChange={e=>setDuration(e.target.value)} className="px-2 py-1 border rounded">
          <option value="short">Short (&lt; 3 days)</option>
          <option value="medium">Medium (3-14 days)</option>
          <option value="long">Long (&gt; 14 days)</option>
        </select>
      </div>

      <div className="flex justify-end space-x-2">
        <button onClick={onClose} className="px-3 py-1 rounded bg-slate-200">Cancel</button>
        <button onClick={submit} className="px-3 py-1 rounded bg-blue-600 text-white">Analyze</button>
      </div>
    </div>
  );
}
