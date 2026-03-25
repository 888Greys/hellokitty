import { useUiStore } from '../../stores/ui'

export function NotificationCenter() {
  const isOpen = useUiStore((state) => state.isCenterOpen)
  const notifications = useUiStore((state) => state.notifications)
  const markAllRead = useUiStore((state) => state.markAllRead)

  if (!isOpen) {
    return null
  }

  return (
    <aside className="fixed right-4 top-20 z-50 w-[min(360px,calc(100vw-2rem))] rounded-xl border border-blue-100 bg-white p-4 shadow-card">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-headline text-lg font-bold">Notification Center</h3>
        <button
          type="button"
          onClick={markAllRead}
          className="text-xs font-semibold text-primary hover:underline"
        >
          Mark all read
        </button>
      </div>
      <div className="max-h-80 space-y-2 overflow-y-auto">
        {notifications.length === 0 && (
          <p className="rounded-md bg-surfaceContainerLow p-3 text-sm text-onSurfaceVariant">
            No notifications yet.
          </p>
        )}
        {notifications.map((item) => (
          <article
            key={item.id}
            className={`rounded-md border p-3 ${item.read ? 'border-blue-100 bg-white' : 'border-blue-200 bg-blue-50/70'}`}
          >
            <p className="text-sm font-bold text-onSurface">{item.title}</p>
            <p className="text-xs text-onSurfaceVariant">{item.message}</p>
            <p className="mt-2 text-[10px] uppercase tracking-wide text-onSurfaceVariant/80">
              {new Date(item.createdAt).toLocaleString()}
            </p>
          </article>
        ))}
      </div>
    </aside>
  )
}
