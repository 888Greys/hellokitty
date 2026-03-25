import { useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { attachInternalNavigation } from '../lib/attachInternalNavigation'
import { loginBody } from '../templates/loginBody'
import { useAuthStore } from '../stores/auth'
import { useUiStore } from '../stores/ui'

export function AuthPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const loginWithJwt = useAuthStore((state) => state.loginWithJwt)
  const pushNotification = useUiStore((state) => state.pushNotification)

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    const cleanupNavigation = attachInternalNavigation(container, navigate)
    const form = container.querySelector<HTMLFormElement>('form[data-login-form]')
    form?.setAttribute('novalidate', 'novalidate')
    const ssoButton = container.querySelector<HTMLButtonElement>('[data-oauth-provider="sso"]')

    const onSubmit = (event: Event) => {
      event.preventDefault()

      if (!form) {
        return
      }

      const formData = new FormData(form)
      const email = String(formData.get('email') ?? '').trim().toLowerCase()
      const password = String(formData.get('password') ?? '')
      const workspace = String(formData.get('workspace') ?? '').trim()

      if (!email) {
        toast.error('Enter your email address.')
        return
      }

      if (password.length < 8) {
        toast.error('Password must be at least 8 characters.')
        return
      }

      loginWithJwt(`jwt-${crypto.randomUUID()}`, {
        email,
        provider: 'password',
      })
      pushNotification({
        title: 'Login successful',
        message: workspace
          ? `Signed in to ${workspace}.samaritan.com`
          : `Signed in as ${email}`,
      })
      toast.success('Welcome back')
      navigate('/dashboard')
    }

    const onSsoClick = () => {
      loginWithJwt(`sso-${crypto.randomUUID()}`, {
        email: 'sso.user@enterprise.com',
        provider: 'google',
      })
      pushNotification({
        title: 'SSO login successful',
        message: 'Signed in with enterprise SSO.',
      })
      toast.success('Signed in with SSO')
      navigate('/dashboard')
    }

    form?.addEventListener('submit', onSubmit)
    ssoButton?.addEventListener('click', onSsoClick)

    return () => {
      cleanupNavigation()
      form?.removeEventListener('submit', onSubmit)
      ssoButton?.removeEventListener('click', onSsoClick)
    }
  }, [loginWithJwt, navigate, pushNotification])

  return (
    <div
      ref={containerRef}
      className="bg-surface font-body text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed overflow-x-hidden"
      dangerouslySetInnerHTML={{ __html: loginBody }}
    />
  )
}
