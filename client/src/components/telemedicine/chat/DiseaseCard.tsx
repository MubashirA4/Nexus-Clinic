import React from 'react';

export default function DiseaseCard({ disease }: { disease: any }) {
  return (
    <div className="p-3 bg-slate-50 rounded">
      <div className="font-semibold">{disease.name}</div>
      <div className="text-xs text-slate-500">Matched symptoms: {disease.matches?.join(', ')}</div>
      <div className="text-sm mt-2">Prevention:</div>
      <ul className="text-xs text-slate-600 list-disc pl-5">
        {(disease.prevention || []).map((p:string, i:number)=> <li key={i}>{p}</li>)}
      </ul>
    </div>
  );
}
