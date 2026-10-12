import CheckCircleOutlined  from '@mui/icons-material/CheckCircleOutlined'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { HOW_IT_WORKS_SECTIONS } from '../../data/sections'

/* "How MeetAI works" – a numbered card for every section in data/sections.js. */
export default function HowItWorksSections() {
  return (
    <>
      <Box>
        <Typography
          sx={{ fontSize: { xs: '1.15rem', md: '1.3rem' }, fontWeight: 700 }}
        >
          How MeetAI works
        </Typography>

        <Typography sx={{ mt: 0.5, fontSize: '.82rem', color: 'text.secondary' }}>
          A simple explanation of the main parts of MeetAI.
        </Typography>
      </Box>

      <Stack spacing={1.5}>
        {HOW_IT_WORKS_SECTIONS.map((section, index) => {
          const Icon = section.icon

          return (
            <Card
              key={section.id}
              id={`how-it-works-${section.id}`}
              elevation={0}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2.5,
                overflow: 'hidden',
              }}
            >
              <CardContent
                sx={{
                  p: { xs: 2, md: 2.5 },
                  '&:last-child': { pb: { xs: 2, md: 2.5 } },
                }}
              >
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  {/* Number + icon */}
                  <Stack
                    direction="row"
                    spacing={1.2}
                    alignItems="center"
                    sx={{ flexShrink: 0 }}
                  >
                    <Box
                      sx={{
                        width: 30,
                        height: 30,
                        borderRadius: '50%',
                        display: 'grid',
                        placeItems: 'center',
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        fontSize: '.72rem',
                        fontWeight: 700,
                      }}
                    >
                      {index + 1}
                    </Box>

                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: 1.75,
                        display: 'grid',
                        placeItems: 'center',
                        bgcolor: '#eaf2fd',
                        color: 'primary.main',
                      }}
                    >
                      <Icon fontSize="small" />
                    </Box>
                  </Stack>

                  {/* Content */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      sx={{ fontSize: '.98rem', fontWeight: 700, lineHeight: 1.4 }}
                    >
                      {section.title}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.5,
                        fontSize: '.8rem',
                        lineHeight: 1.6,
                        color: 'text.secondary',
                        maxWidth: 760,
                      }}
                    >
                      {section.description}
                    </Typography>

                    <Stack spacing={1} sx={{ mt: 1.75 }}>
                      {section.steps.map((step, stepIndex) => (
                        <Stack
                          key={`${section.id}-${stepIndex}`}
                          direction="row"
                          spacing={1.2}
                          alignItems="flex-start"
                        >
                          <CheckCircleOutlined
                            sx={{
                              mt: '.05rem',
                              fontSize: 17,
                              color: 'success.main',
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            sx={{
                              fontSize: '.76rem',
                              lineHeight: 1.55,
                              color: 'text.secondary',
                            }}
                          >
                            {step}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          )
        })}
      </Stack>
    </>
  )
}