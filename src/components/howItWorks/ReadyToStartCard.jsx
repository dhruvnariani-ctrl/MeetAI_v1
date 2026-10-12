import ArrowForward from '@mui/icons-material/ArrowForward'
import ListAlt from '@mui/icons-material/ListAlt'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
/* Bottom card: "Ready to get started?" with an Open calendar button. */
export default function ReadyToStartCard({ onOpenCalendar }) {
  return (
    <Card
      elevation={0}
      sx={{ borderRadius: 2.5, bgcolor: '#f6f9fc', border: '1px solid #e3eaf2' }}
    >
      <CardContent
        sx={{
          p: { xs: 2, md: 2.5 },
          '&:last-child': { pb: { xs: 2, md: 2.5 } },
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 1.75,
                display: 'grid',
                placeItems: 'center',
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                color: 'primary.main',
                flexShrink: 0,
              }}
            >
              <ListAlt sx={{ fontSize: 20 }} />
            </Box>

            <Box>
              <Typography sx={{ fontSize: '.92rem', fontWeight: 700 }}>
                Ready to get started?
              </Typography>
              <Typography
                sx={{ mt: 0.3, fontSize: '.76rem', color: 'text.secondary' }}
              >
                Open your calendar and see your meetings.
              </Typography>
            </Box>
          </Stack>

          <Button
            variant="outlined"
            endIcon={<ArrowForward />}
            onClick={onOpenCalendar}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              whiteSpace: 'nowrap',
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            Open calendar
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}