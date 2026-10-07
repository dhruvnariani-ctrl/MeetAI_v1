import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: { main: '#0a62c9' },
    text: { primary: '#0b2545', secondary: '#55657d' }, // secondary passes 4.5:1 on white
    background: { default: '#e9f1fb', paper: '#ffffff' },
    divider: '#d9e1ec',
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: "'DM Sans', system-ui, -apple-system, 'Segoe UI', sans-serif",
    h1: { fontSize: '1.625rem', fontWeight: 700, lineHeight: 1.2 }, // 26px
    h2: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.4 },
    body1: { fontSize: '0.9rem' },
    body2: { fontSize: '0.8125rem' }, // 13px
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@media (prefers-reduced-motion: reduce)': {
          '*, *::before, *::after': {
            transitionDuration: '0.01ms !important',
            animationDuration: '0.01ms !important',
          },
        },
      },
    },
    // Visible keyboard focus on every MUI ButtonBase (buttons, tabs, switches, list items, chips)
    MuiButtonBase: {
      styleOverrides: {
        root: { '&.Mui-focusVisible': { outline: '3px solid #0a62c9', outlineOffset: 2 } },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#fff',
          color: '#0b2545',
          border: '1px solid #d9e1ec',
          borderRadius: 12,
          boxShadow: '0 4px 14px rgba(11,37,69,.12)',
          fontSize: '0.8125rem',
          fontWeight: 400,
          padding: '10px 16px',
        },
      },
    },
  },
})

export default theme