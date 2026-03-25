import { create } from 'zustand'

type NotificationItem = {
  id: string
  title: string
  message: string
  createdAt: string
  read: boolean
}

type UiState = {
  isCenterOpen: boolean
  notifications: NotificationItem[]
  toggleCenter: () => void
  pushNotification: (payload: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) => void
  markAllRead: () => void
}

export const useUiStore = create<UiState>((set) => ({
  isCenterOpen: false,
  notifications: [],
  toggleCenter: () => set((state) => ({ isCenterOpen: !state.isCenterOpen })),
  pushNotification: (payload) =>
    set((state) => ({
      notifications: [
        {
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          read: false,
          ...payload,
        },
        ...state.notifications,
      ],
    })),
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((item) => ({ ...item, read: true })),
    })),
}))
