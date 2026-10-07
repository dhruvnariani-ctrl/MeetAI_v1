import { useId } from 'react'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

// Stand-alone stat card: just the number of open action items.
export default function ActionItemCountCard({ count }) {
  const headingId = useId()
  return (
    <Paper
      component="section"
      aria-labelledby={headingId}
      variant="outlined"
      sx={{ p: 1.5, borderRadius: '20px', bgcolor: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
    >
      <Typography id={headingId} component="h4" sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
        Open action items
      </Typography>
      <Typography sx={{ my: 1, fontSize: '1.25rem', fontWeight: 500, lineHeight: 1.1 }}>{count}</Typography>
      <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
        {count === 0 ? "You're all caught up" : 'Assigned to you from your meetings'}
      </Typography>
    </Paper>
  )
}