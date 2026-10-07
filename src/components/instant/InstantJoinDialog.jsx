import { useId, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined'
import CloseIcon from '@mui/icons-material/Close'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined'
import FormField from './FormField'
import ParticipantPicker from './ParticipantPicker'

const MEETING_HOSTS = /(^|\.)(zoom\.us|zoom\.com|zoomgov\.com|meet\.google\.com|teams\.microsoft\.com|teams\.live\.com)$/i

// Accepts links with or without https:// ; returns a clean URL string or null.
function normalizeMeetingLink(value) {
  const raw = value.trim()
  if (!raw) return null
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`)
    return MEETING_HOSTS.test(url.hostname) ? url.href : null
  } catch {
    return null
  }
}

const STEPS = (n) => [
  'Avaada Meet Companion joins with your meeting link',
  'Avaada Meet Companion appears in the meeting as a participant',
  'Real-time transcription with speaker identification',
  'When meeting ends — AI generates MoM & action items',
  `Emails sent to all ${n} ${n === 1 ? 'participant' : 'participants'} automatically`,
]

export default function InstantJoinDialog({ open, onClose, onSubmit, currentUser, searchDirectory }) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const titleId = useId()
  const descId = useId()
  const linkRef = useRef(null)

  const [link, setLink] = useState('')
  const [title, setTitle] = useState('')
  const [linkError, setLinkError] = useState(false)
  const [participants, setParticipants] = useState([{ ...currentUser, you: true }])
  const [recordVideo, setRecordVideo] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const url = normalizeMeetingLink(link)
    if (!url) {
      setLinkError(true)
      linkRef.current?.focus()
      return
    }
    onSubmit({ link: url, title: title.trim(), participants, recordVideo })
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
      {/* Header scrolls together with the body */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2.25, py: 1.75, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box aria-hidden="true" sx={{ display: 'grid', placeItems: 'center', width: 44, height: 44, flexShrink: 0, borderRadius: '14px', bgcolor: '#e3eefc', border: '1px solid #c5d9f5', color: 'primary.main' }}>
          <BoltOutlinedIcon />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography id={titleId} component="h2" sx={{ fontSize: '1.0625rem', fontWeight: 700, lineHeight: 1.3 }}>
            Record instant meeting
          </Typography>
          <Typography id={descId} sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>
            Fill in the details — Avaada Meet Companion joins when you start
          </Typography>
        </Box>
        <IconButton aria-label="Close" onClick={onClose} sx={{ ml: 'auto', color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: 2.25, pt: 2.25, pb: 2.5, overflowY: 'visible', flex: '0 0 auto' }}>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2.25 }}>
          <Box sx={{ p: 1.75, borderRadius: '14px', bgcolor: '#e3eefc', border: '1px solid #c5d9f5', color: '#0b4a99' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75, fontSize: '0.9rem', fontWeight: 500 }}>
              <InfoOutlinedIcon sx={{ fontSize: 18 }} aria-hidden="true" />
              <Typography component="h3" sx={{ fontSize: 'inherit', fontWeight: 'inherit' }}>
                What “Record meeting” does
              </Typography>
            </Box>
            <Typography sx={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
              Starts <strong>Meet AI / transcription</strong>: Avaada Meet Companion joins, captures the live transcript,
              and emails MoM + action items when the meeting ends. Optional <strong>Video Recording</strong> below saves a
              video file separately (7-day retention).
            </Typography>
          </Box>

          <FormField
            label="Meeting Link"
            required
            ref={linkRef}
            autoFocus
            type="url"
            value={link}
            onChange={(e) => { setLink(e.target.value); if (linkError) setLinkError(false) }}
            error={linkError}
            placeholder="https://meet.google.com/abc-xyz  or  zoom.us/j/123456789"
            startIcon={<LinkOutlinedIcon sx={{ fontSize: 20 }} />}
            helper={linkError ? 'Enter a valid Zoom, Google Meet, or Microsoft Teams link' : 'Paste a Zoom, Google Meet, or Microsoft Teams link'}
          />

          <FormField
            label="Meeting Title"
            optional
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Quick sync with design team"
          />

          <ParticipantPicker
            participants={participants}
            searchDirectory={searchDirectory}
            onAdd={(p) => setParticipants((list) => [...list, p])}
            onRemove={(email) => setParticipants((list) => list.filter((p) => p.email !== email))}
          />

          <Box>
            <Typography sx={{ p: 1.5, borderRadius: '10px', bgcolor: '#eef4f9', border: '1px solid #dbe5ee', fontSize: '0.875rem', lineHeight: 1.6 }}>
              <strong>Meet AI / transcription:</strong> Always enabled for instant meetings. Avaada Meet Companion joins to
              capture the transcript and generate MoM / insights.
            </Typography>
            <FormControlLabel
              sx={{ mt: 0.5, ml: -0.5, '& .MuiFormControlLabel-label': { fontSize: '0.9rem' } }}
              control={<Checkbox size="small" checked={recordVideo} onChange={(e) => setRecordVideo(e.target.checked)} />}
              label="Also enable Video Recording"
            />
          </Box>

          <Box component="section" aria-labelledby={`${titleId}-after`} sx={{ p: 2, borderRadius: '14px', bgcolor: '#f3f3f3', border: '1px solid #dcdfe3' }}>
            <Typography id={`${titleId}-after`} component="h3" sx={{ mb: 1.25, fontSize: '0.9rem', fontWeight: 500 }}>
              What happens after you start
            </Typography>
            <Box component="ol" role="list" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: 1.25 }}>
              {STEPS(participants.length).map((text, i) => (
                <Box component="li" key={text} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontSize: '0.9rem' }}>
                  <Box aria-hidden="true" sx={{ display: 'grid', placeItems: 'center', width: 24, height: 24, flexShrink: 0, borderRadius: '50%', bgcolor: '#dfe3e8', fontSize: '0.75rem', fontWeight: 600 }}>
                    {i + 1}
                  </Box>
                  {text}
                </Box>
              ))}
            </Box>
          </Box>

          <Box>
            <Button
              type="submit"
              variant="contained"
              disableElevation
              fullWidth
              startIcon={<BoltOutlinedIcon />}
              sx={{ height: 48, borderRadius: '12px', bgcolor: '#0f2a4d', fontSize: '1rem', '&:hover': { bgcolor: '#173a66' } }}
            >
              Record meeting
            </Button>
            <Typography sx={{ mt: 1.25, textAlign: 'center', fontSize: '0.8125rem', color: 'text.secondary' }}>
              {recordVideo
                ? 'Starts Meet AI transcription and saves a video file (7-day retention)'
                : 'Starts Meet AI transcription only (no video file unless you check Video Recording)'}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}