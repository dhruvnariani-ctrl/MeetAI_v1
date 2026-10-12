import { useMemo, useState } from 'react'

import PageShell, {
  EmptyPanel,
} from '../components/PageShell'

import TaskFilters from '../components/tasks/TaskFilters'
import TaskCard from '../components/tasks/TaskCard'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import usePageTitle from '../hooks/usePageTitle'
import useCurrentUser from '../hooks/useCurrentUser'

import {
  TASK_FILTERS,
  TASK_SORT_OPTIONS,
  getTasksFromDashboard,
  filterAndSortTasks,
} from '../data/tasks'

import {
  updateMeetingActionItemStatus,
} from '../data/meetings'

export default function MyTasks() {
  usePageTitle('My Tasks')

  const currentUser =
    useCurrentUser()

  const [
    tasks,
    setTasks,
  ] = useState(() =>
    getTasksFromDashboard(
      currentUser,
    ),
  )

  const [
    filter,
    setFilter,
  ] = useState('All')

  const [
    sortBy,
    setSortBy,
  ] = useState('My Order')

  const filteredTasks =
    useMemo(
      () =>
        filterAndSortTasks(
          tasks,
          filter,
          sortBy,
        ),
      [
        tasks,
        filter,
        sortBy,
      ],
    )

  /*
   * The first task that is not done
   * carries the Mark as done tour target.
   */
  const firstActionableIndex =
    filteredTasks.findIndex(
      (task) =>
        task.status !== 'Done',
    )

  const handleMarkDone = (
    taskId,
  ) => {
    const task =
      tasks.find(
        (item) =>
          item.id === taskId,
      )

    if (!task) return

    updateMeetingActionItemStatus(
      task.meetingId,
      task.id,
      'Done',
    )

    setTasks(
      (current) =>
        current.map(
          (item) =>
            item.id === taskId
              ? {
                  ...item,
                  status: 'Done',
                }
              : item,
        ),
    )
  }

  return (
    <PageShell
      title="My Tasks"
      subtitle="Action items assigned to you from your meetings."
    >
      <Stack spacing={2.5}>
        <TaskFilters
          filters={TASK_FILTERS}
          filter={filter}
          onFilterChange={
            setFilter
          }
          sortOptions={
            TASK_SORT_OPTIONS
          }
          sortBy={sortBy}
          onSortChange={
            setSortBy
          }
        />

        <Typography
          sx={{
            fontSize: '0.9rem',
            fontWeight: 600,
            color: '#24364d',
          }}
        >
          {filteredTasks.length}{' '}
          {filteredTasks.length ===
          1
            ? 'task'
            : 'tasks'}
        </Typography>

        {filteredTasks.length ===
        0 ? (
          <EmptyPanel title="No tasks here">
            There are no tasks in this section.
          </EmptyPanel>
        ) : (
          <Stack spacing={1.5}>
            {filteredTasks.map(
              (
                task,
                index,
              ) => (
                <Box
                  key={task.id}
                  data-tour={
                    index === 0
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
                      index ===
                      firstActionableIndex
                    }
                  />
                </Box>
              ),
            )}
          </Stack>
        )}
      </Stack>
    </PageShell>
  )
}
