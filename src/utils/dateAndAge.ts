import { CategoriaEdad } from '../types';

export function calculateAge(birthDateString: string): number {
  if (!birthDateString) return 0;
  const birthDate = new Date(birthDateString + 'T00:00:00');
  if (isNaN(birthDate.getTime())) return 0;
  
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export function suggestCategoryByAge(age: number): CategoriaEdad | null {
  if (age >= 7 && age <= 8) {
    return 'Festival o formación 7 y 8 años';
  } else if (age >= 9 && age <= 10) {
    return 'Preinfantil 9 y 10 años';
  } else if (age >= 11 && age <= 12) {
    return 'Infantil 11 y 12 años';
  } else if (age >= 13 && age <= 15) {
    return 'Prejuvenil 13 a 15 años';
  } else if (age >= 16 && age <= 17) {
    return 'Juvenil 16 y 17 años';
  }
  return null;
}
