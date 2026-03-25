import { create } from 'zustand'

type UserProfile = {
  email: string
  provider?: 'password' | 'google' | 'github'
}

type AuthState = {
  token: string | null
  user: UserProfile | null
  loginWithJwt: (token: string, user: UserProfile) => void
  logout: () => void
}

const TOKEN_KEY = 'auth.jwt'

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem(TOKEN_KEY),
  user: null,
  loginWithJwt: (token, user) => {
    localStorage.setItem(TOKEN_KEY, token)
    set({ token, user })
  },
  logout: () => {
    localStorage.removeItem(TOKEN_KEY)
    set({ token: null, user: null })
  },
}))
