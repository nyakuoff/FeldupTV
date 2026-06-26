<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 max-w-screen-md mx-auto">
    <div class="flex items-center gap-2.5 mb-6">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :style="{ color: 'var(--feldup-accent)' }">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
      </svg>
      <h1 class="text-xl font-semibold" style="color: var(--yt-text-primary);">Admin — AI Summary Notes</h1>
    </div>

    <p class="text-sm mb-6" style="color: var(--yt-text-secondary);">
      Add news or context the AI can't pick up automatically (e.g. a video Feldup
      posted about current events). These notes are fed into the AI summary and
      treated as reliable, prioritised information.
    </p>

    <!-- Login -->
    <div
      v-if="!authed"
      class="rounded-2xl p-5"
      style="background-color: var(--yt-bg-secondary); border: 1px solid var(--yt-border);"
    >
      <label class="block text-sm font-medium mb-2" style="color: var(--yt-text-primary);">
        Admin password
      </label>
      <form class="flex gap-2" @submit.prevent="login">
        <input
          v-model="passwordInput"
          type="password"
          autocomplete="current-password"
          placeholder="Enter admin password"
          class="flex-1 rounded-lg px-3 py-2 text-sm outline-none"
          style="background-color: var(--yt-bg-tertiary); color: var(--yt-text-primary); border: 1px solid var(--yt-border);"
        />
        <button
          type="submit"
          :disabled="loggingIn || !passwordInput"
          class="rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
          style="background-color: var(--feldup-accent); color: #0a0a0a;"
        >
          {{ loggingIn ? '…' : 'Unlock' }}
        </button>
      </form>
      <p v-if="loginError" class="mt-2 text-sm" style="color: #f87171;">{{ loginError }}</p>
    </div>

    <!-- Panel -->
    <div v-else>
      <!-- Add note -->
      <div
        class="rounded-2xl p-5 mb-6"
        style="background-color: var(--yt-bg-secondary); border: 1px solid var(--yt-border);"
      >
        <label class="block text-sm font-medium mb-2" style="color: var(--yt-text-primary);">
          New note
        </label>
        <form class="flex flex-col gap-3" @submit.prevent="addNote">
          <textarea
            v-model="noteInput"
            rows="3"
            maxlength="1000"
            placeholder="e.g. Feldup a sorti une vidéo le 24 juin sur l'actualité de Hollow Knight: Silksong…"
            class="w-full rounded-lg px-3 py-2 text-sm outline-none resize-y"
            style="background-color: var(--yt-bg-tertiary); color: var(--yt-text-primary); border: 1px solid var(--yt-border);"
          />
          <div class="flex items-center justify-between">
            <span class="text-xs" style="color: var(--yt-text-muted);">{{ noteInput.length }}/1000</span>
            <div class="flex items-center gap-3">
              <button
                type="button"
                class="text-sm transition-colors"
                style="color: var(--yt-text-secondary);"
                @click="logout"
              >
                Lock
              </button>
              <button
                type="submit"
                :disabled="saving || !noteInput.trim()"
                class="rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
                style="background-color: var(--feldup-accent); color: #0a0a0a;"
              >
                {{ saving ? 'Saving…' : 'Add note' }}
              </button>
            </div>
          </div>
        </form>
        <p v-if="actionError" class="mt-2 text-sm" style="color: #f87171;">{{ actionError }}</p>
      </div>

      <!-- Notes list -->
      <div v-if="loadingNotes" class="flex flex-col gap-3">
        <div v-for="n in 3" :key="n" class="h-20 rounded-xl skeleton" />
      </div>

      <div v-else-if="!notes.length" class="text-center py-12" style="color: var(--yt-text-secondary);">
        No notes yet. Add one above to enrich the AI summary.
      </div>

      <div v-else class="flex flex-col gap-3">
        <div
          v-for="note in notes"
          :key="note.id"
          class="rounded-xl p-4 flex gap-3"
          style="background-color: var(--yt-bg-secondary); border: 1px solid var(--yt-border);"
        >
          <div class="flex-1 min-w-0">
            <p class="text-sm whitespace-pre-wrap break-words" style="color: var(--yt-text-primary);">{{ note.text }}</p>
            <p class="text-xs mt-2" style="color: var(--yt-text-muted);">{{ formatDate(note.createdAt) }}</p>
          </div>
          <button
            class="shrink-0 self-start rounded-lg px-2.5 py-1.5 text-xs transition-colors"
            style="background-color: var(--yt-bg-tertiary); color: #f87171; border: 1px solid var(--yt-border);"
            :disabled="deletingId === note.id"
            @click="deleteNote(note.id)"
          >
            {{ deletingId === note.id ? '…' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface AdminNote {
  id: string
  text: string
  createdAt: string
}

useHead({ title: 'Admin · FeldupTV' })

const STORAGE_KEY = 'felduptv-admin-pw'

const password = ref('')
const authed = ref(false)

const passwordInput = ref('')
const loggingIn = ref(false)
const loginError = ref('')

const notes = ref<AdminNote[]>([])
const loadingNotes = ref(false)

const noteInput = ref('')
const saving = ref(false)
const deletingId = ref<string | null>(null)
const actionError = ref('')

function authHeaders() {
  return { 'x-admin-password': password.value }
}

async function fetchNotes() {
  loadingNotes.value = true
  try {
    const res = await $fetch<{ notes: AdminNote[] }>('/api/admin/notes', { headers: authHeaders() })
    notes.value = res.notes
  } finally {
    loadingNotes.value = false
  }
}

async function login() {
  loggingIn.value = true
  loginError.value = ''
  try {
    password.value = passwordInput.value
    await fetchNotes()
    authed.value = true
    sessionStorage.setItem(STORAGE_KEY, password.value)
    passwordInput.value = ''
  } catch (err: any) {
    password.value = ''
    loginError.value = err?.statusCode === 401
      ? 'Incorrect password.'
      : (err?.data?.message ?? 'Could not sign in.')
  } finally {
    loggingIn.value = false
  }
}

function logout() {
  authed.value = false
  password.value = ''
  notes.value = []
  sessionStorage.removeItem(STORAGE_KEY)
}

async function addNote() {
  const text = noteInput.value.trim()
  if (!text) return
  saving.value = true
  actionError.value = ''
  try {
    await $fetch('/api/admin/notes', { method: 'POST', headers: authHeaders(), body: { text } })
    noteInput.value = ''
    await fetchNotes()
  } catch (err: any) {
    actionError.value = err?.data?.message ?? 'Could not save note.'
  } finally {
    saving.value = false
  }
}

async function deleteNote(id: string) {
  deletingId.value = id
  actionError.value = ''
  try {
    await $fetch('/api/admin/notes', { method: 'DELETE', headers: authHeaders(), body: { id } })
    await fetchNotes()
  } catch (err: any) {
    actionError.value = err?.data?.message ?? 'Could not delete note.'
  } finally {
    deletingId.value = null
  }
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

onMounted(async () => {
  const saved = sessionStorage.getItem(STORAGE_KEY)
  if (saved) {
    password.value = saved
    try {
      await fetchNotes()
      authed.value = true
    } catch {
      logout()
    }
  }
})
</script>
