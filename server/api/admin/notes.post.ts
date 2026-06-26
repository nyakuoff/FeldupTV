// POST /api/admin/notes — add a new admin note (requires admin password)
export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const body = await readBody<{ text?: string }>(event)
  const text = body?.text?.trim()

  if (!text) {
    throw createError({ statusCode: 400, message: 'Note text is required' })
  }

  if (text.length > 1000) {
    throw createError({ statusCode: 400, message: 'Note is too long (max 1000 characters)' })
  }

  const notes = await readNotes()

  const note: AdminNote = {
    id: (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`),
    text,
    createdAt: new Date().toISOString(),
  }

  // Newest first
  notes.unshift(note)
  await writeNotes(notes)

  // Force the AI summary to regenerate with the new note
  invalidateSummaryCache()

  return { note }
})
