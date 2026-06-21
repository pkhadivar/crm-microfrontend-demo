export type UserRole = 'admin' | 'manager' | 'employee'

export type User = {
  id: number;

  first_name: string;

  last_name: string;

  email: string;

  phone: string;

  department: {
    id: number;
    name: string;
  }| null;

  roles: {
    id: number;
    name: string;
  }[];

  is_active: boolean;

  created_at: string;
};