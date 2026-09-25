import { useState, useEffect } from 'react';
import { Deportista, ResponsibleData } from './types';
import { SAMPLE_RESPONSIBLE, SAMPLE_DEPORTISTAS } from './data/sampleAthletes';
import { ResponsibleForm } from './components/ResponsibleForm';
import { AthletesTable } from './components/AthletesTable';
import { AthleteModal } from './components/AthleteModal';
import { SummaryStats } from './components/SummaryStats';
import { ExportModal } from './components/ExportModal';
import { exportRegistrationToExcel } from './utils/excelExport';
import {
  FileSpreadsheet,
  Download,
  RotateCcw,
  Sparkles,
  Trophy,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

const STORAGE_KEY_RESPONSIBLE = 'app_deportistas_responsable';
const STORAGE_KEY_ATHLETES = 'app_deportistas_list';

const INITIAL_RESPONSIBLE: ResponsibleData = {
  nombreResponsable: '',
  correoElectronico: '',
  telefono: '',
  departamento: '',
  municipio: '',
  clubODelegacion: '',
  observaciones: '',
};

export default function App() {
  const [responsable, setResponsable] = useState<ResponsibleData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RESPONSIBLE);
      return saved ? JSON.parse(saved) : INITIAL_RESPONSIBLE;
    } catch {
      return INITIAL_RESPONSIBLE;
    }
  });

  const [athletes, setAthletes] = useState<Deportista[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ATHLETES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isAthleteModalOpen, setIsAthleteModalOpen] = useState(false);
  const [editingAthlete, setEditingAthlete] = useState<Deportista | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ResponsibleData, string>>>({});
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(
    null
  );

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RESPONSIBLE, JSON.stringify(responsable));
    } catch (e) {
      console.warn('Failed to save responsible data to storage', e);
    }
  }, [responsable]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ATHLETES, JSON.stringify(athletes));
    } catch (e) {
      console.warn('Failed to save athletes data to storage', e);
    }
  }, [athletes]);

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleResponsibleChange = (field: keyof ResponsibleData, value: string) => {
    setResponsable((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleOpenAddAthlete = () => {
    setEditingAthlete(null);
    setIsAthleteModalOpen(true);
  };

  const handleOpenEditAthlete = (athlete: Deportista) => {
    setEditingAthlete(athlete);
    setIsAthleteModalOpen(true);
  };

  const handleDuplicateAthlete = (athlete: Deportista) => {
    const duplicated: Deportista = {
      ...athlete,
      id: `dep-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      nombre: `${athlete.nombre} (Copia)`,
      numeroDocumento: '',
      createdAt: Date.now(),
    };
    setAthletes((prev) => [duplicated, ...prev]);
    showNotification('Deportista duplicado como plantilla para nuevo registro');
  };

  const handleDeleteAthlete = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este deportista de la lista?')) {
      setAthletes((prev) => prev.filter((a) => a.id !== id));
      showNotification('Deportista eliminado', 'info');
    }
  };

  const handleSaveAthlete = (athleteData: Omit<Deportista, 'id' | 'createdAt'> & { id?: string }) => {
    if (athleteData.id) {
      // Edit existing
      setAthletes((prev) =>
        prev.map((a) => (a.id === athleteData.id ? { ...a, ...athleteData } : a))
      );
      showNotification('Datos del deportista actualizados correctamente');
    } else {
      // New athlete
      const newAthlete: Deportista = {
        ...athleteData,
        id: `dep-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        createdAt: Date.now(),
      };
      setAthletes((prev) => [newAthlete, ...prev]);
      showNotification('¡Deportista inscrito exitosamente!');
    }
  };

  const validateResponsibleBeforeExport = (): boolean => {
    const errs: Partial<Record<keyof ResponsibleData, string>> = {};
    if (!responsable.nombreResponsable?.trim()) {
      errs.nombreResponsable = 'Por favor indique el nombre de quien diligencia';
    }
    if (!responsable.correoElectronico?.trim()) {
      errs.correoElectronico = 'El correo electrónico es requerido';
    }
    if (!responsable.telefono?.trim()) {
      errs.telefono = 'El teléfono de contacto es requerido';
    }
    if (!responsable.departamento?.trim()) {
      errs.departamento = 'Seleccione o ingrese el departamento';
    }
    if (!responsable.municipio?.trim()) {
      errs.municipio = 'Seleccione o ingrese el municipio o ciudad';
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleTriggerExport = () => {
    if (athletes.length === 0) {
      alert('Debe inscribir al menos a un deportista para poder generar el archivo Excel.');
      return;
    }
    // Warn if responsible is missing fields, but open export modal
    validateResponsibleBeforeExport();
    setIsExportModalOpen(true);
  };

  const handleDirectQuickExcel = () => {
    if (athletes.length === 0) {
      alert('Debe inscribir al menos a un deportista para generar el Excel.');
      return;
    }
    validateResponsibleBeforeExport();
    exportRegistrationToExcel(responsable, athletes);
    showNotification('¡Archivo Excel descargado con éxito!');
  };

  const handleLoadSampleData = () => {
    if (
      athletes.length > 0 &&
      !window.confirm('¿Desea reemplazar los datos actuales con los datos de ejemplo?')
    ) {
      return;
    }
    setResponsable(SAMPLE_RESPONSIBLE);
    setAthletes(SAMPLE_DEPORTISTAS);
    setFormErrors({});
    showNotification('Se cargaron datos de ejemplo con 4 deportistas');
  };

  const handleResetForm = () => {
    if (
      window.confirm(
        '¿Está seguro de reiniciar el formulario? Se borrarán todos los deportistas inscritos y datos diligenciados.'
      )
    ) {
      setResponsable(INITIAL_RESPONSIBLE);
      setAthletes([]);
      setFormErrors({});
      localStorage.removeItem(STORAGE_KEY_RESPONSIBLE);
      localStorage.removeItem(STORAGE_KEY_ATHLETES);
      showNotification('Formulario reiniciado', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 font-sans pb-16">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium ${
              notification.type === 'success'
                ? 'bg-emerald-800 text-white border-emerald-700'
                : 'bg-slate-900 text-white border-slate-800'
            }`}
          >
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Top Banner Navigation */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <span>Planilla Oficial de Inscripción de Deportistas</span>
                </h1>
                <p className="text-xs text-slate-400 hidden sm:block">
                  Registro por delegaciones y descarga oficial en formato Excel (.xlsx)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={handleLoadSampleData}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors cursor-pointer"
                title="Cargar datos de prueba para demostración rápida"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Cargar Ejemplo</span>
              </button>

              <button
                type="button"
                onClick={handleResetForm}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Limpiar formulario"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Main CTA */}
              <button
                type="button"
                onClick={handleTriggerExport}
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-xs sm:text-sm cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span className="hidden sm:inline">Descargar Excel</span>
                <span className="sm:hidden">Excel</span>
                {athletes.length > 0 && (
                  <span className="bg-emerald-800 px-1.5 py-0.5 rounded text-[11px] font-extrabold">
                    {athletes.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero / Step Summary Ribbon */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                Formulario adaptado para festivales, ligas, intercolegiados y torneos de lucha y disciplinas afines.
              </span>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              <span className="text-xs text-slate-500">Estado de la planilla:</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                {athletes.length === 0
                  ? 'Sin deportistas'
                  : `${athletes.length} ${athletes.length === 1 ? 'deportista listo' : 'deportistas listos'}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Sample data alert banner on empty state */}
        {athletes.length === 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  ¿Desea probar el funcionamiento con registros de ejemplo?
                </h3>
                <p className="text-xs text-slate-600">
                  Haga clic para autocompletar con un delegado y 4 deportistas en distintas categorías y modalidades.
                </p>
              </div>
            </div>
            <button
              onClick={handleLoadSampleData}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors self-start sm:self-auto shrink-0 cursor-pointer"
            >
              Cargar datos de ejemplo
            </button>
          </div>
        )}

        {/* Step 1: Responsible Form */}
        <ResponsibleForm
          data={responsable}
          onChange={handleResponsibleChange}
          errors={formErrors}
        />

        {/* Dynamic Metric Stats Summary */}
        <SummaryStats athletes={athletes} />

        {/* Step 2: Athletes Management Section */}
        <AthletesTable
          athletes={athletes}
          onAddAthlete={handleOpenAddAthlete}
          onEditAthlete={handleOpenEditAthlete}
          onDeleteAthlete={handleDeleteAthlete}
          onDuplicateAthlete={handleDuplicateAthlete}
        />

        {/* Step 3: Bottom Action Banner for Exporting */}
        {athletes.length > 0 && (
          <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6 border border-slate-800">
            <div className="space-y-2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Paso 3 • Generación de Documento
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                ¿Todo listo para generar la planilla oficial?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Se han registrado <strong>{athletes.length} deportistas</strong> por parte de{' '}
                <strong>{responsable.nombreResponsable || 'la delegación'}</strong> ({responsable.municipio || 'Municipio'}, {responsable.departamento || 'Departamento'}).
                El archivo descargable contendrá la lista estructurada con todas las modalidades y hoja de estadísticas.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
              <button
                type="button"
                onClick={handleDirectQuickExcel}
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Descarga Directa (.xlsx)</span>
              </button>

              <button
                type="button"
                onClick={() => setIsExportModalOpen(true)}
                className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Opciones & Compartir</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Athlete Create / Edit Modal */}
      <AthleteModal
        isOpen={isAthleteModalOpen}
        onClose={() => {
          setIsAthleteModalOpen(false);
          setEditingAthlete(null);
        }}
        onSave={handleSaveAthlete}
        initialData={editingAthlete}
      />

      {/* Export & Share Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        responsable={responsable}
        athletes={athletes}
      />
    </div>
  );
}
