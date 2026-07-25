const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export class ApiClientError extends Error {
  status: number
  details?: unknown

  constructor(status: number, message: string, details?: unknown) {
    super(message)
    this.status = status
    this.details = details
  }
}

export class AuthError extends ApiClientError {}

let refreshPromise: Promise<boolean> | null = null

async function attemptRefresh(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.ok)
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

async function parseErrorBody(
  res: Response
): Promise<{ message: string; details?: unknown }> {
  try {
    const body = (await res.json()) as {
      error?: { message?: string; details?: unknown }
    }
    return {
      message:
        body.error?.message ?? `Request failed with status ${res.status}`,
      details: body.error?.details,
    }
  } catch {
    return { message: `Request failed with status ${res.status}` }
  }
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
  isRetry = false
): Promise<T> {
  const isAuthRoute = path.startsWith("/auth/")

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  })

  if (res.status === 401 && !isAuthRoute && !isRetry) {
    const refreshed = await attemptRefresh()
    if (refreshed) {
      return apiFetch<T>(path, init, true)
    }
  }

  if (!res.ok) {
    const { message, details } = await parseErrorBody(res)
    const ErrorType = res.status === 401 ? AuthError : ApiClientError
    throw new ErrorType(res.status, message, details)
  }

  if (res.status === 204) {
    return undefined as T
  }

  return (await res.json()) as T
}
