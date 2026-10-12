import ArrowForward from '@mui/icons-material/ArrowForward'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { PAGE_TOURS } from '../../data/pageTours'

/* "Want to learn just one thing?" – one card per page tour. */
export default function PageToursSection({ onStartTour }) {
  return (
    <Box>
      <Typography
        sx={{
          fontSize: { xs: '1.15rem', md: '1.3rem' },
          fontWeight: 700,
          color: 'text.primary',
        }}
      >
        Want to learn just one thing?
      </Typography>

      <Typography
        sx={{
          mt: 0.5,
          fontSize: '.82rem',
          lineHeight: 1.6,
          color: 'text.secondary',
          maxWidth: 700,
        }}
      >
        Choose an area below and we’ll take you directly there. You don’t need
        to go through the whole tour.
      </Typography>

      <Box
        sx={{
          mt: 2,
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
          },
          gap: 1.5,
        }}
      >
        {PAGE_TOURS.map((tour) => {
          const Icon = tour.icon

          return (
            <Card
              key={tour.id}
              elevation={0}
              sx={{
                height: '100%',
                borderRadius: 2.5,
                border: '1px solid',
                borderColor: 'divider',
                transition:
                  'border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease',
                '&:hover': {
                  borderColor: 'primary.light',
                  boxShadow: '0 5px 18px rgba(30, 60, 90, .08)',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Stack spacing={1.5}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 1.75,
                      display: 'grid',
                      placeItems: 'center',
                      bgcolor: '#eaf2fd',
                      color: 'primary.main',
                    }}
                  >
                    <Icon sx={{ fontSize: 20 }} />
                  </Box>

                  <Box>
                    <Typography sx={{ fontSize: '.92rem', fontWeight: 700 }}>
                      {tour.title}
                    </Typography>
                    <Typography
                      sx={{
                        mt: 0.45,
                        fontSize: '.76rem',
                        lineHeight: 1.55,
                        color: 'text.secondary',
                      }}
                    >
                      {tour.description}
                    </Typography>
                  </Box>

                  <Button
                    variant="text"
                    endIcon={<ArrowForward />}
                    onClick={() => onStartTour(tour.steps)}
                    sx={{
                      alignSelf: 'flex-start',
                      px: 0,
                      textTransform: 'none',
                      fontSize: '.78rem',
                      fontWeight: 650,
                      '&:hover': { bgcolor: 'transparent' },
                    }}
                  >
                    {tour.button}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          )
        })}
      </Box>
    </Box>
  )
}