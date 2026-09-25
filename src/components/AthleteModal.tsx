import React, { useState, useEffect } from 'react';
import {
  Deportista,
  CategoriaEdad,
  TipoDocumento,
  CaracterInstitucion,
  ZonaInstitucion,
  Sexo,
  Modalidad,
  CATEGORIAS_EDAD,
  MODALIDADES_DISPONIBLES,
  TIPOS_DOCUMENTO,
} from '../types';
import { calculateAge, suggestCategoryByAge } from '../utils/dateAndAge';
import {
  X,
  User,
  Calendar,
  CreditCard,
  Building,
  Scale,
  Sparkles,
  Trophy,
  Check,
  AlertCircle,
} from 'lucide-react';

interface AthleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (athlete: Omit<Deportista, 'id' | 'createdAt'> & { id?: string }) => void;
  initialData?: Deportista | null;
}

const DEFAULT_FORM: Omit<Deportista, 'id' | 'createdAt'> = {
  nombre: '',
  fechaNacimiento: '',
  tipoDocumento: 'Tarjeta de Identidad (TI)',
  numeroDocumento: '',
  categoria: 'Infantil 11 y 12 años',
  institucionEducativa: '',
  caracterInstitucion: 'Oficial',
  zona: 'Urbana',
  sexo: 'Masculino',
  peso: 40,
  modalidades: ['Libre masculino'],
};

export const AthleteModal: React.FC<AthleteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [formData, setFormData] = useState<Omit<Deportista, 'id' | 'createdAt'>>(DEFAULT_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [suggestedCat, setSuggestedCat] = useState<CategoriaEdad | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || '',
        fechaNacimiento: initialData.fechaNacimiento || '',
        tipoDocumento: initialData.tipoDocumento || 'Tarjeta de Identidad (TI)',
        numeroDocumento: initialData.numeroDocumento || '',
        categoria: initialData.categoria || 'Infantil 11 y 12 años',
        institucionEducativa: initialData.institucionEducativa || '',
        caracterInstitucion: initialData.caracterInstitucion || 'Oficial',
        zona: initialData.zona || 'Urbana',
        sexo: initialData.sexo || 'Masculino',
        peso: initialData.peso ?? 40,
        modalidades: initialData.modalidades || ['Libre masculino'],
      });
      if (initialData.fechaNacimiento) {
        const age = calculateAge(initialData.fechaNacimiento);
        setSuggestedCat(suggestCategoryByAge(age));
      }
    } else {
      setFormData(DEFAULT_FORM);
      setSuggestedCat(null);
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const calculatedAge = formData.fechaNacimiento ? calculateAge(formData.fechaNacimiento) : null;

  const handleBirthDateChange = (val: string) => {
    setFormData((prev) => ({ ...prev, fechaNacimiento: val }));
    if (val) {
      const age = calculateAge(val);
      const sug = suggestCategoryByAge(age);
      setSuggestedCat(sug);
      // Automatically set category if appropriate and empty or requested
      if (sug && (!formData.categoria || formData.categoria === DEFAULT_FORM.categoria)) {
        setFormData((prev) => ({ ...prev, fechaNacimiento: val, categoria: sug }));
      }
    } else {
      setSuggestedCat(null);
    }
  };

  const toggleModalidad = (mod: Modalidad) => {
    setFormData((prev) => {
      const exists = prev.modalidades.includes(mod);
      const updated = exists
        ? prev.modalidades.filter((m) => m !== mod)
        : [...prev.modalidades, mod];
      return {
        ...prev,
        modalidades: updated,
      };
    });
  };

  const handleSexoChange = (newSexo: Sexo) => {
    setFormData((prev) => {
      // Intelligently adjust default modality if it contradicts
      let currentMods = [...prev.modalidades];
      if (newSexo === 'Femenino') {
        currentMods = currentMods.filter((m) => m !== 'Libre masculino' && m !== 'Grecorromana');
        if (!currentMods.includes('Libre femenino')) {
          currentMods.push('Libre femenino');
        }
      } else {
        currentMods = currentMods.filter((m) => m !== 'Libre femenino');
        if (!currentMods.includes('Libre masculino')) {
          currentMods.push('Libre masculino');
        }
      }
      return {
        ...prev,
        sexo: newSexo,
        modalidades: currentMods,
      };
    });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre completo es requerido';
    if (!formData.fechaNacimiento) newErrors.fechaNacimiento = 'La fecha de nacimiento es requerida';
    if (!formData.numeroDocumento.trim()) newErrors.numeroDocumento = 'El número de documento es requerido';
    if (!formData.institucionEducativa.trim())
      newErrors.institucionEducativa = 'El nombre del colegio o institución es requerido';
    if (!formData.peso || Number(formData.peso) <= 0)
      newErrors.peso = 'Ingrese un peso válido en kg';
    if (!formData.modalidades || formData.modalidades.length === 0)
      newErrors.modalidades = 'Debe seleccionar al menos una modalidad';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      ...formData,
      peso: Number(formData.peso),
      id: initialData?.id,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200 my-4 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                {initialData ? 'Editar Registro de Deportista' : 'Inscribir Nuevo Deportista'}
              </h3>
              <p className="text-xs text-slate-300">
                Llene los datos individuales del atleta para la planilla oficial
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* SECTION: Identificación Personal */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-2">
              <User className="w-4 h-4" /> Datos de Identificación del Deportista
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nombre Completo */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nombre Completo <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: David Alejandro Gómez Martínez"
                  className={`w-full px-3.5 py-2 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    errors.nombre
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-slate-300 focus:ring-blue-100 focus:border-blue-600'
                  }`}
                />
                {errors.nombre && (
                  <p className="text-xs text-rose-500 mt-1 font-medium">{errors.nombre}</p>
                )}
              </div>

              {/* Tipo de Documento */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tipo de Documento de Identidad <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.tipoDocumento}
                    onChange={(e) =>
                      setFormData({ ...formData, tipoDocumento: e.target.value as TipoDocumento })
                    }
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all appearance-none"
                  >
                    {TIPOS_DOCUMENTO.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Número de Documento */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Número de Documento de Identidad <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={formData.numeroDocumento}
                    onChange={(e) => setFormData({ ...formData, numeroDocumento: e.target.value })}
                    placeholder="Ej: 1085239102"
                    className={`w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      errors.numeroDocumento
                        ? 'border-rose-400 focus:ring-rose-200'
                        : 'border-slate-300 focus:ring-blue-100 focus:border-blue-600'
                    }`}
                  />
                </div>
                {errors.numeroDocumento && (
                  <p className="text-xs text-rose-500 mt-1 font-medium">{errors.numeroDocumento}</p>
                )}
              </div>

              {/* Fecha de Nacimiento */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Fecha de Nacimiento <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type="date"
                    value={formData.fechaNacimiento}
                    onChange={(e) => handleBirthDateChange(e.target.value)}
                    max={new Date().toISOString().slice(0, 10)}
                    className={`w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      errors.fechaNacimiento
                        ? 'border-rose-400 focus:ring-rose-200'
                        : 'border-slate-300 focus:ring-blue-100 focus:border-blue-600'
                    }`}
                  />
                </div>
                {errors.fechaNacimiento && (
                  <p className="text-xs text-rose-500 mt-1 font-medium">{errors.fechaNacimiento}</p>
                )}
                {calculatedAge !== null && !isNaN(calculatedAge) && (
                  <p className="text-xs text-slate-600 mt-1.5 flex items-center gap-1 font-medium">
                    Edad calculada: <span className="text-blue-700 font-bold">{calculatedAge} años</span>
                  </p>
                )}
              </div>

              {/* Categoría de Edad */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Categoría de Competencia <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.categoria}
                  onChange={(e) =>
                    setFormData({ ...formData, categoria: e.target.value as CategoriaEdad })
                  }
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all"
                >
                  {CATEGORIAS_EDAD.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>

                {suggestedCat && suggestedCat !== formData.categoria && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, categoria: suggestedCat })}
                    className="mt-1.5 text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded-md border border-amber-200 flex items-center gap-1 transition-colors text-left"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Sugerida por edad: <strong>{suggestedCat}</strong> (clic para aplicar)</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* SECTION: Físico y Modalidades */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-2">
              <Scale className="w-4 h-4" /> Parámetros Físicos y Modalidades Deportivas
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Sexo */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Sexo <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Masculino', 'Femenino'] as Sexo[]).map((sexo) => {
                    const isSelected = formData.sexo === sexo;
                    return (
                      <button
                        key={sexo}
                        type="button"
                        onClick={() => handleSexoChange(sexo)}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        {sexo}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Peso en kg */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Peso Corporal (kg) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="15"
                    max="150"
                    value={formData.peso || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        peso: e.target.value === '' ? ('' as unknown as number) : parseFloat(e.target.value),
                      })
                    }
                    placeholder="Ej: 48.5"
                    className={`w-full px-3.5 py-2 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      errors.peso
                        ? 'border-rose-400 focus:ring-rose-200'
                        : 'border-slate-300 focus:ring-blue-100 focus:border-blue-600'
                    }`}
                  />
                  <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">
                    kg
                  </span>
                </div>
                {errors.peso && (
                  <p className="text-xs text-rose-500 mt-1 font-medium">{errors.peso}</p>
                )}
              </div>

              {/* Modalidad - Permitir escoger varias opciones */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Modalidad(es) de Participación <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-xs text-blue-600 font-medium">
                    (Puede marcar varias opciones)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {MODALIDADES_DISPONIBLES.map((mod) => {
                    const isChecked = formData.modalidades.includes(mod.id);
                    const isCompatible =
                      !mod.sexoCompatible || mod.sexoCompatible.includes(formData.sexo);

                    return (
                      <label
                        key={mod.id}
                        className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-blue-50/80 border-blue-400 ring-1 ring-blue-300 text-blue-900'
                            : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100 text-slate-700'
                        } ${!isCompatible ? 'opacity-50' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleModalidad(mod.id)}
                          className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                        />
                        <div className="text-xs">
                          <span className="font-bold block text-slate-800">{mod.label}</span>
                          <span className="text-slate-500 block leading-relaxed">
                            {mod.descripcion}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
                {errors.modalidades && (
                  <p className="text-xs text-rose-500 mt-1.5 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.modalidades}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* SECTION: Institución Educativa */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-2">
              <Building className="w-4 h-4" /> Datos de la Institución Educativa
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nombre del Colegio / Institución */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nombre del Colegio o Institución Educativa <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.institucionEducativa}
                  onChange={(e) =>
                    setFormData({ ...formData, institucionEducativa: e.target.value })
                  }
                  placeholder="Ej: Institución Educativa Antonio José Camacho"
                  className={`w-full px-3.5 py-2 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    errors.institucionEducativa
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-slate-300 focus:ring-blue-100 focus:border-blue-600'
                  }`}
                />
                {errors.institucionEducativa && (
                  <p className="text-xs text-rose-500 mt-1 font-medium">
                    {errors.institucionEducativa}
                  </p>
                )}
              </div>

              {/* Carácter de la Institución (Oficial / Privado) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Carácter de la Institución <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Oficial', 'Privado'] as CaracterInstitucion[]).map((caracter) => {
                    const isSelected = formData.caracterInstitucion === caracter;
                    return (
                      <button
                        key={caracter}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, caracterInstitucion: caracter })
                        }
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        {caracter}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Zona (Urbana / Rural) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Zona <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Urbana', 'Rural'] as ZonaInstitucion[]).map((zona) => {
                    const isSelected = formData.zona === zona;
                    return (
                      <button
                        key={zona}
                        type="button"
                        onClick={() => setFormData({ ...formData, zona: zona })}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        {zona}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              {initialData ? 'Guardar Cambios' : 'Registrar Deportista'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
