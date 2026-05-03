// Authentication boundary. Mirrors checkout.js / cart.js: the rest of
// the app calls these functions, never the backend or session store
// directly. Today the bodies are stubs; when the PHP / MySQL backend
// lands, replace each body with a real fetch() against the documented
// endpoint — signatures and return shapes stay the same.
//
// ─── Endpoints (backend to implement) ────────────────────────────────
//   POST /api/auth/login     { email, password }      → Session
//   POST /api/auth/register  { email, password, ... } → Session
//   POST /api/auth/logout    {}                        → 204
//   GET  /api/auth/me        —                         → User | null
//   POST /api/auth/reset     { email }                 → 204
//
// ─── Types ───────────────────────────────────────────────────────────
//   User     { id, email, firstName?, lastName?, acceptsMarketing }
//   Session  { user: User, csrfToken }
//
// Sessions are HTTP-only cookies. The CSRF token is mirrored in a JS
// readable header / form field for state-changing calls. The frontend
// stores nothing about credentials in localStorage — `getCurrentUser()`
// is the single source of truth and reads from the server.

const STORAGE_KEY = 'kn-auth-stub-v1'

// In-memory + localStorage stub for design review. Replaced wholesale
// once the backend exposes the real endpoints. Format mirrors what
// the API will return so the UI layer stays unchanged.
function loadStub() {
  if (typeof localStorage === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.user?.email) return null
    return parsed
  } catch {
    return null
  }
}

function persistStub(session) {
  if (typeof localStorage === 'undefined') return
  try {
    if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* quota or private mode — ignore */
  }
}

let current = loadStub()

function emailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim())
}

function passwordValid(password) {
  return typeof password === 'string' && password.length >= 8
}

function authError(code, message) {
  const err = new Error(message)
  err.code = code
  return err
}

/**
 * Returns the current authenticated user (or null). The real endpoint
 * reads from the session cookie; the stub from localStorage.
 *
 * Backend contract: `GET /api/auth/me`.
 *
 * @returns {Promise<{ user: User } | null>}
 */
export async function getCurrentUser() {
  return current
}

/**
 * Sign in with email + password. Real backend issues an HTTP-only
 * session cookie and returns the User shape. The stub fakes both —
 * any password ≥ 8 characters succeeds.
 *
 * Backend contract: `POST /api/auth/login`.
 *
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ user: User, csrfToken: string }>}
 */
export async function signIn({ email, password }) {
  if (!emailValid(email)) throw authError('auth.invalidEmail', 'Please enter a valid email.')
  if (!passwordValid(password)) {
    throw authError('auth.invalidPassword', 'Password must be at least 8 characters.')
  }

  const session = {
    user: {
      id: `usr_${btoa(String(email).toLowerCase()).replace(/=+$/, '').slice(0, 12)}`,
      email: String(email).toLowerCase().trim(),
      firstName: '',
      lastName: '',
      acceptsMarketing: false,
    },
    csrfToken: `csrf_stub_${Date.now().toString(36)}`,
  }
  current = session
  persistStub(session)
  return session
}

/**
 * Create a new account. Real backend hashes the password with Argon2id,
 * issues a session, and returns the new User. The stub stores the
 * session locally so the UI can flow through end-to-end.
 *
 * Backend contract: `POST /api/auth/register`.
 *
 * @param {{ email: string, password: string, firstName?: string,
 *           lastName?: string, acceptsMarketing?: boolean }} request
 * @returns {Promise<{ user: User, csrfToken: string }>}
 */
export async function register(request) {
  if (!emailValid(request?.email)) {
    throw authError('auth.invalidEmail', 'Please enter a valid email.')
  }
  if (!passwordValid(request?.password)) {
    throw authError('auth.invalidPassword', 'Password must be at least 8 characters.')
  }

  const session = {
    user: {
      id: `usr_${Date.now().toString(36)}`,
      email: String(request.email).toLowerCase().trim(),
      firstName: String(request.firstName || '').trim(),
      lastName: String(request.lastName || '').trim(),
      acceptsMarketing: Boolean(request.acceptsMarketing),
    },
    csrfToken: `csrf_stub_${Date.now().toString(36)}`,
  }
  current = session
  persistStub(session)
  return session
}

/**
 * Sign out. Real backend invalidates the session cookie server-side.
 *
 * Backend contract: `POST /api/auth/logout`.
 */
export async function signOut() {
  current = null
  persistStub(null)
}

/**
 * Send a password reset email. Real backend issues a single-use,
 * time-limited token via email; the stub is a no-op.
 *
 * Backend contract: `POST /api/auth/reset`.
 */
export async function requestPasswordReset({ email }) {
  if (!emailValid(email)) throw authError('auth.invalidEmail', 'Please enter a valid email.')
  return { ok: true }
}
