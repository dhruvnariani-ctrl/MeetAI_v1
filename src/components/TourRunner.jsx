import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import TourIntro from './tour/TourIntro'
import TourOverlay from './tour/TourOverlay'
import TourCard from './tour/TourCard'
import {
  readTour,
  saveTour,
  startAppTour,
  stopAppTour,
  TOUR_STORAGE_KEY,
} from './tour/TourStorage'
import { findTarget, positionCard, rectOf } from './tour/TourUtils'

/*
 * Other files import startAppTour from this file (Header, HowItWorks),
 * so it is re-exported here.
 */
export { startAppTour, stopAppTour, TOUR_STORAGE_KEY }

export default function TourRunner() {
  const location = useLocation()
  const navigate = useNavigate()

  const [tour, setTour] = useState(null)
  const [targetRect, setTargetRect] = useState(null)
  const [targetFound, setTargetFound] = useState(false)
  const [cardPosition, setCardPosition] = useState(null)

  const cardRef = useRef(null)

  const step = useMemo(() => tour?.steps?.[tour.index] || null, [tour])

  const resetTarget = () => {
    setTargetRect(null)
    setTargetFound(false)
    setCardPosition(null)
  }

  /*
   * Start/stop listeners + restore an active tour after refresh.
   */
  useEffect(() => {
    const onStart = () => {
      const next = readTour()
      if (!next) return
      setTour(next)
      resetTarget()
    }

    const onStop = () => {
      setTour(null)
      resetTarget()
    }

    window.addEventListener('meetai-tour-start', onStart)
    window.addEventListener('meetai-tour-stop', onStop)

    const existing = readTour()
    if (existing) setTour(existing)

    return () => {
      window.removeEventListener('meetai-tour-start', onStart)
      window.removeEventListener('meetai-tour-stop', onStop)
    }
  }, [])

  /*
   * Navigate to the step's page, then find the target element.
   * If the target never shows up, SKIP the step instead of freezing the tour.
   */
  useEffect(() => {
    if (!tour || !step || tour.phase === 'intro') return undefined

    if (step.path && step.path !== location.pathname) {
      resetTarget()
      navigate(step.path)
      return undefined
    }

    let cancelled = false
    let timer = null
    const started = Date.now()

    resetTarget()

    const locate = () => {
      if (cancelled) return

      const target = findTarget(step.target)

      if (!target) {
        // Give the page up to 5 seconds to render the target.
        if (Date.now() - started < 5000) {
          timer = window.setTimeout(locate, 100)
          return
        }

        // Still missing: move on so one bad selector can't brick the tour.
        if (tour.index >= tour.steps.length - 1) {
          stopAppTour()
          return
        }

        const skipped = { ...tour, index: tour.index + 1 }
        saveTour(skipped)
        setTour(skipped)
        return
      }

      target.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      })

      timer = window.setTimeout(() => {
        if (cancelled) return

        const rect = rectOf(target)
        if (!rect) return

        setTargetRect(rect)
        setTargetFound(true)
      }, 350)
    }

    locate()

    return () => {
      cancelled = true
      if (timer) window.clearTimeout(timer)
    }
  }, [tour, step, location.pathname, navigate])

  /*
   * Keep highlight + card positioned on scroll / resize.
   */
  useEffect(() => {
    if (!tour || !step || !targetFound) return undefined

    const update = () => {
      const rect = rectOf(findTarget(step.target))

      if (!rect) {
        setTargetFound(false)
        setTargetRect(null)
        return
      }

      setTargetRect(rect)

      const cardBox = cardRef.current?.getBoundingClientRect()

      setCardPosition(
        positionCard(rect, cardBox?.width || 360, cardBox?.height || 300),
      )
    }

    update()

    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)

    const observerTarget = findTarget(step.target)
    const observer = observerTarget ? new ResizeObserver(update) : null
    observer?.observe(observerTarget)

    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
      observer?.disconnect()
    }
  }, [tour, step, targetFound])

  /*
   * Re-position when the card itself changes size.
   */
  useEffect(() => {
    if (!tour || !step || !targetFound || !cardRef.current) return undefined

    const updateCard = () => {
      if (!targetRect || !cardRef.current) return

      const cardRect = cardRef.current.getBoundingClientRect()

      setCardPosition(positionCard(targetRect, cardRect.width, cardRect.height))
    }

    updateCard()

    const observer = new ResizeObserver(updateCard)
    observer.observe(cardRef.current)

    return () => observer.disconnect()
  }, [tour, step, targetFound, targetRect])

  if (!tour || !step) return null

  /* ---- Intro screen ---- */
  if (tour.phase === 'intro') {
    return (
      <TourIntro
        onSkip={stopAppTour}
        onStart={() => {
          const startedTour = { ...tour, phase: 'tour' }
          saveTour(startedTour)
          setTour(startedTour)
          resetTarget()
        }}
      />
    )
  }

  if (!targetFound || !targetRect) return null

  /* ---- Step navigation ---- */
  const total = tour.steps.length

  const goTo = (index) => {
    const nextStep = tour.steps[index]
    const nextTour = { ...tour, index }

    saveTour(nextTour)
    setTour(nextTour)
    resetTarget()

    if (nextStep.path && nextStep.path !== location.pathname) {
      navigate(nextStep.path)
    }
  }

  const next = () => {
    if (tour.index >= total - 1) {
      stopAppTour()
      return
    }
    goTo(tour.index + 1)
  }

  const back = () => {
    if (tour.index <= 0) return
    goTo(tour.index - 1)
  }

  return (
    <>
      <TourOverlay targetRect={targetRect} />

      <TourCard
        ref={cardRef}
        step={step}
        index={tour.index}
        total={total}
        position={cardPosition}
        onNext={next}
        onBack={back}
        onClose={stopAppTour}
      />
    </>
  )
}