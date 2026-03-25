import { useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { attachInternalNavigation } from '../lib/attachInternalNavigation'
import { registerBody } from '../templates/registerBody'
import { useUiStore } from '../stores/ui'

export function RegisterPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const pushNotification = useUiStore((state) => state.pushNotification)

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    const cleanupNavigation = attachInternalNavigation(container, navigate)
    const form = container.querySelector<HTMLFormElement>('form[data-register-form]')
    form?.setAttribute('novalidate', 'novalidate')

    const onSubmit = (event: Event) => {
      event.preventDefault()

      if (!form) {
        return
      }

      const formData = new FormData(form)
      const orgName = String(formData.get('orgName') ?? '').trim()
      const workspace = String(formData.get('workspace') ?? '').trim().toLowerCase()
      const industry = String(formData.get('industry') ?? '').trim()

      if (!orgName) {
        toast.error('Enter your organization name.')
        return
      }

      if (workspace.length < 4 || !/^[a-z0-9-]+$/i.test(workspace)) {
        toast.error('Workspace must be at least 4 characters and use letters, numbers, or hyphens.')
        return
      }

      pushNotification({
        title: 'Registration saved',
        message: `${orgName} (${industry || 'Organization'}) workspace: ${workspace}.samaritan.cloud`,
      })
      toast.success('Setup saved. Continue to admin account.')
      navigate('/register/admin')
    }

    form?.addEventListener('submit', onSubmit)

    return () => {
      cleanupNavigation()
      form?.removeEventListener('submit', onSubmit)
    }
  }, [navigate, pushNotification])

  return (
    <div
      ref={containerRef}
      className="register-page bg-surface font-body text-on-surface antialiased min-h-screen"
      dangerouslySetInnerHTML={{ __html: registerBody }}
    />
  )
}
