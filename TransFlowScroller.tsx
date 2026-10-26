// Adapted from Hyperiux Vault: https://vault.hyperiux.com
// Scroll-driven horizontal story for TransFlow. Opens with the logo and a short explanation.

import { useLayoutEffect, useRef, useSyncExternalStore } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import './transflow-scroller.css'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText)
}

/* Inline stand-in for @gsap/react's useGSAP. One gsap.context lives for the component's lifetime,
   the callback is re-added when dependencies change, and the context is reverted on unmount.
   A callback may return its own cleanup, which runs before the next re-add and on unmount. */
function useGSAP(
  callback: () => void | (() => void),
  options?: {
    dependencies?: unknown[]
    scope?: { current: Element | null } | Element | null
  },
) {
  const deps = options?.dependencies ?? []
  const scope = options?.scope
  const ctxRef = useRef<gsap.Context | null>(null)
  const cleanupRef = useRef<(() => void) | undefined>(undefined)

  useLayoutEffect(() => {
    const el =
      scope && typeof scope === 'object' && 'current' in scope ? scope.current : (scope as Element | null)
    ctxRef.current = gsap.context(() => {}, el ?? undefined)
    return () => {
      cleanupRef.current?.()
      cleanupRef.current = undefined
      ctxRef.current?.revert()
      ctxRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useLayoutEffect(() => {
    if (!ctxRef.current) return
    cleanupRef.current?.()
    const ret = ctxRef.current.add(callback)
    cleanupRef.current = typeof ret === 'function' ? ret : undefined
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

/* Bus icon that rides the tip of the progress line as the story scrolls. */
function BusIcon() {
  return (
    <svg className="ts-bus-icon" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <path d="M0 0h64v64H0z" fill="none" />
      <path fill="currentColor" d="M11.974 49.959h5.931v2.98h-5.931zm34 0h5.932v2.98h-5.932z" />
      <ellipse cx="50.685" cy="43.46" fill="currentColor" rx="2.403" ry="2.416" />
      <ellipse cx="45.49" cy="43.46" fill="currentColor" rx="2.402" ry="2.416" />
      <ellipse cx="18.511" cy="43.46" fill="currentColor" rx="2.403" ry="2.416" />
      <ellipse cx="13.316" cy="43.46" fill="currentColor" rx="2.403" ry="2.416" />
      <path fill="currentColor" d="M60.001 15.754h-.382L56 12.116V7.711a3.01 3.01 0 0 0-3-3.018h-5.05C47.95 3.205 47.156 2 46.178 2H17.824c-.98 0-1.772 1.205-1.772 2.693H11a3.01 3.01 0 0 0-3 3.018v4.405l-3.618 3.638h-.381c-.553 0-1.001.449-1.001 1.005v8.042c0 .557.448 1.006 1.001 1.006H6c.554 0 1-.449 1-1.006v-8.042a1 1 0 0 0-1-1.005h-.203L8 13.538v40.419a3.01 3.01 0 0 0 3 3.016v3.018c0 1.105.901 2.01 2.001 2.01h4A2.01 2.01 0 0 0 19 59.991v-3.018h26v3.018c0 1.105.901 2.01 2.001 2.01h4A2.01 2.01 0 0 0 53 59.991v-3.018c1.657 0 3-1.35 3-3.016V13.538l2.205 2.216H58c-.552 0-1 .449-1 1.005v8.042c0 .557.448 1.006 1 1.006h2.001A1 1 0 0 0 61 24.801v-8.042a1 1 0 0 0-.999-1.005M41.092 45.408v1.006H22.91v-1.006zM22.91 44.404v-1.006h18.182v1.006zm18.182 3.016v1.006H22.91V47.42zm0 2.01v1.006H22.91V49.43zm0 2.011v1.004H22.91v-1.004zm12.357 2.989h-8.896v-5.961h8.896zm-34 0h-8.896v-5.961h8.896zM42 46.926v-4.533H22v4.533H10V7.711a1.01 1.01 0 0 1 1-1.017h42c.552 0 1 .456 1 1.017v39.215z" />
      <path fill="currentColor" d="M17.824 15.285h28.354c.979 0 1.772-.797 1.772-1.782V9.94c0-.985-.794-1.782-1.772-1.782H17.824c-.98 0-1.772.797-1.772 1.782v3.563c0 .985.792 1.782 1.772 1.782m6.946-3.764l-.266.267l-.264-.267V9.987h.529zm1.126 2.268a.43.43 0 0 1-.33.334l-.198-.534v-1.4l.397-.4l.131.134zm2.788.334h-1.458l-.266-.268l.266-.267h1.458l.266.267zm.664-.667l-.332.333l-.199-.2v-1.4l.398-.4l.133.134zm7.429.667h-1.459l-.266-.268l.266-.267h1.459l.266.267zm.662-.667l-.33.333l-.199-.2v-1.4l.398-.4l.131.134zm4.453-4.136h2.183l-.199.534h-1.784l-.53-.2a.43.43 0 0 1 .33-.334m2.182 2.402l-.265.267h-1.726l-.266-.267l.266-.267h1.726zm-2.52-1.935l.53.2v1.268l-.397.4l-.133-.134zm0 2.135l.133-.134l.397.4v1.268l-.53.2zm.53 1.667h1.791l.199.534h-2.189a.43.43 0 0 1-.331-.334zm-1.725-3.668l.199-.533a.42.42 0 0 1 .332.333v1.867l-.133.134l-.398-.4zm0 2.267l.398-.4l.133.134v1.867a.43.43 0 0 1-.332.334l-.199-.534zm-1.591-2.267h.398l1.061 1.066v.334h-.464l-.995-1zm-.664-.2a.43.43 0 0 1 .332-.333l.199.533v1.4l-.398.4l-.133-.134zm0 2.201l.133-.134l.398.4v1.4l-.199.534a.43.43 0 0 1-.332-.334zm-.665-1.935v1.534l-.131.134l-.398-.4v-1.4l.199-.2zm-2.121-.667h1.459l.266.268l-.266.267h-1.459l-.266-.267zm-.663.667l.331-.333l.199.2v1.4l-.398.4l-.132-.134zm0 1.935l.132-.134l.398.4v1.4l-.199.2l-.331-.333zm-1.194-2.068l.198-.534a.43.43 0 0 1 .332.334v1.867l-.133.134l-.397-.4zm0 2.268l.397-.4l.133.134v1.866a.43.43 0 0 1-.332.334l-.198-.533zm-1.194-2.268l.198-.534a.43.43 0 0 1 .332.334v1.867l-.133.134l-.397-.4zm0 2.334l.397-.4l.133.134v1.867a.43.43 0 0 1-.332.334l-.198-.534zm-2.256-.266l.133-.134l.397.4v1.268l-.53.2zm.53 1.667h1.593l.198.534h-1.989a.43.43 0 0 1-.332-.334zm-1.193-3.602v1.534l-.133.134l-.398-.4v-1.4l.199-.2zm-2.122-.667h1.458l.266.268l-.266.267h-1.458l-.266-.267zm-.665.667l.332-.333l.199.2v1.4l-.398.4l-.133-.134zm0 1.935l.133-.134l.398.4v1.4l-.199.2l-.332-.333zm-.665-2.268v1.867l-.131.134l-.397-.4v-1.4l.198-.534a.42.42 0 0 1 .33.333m-2.447-.334h1.984l-.199.534h-1.585l-.53-.2a.43.43 0 0 1 .33-.334m-.337.467l.53.2v1.268l-.398.4l-.132-.134zm0 2.135l.132-.134l.398.4v1.4l-.199.534a.43.43 0 0 1-.331-.334zM20.266 9.32h2.183l-.2.534h-1.783l-.53-.2a.43.43 0 0 1 .33-.334m2.182 2.402l-.265.267h-1.726l-.266-.267l.266-.267h1.726zm-2.52-1.935l.53.2v1.268l-.397.4l-.133-.134zm0 2.135l.133-.134l.397.4v1.268l-.53.2zm.53 1.667h1.79l.2.534h-2.19a.43.43 0 0 1-.33-.334zm21.817 22.682h-8.957v-1.006H51.5v1.006h-8.113l4.4 2.358h2.438a2.785 2.785 0 0 0 2.776-2.793V19.423a2.784 2.784 0 0 0-2.776-2.791H13.777a2.783 2.783 0 0 0-2.776 2.791v16.414a2.784 2.784 0 0 0 2.776 2.793h12.244l-4.527-2.358h-8.957v-1.006h18.182v1.006h-8.113l4.4 2.358h19.797z" />
    </svg>
  )
}

/* Places the bus on screen and fills the progress line up to it.
   The bus travels from the middle of the screen to the right edge as the story scrolls (f = 0 to 1). */
function placeBus(section: HTMLElement, f: number) {
  const bus = section.querySelector<HTMLElement>('.ts-bus')
  const progress = section.querySelector<HTMLElement>('.ts-progress')
  const axis = section.querySelector<HTMLElement>('.ts-axis')
  const dot = section.querySelector<HTMLElement>('.ts-axis .ts-dot')
  if (!bus || !progress || !axis || !dot) return
  const vw = window.innerWidth
  const busX = vw / 2 + f * (vw / 2 - 40)
  const axisBox = axis.getBoundingClientRect()
  const dotW = dot.getBoundingClientRect().width
  const start = axisBox.left + dotW
  // The line runs from the start dot right up to the bus, with no clamp, so it never leads the bus.
  const w = Math.max(busX - start, 0)
  progress.style.width = `${w}px`
  bus.style.left = `${busX}px`
}

/* Snaps stems and dots to device pixels, so every line draws equally sharp at any screen density.
   Measures each element against the track, so it works at any scroll position. */
function snapToPixels(section: HTMLElement) {
  const track = section.querySelector<HTMLElement>('.ts-track')
  if (!track) return
  const origin = track.getBoundingClientRect().left
  const dpr = window.devicePixelRatio || 1
  const lineDevicePx = Math.round(2 * dpr)
  const lineWidth = lineDevicePx / dpr
  section.querySelectorAll<HTMLElement>('.ts-stem').forEach((el) => {
    el.style.width = `${lineWidth}px`
    el.style.marginLeft = `${-lineWidth / 2}px`
  })
  section.querySelectorAll<HTMLElement>('.ts-stem, .ts-node').forEach((el) => {
    const isLine = el.classList.contains('ts-stem')
    const r = el.getBoundingClientRect()
    const centre = r.left + r.width / 2 - origin
    // An odd-width line must be centred on a half device pixel to be drawn sharp.
    const target =
      isLine && lineDevicePx % 2 === 1
        ? (Math.floor(centre * dpr) + 0.5) / dpr
        : Math.round(centre * dpr) / dpr
    el.style.left = `${(parseFloat(el.style.left) || 0) + (target - centre)}px`
  })
}

type JourneyItem = {
  id: string
  label: string
  content: string
}

type SplitTextInstance = InstanceType<typeof SplitText>

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

function subscribeToReducedMotion(callback: () => void) {
  if (typeof window === 'undefined') return () => {}
  const mediaQueryList = window.matchMedia(REDUCED_MOTION_QUERY)
  mediaQueryList.addEventListener('change', callback)
  return () => mediaQueryList.removeEventListener('change', callback)
}

function getReducedMotionSnapshot() {
  if (typeof window === 'undefined') return false
  return window.matchMedia?.(REDUCED_MOTION_QUERY)?.matches ?? false
}

function getServerReducedMotionSnapshot() {
  return false
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribeToReducedMotion, getReducedMotionSnapshot, getServerReducedMotionSnapshot)
}

/* The story. Top row first, then bottom row; the order is also the scroll order. */
const topItems: JourneyItem[] = [
  {
    id: 'plan',
    label: '1. Plan',
    content: "Choose where you're starting and where you're going. Only places that Routes buses serve appear.",
  },
  {
    id: 'trip',
    label: '2. Trip',
    content: 'See every stop in order, with where to board and where to alight. Tick off each stop as you pass it.',
  },
  {
    id: 'map',
    label: '3. Live map',
    content: 'Follow the trip on a street map. It pauses at each stop, then zooms out to show the whole route.',
  },
  {
    id: 'offline',
    label: '4. Offline',
    content: 'Save your trip to your phone and follow it without signal.',
  },
]

const bottomItems: JourneyItem[] = [
  {
    id: 'routes',
    label: 'Routes',
    content: 'Four Routes from Gandhi Square along Louis Botha and Highlands North: 4, 13A, 13B and 13C.',
  },
  {
    id: 'taxi',
    label: 'Taxi ranks',
    content: 'Four main city-centre ranks: MTN Noord, Bree Street, Wanderers and Faraday.',
  },
  {
    id: 'share',
    label: 'Share live trip',
    content: 'Send a South African mobile number a preview of your trip. They get live updates as you pass each stop, until you arrive.',
  },
]

const allItems: JourneyItem[] = [...topItems, ...bottomItems]

/* Scroll windows for each item, as percentages of the section (desktop, then phone). */
const DESKTOP_POSITIONS: ReadonlyArray<readonly [number, number]> = [
  [6, 26],
  [16, 36],
  [26, 46],
  [35, 55],
  [45, 65],
  [55, 75],
  [65, 85],
]

const PHONE_POSITIONS: ReadonlyArray<readonly [number, number]> = [
  [22, 32],
  [28, 38],
  [36, 46],
  [45, 55],
  [52, 62],
  [60, 70],
  [69, 79],
]

const ANIMATION_DURATION = 1.2

export default function TransFlowScroller() {
  const sectionRef = useRef<HTMLElement>(null)
  const wholeSliderRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0)
  const reducedMotion = usePrefersReducedMotion()

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return

      const isPhone = window.innerWidth < 600
      const slideEnd = isPhone ? '82% 50%' : '92% bottom'

      // Slide far enough that the last panel ends at the right edge, whatever the screen width.
      // Measured in pixels and re-read on every refresh, so it stays right after resizes and font loads.
      const slideTo = () => {
        const track = wholeSliderRef.current
        if (!track) return 0
        return -Math.max(0, track.offsetWidth - window.innerWidth)
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: slideEnd,
          scrub: true,
          onUpdate: (self) => {
            progressRef.current = self.progress
            if (!reducedMotion) placeBus(section, self.progress)
          },
        },
        defaults: { ease: 'none' },
      })

      // Round the slide to whole device pixels so the snapped lines stay sharp while scrolling.
      tl.fromTo(
        wholeSliderRef.current,
        { x: 0 },
        {
          x: slideTo,
          modifiers: {
            x: (value: string) => {
              const dpr = window.devicePixelRatio || 1
              return `${Math.round(parseFloat(value) * dpr) / dpr}px`
            },
          },
        },
      )

      if (reducedMotion) {
        // No motion: show the whole line and put the bus at the far end.
        gsap.set('.ts-progress', { width: '100%' })
        gsap.set('.ts-bus', { left: 'calc(100% - 40px)' })
        return
      }

      placeBus(section, progressRef.current)
    },
    { dependencies: [reducedMotion], scope: sectionRef },
  )

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return

      if (reducedMotion) {
        allItems.forEach((item) => {
          gsap.set(`.jl-${item.id}`, { clipPath: 'inset(0% 0% 0% 0%)' })
          gsap.set(`.jd-${item.id}`, { scale: 1 })
          gsap.set(`.title-${item.id}`, { opacity: 1, clearProps: 'transform' })
          gsap.set(`.description-${item.id}`, { opacity: 1, clearProps: 'transform' })
        })
        return
      }

      allItems.forEach((item) => {
        // Stems are revealed with a clip, not a transform, so they stay pixel-sharp.
        const hiddenClip = topItems.some((topItem) => topItem.id === item.id)
          ? 'inset(100% 0% 0% 0%)'
          : 'inset(0% 0% 100% 0%)'
        gsap.set(`.jl-${item.id}`, { clipPath: hiddenClip })
        gsap.set(`.jd-${item.id}`, { scale: 0 })
        gsap.set(`.title-${item.id}`, { opacity: 1 })
        gsap.set(`.description-${item.id}`, { opacity: 1 })
      })

      const titleSplits: Partial<Record<string, SplitTextInstance>> = {}
      const descriptionSplits: Partial<Record<string, SplitTextInstance>> = {}

      allItems.forEach((item) => {
        titleSplits[item.id] = new SplitText(`.title-${item.id}`, {
          type: 'chars, words, lines',
          mask: 'lines',
        })
        descriptionSplits[item.id] = new SplitText(`.description-${item.id}`, {
          type: 'chars, words, lines',
          mask: 'lines',
        })
      })

      const createItemTimeline = (item: JourneyItem, startPos: number, endPos: number) => {
        const lineSelector = `.jl-${item.id}`
        const dotSelector = `.jd-${item.id}`
        const titleLines = titleSplits[item.id]?.lines || []
        const descriptionLines = descriptionSplits[item.id]?.lines || []


        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: `${startPos}% 30%`,
            end: `${endPos}% 50%`,
            scrub: true,
          },
        })

        timeline
          .to(lineSelector, { clipPath: 'inset(0% 0% 0% 0%)', duration: ANIMATION_DURATION * 0.4 })
          .to(dotSelector, { scale: 1, duration: ANIMATION_DURATION * 0.4 }, '<')
          .fromTo(
            titleLines,
            { y: 100 },
            {
              y: 0,
              delay: -0.8 * ANIMATION_DURATION,
              duration: ANIMATION_DURATION,
              stagger: 0.02,
              ease: 'power2.out',
            },
          )
          .fromTo(
            descriptionLines,
            { y: 100 },
            { y: 0, duration: ANIMATION_DURATION, stagger: 0.02, ease: 'power2.out' },
            '<',
          )

        return timeline
      }

      const positions = window.innerWidth < 600 ? PHONE_POSITIONS : DESKTOP_POSITIONS
      allItems.forEach((item, index) => {
        const [startPos, endPos] = positions[index]
        createItemTimeline(item, startPos, endPos)
      })
      snapToPixels(section)

      const handleResize = () => {
        ScrollTrigger.refresh()
        snapToPixels(section)
        if (!reducedMotion) placeBus(section, progressRef.current)
      }
      window.addEventListener('resize', handleResize)
      window.addEventListener('load', handleResize)
      void document.fonts?.ready.then(handleResize)

      return () => {
        Object.values(titleSplits).forEach((split) => split?.revert?.())
        Object.values(descriptionSplits).forEach((split) => split?.revert?.())
        window.removeEventListener('resize', handleResize)
        window.removeEventListener('load', handleResize)
      }
    },
    { dependencies: [reducedMotion], scope: sectionRef },
  )

  return (
    <section ref={sectionRef} className="ts-scroller ts-section" aria-label="What TransFlow is and how it works">
      <img className="ts-logo" src="/transflow-logo.png" alt="TransFlow logo" draggable={false} />
      <div className="ts-sticky">
        <span className="ts-bus" aria-hidden="true">
          <BusIcon />
        </span>
        <div ref={wholeSliderRef} className="ts-track">
          <div className="ts-intro">
            <h1 className="ts-intro-title">What is TransFlow?</h1>
            <p>
              A Johannesburg commute tool for people who ride Routes buses and minibus taxis. Plan a trip, follow it
              stop by stop, and see the estimated fare before you leave.
            </p>
            <p>
              It is a planning tool, not an official transport service. Fares and times may change, so confirm before
              you travel.
            </p>
          </div>

          <div className="ts-timeline">
            <div className="ts-axis">
              <div className="ts-dot" />
              <div className="ts-progress" />
            </div>

            <div className="ts-top">
              <div className="ts-title-block">
                <h2 className="ts-title">How TransFlow works</h2>
              </div>

              <div className="ts-top-items">
                {topItems.map((item) => (
                  <div key={`top-${item.id}`} className="ts-item">
                    <div className="ts-axis-item">
                      <div className={`ts-node jd-${item.id}`} />
                      <div className={`ts-stem ts-stem-top jl-${item.id}`} />
                    </div>

                    <div className="ts-copy-top">
                      <h3 className={`ts-label title-${item.id}`}>{item.label}</h3>
                      <p className={`ts-text description-${item.id}`}>{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="ts-bottom">
              <div className="ts-period">
                <p>Johannesburg</p>
              </div>

              <div className="ts-bottom-items">
                {bottomItems.map((item) => (
                  <div key={`bottom-${item.id}`} className="ts-item-bottom">
                    <div className="ts-axis-bottom">
                      <div className={`ts-stem ts-stem-bottom jl-${item.id}`} />
                      <div className={`ts-node jd-${item.id}`} />
                    </div>

                    <div className="ts-copy-bottom">
                      <h3 className={`ts-label title-${item.id}`}>{item.label}</h3>
                      <p className={`ts-text description-${item.id}`}>{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
