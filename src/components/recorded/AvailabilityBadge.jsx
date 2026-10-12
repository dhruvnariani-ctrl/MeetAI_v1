import Box from '@mui/material/Box'

/* Green when available, grey when not. Label text flips to "unavailable". */
export default function AvailabilityBadge({ icon, label, available }) {
  const displayLabel = available
    ? label
    : label.replace(' available', ' unavailable')

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        px: 1,
        py: 0.5,
        borderRadius: '16px',
        bgcolor: available ? '#f1f8f4' : '#f5f6f8',
        color: available ? '#287a4d' : '#8793a3',
        fontSize: '0.67rem',
        fontWeight: 500,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { fontSize: 14 } }}>
        {icon}
      </Box>

      {displayLabel}
    </Box>
  )
}