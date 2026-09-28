import { useEffect, useRef } from 'react'

export function useHomeMotion<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  useEffect(() => {
    const root = ref.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.querySelectorAll<HTMLElement>('[data-counter]').forEach((element) => { element.textContent = Number(element.dataset.counter || 0).toLocaleString() })
      return
    }
    let cancelled = false
    let cleanup: () => void = () => undefined
    void import('gsap').then(async ({ gsap }) => {
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      if (cancelled) return
      gsap.registerPlugin(ScrollTrigger)
      const ctx = gsap.context(() => {
        root.querySelectorAll<HTMLElement>('[data-split]').forEach((element) => {
          if (!element.querySelector('.split-word')) {
            const words = element.textContent?.split(' ') || []
            element.innerHTML = words.map((word) => `<span class="split-word">${word}</span>`).join(' ')
          }
          gsap.from(element.querySelectorAll('.split-word'), { opacity: 0, y: 28, rotateX: -35, duration: .7, stagger: .055, ease: 'power3.out', delay: .12 })
        })
        gsap.from(root.querySelectorAll('[data-hero-float]'), { opacity: 0, y: 22, duration: .65, stagger: .1, ease: 'power3.out', delay: .35 })
        gsap.to(root.querySelector('[data-gradient]'), { yPercent: 8, rotate: 2, duration: 7, repeat: -1, yoyo: true, ease: 'sine.inOut' })
        root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => gsap.from(element, { opacity: 0, y: 34, duration: .7, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 84%', once: true } }))
        root.querySelectorAll<HTMLElement>('[data-counter]').forEach((element) => {
          const target = Number(element.dataset.counter || 0)
          const state = { value: 0 }
          gsap.to(state, { value: target, duration: 1.4, ease: 'power2.out', scrollTrigger: { trigger: element, start: 'top 88%', once: true }, onUpdate: () => { element.textContent = Math.round(state.value).toLocaleString() } })
        })
        const banner = root.querySelector<HTMLElement>('[data-parallax]')
        if (banner && window.innerWidth > 700) gsap.to(banner, { yPercent: -7, ease: 'none', scrollTrigger: { trigger: banner, scrub: true, start: 'top bottom', end: 'bottom top' } })
      }, root)
      cleanup = () => ctx.revert()
    }).catch(() => undefined)
    return () => { cancelled = true; cleanup() }
  }, [])
  return ref
}
