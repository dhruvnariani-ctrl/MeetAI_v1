import { useMemo, useState } from 'react'

import {
  createMeetingSettings,
  saveMeetingSettings,
  saveMeetingSettingsBulk,
} from '../data/meetingSettings'

import {
  dateKey,
  endOfWeek,
  formatDayTitle,
  formatMonthTitle,
  formatWeekTitle,
  getCalendarMeetings,
  getDayDateLabel,
  getMonthDateLabel,
  getTimeSortValue,
  getWeekDateLabel,
  parseDate,
  startOfWeek,
} from '../utils/calenderDates'

import useCurrentUser from './useCurrentUser'

const startOfToday = () => {
  const today = new Date()

  today.setHours(
    0,
    0,
    0,
    0,
  )

  return today
}

/*
 * All Calendar page state: selected date, view, filter,
 * per-meeting MeetAI settings, navigation and the visible list.
 */
export default function useCalendarState(user) {
  /*
   * Use the supplied user when CalendarPage provides one.
   * Otherwise get the current user directly.
   */
  const currentUser = user ?? useCurrentUser()

  /*
   * Dashboard and Calendar use the same meeting source.
   *
   * getCalendarMeetings filters the meetings so only meetings
   * where the current user is the owner or a participant are used.
   */
  const meetings = useMemo(
    () => getCalendarMeetings(currentUser),
    [currentUser],
  )

  const [selectedDate, setSelectedDate] = useState(
    () => new Date(),
  )

  const [view, setView] = useState('day')

  const [filter, setFilter] = useState('All')

  /*
   * Saved MeetAI settings first, then meeting.meetAI defaults.
   */
  const [settings, setSettings] = useState(
    () => createMeetingSettings(meetings),
  )

  const selectedKey = dateKey(selectedDate)

  /* ---------------------------------------------------------------- */
  /* Visible meetings (Day / Week / Month + status filter)            */
  /* ---------------------------------------------------------------- */

  const visibleMeetings = useMemo(() => {
    let result = [...meetings]

    if (view === 'day') {
      result = result.filter(
        (meeting) =>
          meeting.date === selectedKey,
      )
    }

    if (view === 'week') {
      const start = startOfWeek(selectedDate)
      const end = endOfWeek(selectedDate)

      result = result.filter((meeting) => {
        const meetingDate = parseDate(
          meeting.date,
        )

        return (
          meetingDate >= start &&
          meetingDate <= end
        )
      })
    }

    if (view === 'month') {
      result = result.filter((meeting) => {
        const meetingDate = parseDate(
          meeting.date,
        )

        return (
          meetingDate.getFullYear() ===
            selectedDate.getFullYear() &&
          meetingDate.getMonth() ===
            selectedDate.getMonth()
        )
      })
    }

    if (filter !== 'All') {
      result = result.filter(
        (meeting) =>
          meeting.type === filter,
      )
    }

    /*
     * Sort by calendar date, then by numeric time
     * instead of sorting formatted time strings.
     */
    return result.sort((a, b) => {
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date)
      }

      return (
        getTimeSortValue(a.time) -
        getTimeSortValue(b.time)
      )
    })
  }, [
    meetings,
    selectedDate,
    selectedKey,
    view,
    filter,
  ])

  /* ---------------------------------------------------------------- */
  /* MeetAI settings                                                   */
  /* ---------------------------------------------------------------- */

  /*
   * Done meetings never affect the overall switch.
   */
  const activeVisibleMeetings =
    visibleMeetings.filter(
      (meeting) =>
        meeting.type !== 'Done',
    )

  const allVisibleAutoJoin =
    activeVisibleMeetings.length > 0 &&
    activeVisibleMeetings.every(
      (meeting) =>
        settings?.[meeting.id]
          ?.autoJoin === true,
    )

  const onSettingsChange = (
    meetingId,
    changes,
  ) => {
    setSettings(
      saveMeetingSettings(
        meetingId,
        changes,
      ),
    )
  }

  const handleToolbarAutoJoin = (
    checked,
  ) => {
    setSettings(
      saveMeetingSettingsBulk(
        activeVisibleMeetings,
        checked,
      ),
    )
  }

  /* ---------------------------------------------------------------- */
  /* Navigation                                                        */
  /* ---------------------------------------------------------------- */

  const selectDay = (date) => {
    setSelectedDate(date)
    setView('day')
  }

  const selectQuickDate = (offset) => {
    const next = startOfToday()

    next.setDate(
      next.getDate() + offset,
    )

    selectDay(next)
  }

  const handleToday = () =>
    selectQuickDate(0)

  const handleYesterday = () =>
    selectQuickDate(-1)

  const handleTomorrow = () =>
    selectQuickDate(1)

  /*
   * Back to the current period without changing the view.
   */
  const handleCurrentPeriod = () =>
    setSelectedDate(startOfToday())

  const navigateCalendar = (
    direction,
  ) => {
    const next = new Date(
      selectedDate,
    )

    if (view === 'day') {
      next.setDate(
        next.getDate() + direction,
      )
    }

    if (view === 'week') {
      next.setDate(
        next.getDate() +
          direction * 7,
      )
    }

    if (view === 'month') {
      /*
       * Anchor to the 1st so Jan 31 can't skip a month.
       */
      next.setDate(1)

      next.setMonth(
        next.getMonth() + direction,
      )
    }

    setSelectedDate(next)
  }

  const handlePrevious = () =>
    navigateCalendar(-1)

  const handleNext = () =>
    navigateCalendar(1)

  /* ---------------------------------------------------------------- */
  /* Labels                                                            */
  /* ---------------------------------------------------------------- */

  const title =
    view === 'day'
      ? formatDayTitle(
          selectedDate,
        )
      : view === 'week'
        ? formatWeekTitle(
            selectedDate,
          )
        : formatMonthTitle(
            selectedDate,
          )

  const selectedDateLabel =
    view === 'day'
      ? getDayDateLabel(
          selectedDate,
        )
      : view === 'week'
        ? getWeekDateLabel(
            selectedDate,
          )
        : getMonthDateLabel(
            selectedDate,
          )

  return {
    meetings,
    visibleMeetings,
    selectedDate,
    view,
    setView,
    filter,
    setFilter,
    settings,
    title,
    selectedDateLabel,
    allVisibleAutoJoin,
    onSettingsChange,
    handleToolbarAutoJoin,
    selectDay,
    handleToday,
    handleYesterday,
    handleTomorrow,
    handleCurrentPeriod,
    handlePrevious,
    handleNext,
  }
}