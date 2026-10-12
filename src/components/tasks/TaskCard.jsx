import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import TaskDetail from './TaskDetail'
import TaskStatusBadge from './TaskStatusBadge'

function formatDueDate(value) {
  if (!value || value === '—') {
    return 'No due date'
  }

  // If value is already a Date object
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      return 'No due date'
    }

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(value)
  }

  const stringValue = String(value).trim()

  if (!stringValue) {
    return 'No due date'
  }

  // Handle YYYY-MM-DD safely
  const date = new Date(`${stringValue}T00:00:00`)

  if (Number.isNaN(date.getTime())) {
    return 'No due date'
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export default function TaskCard({
  task,
  onMarkDone = () => {},
  showMarkDoneTour = false,
}) {
  const isDone = task?.status === 'Done'

  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid #dce3eb',
        borderRadius: 2.5,
        bgcolor: '#fff',
        px: { xs: 1.75, sm: 2.5 },
        py: { xs: 1.75, sm: 2 },
        transition: 'border-color 160ms ease, box-shadow 160ms ease',

        '&:hover': {
          borderColor: '#bdc9d8',
          boxShadow: '0 4px 14px rgba(15,23,42,0.06)',
        },
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'minmax(0, 1fr) auto',
          },
          gap: {
            xs: 1.5,
            md: 3,
          },
          alignItems: 'center',
        }}
      >
        {/* Task information */}
        <Box
          data-tour="task-details"
          sx={{
            minWidth: 0,
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: '0.9rem',
                sm: '0.95rem',
              },
              lineHeight: 1.5,
              fontWeight: 600,
              color: isDone ? '#64748b' : '#172b46',
              textDecoration: isDone ? 'line-through' : 'none',
            }}
          >
            {task?.title || 'Untitled task'}
          </Typography>

          <Stack
            direction="row"
            spacing={2}
            sx={{
              mt: 1.25,
              flexWrap: 'wrap',
              rowGap: 0.75,
            }}
          >
            <TaskDetail
              label="Owner"
              value={task?.owner || 'Not assigned'}
            />

            <TaskDetail
              label="Due"
              value={formatDueDate(task?.due)}
            />

            <TaskDetail
              label="Priority"
              value={task?.priority || 'Medium'}
              priority
            />
          </Stack>
        </Box>

        {/* Status + action */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            justifyContent: {
              xs: 'space-between',
              md: 'flex-end',
            },
          }}
        >
          <Box data-tour="task-status">
            <TaskStatusBadge
              status={task?.status || 'Pending'}
            />
          </Box>

          {!isDone && (
            <Button
              data-tour={
                showMarkDoneTour
                  ? 'mark-task-done'
                  : undefined
              }
              size="small"
              variant="outlined"
              onClick={() => {
                if (task?.id != null) {
                  onMarkDone(task.id)
                }
              }}
              sx={{
                minWidth: 112,
                textTransform: 'none',
                fontSize: '0.78rem',
                fontWeight: 600,
                borderColor: '#cbd5e1',
                whiteSpace: 'nowrap',

                '&:hover': {
                  borderColor: '#94a3b8',
                  bgcolor: '#f8fafc',
                },
              }}
            >
              Mark as done
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  )
}