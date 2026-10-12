import Box from '@mui/material/Box'

const STATUS_STYLES = {
  Pending: { bgcolor: '#eef4ff', color: '#245ea8' },
  'In Process': { bgcolor: '#fff5df', color: '#946200' },
  Blocked: { bgcolor: '#fff0f0', color: '#b42318' },
  Done: { bgcolor: '#eaf7ef', color: '#287a4d' },
}

export default function TaskStatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.Pending

  return (
    <Box
      sx={{
        px: 1.25,
        py: 0.55,
        borderRadius: '20px',
        bgcolor: style.bgcolor,
        color: style.color,
        fontSize: '0.72rem',
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      {status}
    </Box>
  )
}