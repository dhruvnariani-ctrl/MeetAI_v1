import { useId, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import EventOutlinedIcon from '@mui/icons-material/EventOutlined'
import FormField, { labelSx } from '../instant/FormField'
import ParticipantPicker from '../instant/ParticipantPicker'
import SelectField from './SelectedField'

const LABEL_SIZE = '0.75rem' // 12px labels

const PLATFORMS = [
  { id: 'teams', label: 'Microsoft Teams' },
  { id: 'zoom', label: 'Zoom' },
  { id: 'meet', label: 'Google Meet' },
]

const DURATIONS = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
]

const pad = (n) => String(n).padStart(2, '0')
const toDateInput = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const toTimeInput = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`

function defaultTimes() {
  const s = new Date()
  s.setSeconds(0, 0)
  s.setMinutes(s.getMinutes() < 30 ? 30 : 60) // next half hour
  return { start: toTimeInput(s), end: toTimeInput(new Date(s.getTime() + 30 * 60000)) }
}

export default function CreateEventDialog({ open, onClose, onSubmit, currentUser, searchDirectory }) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const titleId = useId()
  const descId = useId()

  const [initial] = useState(defaultTimes)
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(() => toDateInput(new Date()))
  const [start, setStart] = useState(initial.start)
  const [end, setEnd] = useState(initial.end)
  const [instant, setInstant] = useState(false)
  const [duration, setDuration] = useState(30)
  const [platforms, setPlatforms] = useState({ teams: false, zoom: false, meet: true })
  const [participants, setParticipants] = useState([{ ...currentUser, you: true }])
  const [inviteMeetAI, setInviteMeetAI] = useState(false)
  const [recordVideo, setRecordVideo] = useState(false)
  const [errors, setErrors] = useState({})

  const refs = { title: useRef(null), date: useRef(null), start: useRef(null), end: useRef(null), platforms: useRef(null) }
  const clearError = (key) => setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e))

  const validate = () => {
    const e = {}
    if (!title.trim()) e.title = 'Enter a title'
    if (!date) e.date = 'Pick a date'
    if (!instant) {
      if (!start) e.start = 'Pick a start time'
      if (!end) e.end = 'Pick an end time'
      else if (start && end <= start) e.end = 'End time must be after the start time'
    }
    if (!Object.values(platforms).some(Boolean)) e.platforms = 'Select at least one platform'
    return e
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    const firstInvalid = ['title', 'date', 'start', 'end', 'platforms'].find((k) => e[k])
    if (firstInvalid) {
      refs[firstInvalid].current?.focus()
      return
    }
    onSubmit({
      title: title.trim(),
      date,
      ...(instant ? { instant: true, durationMinutes: duration } : { instant: false, start, end }),
      platforms: PLATFORMS.filter((p) => platforms[p.id]).map((p) => p.id),
      participants,
      inviteMeetAI,
      recordVideo: inviteMeetAI && recordVideo,
    })
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      aria-labelledby={titleId}
      aria-describedby={descId}
      sx={{ '& .MuiDialog-paper': { width: 520, maxWidth: '100%', borderRadius: fullScreen ? 0 : '20px', overflowY: 'auto' } }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2.25, py: 1.75, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box aria-hidden="true" sx={{ display: 'grid', placeItems: 'center', width: 44, height: 44, flexShrink: 0, borderRadius: '14px', bgcolor: '#e3eefc', border: '1px solid #c5d9f5', color: 'primary.main' }}>
          <EventOutlinedIcon />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography id={titleId} component="h2" sx={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.3 }}>
            Create an event
          </Typography>
          <Typography id={descId} sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>
            Schedule a meeting and invite participants
          </Typography>
        </Box>
        <IconButton aria-label="Close" onClick={onClose} sx={{ ml: 'auto', color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: 2.25, pt: 2.25, pb: 2.5, overflowY: 'visible', flex: '0 0 auto' }}>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2.25 }}>
          <FormField
            label="Title"
            required
            labelFontSize={LABEL_SIZE}
            ref={refs.title}
            autoFocus
            value={title}
            onChange={(e) => { setTitle(e.target.value); clearError('title') }}
            placeholder="e.g. Weekly design review"
            error={!!errors.title}
            helper={errors.title}
          />

          <FormField
            label="Date"
            required
            labelFontSize={LABEL_SIZE}
            ref={refs.date}
            type="date"
            value={date}
            onChange={(e) => { setDate(e.target.value); clearError('date') }}
            inputAttrs={{ min: toDateInput(new Date()) }}
            error={!!errors.date}
            helper={errors.date}
          />

          {instant ? (
            <SelectField label="Duration" labelFontSize={LABEL_SIZE} value={duration} onChange={setDuration} options={DURATIONS} />
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, alignItems: 'start' }}>
              <FormField
                label="Start time"
                required
                labelFontSize={LABEL_SIZE}
                ref={refs.start}
                type="time"
                value={start}
                onChange={(e) => { setStart(e.target.value); clearError('start'); clearError('end') }}
                error={!!errors.start}
                helper={errors.start}
              />
              <FormField
                label="End time"
                required
                labelFontSize={LABEL_SIZE}
                ref={refs.end}
                type="time"
                value={end}
                onChange={(e) => { setEnd(e.target.value); clearError('end') }}
                error={!!errors.end}
                helper={errors.end}
              />
            </Box>
          )}

          <Box>
            <FormControlLabel
              sx={{ ml: -0.5, '& .MuiFormControlLabel-label': { fontSize: '0.875rem', fontWeight: 500 } }}
              control={<Checkbox size="small" checked={instant} onChange={(e) => setInstant(e.target.checked)} />}
              label="Instant join"
            />
            <Typography sx={{ ml: 3.5, fontSize: '0.78rem', color: 'text.secondary' }}>
              Start the event right away — only a duration is needed.
            </Typography>
          </Box>

          <FormControl component="fieldset" required error={!!errors.platforms} variant="standard">
            <FormLabel component="legend" sx={{ ...labelSx, fontSize: LABEL_SIZE, mb: 0.25 }}>Video conferencing</FormLabel>
            <FormGroup row sx={{ columnGap: 1 }}>
              {PLATFORMS.map((p, i) => (
                <FormControlLabel
                  key={p.id}
                  sx={{ ml: -0.5, '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                  control={
                    <Checkbox
                      size="small"
                      checked={platforms[p.id]}
                      inputRef={i === 0 ? refs.platforms : undefined}
                      onChange={(e) => { setPlatforms((cur) => ({ ...cur, [p.id]: e.target.checked })); clearError('platforms') }}
                    />
                  }
                  label={p.label}
                />
              ))}
            </FormGroup>
            {errors.platforms && <FormHelperText role="alert" sx={{ mx: 0 }}>{errors.platforms}</FormHelperText>}
          </FormControl>

          <ParticipantPicker
            labelFontSize={LABEL_SIZE}
            hint="(invited to this event)"
            note={inviteMeetAI ? undefined : null}
            participants={participants}
            searchDirectory={searchDirectory}
            onAdd={(p) => setParticipants((list) => [...list, p])}
            onRemove={(email) => setParticipants((list) => list.filter((p) => p.email !== email))}
          />

          <Box sx={{ p: 1.5, borderRadius: '10px', bgcolor: '#eef4f9', border: '1px solid #dbe5ee' }}>
            <FormControlLabel
              sx={{ ml: -0.5, '& .MuiFormControlLabel-label': { fontSize: '0.875rem', fontWeight: 600 } }}
              control={
                <Checkbox
                  size="small"
                  checked={inviteMeetAI}
                  onChange={(e) => { setInviteMeetAI(e.target.checked); if (!e.target.checked) setRecordVideo(false) }}
                />
              }
              label="Invite MeetAI"
            />
            <Typography sx={{ ml: 3.5, fontSize: '0.8125rem', color: 'text.secondary', lineHeight: 1.6 }}>
              Avaada Meet Companion joins to capture the transcript and email MoM + action items.
            </Typography>
            {inviteMeetAI && (
              <Box sx={{ mt: 1, ml: 3.5 }}>
                <FormControlLabel
                  sx={{ ml: -0.5, '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                  control={<Checkbox size="small" checked={recordVideo} onChange={(e) => setRecordVideo(e.target.checked)} />}
                  label="Also enable Video Recording"
                />
                <Typography sx={{ ml: 3.5, fontSize: '0.78rem', color: 'text.secondary' }}>
                  Saves a video file separately (7-day retention).
                </Typography>
              </Box>
            )}
          </Box>

          <Button
            type="submit"
            variant="contained"
            disableElevation
            fullWidth
            sx={{ height: 48, borderRadius: '12px', bgcolor: '#0f2a4d', fontSize: '1rem', '&:hover': { bgcolor: '#173a66' } }}
          >
            {instant ? 'Create & start now' : 'Create event'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}