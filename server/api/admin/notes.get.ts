// GET /api/admin/notes — list all admin notes (requires admin password)
export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const notes = await readNotes()
  return { notes }
})
