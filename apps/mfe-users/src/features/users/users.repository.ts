import type { User } from '@crm/shared-types'
import { users } from '../../data/users'

/**
 * Returns the current users dataset.
 * Static implementation today; replace internals with Django/API client later
 * without changing consumers of getUsers().
 */
export function getUsers(): User[] {
  return users
}
