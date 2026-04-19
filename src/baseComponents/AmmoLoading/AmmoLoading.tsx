import styles from './AmmoLoading.module.scss'
import { buildTestId } from '../../utils/testIds'

export type LoaderVariant =
  | 'radar'
  | 'tiles'
  | 'ripple'
  | 'geo'
  | 'wave'
  | 'rocket'

type AmmoLoadingProps = {
  variant?: LoaderVariant
  label?: string
  testId?: string
}

const tileCells = Array.from({ length: 9 }, (_, index) => index)

const defaultLabels: Record<LoaderVariant, string> = {
  radar: 'Calibrating scan',
  tiles: 'Arranging modules',
  ripple: 'Syncing signals',
  geo: 'Aligning geometry',
  wave: 'Warming signals',
  rocket: 'Launching',
}

const renderLoader = (variant: LoaderVariant) => {
  switch (variant) {
    case 'radar':
      return (
        <div className={`${styles.Loader} ${styles.Radar}`} aria-hidden="true">
          <span className={styles.RadarGrid} />
          <span className={styles.RadarSweep} />
          <span className={styles.RadarRing} />
          <span className={styles.RadarBlip} />
          <span className={`${styles.RadarBlip} ${styles.RadarBlipAlt}`} />
        </div>
      )
    case 'tiles':
      return (
        <div className={`${styles.Loader} ${styles.Tiles}`} aria-hidden="true">
          {tileCells.map((cell) => (
            <span key={cell} className={styles.Tile} />
          ))}
        </div>
      )
    case 'ripple':
      return (
        <div className={`${styles.Loader} ${styles.Ripple}`} aria-hidden="true">
          <span className={styles.RippleRing} />
          <span className={`${styles.RippleRing} ${styles.RippleRingAlt}`} />
          <span className={styles.RippleCore} />
        </div>
      )
    case 'geo':
      return (
        <div className={`${styles.Loader} ${styles.Geo}`} aria-hidden="true">
          <span className={styles.GeoOrbit}>
            <span className={`${styles.Shape} ${styles.ShapeSquare}`} />
            <span className={`${styles.Shape} ${styles.ShapeCircle}`} />
            <span className={`${styles.Shape} ${styles.ShapeDiamond}`} />
          </span>
          <span className={`${styles.GeoOrbit} ${styles.GeoOrbitAlt}`}>
            <span className={`${styles.Shape} ${styles.ShapeSquare} ${styles.ShapeSmall}`} />
            <span className={`${styles.Shape} ${styles.ShapeCircle} ${styles.ShapeSmall}`} />
          </span>
          <span className={styles.GeoCore} />
        </div>
      )
    case 'wave':
      return (
        <div className={`${styles.Loader} ${styles.Wave}`} aria-hidden="true">
          {tileCells.slice(0, 4).map((dot) => (
            <span key={dot} className={styles.WaveDot} />
          ))}
        </div>
      )
    case 'rocket': {
      return (
        <div className={`${styles.Loader} ${styles.Rocket}`} aria-hidden="true">
          {/* static orbit track */}
          <svg className={styles.RocketSvg} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="60" cy="60" r="44" stroke="rgba(200,195,185,0.12)" strokeWidth="1.5" />
          </svg>

          {/* trail and rocket rotate together */}
          <div className={styles.RocketRotatingGroup}>
            <svg className={styles.RocketTrailSvg} viewBox="0 0 120 120" overflow="visible" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                {/* Hot white-yellow core near rocket */}
                <radialGradient id="fireCore" cx="50%" cy="0%" r="60%">
                  <stop offset="0%" stopColor="rgba(255,255,220,1)" />
                  <stop offset="40%" stopColor="rgba(255,220,60,0.95)" />
                  <stop offset="100%" stopColor="rgba(255,160,30,0.7)" />
                </radialGradient>
                {/* Bright orange mid trail */}
                <linearGradient id="fireMid" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,180,40,0.9)" />
                  <stop offset="50%" stopColor="rgba(255,120,25,0.6)" />
                  <stop offset="100%" stopColor="rgba(255,70,15,0.2)" />
                </linearGradient>
                {/* Wide dim outer glow */}
                <linearGradient id="fireOuter" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,140,30,0.5)" />
                  <stop offset="50%" stopColor="rgba(255,80,15,0.15)" />
                  <stop offset="100%" stopColor="rgba(255,50,10,0)" />
                </linearGradient>
                <filter id="fireGlow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="fireBlast">
                  <feGaussianBlur stdDeviation="1.5" />
                </filter>
              </defs>

              {/* Layer 1 — outer heat haze */}
              <path
                className={`${styles.RocketTrail} ${styles.RocketTrailOuter}`}
                d="M 60 16 A 44 44 0 0 0 60 104 A 44 44 0 0 0 60 16"
                pathLength="276.46"
                stroke="url(#fireOuter)"
                strokeWidth="9"
                strokeLinecap="round"
                fill="none"
                filter="url(#fireGlow)"
              />
              {/* Layer 2 — mid fire */}
              <path
                className={`${styles.RocketTrail} ${styles.RocketTrailMid}`}
                d="M 60 16 A 44 44 0 0 0 60 104 A 44 44 0 0 0 60 16"
                pathLength="276.46"
                stroke="url(#fireMid)"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />
              {/* Layer 3 — hot core */}
              <path
                className={`${styles.RocketTrail} ${styles.RocketTrailCore}`}
                d="M 60 16 A 44 44 0 0 0 60 104 A 44 44 0 0 0 60 16"
                pathLength="276.46"
                stroke="url(#fireCore)"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              {/* SVG rocket centred at (60,16) — 12 o'clock on the orbit.
                   Drawn pointing RIGHT so it's tangent to clockwise orbit. */}
              <g className={styles.RocketBody} transform="translate(60,16)">
                {/* fuselage */}
                <ellipse cx="0" cy="0" rx="9" ry="5" fill="#e8e0d8" />
                {/* nose cone */}
                <path d="M 8,-3 Q 14,0 8,3 Z" fill="#e05050" />
                {/* window */}
                <circle cx="2" cy="0" r="2.2" fill="#5bc0eb" stroke="#3a8fbf" strokeWidth="0.5" />
                {/* top fin */}
                <path d="M -6,-4 L -9,-9 L -3,-5 Z" fill="#e05050" />
                {/* bottom fin */}
                <path d="M -6,4 L -9,9 L -3,5 Z" fill="#e05050" />

                {/* === FIRE BLAST — 3 spikey flame tongues, each with unique random pattern === */}
                {/* Instance 1: straight back (neutral) */}
                <g className={`${styles.FlameGroup} ${styles.Flame1}`} transform="rotate(0 -9 0)">
                  <path d="M -9,0 L -9.5,-5 L -10,-1 L -10.5,-8 L -11,-2 L -12,-10 L -13,-3 L -14,-11 L -15,-1 L -15.5,-7 L -16,0 L -15.5,6 L -15,1 L -14,10 L -13,2 L -12,11 L -11,3 L -10.5,9 L -10,1 L -9.5,4 Z" fill="rgba(255,60,10,0.55)" filter="url(#fireGlow)" />
                  <path d="M -9,0 L -10,-4 L -10.5,-1 L -11,-6 L -12,-2 L -13,0 L -12,3 L -11,7 L -10.5,1 L -10,5 Z" fill="rgba(255,150,30,0.8)" />
                  <path d="M -9,0 L -10,-2.5 L -11,-0.5 L -11.5,0 L -11,1 L -10,3 Z" fill="rgba(255,230,80,0.95)" filter="url(#fireBlast)" />
                </g>
                {/* Instance 2: angled up (−25°) — different spike pattern */}
                <g className={`${styles.FlameGroup} ${styles.Flame2}`} transform="rotate(-25 -9 0)">
                  <path d="M -9,0 L -9.5,-6 L -10.5,-2 L -11,-9 L -12,-1 L -13,-8 L -14,-4 L -15,-10 L -15.5,0 L -15,8 L -14,3 L -13,9 L -12,1 L -11,7 L -10.5,2 L -9.5,5 Z" fill="rgba(255,70,15,0.45)" filter="url(#fireGlow)" />
                  <path d="M -9,0 L -10,-5 L -11,-1.5 L -12,-7 L -13,0 L -12,6 L -11,2 L -10,4 Z" fill="rgba(255,140,25,0.7)" />
                  <path d="M -9,0 L -10,-3 L -11,0 L -10,2.5 Z" fill="rgba(255,240,100,0.9)" filter="url(#fireBlast)" />
                </g>
                {/* Instance 3: angled down (+25°) — yet another pattern */}
                <g className={`${styles.FlameGroup} ${styles.Flame3}`} transform="rotate(25 -9 0)">
                  <path d="M -9,0 L -10,-7 L -10.5,-2 L -11.5,-10 L -12,-3 L -13,-11 L -14,-1 L -14.5,-6 L -15,0 L -14.5,7 L -14,2 L -13,10 L -12,4 L -11.5,8 L -10.5,1 L -10,6 Z" fill="rgba(255,80,20,0.45)" filter="url(#fireGlow)" />
                  <path d="M -9,0 L -10,-4.5 L -11,-1 L -12,-5 L -13,0 L -12,6 L -11,1.5 L -10,5 Z" fill="rgba(255,130,20,0.65)" />
                  <path d="M -9,0 L -10,-2 L -11,-0.5 L -11.5,0 L -11,1.5 L -10,2.5 Z" fill="rgba(255,220,70,0.85)" filter="url(#fireBlast)" />
                </g>
                {/* White hot centre at exhaust point */}
                <ellipse cx="-10.5" cy="0" rx="2" ry="2" fill="rgba(255,255,240,0.95)" filter="url(#fireBlast)" />
              </g>
            </svg>
          </div>
        </div>
      )
    }
  }
}

export const AmmoLoading = ({ variant = 'radar', label, testId }: AmmoLoadingProps) => {
  const resolvedLabel = label ?? defaultLabels[variant]

  return (
    <div data-testid={buildTestId(testId, 'screen')} className={styles.Screen} role="status" aria-live="polite" aria-busy="true">
      <div data-testid={buildTestId(testId, 'content')} className={styles.Content}>
        {renderLoader(variant)}
        <span data-testid={buildTestId(testId, 'label')} className={styles.Label}>{resolvedLabel}</span>
      </div>
    </div>
  )
}
