import React, { useState, useMemo } from 'react';
import { Deportista, CategoriaEdad, CATEGORIAS_EDAD } from '../types';
import { calculateAge } from '../utils/dateAndAge';
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  Copy,
  Users,
  GraduationCap,
  MapPin,
  Filter,
  Scale,
} from 'lucide-react';

interface AthletesTableProps {
  athletes: Deportista[];
  onAddAthlete: () => void;
  onEditAthlete: (athlete: Deportista) => void;
  onDeleteAthlete: (id: string) => void;
  onDuplicateAthlete: (athlete: Deportista) => void;
}

export const AthletesTable: React.FC<AthletesTableProps> = ({
  athletes,
  onAddAthlete,
  onEditAthlete,
  onDeleteAthlete,
  onDuplicateAthlete,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sexFilter, setSexFilter] = useState<string>('all');

  const filteredAthletes = useMemo(() => {
    return athletes.filter((a) => {
      const matchesSearch =
        a.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.numeroDocumento.includes(searchTerm) ||
        a.institucionEducativa.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat = categoryFilter === 'all' || a.categoria === categoryFilter;
      const matchesSex = sexFilter === 'all' || a.sexo === sexFilter;

      return matchesSearch && matchesCat && matchesSex;
    });
  }, [athletes, searchTerm, categoryFilter, sexFilter]);

  const getCategoryBadge = (categoria: CategoriaEdad) => {
    const config = CATEGORIAS_EDAD.find((c) => c.id === categoria);
    const colorClass = config?.badgeColor || 'bg-slate-100 text-slate-800 border-slate-300';
    return (
      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorClass}`}>
        {categoria}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6 transition-all">
      {/* Header with Title and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-100 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg border border-indigo-100">
            <Users className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-800">2. Deportistas Inscritos</h2>
              <span className="px-2.5 py-0.5 text-xs font-bold bg-blue-100 text-blue-800 rounded-full">
                {athletes.length} {athletes.length === 1 ? 'atleta' : 'atletas'}
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-500">
              Inscriba a todos los participantes de su institución educativa o delegación
            </p>
          </div>
        </div>

        <button
          onClick={onAddAthlete}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm hover:shadow transition-all text-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Inscribir Deportista</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      {athletes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-5 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar por nombre, documento o colegio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
            />
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 text-slate-700"
            >
              <option value="all">Todas las categorías</option>
              {CATEGORIAS_EDAD.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={sexFilter}
              onChange={(e) => setSexFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 text-slate-700"
            >
              <option value="all">Todos los sexos</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>
          </div>
        </div>
      )}

      {/* Empty State */}
      {athletes.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">
            Aún no hay deportistas inscritos
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-4">
            Comience a inscribir a los competidores haciendo clic en el botón superior. Podrá agregar tantos como necesite y luego exportar a Excel.
          </p>
          <button
            onClick={onAddAthlete}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm text-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Inscribir Primer Deportista</span>
          </button>
        </div>
      ) : filteredAthletes.length === 0 ? (
        <div className="text-center py-8 px-4 text-slate-500 text-sm">
          No se encontraron deportistas con los filtros seleccionados.
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/80 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3 w-10 text-center">#</th>
                  <th className="py-3 px-3">Deportista</th>
                  <th className="py-3 px-3">Documento</th>
                  <th className="py-3 px-3">Edad / Categoría</th>
                  <th className="py-3 px-3">Físico / Modalidad</th>
                  <th className="py-3 px-3">Institución Educativa</th>
                  <th className="py-3 px-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {filteredAthletes.map((athlete, idx) => {
                  const age = calculateAge(athlete.fechaNacimiento);
                  return (
                    <tr key={athlete.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-3 px-3 text-center font-bold text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{athlete.nombre}</div>
                        <div className="text-slate-500 text-[11px]">
                          Nac: {athlete.fechaNacimiento} ({age} años)
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800">
                          {athlete.numeroDocumento}
                        </div>
                        <div className="text-slate-500 text-[11px]">{athlete.tipoDocumento}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="mb-1">{getCategoryBadge(athlete.categoria)}</div>
                        <div className="text-slate-500 text-[11px] font-medium">
                          Sexo: <strong className="text-slate-700">{athlete.sexo}</strong>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1 font-semibold text-slate-800">
                          <Scale className="w-3.5 h-3.5 text-slate-400" />
                          <span>{athlete.peso} kg</span>
                        </div>
                        <div className="text-[11px] text-slate-600 mt-0.5">
                          {athlete.modalidades.join(', ')}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-900 truncate max-w-xs" title={athlete.institucionEducativa}>
                          {athlete.institucionEducativa}
                        </div>
                        <div className="text-slate-500 text-[11px] flex items-center gap-1">
                          <span className="font-semibold text-slate-600">{athlete.caracterInstitucion}</span>
                          <span>•</span>
                          <span>Zona {athlete.zona}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onDuplicateAthlete(athlete)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Duplicar como base"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onEditAthlete(athlete)}
                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                            title="Editar datos"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteAthlete(athlete.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            title="Eliminar de la lista"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile & Tablet Card View */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-3">
            {filteredAthletes.map((athlete, idx) => {
              const age = calculateAge(athlete.fechaNacimiento);
              return (
                <div
                  key={athlete.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-all shadow-2xs relative flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 leading-tight">
                            {athlete.nombre}
                          </h4>
                          <span className="text-xs text-slate-500">
                            {athlete.tipoDocumento}: <strong>{athlete.numeroDocumento}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5 shrink-0">
                        <button
                          onClick={() => onDuplicateAthlete(athlete)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md"
                          title="Duplicar"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEditAthlete(athlete)}
                          className="p-1.5 text-slate-400 hover:text-amber-600 rounded-md"
                          title="Editar"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteAthlete(athlete.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="mb-2">
                      {getCategoryBadge(athlete.categoria)}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs py-2 my-2 border-y border-slate-100 bg-slate-50/50 rounded-lg px-2.5">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                          Edad y Sexo
                        </span>
                        <span className="font-semibold text-slate-800">
                          {age} años • {athlete.sexo}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                          Peso
                        </span>
                        <span className="font-semibold text-slate-800">{athlete.peso} kg</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Filter className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span>
                          <strong className="text-slate-700">Modalidades:</strong>{' '}
                          {athlete.modalidades.join(', ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate" title={athlete.institucionEducativa}>
                          {athlete.institucionEducativa}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>
                          Colegio {athlete.caracterInstitucion} • Zona {athlete.zona}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
