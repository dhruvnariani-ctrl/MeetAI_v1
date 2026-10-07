import { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import TodayOutlinedIcon from '@mui/icons-material/TodayOutlined'

const pad = (value) => String(value).padStart(2, '0')

const dateKey = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

function startOfWeek(date) {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)

  const day = result.getDay()
  const difference = day === 0 ? -6 : 1 - day

  result.setDate(result.getDate() + difference)

  return result
}

function isInSelectedWeek(date, selectedDate) {
  const start = startOfWeek(selectedDate)

  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  end.setHours(23, 59, 59, 999)

  return date >= start && date <= end
}

export default function CalendarSidebar({
  selectedDate,
  view,
  meetings,
  onSelectDate,
}) {
  const [displayMonth, setDisplayMonth] = useState(
    () =>
      new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        1
      )
  )

  useEffect(() => {
    setDisplayMonth(
      new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        1
      )
    )
  }, [selectedDate])

  const year = displayMonth.getFullYear()
  const month = displayMonth.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate()

  const cells = []

  for (let i = 0; i < firstDay; i += 1) {
    cells.push(null)
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(day)
  }

  const todayKey = dateKey(new Date())
  const selectedKey = dateKey(selectedDate)

  const hasMeeting = (key) =>
    meetings.some((meeting) => meeting.date === key)

  const previousMonth = () => {
    setDisplayMonth(
      new Date(year, month - 1, 1)
    )
  }

  const nextMonth = () => {
    setDisplayMonth(
      new Date(year, month + 1, 1)
    )
  }

  const goToday = () => {
    const today = new Date()

    setDisplayMonth(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      )
    )

    onSelectDate(today)
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.75,
        border: '1px solid #e4e8ed',
        borderRadius: 2.5,
        bgcolor: '#fff',
      }}
    >
      <Stack
  direction="row"
  alignItems="center"
  sx={{
    width: '100%',
    mb: 1.25,
  }}
>
  {/* Left arrow */}
  <Box
    sx={{
      flex: 1,
      display: 'flex',
      justifyContent: 'flex-start',
    }}
  >
    <IconButton
      size="small"
      onClick={() =>
        setDisplayMonth(
          new Date(
            displayMonth.getFullYear(),
            displayMonth.getMonth() - 1,
            1
          )
        )
      }
      aria-label="Previous month"
    >
      <ChevronLeftIcon fontSize="small" />
    </IconButton>
  </Box>

  {/* Center month */}
  <Typography
    fontWeight={500}
    fontSize="0.95rem"
    sx={{
      textAlign: 'center',
      whiteSpace: 'nowrap',
    }}
  >
    {new Intl.DateTimeFormat('en', {
      month: 'long',
      year: 'numeric',
    }).format(displayMonth)}
  </Typography>

  {/* Right arrow */}
  <Box
    sx={{
      flex: 1,
      display: 'flex',
      justifyContent: 'flex-end',
    }}
  >
    <IconButton
      size="small"
      onClick={() =>
        setDisplayMonth(
          new Date(
            displayMonth.getFullYear(),
            displayMonth.getMonth() + 1,
            1
          )
        )
      }
      aria-label="Next month"
    >
      <ChevronRightIcon fontSize="small" />
    </IconButton>
  </Box>
</Stack>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 0.25,
          textAlign: 'center',
        }}
      >
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(
          (day, index) => (
            <Typography
              key={`${day}-${index}`}
              sx={{
                py: 0.5,
                fontSize: '0.65rem',
                fontWeight: 600,
                color: 'text.secondary',
              }}
            >
              {day}
            </Typography>
          )
        )}

        {cells.map((day, index) => {
          if (day === null) {
            return (
              <Box
                key={`empty-${index}`}
                sx={{ height: 30 }}
              />
            )
          }

          const date = new Date(year, month, day)
          const key = dateKey(date)

          const selected = key === selectedKey
          const today = key === todayKey

          const selectedWeek =
            view === 'week' &&
            isInSelectedWeek(date, selectedDate)

          const meeting = hasMeeting(key)

          return (
            <Button
              key={key}
              onClick={() => onSelectDate(date)}
              sx={{
                position: 'relative',
                minWidth: 0,
                height: 30,
                p: 0,
                borderRadius: 1.5,
                fontSize: '0.7rem',
                fontWeight:
                  selected || today ? 700 : 400,
                color: selected
                  ? '#fff'
                  : 'text.primary',
                bgcolor: selected
                  ? 'primary.main'
                  : selectedWeek
                    ? '#eaf3ff'
                    : 'transparent',
                '&:hover': {
                  bgcolor: selected
                    ? 'primary.dark'
                    : '#eef5fc',
                },
              }}
            >
              {day}

              {meeting && !selected && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 2,
                    width: 3,
                    height: 3,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                  }}
                />
              )}
            </Button>
          )
        })}
      </Box>

      <Button
        fullWidth
        size="small"
        variant="outlined"
        startIcon={<TodayOutlinedIcon />}
        onClick={goToday}
        sx={{
          mt: 1.5,
          textTransform: 'none',
          fontSize: '0.72rem',
        }}
      >
        Go to today
      </Button>
    </Paper>
  )
}