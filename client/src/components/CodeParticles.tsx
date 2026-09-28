import { useEffect, useRef } from 'react'
import { useAnimeDecorations } from '../motion/animeDecorations'

const symbols = ['{ }', '</>', ';', '#', '=>', '&&', '01']
export function CodeParticles() {
  const ref = useRef<HTMLDivElement>(null)
  useAnimeDecorations(ref)
  useEffect(() => { if (!ref.current) return; ref.current.dataset.particleCount = window.innerWidth < 640 ? '5' : '9' }, [])
  return <div ref={ref} className="code-particles" aria-hidden="true">{symbols.map((symbol, index) => <span key={symbol} className={`code-particle particle-${index}`}>{symbol}</span>)}</div>
}
