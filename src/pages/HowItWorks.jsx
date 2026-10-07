import {
  ArrowForward,
  CalendarMonth,
  CheckCircleOutlined,
  Groups,
  ListAlt,
  PlayCircleOutlined,
  TaskAlt,
  VideoLibrary,
} from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

import PageShell from '../components/PageShell'
import { HOW_IT_WORKS_SECTIONS } from '../data/sections'
import { startAppTour } from '../components/TourRunner'
import {
  APP_TOUR_STEPS,
  DASHBOARD_PAGE_TOUR_STEPS,
  CALENDAR_PAGE_TOUR_STEPS,
  RECORDED_PAGE_TOUR_STEPS,
  MEETING_DETAILS_PAGE_TOUR_STEPS,
  TASKS_PAGE_TOUR_STEPS,
} from '../data/tours'

const PAGE_TOURS = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    description:
      'Get a quick overview of your meetings, upcoming calls, and important tasks.',
    button: 'Tour Dashboard',
    icon: Groups,
    steps: DASHBOARD_PAGE_TOUR_STEPS,
  },
  {
    id: 'calendar',
    title: 'Calendar',
    description:
      'Learn how to find meetings, change your calendar view, and create new meetings.',
    button: 'Tour Calendar',
    icon: CalendarMonth,
    steps: CALENDAR_PAGE_TOUR_STEPS,
  },
  {
    id: 'recorded',
    title: 'Recorded Meetings',
    description:
      'Learn how to find past meetings and review recordings, transcripts, and notes.',
    button: 'Tour Recorded Meetings',
    icon: VideoLibrary,
    steps: RECORDED_PAGE_TOUR_STEPS,
  },
  {
    id: 'meeting-details',
    title: 'Meeting Details',
    description:
      'See where to find participants, meeting information, recordings, and summaries.',
    button: 'Tour Meeting Details',
    icon: Groups,
    steps: MEETING_DETAILS_PAGE_TOUR_STEPS,
  },
  {
    id: 'tasks',
    title: 'My Tasks',
    description:
      'Learn how to find your action items, check their status, and mark work as done.',
    button: 'Tour My Tasks',
    icon: TaskAlt,
    steps: TASKS_PAGE_TOUR_STEPS,
  },
]

export default function HowItWorks() {
  const navigate = useNavigate()

  const startTour = () => {
    startAppTour(APP_TOUR_STEPS)
  }

  const startPageTour = (steps) => {
    startAppTour(steps)
  }

  return (
    <PageShell>
      <Container
        maxWidth="lg"
        sx={{
          py: {
            xs: 2.5,
            sm: 3,
            md: 4,
          },
        }}
      >
        <Stack spacing={{ xs: 3, md: 4 }}>
          {/* --------------------------------------------------------- */}
          {/* HERO                                                      */}
          {/* --------------------------------------------------------- */}

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
                p: {
                  xs: 2.5,
                  sm: 3,
                  md: 4,
                },
                '&:last-child': {
                  pb: {
                    xs: 2.5,
                    sm: 3,
                    md: 4,
                  },
                },
              }}
            >
              <Stack
                direction={{
                  xs: 'column',
                  md: 'row',
                }}
                spacing={{
                  xs: 3,
                  md: 4,
                }}
                alignItems={{
                  xs: 'flex-start',
                  md: 'center',
                }}
                justifyContent="space-between"
              >
                <Box
                  sx={{
                    maxWidth: 700,
                  }}
                >
                  <Chip
                    icon={<PlayCircleOutlined />}
                    label="Quick guide"
                    size="small"
                    sx={{
                      mb: 1.5,
                      borderRadius: 1.5,
                      fontWeight: 600,
                      bgcolor: 'primary.50',
                      color: 'primary.main',
                      '& .MuiChip-icon': {
                        color: 'primary.main',
                      },
                    }}
                  />

                  <Typography
                    sx={{
                      fontSize: {
                        xs: '1.65rem',
                        sm: '2rem',
                        md: '2.25rem',
                      },
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
                      fontSize: {
                        xs: '.88rem',
                        sm: '.92rem',
                      },
                      lineHeight: 1.65,
                      color: 'text.secondary',
                    }}
                  >
                    New to MeetAI? No problem. Take a guided tour and
                    we’ll show you where everything is and what you can
                    do with it.
                  </Typography>

                  <Stack
                    direction={{
                      xs: 'column',
                      sm: 'row',
                    }}
                    spacing={1.2}
                    sx={{
                      mt: 2.5,
                    }}
                  >
                    <Button
                      variant="contained"
                      size="medium"
                      startIcon={<PlayCircleOutlined />}
                      onClick={startTour}
                      sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                        px: 2.2,
                        py: 1,
                        fontWeight: 650,
                        width: {
                          xs: '100%',
                          sm: 'auto',
                        },
                      }}
                    >
                      Start full tour
                    </Button>

                    <Button
                      variant="outlined"
                      size="medium"
                      onClick={() => navigate('/calendar')}
                      sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                        px: 2.2,
                        py: 1,
                        width: {
                          xs: '100%',
                          sm: 'auto',
                        },
                      }}
                    >
                      Go to calendar
                    </Button>
                  </Stack>

                  <Typography
                    sx={{
                      mt: 1.25,
                      fontSize: '.72rem',
                      color: 'text.secondary',
                    }}
                  >
                    The full tour takes you through MeetAI step by step.
                  </Typography>
                </Box>

                {/* Simple visual guide */}
                <Box
                  sx={{
                    width: {
                      xs: '100%',
                      md: 260,
                    },
                    maxWidth: 280,
                    alignSelf: {
                      xs: 'stretch',
                      md: 'center',
                    },
                  }}
                >
                  <Stack spacing={1}>
                    {[
                      {
                        number: '1',
                        label: 'See your meetings',
                        icon: CalendarMonth,
                      },
                      {
                        number: '2',
                        label: 'Review meetings',
                        icon: VideoLibrary,
                      },
                      {
                        number: '3',
                        label: 'Manage your tasks',
                        icon: TaskAlt,
                      },
                    ].map((item) => {
                      const Icon = item.icon

                      return (
                        <Box
                          key={item.number}
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
                              bgcolor: 'primary.50',
                              color: 'primary.main',
                            }}
                          >
                            <Icon sx={{ fontSize: 18 }} />
                          </Box>

                          <Box sx={{ minWidth: 0 }}>
                            <Typography
                              sx={{
                                fontSize: '.8rem',
                                fontWeight: 650,
                              }}
                            >
                              {item.label}
                            </Typography>

                            <Typography
                              sx={{
                                mt: '.1rem',
                                fontSize: '.68rem',
                                color: 'text.secondary',
                              }}
                            >
                              Step {item.number}
                            </Typography>
                          </Box>
                        </Box>
                      )
                    })}
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* --------------------------------------------------------- */}
          {/* SPECIFIC TOURS                                             */}
          {/* --------------------------------------------------------- */}

          <Box>
            <Typography
              sx={{
                fontSize: {
                  xs: '1.15rem',
                  md: '1.3rem',
                },
                fontWeight: 700,
                color: 'text.primary',
              }}
            >
              Want to learn just one thing?
            </Typography>

            <Typography
              sx={{
                mt: .5,
                fontSize: '.82rem',
                lineHeight: 1.6,
                color: 'text.secondary',
                maxWidth: 700,
              }}
            >
              Choose an area below and we’ll take you directly there.
              You don’t need to go through the whole tour.
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
                        boxShadow:
                          '0 5px 18px rgba(30, 60, 90, .08)',
                        transform: 'translateY(-1px)',
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        p: 2,
                        '&:last-child': {
                          pb: 2,
                        },
                      }}
                    >
                      <Stack spacing={1.5}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 1.75,
                            display: 'grid',
                            placeItems: 'center',
                            bgcolor: 'primary.50',
                            color: 'primary.main',
                          }}
                        >
                          <Icon sx={{ fontSize: 20 }} />
                        </Box>

                        <Box>
                          <Typography
                            sx={{
                              fontSize: '.92rem',
                              fontWeight: 700,
                            }}
                          >
                            {tour.title}
                          </Typography>

                          <Typography
                            sx={{
                              mt: .45,
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
                          onClick={() =>
                            startPageTour(tour.steps)
                          }
                          sx={{
                            alignSelf: 'flex-start',
                            px: 0,
                            textTransform: 'none',
                            fontSize: '.78rem',
                            fontWeight: 650,
                            '&:hover': {
                              bgcolor: 'transparent',
                            },
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

          <Divider />

          {/* --------------------------------------------------------- */}
          {/* HOW MEETAI WORKS                                           */}
          {/* --------------------------------------------------------- */}

          <Box>
            <Typography
              sx={{
                fontSize: {
                  xs: '1.15rem',
                  md: '1.3rem',
                },
                fontWeight: 700,
              }}
            >
              How MeetAI works
            </Typography>

            <Typography
              sx={{
                mt: .5,
                fontSize: '.82rem',
                color: 'text.secondary',
              }}
            >
              A simple explanation of the main parts of MeetAI.
            </Typography>
          </Box>

          <Stack spacing={1.5}>
            {HOW_IT_WORKS_SECTIONS.map(
              (section, index) => {
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
                        p: {
                          xs: 2,
                          md: 2.5,
                        },
                        '&:last-child': {
                          pb: {
                            xs: 2,
                            md: 2.5,
                          },
                        },
                      }}
                    >
                      <Stack
                        direction={{
                          xs: 'column',
                          sm: 'row',
                        }}
                        spacing={2}
                      >
                        {/* Number + icon */}
                        <Stack
                          direction="row"
                          spacing={1.2}
                          alignItems="center"
                          sx={{
                            flexShrink: 0,
                          }}
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
                              bgcolor: 'primary.50',
                              color: 'primary.main',
                            }}
                          >
                            <Icon fontSize="small" />
                          </Box>
                        </Stack>

                        {/* Content */}
                        <Box
                          sx={{
                            flex: 1,
                            minWidth: 0,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: '.98rem',
                              fontWeight: 700,
                              lineHeight: 1.4,
                            }}
                          >
                            {section.title}
                          </Typography>

                          <Typography
                            sx={{
                              mt: .5,
                              fontSize: '.8rem',
                              lineHeight: 1.6,
                              color: 'text.secondary',
                              maxWidth: 760,
                            }}
                          >
                            {section.description}
                          </Typography>

                          <Stack
                            spacing={1}
                            sx={{
                              mt: 1.75,
                            }}
                          >
                            {section.steps.map(
                              (
                                step,
                                stepIndex,
                              ) => (
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
                                      color:
                                        'success.main',
                                      flexShrink: 0,
                                    }}
                                  />

                                  <Typography
                                    sx={{
                                      fontSize: '.76rem',
                                      lineHeight: 1.55,
                                      color:
                                        'text.secondary',
                                    }}
                                  >
                                    {step}
                                  </Typography>
                                </Stack>
                              ),
                            )}
                          </Stack>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                )
              },
            )}
          </Stack>

          {/* --------------------------------------------------------- */}
          {/* FINAL CTA                                                  */}
          {/* --------------------------------------------------------- */}

          <Card
            elevation={0}
            sx={{
              borderRadius: 2.5,
              bgcolor: '#f6f9fc',
              border: '1px solid #e3eaf2',
            }}
          >
            <CardContent
              sx={{
                p: {
                  xs: 2,
                  md: 2.5,
                },
                '&:last-child': {
                  pb: {
                    xs: 2,
                    md: 2.5,
                  },
                },
              }}
            >
              <Stack
                direction={{
                  xs: 'column',
                  sm: 'row',
                }}
                spacing={2}
                alignItems={{
                  xs: 'flex-start',
                  sm: 'center',
                }}
                justifyContent="space-between"
              >
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                >
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
                    <Typography
                      sx={{
                        fontSize: '.92rem',
                        fontWeight: 700,
                      }}
                    >
                      Ready to get started?
                    </Typography>

                    <Typography
                      sx={{
                        mt: .3,
                        fontSize: '.76rem',
                        color: 'text.secondary',
                      }}
                    >
                      Open your calendar and see your meetings.
                    </Typography>
                  </Box>
                </Stack>

                <Button
                  variant="outlined"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/calendar')}
                  sx={{
                    textTransform: 'none',
                    borderRadius: 2,
                    whiteSpace: 'nowrap',
                    width: {
                      xs: '100%',
                      sm: 'auto',
                    },
                  }}
                >
                  Open calendar
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </PageShell>
  )
}