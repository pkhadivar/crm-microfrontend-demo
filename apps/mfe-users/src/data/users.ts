import type { User } from '@crm/shared-types'

export const users: User[] = Array.from({ length: 1000 }, (_, index) => ({
  id: String(index + 1),

  firstName: `User`,
  lastName: `${index + 1}`,

  email: `user${index + 1}@crm.com`,

  role:
    index % 3 === 0
      ? 'admin'
      : index % 3 === 1
      ? 'manager'
      : 'employee',

  createdAt: '2026-05-12',
}))