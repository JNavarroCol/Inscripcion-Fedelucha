export interface ResponsibleData {
  nombreResponsable: string;
  correoElectronico: string;
  telefono: string;
  departamento: string;
  municipio: string;
  clubODelegacion: string;
  observaciones: string;
}

export type TipoDocumento =
  | 'Tarjeta de Identidad (TI)'
  | 'Cédula de Ciudadanía (CC)'
  | 'Registro Civil (RC)'
  | 'Cédula de Extranjería (CE)'
  | 'Permiso por Protección Temporal (PPT)'
  | 'Pasaporte';

export type CaracterInstitucion = 'Oficial' | 'Privado';

export type ZonaInstitucion = 'Urbana' | 'Rural';

export type Sexo = 'Masculino' | 'Femenino';

export type Modalidad =
  | 'Libre masculino'
  | 'Libre femenino'
  | 'Grecorromana'
  | 'Lucha de playa';

export type CategoriaEdad =
  | 'Festival o formación 7 y 8 años'
  | 'Preinfantil 9 y 10 años'
  | 'Infantil 11 y 12 años'
  | 'Prejuvenil 13 a 15 años'
  | 'Juvenil 16 y 17 años';

export interface Deportista {
  id: string;
  nombre: string;
  fechaNacimiento: string;
  tipoDocumento: TipoDocumento;
  numeroDocumento: string;
  institucionEducativa: string;
  caracterInstitucion: CaracterInstitucion;
  zona: ZonaInstitucion;
  sexo: Sexo;
  peso: number;
  modalidades: Modalidad[];
  categoria: CategoriaEdad;
  createdAt: number;
}

export const CATEGORIAS_EDAD: {
  id: CategoriaEdad;
  nombre: string;
  minEdad: number;
  maxEdad: number;
  badgeColor: string;
}[] = [
  {
    id: 'Festival o formación 7 y 8 años',
    nombre: 'Festival o formación (7 y 8 años)',
    minEdad: 7,
    maxEdad: 8,
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  {
    id: 'Preinfantil 9 y 10 años',
    nombre: 'Preinfantil (9 y 10 años)',
    minEdad: 9,
    maxEdad: 10,
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  {
    id: 'Infantil 11 y 12 años',
    nombre: 'Infantil (11 y 12 años)',
    minEdad: 11,
    maxEdad: 12,
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  },
  {
    id: 'Prejuvenil 13 a 15 años',
    nombre: 'Prejuvenil (13 a 15 años)',
    minEdad: 13,
    maxEdad: 15,
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
  },
  {
    id: 'Juvenil 16 y 17 años',
    nombre: 'Juvenil (16 y 17 años)',
    minEdad: 16,
    maxEdad: 17,
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
  },
];

export const MODALIDADES_DISPONIBLES: {
  id: Modalidad;
  label: string;
  descripcion: string;
  iconName?: string;
  sexoCompatible?: Sexo[];
}[] = [
  {
    id: 'Libre masculino',
    label: 'Libre masculino',
    descripcion: 'Modalidad de lucha estilo libre para varones',
    sexoCompatible: ['Masculino'],
  },
  {
    id: 'Libre femenino',
    label: 'Libre femenino',
    descripcion: 'Modalidad de lucha estilo libre para damas',
    sexoCompatible: ['Femenino'],
  },
  {
    id: 'Grecorromana',
    label: 'Grecorromana',
    descripcion: 'Estilo clásico con agarres exclusivos del torso hacia arriba',
    sexoCompatible: ['Masculino'],
  },
  {
    id: 'Lucha de playa',
    label: 'Lucha de playa',
    descripcion: 'Modalidad sobre arena al aire libre (Beach Wrestling)',
    sexoCompatible: ['Masculino', 'Femenino'],
  },
];

export const TIPOS_DOCUMENTO: TipoDocumento[] = [
  'Tarjeta de Identidad (TI)',
  'Cédula de Ciudadanía (CC)',
  'Registro Civil (RC)',
  'Cédula de Extranjería (CE)',
  'Permiso por Protección Temporal (PPT)',
  'Pasaporte',
];
