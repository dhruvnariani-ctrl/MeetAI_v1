import Box from '@mui/material/Box'

// Stand-in for the real Avaada logo. To use the real one, swap the contents for
// <img src={logo} alt="Avaada – Always clean. Always on." height={34} />
export default function Logo() {
  return (
    <Box
      component="a"
      href="/"
      aria-label="Avaada – Always clean. Always on. Home"
      sx={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: '#0d4f9e', lineHeight: 1.1 }}
    >
      <svg width="52" height="12" viewBox="0 0 52 12" fill="none" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true" focusable="false">
        <path d="M2 9c8-9 18-9 26-4s16 4 22-3" stroke="#0f9f78" />
        <path d="M6 10c9-6 17-5 24-1s12 1 16-4" stroke="#0a62c9" />
      </svg>
      <Box component="span" sx={{ fontSize: '0.875rem', fontWeight: 500, letterSpacing: '0.3em', mr: '-0.3em' }}>
        AVAADA
      </Box>
      <Box component="span" sx={{ fontSize: '0.4375rem', letterSpacing: '0.06em', color: 'text.primary', textTransform: 'uppercase' }}>
        Always clean. Always on.
      </Box>
    </Box>
  )
}
