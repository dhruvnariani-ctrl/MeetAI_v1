import { useNavigate } from 'react-router-dom'

import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Tooltip from '@mui/material/Tooltip'

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

import MeetingToggles from '../MeetingToggles'
import MeetingInfo from './MeetingInfo'
import MeetingStatusChip from './MeetingStatusChip'

import {
  getMeetingToggleSettings,
  shouldShowMeetingToggles,
  areMeetingTogglesDisabled,
} from './meetingHelpers'

const has = (object, key) => Object.prototype.hasOwnProperty.call(object, key)
const hasSettingsKeys = (value) =>
  value && typeof value === 'object' && (has(value, 'autoJoin') || has(value, 'recordVideo'))

const stop = (event) => event.stopPropagation()

export default function MeetingListItem({
  meeting,
  status,
  timeLabel,
  settings = {},
  onSettingsChange,
  tourTarget = false,
}) {
  const navigate = useNavigate()

  /*
   * `settings` is either the full map ({ [meetingId]: {...} })
   * or this meeting's own settings object. Resolve both.
   */
  const settingsForMeeting = hasSettingsKeys(settings)
    ? settings
    : settings?.[meeting.id]

  /* Stored settings win; fall back to the meeting's own MeetAI values. */
  const meetingSettings = hasSettingsKeys(settingsForMeeting)
    ? {
        autoJoin: settingsForMeeting.autoJoin === true,
        recordVideo:
          settingsForMeeting.autoJoin === true &&
          settingsForMeeting.recordVideo === true,
      }
    : getMeetingToggleSettings(meeting, undefined)

  const togglesDisabled = areMeetingTogglesDisabled(status)
  const showToggles = shouldShowMeetingToggles(status)

  const handleOpenMeeting = () => navigate(`/meetings/${meeting.id}`)

  /* Keyboard users open details with Enter or Space. */
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleOpenMeeting()
    }
  }

  return (
    <Paper
      data-tour={tourTarget ? 'calendar-meeting' : undefined}
      role="button"
      tabIndex={0}
      elevation={0}
      onDoubleClick={handleOpenMeeting}
      onKeyDown={handleKeyDown}
      sx={{
        border: '1px solid #e1e6ec',
        borderRadius: '18px',
        bgcolor: '#fff',
        overflow: 'hidden',
        cursor: 'default',
        transition:
          'border-color 160ms ease, box-shadow 160ms ease, background-color 160ms ease',
        '&:hover': {
          borderColor: '#c5d0df',
          boxShadow: '0 5px 18px rgba(15, 23, 42, 0.06)',
          bgcolor: '#fcfdff',
          '& .meeting-list-item-arrow': {
            opacity: 1,
            transform: 'translateX(2px)',
          },
        },
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: '2px',
        },
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr auto',
            md: 'minmax(0, 1fr) auto auto 24px',
          },
          alignItems: 'center',
          columnGap: { xs: 1, md: 2 },
          rowGap: { xs: 1, md: 0 },
          px: { xs: 1.75, md: 2.25 },
          py: { xs: 1.5, md: 1.75 },
        }}
      >
        <MeetingInfo meeting={meeting} timeLabel={timeLabel} />

        <MeetingStatusChip status={status} />

        {showToggles ? (
          <Box
            onClick={stop}
            onMouseDown={stop}
            onPointerDown={stop}
            sx={{
              gridColumn: { xs: '1 / 3', md: '3 / 4' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: { xs: 'flex-start', md: 'flex-end' },
              minWidth: { md: 220 },
              pt: { xs: 1, md: 0 },
              mt: { xs: 0.25, md: 0 },
              borderTop: { xs: '1px solid #eef1f5', md: 'none' },
            }}
          >
            <Tooltip
              title={togglesDisabled ? 'Meeting already done' : ''}
              placement="top"
              arrow
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  opacity: togglesDisabled ? 0.7 : 1,
                  cursor: togglesDisabled ? 'not-allowed' : 'default',
                }}
              >
                <MeetingToggles
                  meeting={meeting}
                  settings={meetingSettings}
                  onChange={(changes) => onSettingsChange?.(meeting.id, changes)}
                  disabled={togglesDisabled}
                />
              </Box>
            </Tooltip>
          </Box>
        ) : null}

        <Box
          className="meeting-list-item-arrow"
          aria-hidden="true"
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            justifyContent: 'center',
            color: '#94a3b8',
            opacity: 0.5,
            transform: 'translateX(0)',
            transition: 'opacity 160ms ease, transform 160ms ease',
          }}
        >
          <ArrowForwardIosIcon sx={{ fontSize: 15 }} />
        </Box>
      </Box>
    </Paper>
  )
}