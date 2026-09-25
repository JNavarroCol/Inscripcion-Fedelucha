import * as XLSX from 'xlsx';
import { Deportista, ResponsibleData } from '../types';
import { calculateAge } from './dateAndAge';

export function exportRegistrationToExcel(
  responsable: ResponsibleData,
  deportistas: Deportista[],
  customFileName?: string
) {
  const wb = XLSX.utils.book_new();
  const currentDate = new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Sheet 1: Main Roster ("Planilla_Deportistas")
  // Let's create an organized layout with header information and athletes table
  const athleteRows: (string | number)[][] = [
    ['PLANILLA OFICIAL DE INSCRIPCIÓN DE DEPORTISTAS'],
    ['Sistema de Registro y Clasificación Deportiva'],
    [],
    ['DATOS DE QUIEN DILIGENCIA:'],
    ['Nombre Responsable:', responsable.nombreResponsable || 'No especificado', '', 'Fecha Generación:', currentDate],
    ['Correo Electrónico:', responsable.correoElectronico || 'No especificado', '', 'Teléfono:', responsable.telefono || 'No especificado'],
    ['Departamento:', responsable.departamento || 'No especificado', '', 'Municipio / Ciudad:', responsable.municipio || 'No especificado'],
    ['Club / Delegación:', responsable.clubODelegacion || 'No especificado', '', 'Total Inscritos:', deportistas.length],
    [],
    [
      'N°',
      'Nombre Completo',
      'Tipo Documento',
      'Número Documento',
      'Fecha Nacimiento',
      'Edad (Años)',
      'Categoría',
      'Sexo',
      'Peso (kg)',
      'Modalidades Seleccionadas',
      'Institución Educativa / Colegio',
      'Carácter Institución',
      'Zona',
    ],
  ];

  deportistas.forEach((d, index) => {
    const age = calculateAge(d.fechaNacimiento);
    athleteRows.push([
      index + 1,
      d.nombre,
      d.tipoDocumento,
      d.numeroDocumento,
      d.fechaNacimiento,
      age || '',
      d.categoria,
      d.sexo,
      d.peso ? Number(d.peso) : '',
      Array.isArray(d.modalidades) ? d.modalidades.join(', ') : '',
      d.institucionEducativa,
      d.caracterInstitucion,
      d.zona,
    ]);
  });

  const wsDeportistas = XLSX.utils.aoa_to_sheet(athleteRows);

  // Set column widths for sheet 1
  wsDeportistas['!cols'] = [
    { wch: 6 },  // N°
    { wch: 32 }, // Nombre Completo
    { wch: 28 }, // Tipo Documento
    { wch: 18 }, // N° Documento
    { wch: 16 }, // Fecha Nacimiento
    { wch: 12 }, // Edad
    { wch: 30 }, // Categoría
    { wch: 14 }, // Sexo
    { wch: 12 }, // Peso (kg)
    { wch: 38 }, // Modalidades
    { wch: 36 }, // Institución
    { wch: 16 }, // Carácter
    { wch: 14 }, // Zona
  ];

  XLSX.utils.book_append_sheet(wb, wsDeportistas, 'Deportistas');

  // Sheet 2: Resumen y Estadísticas ("Resumen_Estadistico")
  const statsRows: (string | number)[][] = [
    ['RESUMEN EJECUTIVO Y ESTADÍSTICAS DE INSCRIPCIÓN'],
    ['Delegación / Responsable:', responsable.nombreResponsable, '', 'Ubicación:', `${responsable.municipio}, ${responsable.departamento}`],
    ['Total de Deportistas Registrados:', deportistas.length],
    [],
    ['DISTRIBUCIÓN POR CATEGORÍA DE EDAD'],
    ['Categoría', 'Total Inscritos', 'Porcentaje'],
  ];

  const total = deportistas.length || 1;
  const categoriesMap: Record<string, number> = {};
  const sexMap: Record<string, number> = { Masculino: 0, Femenino: 0 };
  const modalMap: Record<string, number> = {
    'Libre masculino': 0,
    'Libre femenino': 0,
    'Grecorromana': 0,
    'Lucha de playa': 0,
  };
  const caracterMap: Record<string, number> = { Oficial: 0, Privado: 0 };
  const zonaMap: Record<string, number> = { Urbana: 0, Rural: 0 };

  deportistas.forEach((d) => {
    categoriesMap[d.categoria] = (categoriesMap[d.categoria] || 0) + 1;
    if (d.sexo in sexMap) sexMap[d.sexo]++;
    if (d.caracterInstitucion in caracterMap) caracterMap[d.caracterInstitucion]++;
    if (d.zona in zonaMap) zonaMap[d.zona]++;
    if (Array.isArray(d.modalidades)) {
      d.modalidades.forEach((m) => {
        modalMap[m] = (modalMap[m] || 0) + 1;
      });
    }
  });

  Object.entries(categoriesMap).forEach(([cat, count]) => {
    statsRows.push([cat, count, `${((count / total) * 100).toFixed(1)}%`]);
  });

  statsRows.push([]);
  statsRows.push(['DISTRIBUCIÓN POR SEXO']);
  statsRows.push(['Sexo', 'Total', 'Porcentaje']);
  Object.entries(sexMap).forEach(([sex, count]) => {
    statsRows.push([sex, count, `${((count / total) * 100).toFixed(1)}%`]);
  });

  statsRows.push([]);
  statsRows.push(['PARTICIPACIÓN POR MODALIDADES']);
  statsRows.push(['Modalidad', 'Total Inscripciones']);
  Object.entries(modalMap).forEach(([modal, count]) => {
    statsRows.push([modal, count]);
  });

  statsRows.push([]);
  statsRows.push(['INSTITUCIÓN EDUCATIVA (CARÁCTER Y ZONA)']);
  statsRows.push(['Carácter Oficial:', caracterMap['Oficial'], '', 'Zona Urbana:', zonaMap['Urbana']]);
  statsRows.push(['Carácter Privado:', caracterMap['Privado'], '', 'Zona Rural:', zonaMap['Rural']]);

  const wsStats = XLSX.utils.aoa_to_sheet(statsRows);
  wsStats['!cols'] = [{ wch: 35 }, { wch: 18 }, { wch: 18 }, { wch: 25 }, { wch: 18 }];
  XLSX.utils.book_append_sheet(wb, wsStats, 'Resumen_Estadisticas');

  // Generate file name
  const safeDept = (responsable.departamento || 'Delegacion').replace(/[^a-zA-Z0-9]/g, '_');
  const safeMun = (responsable.municipio || 'General').replace(/[^a-zA-Z0-9]/g, '_');
  const timestamp = new Date().toISOString().slice(0, 10);
  const defaultFileName = `Inscripcion_Deportistas_${safeDept}_${safeMun}_${timestamp}.xlsx`;
  const fileName = customFileName || defaultFileName;

  // Trigger download
  XLSX.writeFile(wb, fileName);
}
