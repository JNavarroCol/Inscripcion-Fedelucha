import React, { useState } from 'react';
import { Deportista, ResponsibleData } from '../types';
import { exportRegistrationToExcel } from '../utils/excelExport';
import {
  FileSpreadsheet,
  Download,
  Share2,
  Copy,
  Check,
  X,
  ExternalLink,
  MessageCircle,
  FileCheck2,
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  responsable: ResponsibleData;
  athletes: Deportista[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  responsable,
  athletes,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [customName, setCustomName] = useState('');

  if (!isOpen) return null;

  const defaultFileName = `Inscripcion_${(responsable.departamento || 'Deportes').replace(/\s+/g, '_')}_${(responsable.municipio || 'Ciudad').replace(/\s+/g, '_')}.xlsx`;

  const handleDownloadExcel = () => {
    exportRegistrationToExcel(
      responsable,
      athletes,
      customName.trim() ? (customName.endsWith('.xlsx') ? customName : `${customName}.xlsx`) : defaultFileName
    );
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3500);
  };

  // Generate plain text summary for WhatsApp or email sharing
  const generateShareText = () => {
    const total = athletes.length;
    let text = `📋 *PLANILLA OFICIAL DE INSCRIPCIÓN DE DEPORTISTAS*\n`;
    text += `👤 *Responsable:* ${responsable.nombreResponsable || 'No especificado'}\n`;
    text += `📞 *Teléfono:* ${responsable.telefono || 'No especificado'}\n`;
    text += `📧 *Correo:* ${responsable.correoElectronico || 'No especificado'}\n`;
    text += `📍 *Ubicación:* ${responsable.municipio || 'Ciudad'}, ${responsable.departamento || 'Depto'}\n`;
    if (responsable.clubODelegacion) {
      text += `🏢 *Delegación:* ${responsable.clubODelegacion}\n`;
    }
    text += `\n🏅 *Total Atletas Inscritos:* ${total}\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;

    athletes.forEach((a, i) => {
      text += `*${i + 1}. ${a.nombre}*\n`;
      text += `• Doc: ${a.tipoDocumento} ${a.numeroDocumento}\n`;
      text += `• Cat: ${a.categoria} | ${a.peso} kg | ${a.sexo}\n`;
      text += `• Modalidad: ${a.modalidades.join(', ')}\n`;
      text += `• Colegio: ${a.institucionEducativa} (${a.caracterInstitucion}, Zona ${a.zona})\n\n`;
    });

    text += `📁 _Archivo Excel generado y listo para verificación oficial._`;
    return text;
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(generateShareText());
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 3000);
    } catch {
      // fallback
    }
  };

  const handleWhatsAppShare = () => {
    const encodedText = encodeURIComponent(generateShareText());
    window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-800 text-white flex items-center justify-between border-b border-emerald-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-sm">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                Exportar y Compartir Documento Excel
              </h3>
              <p className="text-xs text-emerald-100">
                Planilla oficial en formato Microsoft Excel (.xlsx) lista para enviar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-emerald-200 hover:text-white rounded-lg hover:bg-emerald-700/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Overview of what's inside */}
          <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl flex items-start gap-3">
            <FileCheck2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-900 space-y-1">
              <p className="font-bold">Contenido del archivo Excel generado:</p>
              <ul className="list-disc list-inside space-y-0.5 text-emerald-800">
                <li>
                  <strong>Hoja 1: Deportistas</strong> - Roster completo con los {athletes.length}{' '}
                  deportistas, categorías, colegios, modalidades, pesos y documentos.
                </li>
                <li>
                  <strong>Hoja 2: Resumen_Estadisticas</strong> - Conteos automáticos por categoría,
                  modalidad, sexo y tipo de colegio.
                </li>
              </ul>
            </div>
          </div>

          {/* Filename configuration */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Nombre personalizado del archivo (opcional)
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder={defaultFileName}
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Download Main Button */}
          <button
            onClick={handleDownloadExcel}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-5 h-5" />
                <span>¡Descargado con éxito! Revisa tus descargas</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Descargar Planilla en Excel (.xlsx)</span>
              </>
            )}
          </button>

          {/* Share options */}
          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5" /> Opciones Rápidas para Compartir
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Compartir por WhatsApp</span>
                <ExternalLink className="w-3 h-3 text-emerald-500 ml-auto" />
              </button>

              <button
                type="button"
                onClick={handleCopyText}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
              >
                {copiedSummary ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>¡Copiado al portapapeles!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-600" />
                    <span>Copiar Resumen para Correo</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
