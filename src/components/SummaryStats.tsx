import React from 'react';
import { Deportista } from '../types';
import { Users, Award, Dumbbell, School } from 'lucide-react';

interface SummaryStatsProps {
  athletes: Deportista[];
}

export const SummaryStats: React.FC<SummaryStatsProps> = ({ athletes }) => {
  if (athletes.length === 0) return null;

  const total = athletes.length;
  const maleCount = athletes.filter((a) => a.sexo === 'Masculino').length;
  const femaleCount = athletes.filter((a) => a.sexo === 'Femenino').length;

  const oficialCount = athletes.filter((a) => a.caracterInstitucion === 'Oficial').length;
  const privadoCount = athletes.filter((a) => a.caracterInstitucion === 'Privado').length;

  // Breakdown by category
  const catCount: Record<string, number> = {};
  // Breakdown by modality
  const modCount: Record<string, number> = {};

  athletes.forEach((a) => {
    catCount[a.categoria] = (catCount[a.categoria] || 0) + 1;
    a.modalidades.forEach((m) => {
      modCount[m] = (modCount[m] || 0) + 1;
    });
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Athletes & Gender Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Inscritos
          </span>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-3xl font-extrabold text-slate-900 mb-2">{total}</div>
          <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 py-1.5 px-2.5 rounded-lg border border-slate-100">
            <span>
              Varones: <strong>{maleCount}</strong> ({Math.round((maleCount / total) * 100)}%)
            </span>
            <span>
              Damas: <strong>{femaleCount}</strong> ({Math.round((femaleCount / total) * 100)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Categories Breakdown Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Por Categorías
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
        </div>
        <div className="space-y-1.5 text-xs">
          {Object.entries(catCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([cat, count]) => (
              <div key={cat} className="flex items-center justify-between">
                <span className="text-slate-600 truncate max-w-[160px]">{cat}</span>
                <span className="font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                  {count}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Modalities Breakdown Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Modalidades
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Dumbbell className="w-4 h-4" />
          </div>
        </div>
        <div className="space-y-1 text-xs">
          {Object.entries(modCount).map(([mod, count]) => (
            <div key={mod} className="flex items-center justify-between">
              <span className="text-slate-600 truncate max-w-[150px]">{mod}</span>
              <span className="font-bold text-slate-800">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* School Character Breakdown Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Tipo Institución
          </span>
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <School className="w-4 h-4" />
          </div>
        </div>
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-600">Oficial ({oficialCount})</span>
              <span className="font-semibold text-slate-800">
                {Math.round((oficialCount / total) * 100)}%
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all"
                style={{ width: `${(oficialCount / total) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-600">Privado ({privadoCount})</span>
              <span className="font-semibold text-slate-800">
                {Math.round((privadoCount / total) * 100)}%
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-indigo-400 h-2 rounded-full transition-all"
                style={{ width: `${(privadoCount / total) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
