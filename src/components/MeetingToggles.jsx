import { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'

const switchSx = {
  '& .MuiSwitch-switchBase, & .MuiSwitch-switchBase.Mui-checked': {
    color: '#fff',
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    bgcolor: '#a9b5c5',
  },
  '& .Mui-checked + .MuiSwitch-track': {
    opacity: 1,
    bgcolor: 'primary.main',
  },
}

const controlRowSx = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 2,
  px: 1.5,
  py: 1.25,
  border: '1px solid #e1e6ec',
  borderRadius: 2,
  cursor: 'pointer',
  userSelect: 'none',
  '&:hover': { bgcolor: '#f8fafc' },
}

const toggleLabelSx = {
  fontSize: '0.7rem',
  fontWeight: 500,
  color: 'text.primary',
  transition: 'color 120ms ease',
}

const toggleButtonSx = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 0.5,
  cursor: 'pointer',
  userSelect: 'none',
  '&:focus-visible': {
    outline: '2px solid',
    outlineColor: 'primary.main',
    outlineOffset: 2,
    borderRadius: 1,
  },
  '&:hover .meeting-toggle-label': { color: 'primary.main' },
}

export default function MeetingToggles({ meeting, settings = {}, onChange }) {
  const [dialogOpen, setDialogOpen] = useState(false)

  const [draftAutoJoin, setDraftAutoJoin] = useState(settings.autoJoin === true)
  const [draftRecordVideo, setDraftRecordVideo] = useState(settings.recordVideo === true)

  useEffect(() => {
    if (!dialogOpen) {
      setDraftAutoJoin(settings.autoJoin === true)
      setDraftRecordVideo(settings.recordVideo === true)
    }
  }, [dialogOpen, settings.autoJoin, settings.recordVideo])

  const handleOpenDialog = (event) => {
    event?.stopPropagation()

    setDraftAutoJoin(settings.autoJoin === true)
    setDraftRecordVideo(settings.recordVideo === true && settings.autoJoin === true)

    setDialogOpen(true)
  }

  const handleCloseDialog = (event) => {
    event?.stopPropagation()
    setDialogOpen(false)
  }

  const handleAutoJoinChange = (event) => {
    event.stopPropagation()

    const checked = event.target.checked

    setDraftAutoJoin(checked)

    if (!checked) setDraftRecordVideo(false)
  }

  const handleRecordVideoChange = (event) => {
    event.stopPropagation()

    if (!draftAutoJoin) return

    setDraftRecordVideo(event.target.checked)
  }

  const handleSave = (event) => {
    event.stopPropagation()

    onChange?.(meeting.id, {
      autoJoin: draftAutoJoin,
      recordVideo: draftAutoJoin ? draftRecordVideo : false,
    })

    setDialogOpen(false)
  }

  const openOnKey = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleOpenDialog(event)
    }
  }

  return (
    <>
      {/* Visible meeting controls (tour target for "MeetAI status") */}
      <Box
        data-tour="dashboard-meetai-status"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          flexWrap: 'wrap',
        }}
        onClick={(event) => event.stopPropagation()}
        onMouseDown={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
      >
        {/* Invite MeetAI */}
        <Box
          role="button"
          tabIndex={0}
          aria-label={`Configure MeetAI for ${meeting.title}`}
          onClick={handleOpenDialog}
          onKeyDown={openOnKey}
          sx={toggleButtonSx}
        >
          <Typography className="meeting-toggle-label" sx={toggleLabelSx}>
            Invite MeetAI
          </Typography>

          <Switch
            size="small"
            checked={settings.autoJoin === true}
            readOnly
            tabIndex={-1}
            inputProps={{ 'aria-hidden': true }}
            sx={{ ...switchSx, pointerEvents: 'none' }}
          />
        </Box>

        {/* Video recording */}
        <Box
          role="button"
          tabIndex={0}
          aria-label={`Configure video recording for ${meeting.title}`}
          onClick={handleOpenDialog}
          onKeyDown={openOnKey}
          sx={toggleButtonSx}
        >
          <Typography className="meeting-toggle-label" sx={toggleLabelSx}>
            Video rec
          </Typography>

          <Switch
            size="small"
            checked={settings.autoJoin === true && settings.recordVideo === true}
            readOnly
            tabIndex={-1}
            inputProps={{ 'aria-hidden': true }}
            sx={{ ...switchSx, pointerEvents: 'none' }}
          />
        </Box>
      </Box>

      {/* Shared MeetAI / video settings dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="xs"
        onClick={(event) => event.stopPropagation()}
      >
        <DialogTitle sx={{ fontSize: '1.05rem', fontWeight: 700, pb: 1 }}>
          {draftAutoJoin ? 'MeetAI meeting settings' : 'Invite MeetAI to this meeting?'}
        </DialogTitle>

        <DialogContent>
          <Typography
            sx={{
              fontSize: '0.82rem',
              lineHeight: 1.6,
              color: 'text.secondary',
              mb: 2.25,
            }}
          >
            MeetAI can automatically join this meeting. You can also choose whether
            you want to save a video recording.
          </Typography>

          <Box
            role="button"
            tabIndex={0}
            onClick={() => {
              if (draftAutoJoin) setDraftRecordVideo(false)
              setDraftAutoJoin(!draftAutoJoin)
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                if (draftAutoJoin) setDraftRecordVideo(false)
                setDraftAutoJoin(!draftAutoJoin)
              }
            }}
            sx={controlRowSx}
          >
            <Box sx={{ pr: 2 }}>
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
                Invite MeetAI
              </Typography>

              <Typography
                sx={{
                  mt: 0.25,
                  fontSize: '0.72rem',
                  lineHeight: 1.45,
                  color: 'text.secondary',
                }}
              >
                Let MeetAI automatically join this meeting.
              </Typography>
            </Box>

            <Switch
              size="small"
              checked={draftAutoJoin}
              onChange={handleAutoJoinChange}
              onClick={(event) => event.stopPropagation()}
              inputProps={{ 'aria-label': 'Invite MeetAI' }}
              sx={switchSx}
            />
          </Box>

          <Box
            role="button"
            tabIndex={draftAutoJoin ? 0 : -1}
            aria-disabled={!draftAutoJoin}
            onClick={() => {
              if (draftAutoJoin) setDraftRecordVideo(!draftRecordVideo)
            }}
            onKeyDown={(event) => {
              if (draftAutoJoin && (event.key === 'Enter' || event.key === ' ')) {
                event.preventDefault()
                setDraftRecordVideo(!draftRecordVideo)
              }
            }}
            sx={{
              ...controlRowSx,
              mt: 1.25,
              opacity: draftAutoJoin ? 1 : 0.5,
              cursor: draftAutoJoin ? 'pointer' : 'not-allowed',
            }}
          >
            <Box sx={{ pr: 2 }}>
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
                Record video
              </Typography>

              <Typography
                sx={{
                  mt: 0.25,
                  fontSize: '0.72rem',
                  lineHeight: 1.45,
                  color: 'text.secondary',
                }}
              >
                Save a video recording of the meeting.
              </Typography>
            </Box>

            <Switch
              size="small"
              checked={draftAutoJoin && draftRecordVideo}
              disabled={!draftAutoJoin}
              onChange={handleRecordVideoChange}
              onClick={(event) => event.stopPropagation()}
              inputProps={{ 'aria-label': 'Record video' }}
              sx={switchSx}
            />
          </Box>

          {!draftAutoJoin && (
            <Typography
              sx={{
                mt: 1.25,
                fontSize: '0.7rem',
                lineHeight: 1.45,
                color: 'text.secondary',
              }}
            >
              Video recording is unavailable until MeetAI is enabled.
            </Typography>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={handleCloseDialog}
            sx={{ textTransform: 'none', fontSize: '0.8rem' }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
            sx={{ textTransform: 'none', fontSize: '0.8rem', fontWeight: 600 }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}