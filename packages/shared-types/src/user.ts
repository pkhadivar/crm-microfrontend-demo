export type UserRole = 'admin' | 'manager' | 'employee'

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: UserRole
  createdAt: string
}