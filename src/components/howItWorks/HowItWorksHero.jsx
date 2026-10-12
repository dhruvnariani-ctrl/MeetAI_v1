import CalendarMonth from '@mui/icons-material/CalendarMonth'
import PlayCircleOutlined from '@mui/icons-material/PlayCircleOutlined'
import TaskAlt from '@mui/icons-material/TaskAlt'
import VideoLibrary from '@mui/icons-material/VideoLibrary'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

const QUICK_STEPS = [
  { number: '1', label: 'See your meetings', icon: CalendarMonth },
  { number: '2', label: 'Review meetings', icon: VideoLibrary },
  { number: '3', label: 'Manage your tasks', icon: TaskAlt },
]

/* Top card: title, "Start full tour" button and the 3-step visual. */
export default function HowItWorksHero({ onStartTour, onGoToCalendar }) {
  return (
    <Card
      elevation={0}
      sx={{
        overflow: 'hidden',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        background:
          'linear-gradient(135deg, rgba(25,118,210,.07) 0%, rgba(255,255,255,1) 65%)',
      }}
    >
      <CardContent
        sx={{
          p: { xs: 2.5, sm: 3, md: 4 },
          '&:last-child': { pb: { xs: 2.5, sm: 3, md: 4 } },
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 3, md: 4 }}
          alignItems={{ xs: 'flex-start', md: 'center' }}
          justifyContent="space-between"
        >
          <Box sx={{ maxWidth: 700 }}>
            <Chip
              icon={<PlayCircleOutlined />}
              label="Quick guide"
              size="small"
              sx={{
                mb: 1.5,
                borderRadius: 1.5,
                fontWeight: 600,
                bgcolor: '#eaf2fd',
                color: 'primary.main',
                '& .MuiChip-icon': { color: 'primary.main' },
              }}
            />

            <Typography
              sx={{
                fontSize: { xs: '1.65rem', sm: '2rem', md: '2.25rem' },
                fontWeight: 750,
                lineHeight: 1.15,
                letterSpacing: '-.02em',
                color: 'text.primary',
              }}
            >
              Learn MeetAI in a few minutes
            </Typography>

            <Typography
              sx={{
                mt: 1.25,
                maxWidth: 620,
                fontSize: { xs: '.88rem', sm: '.92rem' },
                lineHeight: 1.65,
                color: 'text.secondary',
              }}
            >
              New to MeetAI? No problem. Take a guided tour and we’ll show you
              where everything is and what you can do with it.
            </Typography>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.2}
              sx={{ mt: 2.5 }}
            >
              <Button
                variant="contained"
                size="medium"
                startIcon={<PlayCircleOutlined />}
                onClick={onStartTour}
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 2.2,
                  py: 1,
                  fontWeight: 650,
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                Start full tour
              </Button>

              <Button
                variant="outlined"
                size="medium"
                onClick={onGoToCalendar}
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 2.2,
                  py: 1,
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                Go to calendar
              </Button>
            </Stack>

            <Typography
              sx={{ mt: 1.25, fontSize: '.72rem', color: 'text.secondary' }}
            >
              The full tour takes you through MeetAI step by step.
            </Typography>
          </Box>

          {/* Simple visual guide */}
          <Box
            sx={{
              width: { xs: '100%', md: 260 },
              maxWidth: 280,
              alignSelf: { xs: 'stretch', md: 'center' },
            }}
          >
            <Stack spacing={1}>
              {QUICK_STEPS.map(({ number, label, icon: Icon }) => (
                <Box
                  key={number}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.25,
                    p: 1.25,
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 1.5,
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: 0,
                      bgcolor: '#eaf2fd',
                      color: 'primary.main',
                    }}
                  >
                    <Icon sx={{ fontSize: 18 }} />
                  </Box>

                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontSize: '.8rem', fontWeight: 650 }}>
                      {label}
                    </Typography>
                    <Typography
                      sx={{
                        mt: '.1rem',
                        fontSize: '.68rem',
                        color: 'text.secondary',
                      }}
                    >
                      Step {number}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}