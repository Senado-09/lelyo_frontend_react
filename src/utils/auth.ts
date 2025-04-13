// src/utils/auth.ts

export const login = (email: string, password: string): boolean => {
    if (email === 'admin@host.com' && password === 'admin') {
      localStorage.setItem('auth', 'true')
      return true
    }
    return false
  }
  
  export const logout = () => {
    localStorage.removeItem('auth_token')
    window.location.href = '/login' // redirection vers la page de connexion
  }  
  
  export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('auth_token')
    return !!token // true si token existe
  }
  
  