import { useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { attachInternalNavigation } from '../lib/attachInternalNavigation'
import { useUiStore } from '../stores/ui'
import { adminBody } from '../templates/adminBody'

export function AdminPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const pushNotification = useUiStore((state) => state.pushNotification)

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    const cleanupNavigation = attachInternalNavigation(container, navigate)
    const form = container.querySelector<HTMLFormElement>('form[data-admin-form]')
    form?.setAttribute('novalidate', 'novalidate')
    const togglePasswordButton = container.querySelector<HTMLButtonElement>(
      'button[type="button"] .material-symbols-outlined',
    )?.parentElement as HTMLButtonElement | null
    const passwordInput = form?.querySelector<HTMLInputElement>('input[name="password"]')

    const onSubmit = (event: Event) => {
      event.preventDefault()

      if (!form) {
        return
      }

      const formData = new FormData(form)
      const fullName = String(formData.get('fullName') ?? '').trim()
      const email = String(formData.get('email') ?? '').trim().toLowerCase()
      const role = String(formData.get('role') ?? '').trim()
      const password = String(formData.get('password') ?? '')
      const termsAccepted = formData.get('terms') !== null

      if (!fullName || !email || !role || password.length < 8) {
        toast.error('Complete all required fields to continue.')
        return
      }

      if (!termsAccepted) {
        toast.error('Accept the terms to continue.')
        return
      }

      pushNotification({
        title: 'Admin account created',
        message: `${fullName} (${role}) is ready for first login.`,
      })
      toast.success('Admin setup complete. Continue to finalize.')
      navigate('/register/finalize')
    }

    const onTogglePassword = () => {
      if (!passwordInput) {
        return
      }

      passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password'
    }

    form?.addEventListener('submit', onSubmit)
    togglePasswordButton?.addEventListener('click', onTogglePassword)

    return () => {
      cleanupNavigation()
      form?.removeEventListener('submit', onSubmit)
      togglePasswordButton?.removeEventListener('click', onTogglePassword)
    }
  }, [navigate, pushNotification])

  return (
    <div
      ref={containerRef}
      className="admin-page bg-surface font-body text-on-surface min-h-screen"
      dangerouslySetInnerHTML={{ __html: adminBody }}
    />
  )
}
