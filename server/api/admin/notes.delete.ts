// DELETE /api/admin/notes — remove an admin note by id (requires admin password)
export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const body = await readBody<{ id?: string }>(event)
  const id = body?.id

  if (!id) {
    throw createError({ statusCode: 400, message: 'Note id is required' })
  }

  const notes = await readNotes()
  const next = notes.filter(n => n.id !== id)

  if (next.length === notes.length) {
    throw createError({ statusCode: 404, message: 'Note not found' })
  }

  await writeNotes(next)
  invalidateSummaryCache()

  return { ok: true }
})
