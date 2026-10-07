import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Fade,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import {
  ArrowBack,
  ArrowForward,
  CalendarMonth,
  CheckCircle,
  Close,
  EventAvailable,
  FilterList,
  Groups,
  HelpOutlined,
  Lightbulb,
  Mic,
  PlayCircleOutlined,
  TaskAlt,
  Today,
  VideoLibrary,
} from '@mui/icons-material'

export const TOUR_STORAGE_KEY = 'meetai-active-tour'

/*
 * Tour data stores icons as STRINGS (components can't go into sessionStorage).
 * Every string used in tours.js / dashboardTours.js must exist here.
 */
const TOUR_ICONS = {
  Today,
  CalendarMonth,
  CheckCircle,
  EventAvailable,
  FilterList,
  Groups,
  HelpOutlined,
  Lightbulb,
  Mic,
  PlayCircleOutlined,
  TaskAlt,
  VideoLibrary,
}

const OVERLAY = 'rgba(20, 34, 50, .42)'

const toSafeSteps = (steps) =>
  steps.map((step) => ({
    ...step,
    icon: typeof step.icon === 'string' ? step.icon : 'Lightbulb',
  }))

export function startAppTour(steps) {
  const safeSteps = Array.isArray(steps) ? toSafeSteps(steps) : []
  if (!safeSteps.length) return

  sessionStorage.setItem(
    TOUR_STORAGE_KEY,
    JSON.stringify({ steps: safeSteps, index: 0, phase: 'intro' }),
  )

  window.dispatchEvent(new Event('meetai-tour-start'))
}

export function stopAppTour() {
  sessionStorage.removeItem(TOUR_STORAGE_KEY)
  window.dispatchEvent(new Event('meetai-tour-stop'))
}

function readTour() {
  try {
    const raw = sessionStorage.getItem(TOUR_STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw)

    if (!parsed || !Array.isArray(parsed.steps) || !parsed.steps.length) {
      return null
    }

    const steps = toSafeSteps(parsed.steps)
    const index = Number.isInteger(parsed.index) ? parsed.index : 0

    return {
      steps,
      index: Math.min(Math.max(index, 0), steps.length - 1),
      phase: parsed.phase === 'intro' ? 'intro' : 'tour',
    }
  } catch {
    return null
  }
}

function saveTour(tour) {
  sessionStorage.setItem(TOUR_STORAGE_KEY, JSON.stringify(tour))
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), Math.max(min, max))
}

function findTarget(selector) {
  if (!selector) return null

  try {
    return document.querySelector(selector)
  } catch {
    return null
  }
}

function rectOf(element) {
  if (!element) return null

  const r = element.getBoundingClientRect()

  return {
    top: r.top,
    left: r.left,
    right: r.right,
    bottom: r.bottom,
    width: r.width,
    height: r.height,
  }
}

function positionCard(rect, width, height) {
  const gap = 18
  const pad = 16

  const vw = window.innerWidth
  const vh = window.innerHeight

  if (!rect) {
    return {
      left: clamp((vw - width) / 2, pad, vw - width - pad),
      top: clamp((vh - height) / 2, pad, vh - height - pad),
    }
  }

  const candidates = [
    // Right
    { left: rect.right + gap, top: clamp(rect.top, pad, vh - height - pad) },
    // Left
    { left: rect.left - gap - width, top: clamp(rect.top, pad, vh - height - pad) },
    // Below
    { left: clamp(rect.left, pad, vw - width - pad), top: rect.bottom + gap },
    // Above
    { left: clamp(rect.left, pad, vw - width - pad), top: rect.top - gap - height },
  ]

  const overlapsTarget = (c) =>
    !(
      c.left + width <= rect.left - gap ||
      c.left >= rect.right + gap ||
      c.top + height <= rect.top - gap ||
      c.top >= rect.bottom + gap
    )

  const fitsViewport = (c) =>
    c.left >= pad &&
    c.left + width <= vw - pad &&
    c.top >= pad &&
    c.top + height <= vh - pad

  const safe = candidates.find((c) => fitsViewport(c) && !overlapsTarget(c))
  if (safe) return safe

  const fits = candidates.find(fitsViewport)
  if (fits) return fits

  return {
    left: clamp(rect.right + gap, pad, vw - width - pad),
    top: clamp(rect.top, pad, vh - height - pad),
  }
}

const hintBoxSx = {
  p: 1.4,
  borderRadius: 2,
  bgcolor: '#f6f9fc',
  border: '1px solid #e3eaf2',
}

const hintLabelSx = { fontSize: '.68rem', fontWeight: 700, color: '#53667d' }

const hintTextSx = {
  mt: 0.25,
  fontSize: '.75rem',
  lineHeight: 1.5,
  color: '#65768b',
}

export default function TourRunner() {
  const location = useLocation()
  const navigate = useNavigate()

  const [tour, setTour] = useState(null)
  const [targetRect, setTargetRect] = useState(null)
  const [targetFound, setTargetFound] = useState(false)
  const [cardPosition, setCardPosition] = useState(null)

  const cardRef = useRef(null)

  const step = useMemo(() => tour?.steps?.[tour.index] || null, [tour])

  /*
   * Start/stop listeners + restore an active tour after refresh.
   */
  useEffect(() => {
    const reset = () => {
      setTargetRect(null)
      setTargetFound(false)
      setCardPosition(null)
    }

    const onStart = () => {
      const next = readTour()
      if (!next) return
      setTour(next)
      reset()
    }

    const onStop = () => {
      setTour(null)
      reset()
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
      setTargetRect(null)
      setTargetFound(false)
      setCardPosition(null)
      navigate(step.path)
      return undefined
    }

    let cancelled = false
    let timer = null
    const started = Date.now()

    setTargetRect(null)
    setTargetFound(false)
    setCardPosition(null)

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

  if (tour.phase === 'intro') {
    return (
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: 1500,
          bgcolor: 'rgba(20, 34, 50, .55)',
          display: 'grid',
          placeItems: 'center',
          p: 2,
        }}
      >
        <Paper
          elevation={12}
          sx={{ width: '100%', maxWidth: 480, borderRadius: 3, overflow: 'hidden' }}
        >
          <LinearProgress variant="determinate" value={0} sx={{ height: 4 }} />
          <Box sx={{ p: { xs: 3, sm: 4 } }}>
            <Stack spacing={2.5}>
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: 2.5,
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: '#eaf2fd',
                  color: 'primary.main',
                }}
              >
                <Lightbulb />
              </Box>

              <Box>
                <Typography sx={{ fontSize: '.72rem', fontWeight: 700, color: 'text.secondary' }}>
                  MeetAI guided tour
                </Typography>
                <Typography sx={{ mt: .5, fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.25 }}>
                  Take a quick tour
                </Typography>
                <Typography sx={{ mt: 1, fontSize: '.9rem', lineHeight: 1.6, color: 'text.secondary' }}>
                  We’ll walk you through the sidebar, dashboard, calendar, meetings, recordings, and action items so you know where everything is.
                </Typography>
              </Box>

              <Box sx={hintBoxSx}>
                <Typography sx={hintLabelSx}>What to expect</Typography>
                <Typography sx={hintTextSx}>
                  Follow the highlighted areas and use Next to move through the tour. You can skip it at any time.
                </Typography>
              </Box>

              <Stack direction="row" justifyContent="flex-end" spacing={1}>
                <Button
                  size="small"
                  color="inherit"
                  onClick={stopAppTour}
                  sx={{ textTransform: 'none', color: 'text.secondary' }}
                >
                  Not now
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  endIcon={<ArrowForward />}
                  onClick={() => {
                    const startedTour = { ...tour, phase: 'tour' }
                    saveTour(startedTour)
                    setTour(startedTour)
                    setTargetFound(false)
                    setTargetRect(null)
                    setCardPosition(null)
                  }}
                  sx={{ textTransform: 'none' }}
                >
                  Start tour
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      </Box>
    )
  }

  if (!targetFound || !targetRect) return null

  const total = tour.steps.length
  const current = tour.index + 1
  const Icon = TOUR_ICONS[step.icon] || Lightbulb

  const goTo = (index) => {
    const nextStep = tour.steps[index]
    const nextTour = { ...tour, index }

    saveTour(nextTour)
    setTour(nextTour)
    setTargetFound(false)
    setTargetRect(null)
    setCardPosition(null)

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

  const pad = 7
  const topH = Math.max(targetRect.top - pad, 0)
  const bottomTop = Math.min(targetRect.bottom + pad, window.innerHeight)
  const leftW = Math.max(targetRect.left - pad, 0)
  const rightLeft = Math.min(targetRect.right + pad, window.innerWidth)
  const midH = Math.max(bottomTop - topH, 0)

  return (
    <>
      {/* Dark overlay (4 panels around the target) */}
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: 1400,
          pointerEvents: 'none',
        }}
      >
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: topH, bgcolor: OVERLAY }} />
        <Box sx={{ position: 'absolute', top: bottomTop, left: 0, right: 0, bottom: 0, bgcolor: OVERLAY }} />
        <Box sx={{ position: 'absolute', top: topH, left: 0, width: leftW, height: midH, bgcolor: OVERLAY }} />
        <Box sx={{ position: 'absolute', top: topH, left: rightLeft, right: 0, height: midH, bgcolor: OVERLAY }} />
      </Box>

      {/* Highlight */}
      <Box
        sx={{
          position: 'fixed',
          zIndex: 1401,
          top: targetRect.top - pad,
          left: targetRect.left - pad,
          width: targetRect.width + pad * 2,
          height: targetRect.height + pad * 2,
          borderRadius: 2,
          border: '2px solid',
          borderColor: 'primary.main',
          boxShadow: '0 2px 12px rgba(25,118,210,.22)',
          transition:
            'top 180ms ease, left 180ms ease, width 180ms ease, height 180ms ease',
          pointerEvents: 'none',
        }}
      />

      {/* Tour card */}
      <Fade in timeout={180}>
        <Paper
          ref={cardRef}
          elevation={10}
          sx={{
            position: 'fixed',
            zIndex: 1402,
            width: { xs: 'calc(100vw - 32px)', sm: 360 },
            maxWidth: 360,
            top: { xs: 'auto', sm: cardPosition?.top ?? -9999 },
            left: { xs: 16, sm: cardPosition?.left ?? -9999 },
            bottom: { xs: 16, sm: 'auto' },
            borderRadius: 2.5,
            overflow: 'hidden',
            transition: 'top 180ms ease, left 180ms ease',
          }}
        >
          <LinearProgress
            variant="determinate"
            value={(current / total) * 100}
            sx={{ height: 4 }}
          />

          <Box sx={{ p: 2.5 }}>
            <Stack spacing={2}>
              {/* Header */}
              <Stack
  direction="row"
  alignItems="center"
  sx={{
    width: '100%',
  }}
>
  {/* Left side */}
  <Stack
    direction="row"
    spacing={1.2}
    alignItems="center"
    sx={{
      flex: 1,
      minWidth: 0,
    }}
  >
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: 2,
        display: 'grid',
        placeItems: 'center',
        bgcolor: '#eaf2fd',
        color: 'primary.main',
        flexShrink: 0,
      }}
    >
      <Icon fontSize="small" />
    </Box>

    <Box sx={{ minWidth: 0 }}>
      <Typography
        sx={{
          fontSize: '.68rem',
          fontWeight: 600,
          color: 'text.secondary',
        }}
      >
        MeetAI tour
      </Typography>

      <Typography
        sx={{
          mt: 0.15,
          fontSize: '1rem',
          lineHeight: 1.3,
          fontWeight: 700,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {step.title}
      </Typography>
    </Box>
  </Stack>

  {/* End / Close */}
  <IconButton
    size="small"
    onClick={stopAppTour}
    aria-label="Close tour"
    sx={{
      ml: 'auto',
      flexShrink: 0,
      p: 0.75,
    }}
  >
    <Close fontSize="small" />
  </IconButton>
</Stack>

              {/* Description */}
              <Typography sx={{ fontSize: '.84rem', lineHeight: 1.55, color: 'text.secondary' }}>
                {step.body}
              </Typography>

              {step.action && (
                <Box sx={hintBoxSx}>
                  <Typography sx={hintLabelSx}>Try this</Typography>
                  <Typography sx={hintTextSx}>{step.action}</Typography>
                </Box>
              )}

              {step.tip && (
                <Box sx={hintBoxSx}>
                  <Typography sx={hintLabelSx}>Helpful tip</Typography>
                  <Typography sx={hintTextSx}>{step.tip}</Typography>
                </Box>
              )}

              {/* Controls */}
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Button
                  size="small"
                  color="inherit"
                  onClick={stopAppTour}
                  sx={{ textTransform: 'none', color: 'text.secondary' }}
                >
                  Skip tour
                </Button>

                <Stack direction="row" spacing={1}>
                  {tour.index > 0 && (
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<ArrowBack />}
                      onClick={back}
                      sx={{ textTransform: 'none' }}
                    >
                      Back
                    </Button>
                  )}
                  <Button
                    size="small"
                    variant="contained"
                    endIcon={tour.index < total - 1 ? <ArrowForward /> : undefined}
                    onClick={next}
                    sx={{ textTransform: 'none' }}
                  >
                    {tour.index === total - 1 ? 'Finish' : 'Next'}
                  </Button>
                </Stack>
              </Stack>

              <Typography sx={{ textAlign: 'right', fontSize: '.67rem', color: 'text.secondary' }}>
                {current} of {total}
              </Typography>
            </Stack>
          </Box>
        </Paper>
      </Fade>
    </>
  )
}