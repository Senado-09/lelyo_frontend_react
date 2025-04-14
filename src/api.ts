const API_BASE_URL = import.meta.env.VITE_API_URL

export const api = {
  get: async (path: string) => {
    const res = await fetch(`${API_BASE_URL}${path}`)
    if (!res.ok) throw new Error()
    return res.json()
  },

  post: async (path: string, body: any) => {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error()
    return res.json()
  },

  put: async (path: string, body: any) => {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error()
    return res.json()
  },

  delete: async (path: string) => {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error()
    return res.json()
  },

  patch: async (path: string, body: any) => {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error()
    return res.json()
  },

  upload: async (path: string, formData: FormData) => {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      body: formData,
    })
    if (!res.ok) throw new Error()
    return res.json()
  },
}
