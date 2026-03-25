import { Link, NavLink } from 'react-router-dom'
import { useAuthStore } from '../../stores/auth'
import { useUiStore } from '../../stores/ui'

export function NavBar() {
  const token = useAuthStore((state) => state.token)
  const logout = useAuthStore((state) => state.logout)
  const notifications = useUiStore((state) => state.notifications)
  const toggleCenter = useUiStore((state) => state.toggleCenter)

  const unreadCount = notifications.filter((item) => !item.read).length

  return (
    <header className="sticky top-0 z-40 border-b border-blue-100/80 bg-white/85 backdrop-blur">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-6">
        <Link to="/" className="font-headline text-xl font-extrabold text-primary">
          Samaritan System
        </Link>
        <div className="flex items-center gap-3 md:gap-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-semibold ${isActive ? 'text-primary' : 'text-onSurfaceVariant hover:text-primary'}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `text-sm font-semibold ${isActive ? 'text-primary' : 'text-onSurfaceVariant hover:text-primary'}`
            }
          >
            Dashboard
          </NavLink>
          <button
            type="button"
            onClick={toggleCenter}
            className="relative rounded-md border border-blue-100 bg-surfaceContainerLow px-3 py-1.5 text-xs font-semibold text-primary"
          >
            Notifications
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1.5 text-[10px] text-white">
                {unreadCount}
              </span>
            )}
          </button>
          {token ? (
            <button
              type="button"
              onClick={logout}
              className="rounded-md bg-inverseSurface px-3 py-1.5 text-xs font-semibold text-white"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/auth"
              className="rounded-md bg-primaryContainer px-3 py-1.5 text-xs font-semibold text-white"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}
