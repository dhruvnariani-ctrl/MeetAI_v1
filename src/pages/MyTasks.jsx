import { useMemo, useState } from 'react'

import PageShell, {
  EmptyPanel,
} from '../components/PageShell'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import AddTaskOutlinedIcon from '@mui/icons-material/AddTaskOutlined'

import usePageTitle from '../hooks/usePageTitle'

import { getTodaysMeetings } from '../data/Dashboard'

/* ====================================================== */
/* TASK DATA                                               */
/* ====================================================== */

const getTasksFromDashboard = () => {
  const meetings = getTodaysMeetings()

  return meetings.flatMap((meeting) => {
    const actionItems =
      Array.isArray(meeting.actionItems)
        ? meeting.actionItems
        : []

    return actionItems.map(
      (item, index) => ({
        id:
          item.id ??
          `${meeting.id}-task-${index}`,

        title:
          item.title ??
          item.task ??
          item.description ??
          'Untitled task',

        owner:
          item.owner ??
          item.assignee ??
          item.assignedTo ??
          'Unassigned',

        due:
          item.due ??
          item.dueDate ??
          null,

        priority:
          item.priority ??
          'Medium',

        status:
          item.status ??
          'Pending',

        meetingId: meeting.id,
        meetingTitle: meeting.title,
      }),
    )
  })
}

const FILTERS = [
  'All',
  'Pending',
  'In Process',
  'Blocked',
  'Done',
]

const SORT_OPTIONS = [
  'My Order',
  'Due date',
  'Priority',
]

const PRIORITY_ORDER = {
  High: 1,
  Medium: 2,
  Low: 3,
}

/* ====================================================== */
/* PAGE                                                    */
/* ====================================================== */

export default function MyTasks() {
  usePageTitle('My Tasks')

  const [tasks, setTasks] = useState(
    () => getTasksFromDashboard(),
  )

  const [filter, setFilter] =
    useState('All')

  const [sortBy, setSortBy] =
    useState('My Order')

  const [anchorEl, setAnchorEl] =
    useState(null)

  const menuOpen = Boolean(anchorEl)

  /* ==================================================== */
  /* FILTER + SORT                                         */
  /* ==================================================== */

  const filteredTasks = useMemo(() => {
    let result = [...tasks]

    if (filter !== 'All') {
      result = result.filter(
        (task) =>
          task.status === filter,
      )
    }

    if (sortBy === 'Priority') {
      result.sort((a, b) => {
        const priorityA =
          PRIORITY_ORDER[a.priority] || 99

        const priorityB =
          PRIORITY_ORDER[b.priority] || 99

        return priorityA - priorityB
      })
    }

    if (sortBy === 'Due date') {
      result.sort((a, b) => {
        if (!a.due && !b.due) {
          return 0
        }

        if (!a.due) {
          return 1
        }

        if (!b.due) {
          return -1
        }

        return (
          new Date(a.due) -
          new Date(b.due)
        )
      })
    }

    return result
  }, [
    tasks,
    filter,
    sortBy,
  ])

  /* ==================================================== */
  /* SORT                                                   */
  /* ==================================================== */

  const handleSortOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleSortClose = () => {
    setAnchorEl(null)
  }

  const handleSortChange = (value) => {
    setSortBy(value)
    handleSortClose()
  }

  /* ==================================================== */
  /* MARK DONE                                              */
  /* ==================================================== */

  const handleMarkDone = (taskId) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: 'Done',
            }
          : task,
      ),
    )
  }

  return (
    <PageShell
      title="My Tasks"
      subtitle="Action items assigned to you from your meetings."
    >
      <Stack spacing={2.5}>

        {/* ================================================== */}
{/* FILTERS + SORT                                     */}
{/* ================================================== */}

<Paper
  elevation={0}
  sx={{
    border: '1px solid #dce3eb',
    borderRadius: 2.5,
    bgcolor: '#fff',
    overflow: 'hidden',
  }}
>
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 1.5,
      width: '100%',
      px: { xs: 1, sm: 1.25 },
      py: 0.75,
    }}
  >
    {/* ================================================== */}
    {/* STATUS FILTERS                                     */}
    {/* ================================================== */}

    <Box
      data-tour="tasks-filters"
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 0.4,
        minWidth: 0,
        flexShrink: 1,
        overflowX: 'auto',

        '&::-webkit-scrollbar': {
          display: 'none',
        },

        scrollbarWidth: 'none',
      }}
    >
      {/* Animated selected background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,

          width: {
            xs: 68,
            sm: 92,
          },

          height: {
            xs: 38,
            sm: 42,
          },

          borderRadius: 1.75,

          bgcolor: '#0d68c9',

          boxShadow:
            '0 2px 7px rgba(13, 104, 201, 0.22)',

          transform: {
            xs: `translateX(${FILTERS.indexOf(filter) * 70.4}px)`,
            sm: `translateX(${FILTERS.indexOf(filter) * 94.4}px)`,
          },

          transition:
            'transform 220ms cubic-bezier(0.4, 0, 0.2, 1)',

          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {FILTERS.map((item) => {
        const selected = filter === item

        return (
          <Button
            key={item}
            onClick={() => setFilter(item)}
            disableRipple
            sx={{
              position: 'relative',
              zIndex: 1,

              minWidth: {
                xs: 68,
                sm: 92,
              },

              width: {
                xs: 68,
                sm: 92,
              },

              height: {
                xs: 38,
                sm: 42,
              },

              px: 1,

              flexShrink: 0,

              textTransform: 'none',

              fontSize: {
                xs: '0.74rem',
                sm: '0.82rem',
              },

              fontWeight: selected ? 600 : 500,

              color: selected
                ? '#fff'
                : '#52657d',

              bgcolor: 'transparent',

              border: 'none',

              borderRadius: 1.75,

              whiteSpace: 'nowrap',

              transition:
                'color 180ms ease, font-weight 180ms ease',

              '&:hover': {
                bgcolor: 'transparent',
                color: selected
                  ? '#fff'
                  : '#243b5a',
              },

              '&:focus': {
                bgcolor: 'transparent',
              },

              '&:focus-visible': {
                outline:
                  '2px solid rgba(13, 104, 201, 0.35)',
                outlineOffset: 1,
              },
            }}
          >
            {item}
          </Button>
        )
      })}
    </Box>

    {/* ================================================== */}
    {/* SORT                                               */}
    {/* ================================================== */}

    <Box
      sx={{
        flexShrink: 0,
        ml: 'auto',
      }}
    >
      <Button
        data-tour="tasks-sort"
        size="small"
        variant="outlined"
        endIcon={
          <KeyboardArrowDownIcon
            sx={{ fontSize: 18 }}
          />
        }
        onClick={handleSortOpen}
        sx={{
          minWidth: {
            xs: 130,
            sm: 150,
          },

          height: {
            xs: 38,
            sm: 40,
          },

          px: {
            xs: 1.25,
            sm: 1.5,
          },

          justifyContent: 'space-between',

          textTransform: 'none',

          fontSize: {
            xs: '0.74rem',
            sm: '0.8rem',
          },

          fontWeight: 500,

          color: '#243b5a',

          bgcolor: '#fff',

          borderColor: '#d6dee8',

          borderRadius: 1.75,

          whiteSpace: 'nowrap',

          '&:hover': {
            bgcolor: '#fff',
            borderColor: '#c5d0dc',
            color: '#243b5a',
          },
        }}
      >
        Sort: {sortBy}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleSortClose}
      >
        {SORT_OPTIONS.map((item) => (
          <MenuItem
            key={item}
            selected={sortBy === item}
            onClick={() =>
              handleSortChange(item)
            }
            sx={{
              minWidth: 170,
              minHeight: 40,
              fontSize: '0.82rem',
            }}
          >
            {item}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  </Box>
</Paper>

        {/* ================================================== */}
        {/* TASK COUNT                                         */}
        {/* ================================================== */}

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: '#24364d',
            }}
          >
            {filteredTasks.length}{' '}
            {filteredTasks.length === 1
              ? 'task'
              : 'tasks'}
          </Typography>
        </Box>

        {/* ================================================== */}
        {/* TASK LIST                                          */}
        {/* ================================================== */}

        {filteredTasks.length === 0 ? (
          <EmptyPanel title="No tasks here">
            There are no tasks in this section.
          </EmptyPanel>
        ) : (
          <Stack spacing={1.5}>
            {filteredTasks.map(
              (task, index) => {
                const isFirstTask =
                  index === 0

                const firstActionableIndex =
                  filteredTasks.findIndex(
                    (item) =>
                      item.status !==
                      'Done',
                  )

                const isFirstActionableTask =
                  index ===
                  firstActionableIndex

                return (
                  <Box
                    key={task.id}
                    data-tour={
                      isFirstTask
                        ? 'task-card'
                        : undefined
                    }
                  >
                    <TaskCard
                      task={task}
                      onMarkDone={
                        handleMarkDone
                      }
                      showMarkDoneTour={
                        isFirstActionableTask
                      }
                    />
                  </Box>
                )
              },
            )}
          </Stack>
        )}
      </Stack>
    </PageShell>
  )
}

/* ====================================================== */
/* TASK CARD                                               */
/* ====================================================== */

function TaskCard({
  task,
  onMarkDone,
  showMarkDoneTour = false,
}) {
  const isDone =
    task.status === 'Done'

  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid #dce3eb',
        borderRadius: 2.5,

        bgcolor: '#fff',

        px: {
          xs: 1.75,
          sm: 2.5,
        },

        py: {
          xs: 1.75,
          sm: 2,
        },

        transition:
          'border-color 160ms ease, box-shadow 160ms ease',

        '&:hover': {
          borderColor: '#bdc9d8',

          boxShadow:
            '0 4px 14px rgba(15,23,42,0.06)',
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

        {/* ================================================== */}
        {/* TASK INFORMATION                                   */}
        {/* ================================================== */}

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

              color: isDone
                ? '#64748b'
                : '#172b46',

              textDecoration: isDone
                ? 'line-through'
                : 'none',
            }}
          >
            {task.title}
          </Typography>

          {/* Task metadata */}

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
              value={task.owner}
            />

            <TaskDetail
              label="Due"
              value={formatDueDate(
                task.due,
              )}
            />

            <TaskDetail
              label="Priority"
              value={task.priority}
              priority
            />
          </Stack>
        </Box>

        {/* ================================================== */}
        {/* STATUS + ACTION                                    */}
        {/* ================================================== */}

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
            <StatusBadge
              status={task.status}
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
              onClick={() =>
                onMarkDone(task.id)
              }
              sx={{
                minWidth: 112,

                textTransform: 'none',

                fontSize: '0.78rem',

                fontWeight: 600,

                borderColor:
                  '#cbd5e1',

                whiteSpace: 'nowrap',

                '&:hover': {
                  borderColor:
                    '#94a3b8',
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

/* ====================================================== */
/* TASK DETAIL                                             */
/* ====================================================== */

function TaskDetail({
  label,
  value,
  priority = false,
}) {
  return (
    <Box>
      <Typography
        component="span"
        sx={{
          fontSize: '0.68rem',
          color: '#7b8ba1',
          mr: 0.5,
        }}
      >
        {label}:
      </Typography>

      <Typography
        component="span"
        sx={{
          fontSize: '0.72rem',

          color: priority
            ? getPriorityColor(value)
            : '#42546b',

          fontWeight: priority
            ? 600
            : 500,
        }}
      >
        {value}
      </Typography>
    </Box>
  )
}

/* ====================================================== */
/* STATUS BADGE                                            */
/* ====================================================== */

function StatusBadge({ status }) {
  const styles = {
    Pending: {
      bgcolor: '#eef4ff',
      color: '#245ea8',
    },

    'In Process': {
      bgcolor: '#fff5df',
      color: '#946200',
    },

    Blocked: {
      bgcolor: '#fff0f0',
      color: '#b42318',
    },

    Done: {
      bgcolor: '#eaf7ef',
      color: '#287a4d',
    },
  }

  const style =
    styles[status] ||
    styles.Pending

  return (
    <Box
      sx={{
        px: 1.25,
        py: 0.55,

        borderRadius: '20px',

        bgcolor: style.bgcolor,
        color: style.color,

        fontSize: '0.72rem',

        fontWeight: 600,

        whiteSpace: 'nowrap',
      }}
    >
      {status}
    </Box>
  )
}

/* ====================================================== */
/* HELPERS                                                 */
/* ====================================================== */

function formatDueDate(value) {
  if (!value) {
    return 'No due date'
  }

  const date = new Date(
    `${value}T00:00:00`,
  )

  return new Intl.DateTimeFormat(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    },
  ).format(date)
}

function getPriorityColor(priority) {
  if (priority === 'High') {
    return '#b42318'
  }

  if (priority === 'Medium') {
    return '#946200'
  }

  return '#52657d'
}