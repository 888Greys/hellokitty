import type { NavigateFunction } from 'react-router-dom'

export function isInternalHref(href: string): boolean {
  return href.startsWith('/')
}

export function attachInternalNavigation(
  container: HTMLElement,
  navigate: NavigateFunction,
): () => void {
  const onClick = (event: Event) => {
    const target = event.target
    if (!(target instanceof Element)) {
      return
    }

    const anchor = target.closest('a[href]')
    if (!(anchor instanceof HTMLAnchorElement)) {
      return
    }

    const href = anchor.getAttribute('href')?.trim()
    if (!href || !isInternalHref(href)) {
      return
    }

    if (anchor.target && anchor.target !== '_self') {
      return
    }

    event.preventDefault()
    navigate(href)
  }

  container.addEventListener('click', onClick)

  return () => {
    container.removeEventListener('click', onClick)
  }
}
