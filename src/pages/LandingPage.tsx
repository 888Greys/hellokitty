import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { attachInternalNavigation } from '../lib/attachInternalNavigation'
import { landingBody } from '../templates/landingBody'

export function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    return attachInternalNavigation(container, navigate)
  }, [navigate])

  return (
    <div
      ref={containerRef}
      className="bg-surface text-on-surface selection:bg-primary-fixed selection:text-primary"
      dangerouslySetInnerHTML={{ __html: landingBody }}
    />
  )
}
