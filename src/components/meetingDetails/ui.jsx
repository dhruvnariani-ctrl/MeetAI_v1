import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

/* -------------------------------------------------------------------------- */
/* Reusable UI                                                                */
/* -------------------------------------------------------------------------- */

export function SectionCard({
  icon,
  title,
  children,
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid #dce3eb',
        borderRadius: 2.5,
        bgcolor: '#fff',
        p: {
          xs: 1.75,
          sm: 2.25,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.9,
          mb: 1.5,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'primary.main',

            '& svg': {
              fontSize: 19,
            },
          }}
        >
          {icon}
        </Box>

        <Typography
          sx={{
            fontSize: '0.9rem',
            fontWeight: 700,
            color: '#24364d',
          }}
        >
          {title}
        </Typography>
      </Box>

      {children}
    </Paper>
  )
}

export function InfoCard({
  label,
  value,
  icon,
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid #dce3eb',
        borderRadius: 2.5,
        bgcolor: '#fff',
        p: 1.75,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          color: '#66778d',
        }}
      >
        {icon}

        <Typography
          sx={{
            fontSize: '0.68rem',
            color: '#7b8ba1',
          }}
        >
          {label}
        </Typography>
      </Box>

      <Typography
        sx={{
          mt: 0.8,
          fontSize: '0.92rem',
          fontWeight: 700,
          color: '#24364d',
        }}
      >
        {value}
      </Typography>
    </Paper>
  )
}

export function NotReadyCard({
  icon,
  title,
  children,
}) {
  return (
    <SectionCard
      icon={icon}
      title={title}
    >
      <NotReadyMessage>
        {children}
      </NotReadyMessage>
    </SectionCard>
  )
}

export function NotReadyMessage({
  children,
}) {
  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 1.75,
        bgcolor: '#f8fafc',
        border: '1px solid #e5eaf0',
      }}
    >
      <Typography
        sx={{
          fontSize: '0.76rem',
          lineHeight: 1.65,
          color: '#66778d',
        }}
      >
        {children}
      </Typography>
    </Box>
  )
}
