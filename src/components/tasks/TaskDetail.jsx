import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

function getPriorityColor(priority) {
  if (priority === 'High') return '#b42318'
  if (priority === 'Medium') return '#946200'
  return '#52657d'
}

/* One "Label: value" pair, e.g. "Owner: Aarav Mehta". */
export default function TaskDetail({ label, value, priority = false }) {
  return (
    <Box>
      <Typography
        component="span"
        sx={{ fontSize: '0.68rem', color: '#7b8ba1', mr: 0.5 }}
      >
        {label}:
      </Typography>

      <Typography
        component="span"
        sx={{
          fontSize: '0.72rem',
          color: priority ? getPriorityColor(value) : '#42546b',
          fontWeight: priority ? 600 : 500,
        }}
      >
        {value}
      </Typography>
    </Box>
  )
}