import { useEffect, type RefObject } from 'react'

export function useAnimeDecorations(rootRef: RefObject<HTMLElement>) {
  useEffect(() => {
    const root = rootRef.current
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let cancelled = false
    let instances: any[] = []
    let animeApi: any
    void import('animejs').then((module) => {
      if (cancelled) return
      const anime = (module as any).default || module
      animeApi = anime
      const line = root.querySelector('.logo-line')
      if (line) instances.push(anime({ targets: line, strokeDashoffset: [anime.setDashoffset, 0], duration: 900, easing: 'easeOutQuart' }))
      const particles = Array.from(root.querySelectorAll('.code-particle'))
      if (particles.length) instances.push(anime({ targets: particles, translateY: () => anime.random(-24, 24), translateX: () => anime.random(-18, 18), opacity: [0.08, 0.42], delay: anime.stagger(160), duration: 3500, direction: 'alternate', loop: true, easing: 'easeInOutSine' }))
      const pulseTargets = root.querySelectorAll('.pulse-target')
      if (pulseTargets.length) instances.push(anime({ targets: pulseTargets, scale: [1, 1.035], opacity: [.88, 1], duration: 1200, direction: 'alternate', loop: true, easing: 'easeInOutSine', delay: anime.stagger(90) }))
      const dividers = root.querySelectorAll('.divider-line')
      if (dividers.length) instances.push(anime({ targets: dividers, strokeDashoffset: [anime.setDashoffset, 0], duration: 1100, delay: 300, easing: 'easeOutQuart' }))
    }).catch(() => undefined)
    return () => { cancelled = true; instances.forEach((instance) => instance?.pause?.()); animeApi?.remove?.(root.querySelectorAll('.logo-line, .code-particle, .pulse-target, .divider-line')); instances = [] }
  }, [rootRef])
}
