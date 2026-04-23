export type UserRole = 'admin' | 'coordinatrice' | 'doctor';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  title: string;
  avatar: string;
  organization: string;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrator',
  coordinatrice: 'Medical Coordinator',
  doctor: 'Occupational Doctor',
};

export const ROLE_HOMES: Record<UserRole, string> = {
  admin: '/dashboard/admin',
  coordinatrice: '/dashboard/coordinatrice',
  doctor: '/dashboard/doctor',
};
