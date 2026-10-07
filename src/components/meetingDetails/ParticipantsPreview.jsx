import { useState } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'

import ParticipantRow from './ParticipantRow'

/* -------------------------------------------------------------------------- */
/* Participants                                                               */
/* -------------------------------------------------------------------------- */

export default function ParticipantsPreview({ attendance, meeting }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          border: '1px solid #dce3eb',
          borderRadius: 2,
          bgcolor: '#fff',
          px: 1.5,
          py: 1.25,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: 1.25,
              bgcolor: '#f1f5f9',
              color: '#52657d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <GroupsOutlinedIcon sx={{ fontSize: 19 }} />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#24364d' }}>
              Participants
            </Typography>
            <Typography sx={{ fontSize: '0.68rem', color: '#7b8ba1' }}>
              {attendance.all.length} {attendance.all.length === 1 ? 'participant' : 'participants'}
            </Typography>
          </Box>
        </Box>

        <Button
          variant="outlined"
          onClick={() => setOpen(true)}
          sx={{
            textTransform: 'none',
            fontSize: '0.72rem',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            px: 1.5,
            py: 0.65,
            flexShrink: 0,
          }}
        >
          View participants
        </Button>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '1rem',
            fontWeight: 700,
            color: '#24364d',
          }}
        >
          All participants ({attendance.all.length})
          <IconButton size="small" onClick={() => setOpen(false)} aria-label="Close">
            <CloseOutlinedIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pb: 2.5 }}>
          <ParticipantGroups
            attendance={attendance}
            meeting={meeting}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

function ParticipantGroups({ attendance, meeting }) {
  return (
    <Stack spacing={0.75}>
      {attendance.all.map((person, index) => {
        const key = person.email || person.name || index
        const attended = attendance.attended.some(
          (item) => (item.email || item.name) === key,
        )
        const notAttended = attendance.notAttended.some(
          (item) => (item.email || item.name) === key,
        )

        return (
          <ParticipantRow
            key={key}
            person={person}
            attended={attended ? true : notAttended ? false : null}
            meeting={meeting}
          />
        )
      })}
    </Stack>
  )
}
