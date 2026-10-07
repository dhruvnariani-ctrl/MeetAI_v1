import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export default function PageShell({ title, subtitle, children }) {
  return (
    <>
      <Typography variant="h1" component="h1">{title}</Typography>
      {subtitle && (
        <Typography variant="body2" sx={{ mt: 0.75, maxWidth: '70ch', color: 'text.secondary' }}>{subtitle}</Typography>
      )}
      <Box sx={{ mt: 2.5 }}>{children}</Box>
    </>
  )
}

// Dashed empty-state panel, same look as the Upcoming meetings panel
export function EmptyPanel({ title, children }) {
  return (
    <Box sx={{ minHeight: 235, p: 3, display: 'grid', placeItems: 'center', bgcolor: '#f5f5f5', border: '1px dashed #c8d0db', borderRadius: '20px' }}>
      <Box sx={{ maxWidth: 380, textAlign: 'center' }}>
        <Typography variant="h2" component="h2" sx={{ mb: 1.5 }}>{title}</Typography>
        <Typography sx={{ color: 'text.secondary', lineHeight: 1.55 }}>{children}</Typography>
      </Box>
    </Box>
  )
}