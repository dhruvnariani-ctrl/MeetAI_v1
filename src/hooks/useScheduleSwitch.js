import { useMemo } from 'react'

import { getMeetingStatus } from '../components/meetings/meetingHelpers'

const toTime = (value) =>
  value instanceof Date ? value.getTime() : new Date(value).getTime()

export default function useScheduleSwitch({
  meetings = [],
  now,
  nextId,
  settings = {},
  onSettingsChange,
}) {
  const sortedMeetings = useMemo(
    () => [...meetings].sort((a, b) => toTime(a?.start) - toTime(b?.start)),
    [meetings],
  )

  const meetingsWithStatus = useMemo(
    () =>
      sortedMeetings.map((meeting) => ({
        meeting,
        status: getMeetingStatus(meeting, now, nextId),
      })),
    [sortedMeetings, now, nextId],
  )

  const activeMeetings = useMemo(
    () =>
      meetingsWithStatus
        .filter(({ status }) => status !== 'Done')
        .map(({ meeting }) => meeting),
    [meetingsWithStatus],
  )

  const checked =
    activeMeetings.length > 0 &&
    activeMeetings.every(
      (meeting) =>
        settings?.[meeting.id]?.autoJoin ?? meeting?.meetAI?.invited ?? false,
    )

  const toggle = (value) => {
    activeMeetings.forEach((meeting) => {
      onSettingsChange?.(meeting.id, {
        autoJoin: value === true,
        ...(value === true ? {} : { recordVideo: false }),
      })
    })
  }

  return {
    sortedMeetings,
    meetingsWithStatus,
    checked,
    disabled: activeMeetings.length === 0,
    toggle,
  }
}