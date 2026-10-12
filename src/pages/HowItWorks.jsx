import { Container, Divider, Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import PageShell from '../components/PageShell'
import { startAppTour } from '../components/TourRunner'
import HowItWorksHero from '../components/howItWorks/HowItWorksHero'
import PageToursSection from '../components/howItWorks/PageToursSection'
import HowItWorksSections from '../components/howItWorks/HowItWorksSections'
import ReadyToStartCard from '../components/howItWorks/ReadyToStartCard'
import { APP_TOUR_STEPS } from '../data/tours'

export default function HowItWorks() {
  const navigate = useNavigate()

  const goToCalendar = () => navigate('/calendar')

  return (
    <PageShell>
      <Container maxWidth="lg" sx={{ py: { xs: 2.5, sm: 3, md: 4 } }}>
        <Stack spacing={{ xs: 3, md: 4 }}>
          <HowItWorksHero
            onStartTour={() => startAppTour(APP_TOUR_STEPS)}
            onGoToCalendar={goToCalendar}
          />

          <PageToursSection onStartTour={startAppTour} />

          <Divider />

          <HowItWorksSections />

          <ReadyToStartCard onOpenCalendar={goToCalendar} />
        </Stack>
      </Container>
    </PageShell>
  )
}