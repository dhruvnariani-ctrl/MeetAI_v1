
import Box from '@mui/material/Box'

export default function Logo() {
  return (
    <Box
      component="a"
      href="/"
      aria-label="Avaada home"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        flexShrink: 0,
        textDecoration: 'none',
      }}
    >
      <Box
        component="img"
        src={`${import.meta.env.BASE_URL}/images/avaada-logo.png`}
        alt="Avaada logo"
        onError={(event) => {
          console.error('Failed to load Avaada logo:', event.currentTarget.src)
        }}
        sx={{
          display: 'block',
          height: 34,
          width: 'auto',
          maxWidth: '100%',
          objectFit: 'contain',
        }}
      />
    </Box>
  )
}