import { useId } from 'react'
import { Link as RouterLink } from 'react-router-dom'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'

function formatDueDate(value) {
  if (!value) return null

  const date =
    value instanceof Date
      ? value
      : new Date(value)

  if (Number.isNaN(date.getTime())) {
    return String(value)
  }

  const today = new Date()

  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  )

  const dateStart = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  )

  const diffDays = Math.round(
    (dateStart.getTime() - todayStart.getTime()) /
      86400000,
  )

  if (diffDays === 0) {
    return 'Due today'
  }

  if (diffDays === 1) {
    return 'Due tomorrow'
  }

  if (diffDays === -1) {
    return 'Due yesterday'
  }

  return `Due ${new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date)}`
}

function getPriorityLabel(priority) {
  if (!priority) return 'Medium'

  const value = String(priority).trim()

  if (!value) return 'Medium'

  return (
    value.charAt(0).toUpperCase() +
    value.slice(1).toLowerCase()
  )
}

function getPriorityStyles(priority) {
  const value = String(priority ?? '').toLowerCase()

  if (value === 'high') {
    return {
      bgcolor: '#fff1f2',
      color: '#be123c',
    }
  }

  if (value === 'low') {
    return {
      bgcolor: '#f1f5f9',
      color: '#475569',
    }
  }

  return {
    bgcolor: '#fff7ed',
    color: '#c2410c',
  }
}

function ActionItemList({ items }) {
  return (
    <Stack
      component="ul"
      role="list"
      spacing={1}
      sx={{
        listStyle: 'none',
        m: 0,
        p: 0,
      }}
    >
      {items.map((item) => {
        const dueLabel = formatDueDate(item.due)

        const priorityLabel = getPriorityLabel(
          item.priority,
        )

        const priorityStyles =
          getPriorityStyles(item.priority)

        const isDone =
          item.status === 'Done' ||
          item.completed === true

        return (
          <Box
            component="li"
            key={item.id}
            sx={{
              display: 'flex',
              gap: 1.25,
              alignItems: 'flex-start',
              p: 1.25,
              borderRadius: '14px',
              bgcolor: '#f8fafc',
              border: '1px solid #edf1f5',
            }}
          >
            {isDone ? (
              <CheckCircleIcon
                sx={{
                  fontSize: 22,
                  mt: '1px',
                  color: '#16a34a',
                  flexShrink: 0,
                }}
                aria-label="Completed"
              />
            ) : (
              <RadioButtonUncheckedIcon
                sx={{
                  fontSize: 22,
                  mt: '1px',
                  color: '#64748b',
                  flexShrink: 0,
                }}
                aria-hidden="true"
              />
            )}

            <Box
              sx={{
                minWidth: 0,
                flex: 1,
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  lineHeight: 1.35,
                  color: isDone
                    ? '#64748b'
                    : '#0f172a',
                  textDecoration: isDone
                    ? 'line-through'
                    : 'none',
                  overflowWrap: 'anywhere',
                }}
              >
                {item.title}
              </Typography>

              <Typography
                sx={{
                  mt: 0.4,
                  fontSize: '0.76rem',
                  lineHeight: 1.4,
                  color: '#64748b',
                  overflowWrap: 'anywhere',
                }}
              >
                {item.meeting || 'Meeting task'}
              </Typography>

              <Stack
                direction="row"
                spacing={0.75}
                useFlexGap
                flexWrap="wrap"
                sx={{ mt: 0.9 }}
              >
                {dueLabel && (
                  <Chip
                    label={dueLabel}
                    size="small"
                    sx={{
                      height: 24,
                      borderRadius: '7px',
                      bgcolor: '#eef4ff',
                      color: '#315d9b',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      '& .MuiChip-label': {
                        px: 1,
                      },
                    }}
                  />
                )}

                <Chip
                  label={priorityLabel}
                  size="small"
                  sx={{
                    height: 24,
                    borderRadius: '7px',
                    bgcolor: priorityStyles.bgcolor,
                    color: priorityStyles.color,
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    '& .MuiChip-label': {
                      px: 1,
                    },
                  }}
                />
              </Stack>
            </Box>
          </Box>
        )
      })}
    </Stack>
  )
}

export default function ActionItemsCard({
  items = [],
  limit = 3,
}) {
  const headingId = useId()

  const visibleItems = items.slice(0, limit)

  return (
    <Paper
      data-tour="dashboard-action-items"
      component="section"
      aria-labelledby={headingId}
      variant="outlined"
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: '20px',
        bgcolor: '#fff',
        borderColor: '#e1e6ec',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
          mb: 1.5,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            id={headingId}
            component="h2"
            sx={{
              fontSize: '1rem',
              fontWeight: 700,
              color: '#0f172a',
            }}
          >
            Action items
          </Typography>

          <Typography
            sx={{
              mt: 0.25,
              fontSize: '0.75rem',
              color: '#64748b',
            }}
          >
            Tasks that need your attention
          </Typography>
        </Box>

        <Button
          component={RouterLink}
          to="/tasks"
          size="small"
          endIcon={
            <ArrowForwardIcon
              sx={{ fontSize: 17 }}
            />
          }
          sx={{
            flexShrink: 0,
            minWidth: 0,
            px: 0.5,
            fontSize: '0.8rem',
            fontWeight: 600,
            textTransform: 'none',
            color: '#2563eb',
          }}
        >
          View all
        </Button>
      </Box>

      {visibleItems.length === 0 ? (
        <Box
          sx={{
            py: 3,
            px: 1,
            textAlign: 'center',
          }}
        >
          <Typography
            sx={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: '#334155',
            }}
          >
            You&apos;re all caught up
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              fontSize: '0.78rem',
              color: '#64748b',
            }}
          >
            No action items need your attention.
          </Typography>
        </Box>
      ) : (
        <ActionItemList items={visibleItems} />
      )}
    </Paper>
  )
}