import type { H3Event } from 'h3'

export interface AdminNote {
  id: string
  text: string
  createdAt: string
}

const STORAGE_KEY = 'notes.json'

/**
 * Verify the request carries the correct admin password.
 * Accepts the password via the `x-admin-password` header.
 * Throws a 401/500 error when missing or incorrect.
 */
export function requireAdmin(event: H3Event) {
  const config = useRuntimeConfig(event)
  const expected = config.adminPassword

  if (!expected) {
    throw createError({
      statusCode: 500,
      message: 'Admin password not configured. Set ADMIN_PASSWORD in your environment.',
    })
  }

  const provided = getHeader(event, 'x-admin-password')

  if (!provided || provided !== expected) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }
}

/** Read all admin notes (newest first). */
export async function readNotes(): Promise<AdminNote[]> {
  const storage = useStorage('admin')
  const notes = await storage.getItem<AdminNote[]>(STORAGE_KEY)
  return Array.isArray(notes) ? notes : []
}

/** Persist the full list of admin notes. */
export async function writeNotes(notes: AdminNote[]): Promise<void> {
  const storage = useStorage('admin')
  await storage.setItem(STORAGE_KEY, notes)
}

/**
 * Drop the cached AI summary so the next request regenerates it
 * with the updated admin notes.
 */
export function invalidateSummaryCache() {
  const g = globalThis as any
  g.__felduptv_summary__ = null
  g.__felduptv_summary_at__ = 0
}
