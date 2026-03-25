import { useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { attachInternalNavigation } from '../lib/attachInternalNavigation'
import { finalizeBody } from '../templates/finalizeBody'
import { useUiStore } from '../stores/ui'

function updateModuleCardVisual(card: HTMLElement, selected: boolean): void {
  const selectorDot = card.querySelector('div.w-5.h-5.rounded-full')
  const selectorIcon = selectorDot?.querySelector('span[data-icon="check"]')

  card.classList.toggle('border-primary', selected)
  card.classList.toggle('border-transparent', !selected)

  if (selectorDot instanceof HTMLElement) {
    selectorDot.classList.toggle('bg-primary', selected)
    selectorDot.classList.toggle('border-primary', selected)
    selectorDot.classList.toggle('border-outline-variant', !selected)
    selectorDot.classList.toggle('group-hover:bg-primary', !selected)
    selectorDot.classList.toggle('group-hover:border-primary', !selected)
  }

  if (selectorIcon instanceof HTMLElement) {
    selectorIcon.classList.toggle('opacity-0', !selected)
    selectorIcon.classList.toggle('group-hover:opacity-100', !selected)
  }
}

export function FinalizePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const pushNotification = useUiStore((state) => state.pushNotification)

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    const cleanupNavigation = attachInternalNavigation(container, navigate)
    const moduleCards = Array.from(
      container.querySelectorAll<HTMLElement>('[data-module-card]'),
    )
    const deployButton = container.querySelector<HTMLButtonElement>('[data-deploy-workspace]')

    moduleCards.forEach((card) => {
      const selected = card.classList.contains('border-primary')
      updateModuleCardVisual(card, selected)
    })

    const onCardClick = (event: Event) => {
      const target = event.currentTarget
      if (!(target instanceof HTMLElement)) {
        return
      }

      const selected = !target.classList.contains('border-primary')
      updateModuleCardVisual(target, selected)
    }

    const onDeploy = () => {
      const selectedModules = moduleCards
        .filter((card) => card.classList.contains('border-primary'))
        .map((card) => card.dataset.moduleCard)
        .filter((moduleName): moduleName is string => Boolean(moduleName))

      if (selectedModules.length === 0) {
        toast.error('Select at least one starting module.')
        return
      }

      pushNotification({
        title: 'Workspace deployment initialized',
        message: `Modules: ${selectedModules.join(', ')}`,
      })
      toast.success('Workspace deployed. Sign in to continue.')
      navigate('/auth')
    }

    moduleCards.forEach((card) => card.addEventListener('click', onCardClick))
    deployButton?.addEventListener('click', onDeploy)

    return () => {
      cleanupNavigation()
      moduleCards.forEach((card) => card.removeEventListener('click', onCardClick))
      deployButton?.removeEventListener('click', onDeploy)
    }
  }, [navigate, pushNotification])

  return (
    <div
      ref={containerRef}
      className="finalize-page bg-surface text-on-surface min-h-screen"
      dangerouslySetInnerHTML={{ __html: finalizeBody }}
    />
  )
}
