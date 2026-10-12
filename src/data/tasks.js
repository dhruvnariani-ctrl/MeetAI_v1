import { getAllMeetings } from './meetings'

import {
  filterUserMeetings,
} from '../utils/meetingAccess'

import {
  filterUserTasks,
} from '../utils/taskAccess'

export const TASK_FILTERS = [
  'All',
  'Pending',
  'In Process',
  'Blocked',
  'Done',
]

export const TASK_SORT_OPTIONS = [
  'My Order',
  'Due date',
  'Priority',
]

const PRIORITY_ORDER = {
  High: 1,
  Medium: 2,
  Low: 3,
}

/**
 * Convert action items from meeting data
 * into the normalized task shape.
 */
export function getTasksFromMeetings(
  meetings = [],
) {
  return meetings.flatMap(
    (meeting) => {
      const actionItems =
        Array.isArray(
          meeting.actionItems,
        )
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

          meetingTitle:
            item.meeting ??
            item.meetingTitle ??
            meeting.title,

          due:
            item.due ??
            item.dueDate ??
            null,

          owner:
            item.owner ??
            item.assignee ??
            item.assignedTo ??
            'Unassigned',

          priority:
            item.priority ??
            'Medium',

          status:
            item.status ??
            'Pending',

          meetingId:
            meeting.id,
        }),
      )
    },
  )
}

/**
 * Get all tasks belonging to
 * the current user.
 *
 * A task belongs to the user only
 * when the task itself is owned by them.
 */
export function getTasksFromDashboard(
  currentUser,
) {
  const meetings =
    filterUserMeetings(
      getAllMeetings(),
      currentUser,
    )

  const tasks =
    getTasksFromMeetings(
      meetings,
    )

  return filterUserTasks(
    tasks,
    currentUser,
  )
}

/**
 * Filter by status, then sort.
 */
export function filterAndSortTasks(
  tasks = [],
  filter,
  sortBy,
) {
  let result = [...tasks]

  if (filter !== 'All') {
    result = result.filter(
      (task) =>
        task.status === filter,
    )
  }

  if (sortBy === 'Priority') {
    result.sort(
      (a, b) =>
        (
          PRIORITY_ORDER[
            a.priority
          ] || 99
        ) -
        (
          PRIORITY_ORDER[
            b.priority
          ] || 99
        ),
    )
  }

  if (sortBy === 'Due date') {
    result.sort(
      (a, b) => {
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
      },
    )
  }

  return result
}