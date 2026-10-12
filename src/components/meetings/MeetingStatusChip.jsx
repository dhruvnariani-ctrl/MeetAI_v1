import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'

import { getStatusStyle } from './meetingHelpers'

const stop = (event) => event.stopPropagation()

/* Status pill. Clicking it must never open the meeting. */
export default function MeetingStatusChip({ status }) {
  const statusStyle = getStatusStyle(status)

  return (
    <Box
      onClick={stop}
      onMouseDown={stop}
      onPointerDown={stop}
      sx={{
        gridColumn: '2 / 3',
        alignSelf: { xs: 'start', md: 'center' },
        justifySelf: 'end',
      }}
    >
      <Chip
        label={status}
        size="small"
        sx={{
          height: 32,
          minWidth: { xs: 88, md: 104 },
          borderRadius: '999px',
          backgroundColor: statusStyle.backgroundColor,
          color: statusStyle.color,
          fontSize: '0.75rem',
          fontWeight: 700,
          userSelect: 'none',
          '& .MuiChip-label': { px: 1.5 },
          '&:focus': { outline: 'none' },
        }}
      />
    </Box>
  )
}