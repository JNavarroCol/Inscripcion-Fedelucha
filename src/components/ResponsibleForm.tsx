import React, { useMemo } from 'react';
import { ResponsibleData } from '../types';
import { DEPARTAMENTOS_COLOMBIA } from '../data/colombiaData';
import { UserCheck, Mail, Phone, MapPin, Building2, CheckCircle2 } from 'lucide-react';

interface ResponsibleFormProps {
  data: ResponsibleData;
  onChange: (field: keyof ResponsibleData, value: string) => void;
  errors?: Partial<Record<keyof ResponsibleData, string>>;
}

export const ResponsibleForm: React.FC<ResponsibleFormProps> = ({
  data,
  onChange,
  errors = {},
}) => {
  const selectedDeptObj = useMemo(() => {
    return DEPARTAMENTOS_COLOMBIA.find(
      (d) => d.nombre.toLowerCase() === (data.departamento || '').toLowerCase()
    );
  }, [data.departamento]);

  const availableCities = selectedDeptObj ? selectedDeptObj.ciudades : [];

  const isFormComplete =
    Boolean(data.nombreResponsable?.trim()) &&
    Boolean(data.correoElectronico?.trim()) &&
    Boolean(data.telefono?.trim()) &&
    Boolean(data.departamento?.trim()) &&
    Boolean(data.municipio?.trim());

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6 transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-100 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg border border-blue-100">
            <UserCheck className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              1. Datos de Quien Diligencia el Formulario
            </h2>
            <p className="text-xs md:text-sm text-slate-500">
              Información del delegado, entrenador o responsable del registro institucional
            </p>
          </div>
        </div>

        {isFormComplete ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Datos completos
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 self-start sm:self-auto">
            Campos obligatorios pendientes
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {/* Nombre Responsable */}
        <div className="lg:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Nombre completo de quien diligencia <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <UserCheck className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={data.nombreResponsable}
              onChange={(e) => onChange('nombreResponsable', e.target.value)}
              placeholder="Ej: Lic. Carlos Andrés Mendoza"
              className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50/50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.nombreResponsable
                  ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-500'
                  : 'border-slate-300 focus:ring-blue-100 focus:border-blue-600'
              }`}
            />
          </div>
          {errors.nombreResponsable && (
            <p className="text-xs text-rose-500 mt-1 font-medium">{errors.nombreResponsable}</p>
          )}
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Teléfono de contacto <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Phone className="w-4 h-4" />
            </div>
            <input
              type="tel"
              value={data.telefono}
              onChange={(e) => onChange('telefono', e.target.value)}
              placeholder="Ej: 312 458 9021"
              className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50/50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.telefono
                  ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-500'
                  : 'border-slate-300 focus:ring-blue-100 focus:border-blue-600'
              }`}
            />
          </div>
          {errors.telefono && (
            <p className="text-xs text-rose-500 mt-1 font-medium">{errors.telefono}</p>
          )}
        </div>

        {/* Correo Electrónico */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Correo Electrónico <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              value={data.correoElectronico}
              onChange={(e) => onChange('correoElectronico', e.target.value)}
              placeholder="entrenador@deportes.gov.co"
              className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50/50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.correoElectronico
                  ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-500'
                  : 'border-slate-300 focus:ring-blue-100 focus:border-blue-600'
              }`}
            />
          </div>
          {errors.correoElectronico && (
            <p className="text-xs text-rose-500 mt-1 font-medium">{errors.correoElectronico}</p>
          )}
        </div>

        {/* Departamento */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Departamento <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <MapPin className="w-4 h-4" />
            </div>
            <input
              type="text"
              list="departamentos-list"
              value={data.departamento}
              onChange={(e) => {
                onChange('departamento', e.target.value);
              }}
              placeholder="Seleccionar o escribir depto."
              className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50/50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.departamento
                  ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-500'
                  : 'border-slate-300 focus:ring-blue-100 focus:border-blue-600'
              }`}
            />
            <datalist id="departamentos-list">
              {DEPARTAMENTOS_COLOMBIA.map((d) => (
                <option key={d.nombre} value={d.nombre} />
              ))}
            </datalist>
          </div>
          {errors.departamento && (
            <p className="text-xs text-rose-500 mt-1 font-medium">{errors.departamento}</p>
          )}
        </div>

        {/* Municipio o Ciudad */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Municipio o Ciudad <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Building2 className="w-4 h-4" />
            </div>
            <input
              type="text"
              list="municipios-list"
              value={data.municipio}
              onChange={(e) => onChange('municipio', e.target.value)}
              placeholder="Ej: Cali, Medellín, Bogotá..."
              className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50/50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.municipio
                  ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-500'
                  : 'border-slate-300 focus:ring-blue-100 focus:border-blue-600'
              }`}
            />
            <datalist id="municipios-list">
              {availableCities.map((ciudad) => (
                <option key={ciudad} value={ciudad} />
              ))}
            </datalist>
          </div>
          {errors.municipio && (
            <p className="text-xs text-rose-500 mt-1 font-medium">{errors.municipio}</p>
          )}
        </div>

        {/* Club o Delegación (complementary) */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Nombre de la Delegación, Club o Liga Deportiva <span className="text-slate-400 font-normal">(Opcional)</span>
              </label>
              <input
                type="text"
                value={data.clubODelegacion || ''}
                onChange={(e) => onChange('clubODelegacion', e.target.value)}
                placeholder="Ej: Club Titanes de Lucha Olímpica / Liga de Lucha"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Observaciones o Notas Adicionales <span className="text-slate-400 font-normal">(Opcional)</span>
              </label>
              <input
                type="text"
                value={data.observaciones || ''}
                onChange={(e) => onChange('observaciones', e.target.value)}
                placeholder="Ej: Torneo Nacional Intercolegiado Fase Zonal"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
