import Box from '@mui/material/Box'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'

import { formatElapsedTime } from './utils'

export default function MeetingStatusArea({
  meeting,
  state,
}) {
  const type = state?.type || 'upcoming'

  /*
   * --------------------------------------------------------------------------
   * Completed
   * --------------------------------------------------------------------------
   *
   * Example:
   *
   * [ ✓ Completed ] [ Finished 1h 0m ago ] [ MeetAI attended ]
   *
   * or:
   *
   * [ ✓ Completed ] [ Finished 1h 0m ago ] [ MeetAI invited ]
   */
  if (type === 'completed') {
    return (
      <StatusRow>
        <StatusBadge
          icon={<CheckCircleOutlineIcon />}
          label="Completed"
          bgcolor="#eaf7ef"
          color="#287a4d"
        />

        <StatusBadge
          label={`Finished ${formatElapsedTime(
            state?.afterMs || 0,
          )} ago`}
          bgcolor="#f4f6f8"
          color="#68778a"
        />

        <MeetAIBadge meeting={meeting} />
      </StatusRow>
    )
  }

  /*
   * --------------------------------------------------------------------------
   * Starting soon
   * --------------------------------------------------------------------------
   *
   * Example:
   *
   * [ 🕐 Starting in 8m ] [ MeetAI invited ]
   */
  if (type === 'starting-soon') {
    return (
      <StatusRow>
        <StatusBadge
          icon={<AccessTimeOutlinedIcon />}
          label={`Starting in ${formatRemainingTime(
            state?.remainingMs || 0,
          )}`}
          bgcolor="#fff4dc"
          color="#946200"
        />

        <MeetAIBadge meeting={meeting} />
      </StatusRow>
    )
  }

  /*
   * --------------------------------------------------------------------------
   * Upcoming
   * --------------------------------------------------------------------------
   *
   * Example:
   *
   * [ 🕐 In 2h 15m ] [ MeetAI invited ]
   */
  if (type === 'upcoming') {
    return (
      <StatusRow>
        <StatusBadge
          icon={<AccessTimeOutlinedIcon />}
          label={`In ${formatRemainingTime(
            state?.remainingMs || 0,
          )}`}
          bgcolor="#eef4ff"
          color="#245ea8"
        />

        <MeetAIBadge meeting={meeting} />
      </StatusRow>
    )
  }

  /*
   * --------------------------------------------------------------------------
   * Live
   * --------------------------------------------------------------------------
   */
  if (
    type === 'live' ||
    type === 'just-started'
  ) {
    return (
      <StatusRow>
        <StatusBadge
          label="Live now"
          bgcolor="#eaf7ef"
          color="#287a4d"
          live
        />

        <MeetAIBadge meeting={meeting} />
      </StatusRow>
    )
  }

  return null
}

/* -------------------------------------------------------------------------- */
/* MeetAI status                                                              */
/* -------------------------------------------------------------------------- */

function MeetAIBadge({ meeting }) {
  /*
   * Attended has priority.
   *
   * This is important because a meeting can have:
   *
   * invited: true
   * attended: true
   *
   * In that case we want "MeetAI attended", not
   * "MeetAI invited".
   */
  if (meeting?.meetAI?.attended === true) {
    return (
      <StatusBadge
        label="MeetAI attended"
        bgcolor="#eaf7ef"
        color="#287a4d"
      />
    )
  }

  /*
   * If MeetAI was invited but did not attend,
   * show "MeetAI invited".
   *
   * We intentionally don't call it "did not attend"
   * because your requested UI terminology is
   * "MeetAI invited".
   */
  if (meeting?.meetAI?.invited === true) {
    return (
      <StatusBadge
        label="MeetAI invited"
        bgcolor="#eef4ff"
        color="#245ea8"
      />
    )
  }

  /*
   * No MeetAI information / not invited:
   * don't show an unnecessary badge.
   */
  return null
}

/* -------------------------------------------------------------------------- */
/* Status row                                                                 */
/* -------------------------------------------------------------------------- */

function StatusRow({ children }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 0.9,
        flexWrap: 'wrap',
        maxWidth: '100%',
      }}
    >
      {children}
    </Box>
  )
}

/* -------------------------------------------------------------------------- */
/* Status badge                                                               */
/* -------------------------------------------------------------------------- */

function StatusBadge({
  icon,
  label,
  bgcolor,
  color,
  live = false,
}) {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.65,

        minHeight: 36,

        px: 1.25,

        borderRadius: '999px',

        bgcolor,
        color,

        whiteSpace: 'nowrap',
        flexShrink: 0,

        '& svg': {
          fontSize: 17,
          flexShrink: 0,
        },
      }}
    >
      {live && (
        <Box
          component="span"
          sx={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            bgcolor: color,
            flexShrink: 0,
          }}
        />
      )}

      {icon}

      <Box
        component="span"
        sx={{
          fontSize: '0.72rem',
          lineHeight: 1,
          fontWeight: 700,
        }}
      >
        {label}
      </Box>
    </Box>
  )
}

/* -------------------------------------------------------------------------- */
/* Remaining time                                                             */
/* -------------------------------------------------------------------------- */

function formatRemainingTime(ms) {
  const totalMinutes = Math.max(
    0,
    Math.ceil(ms / 60000),
  )

  const hours = Math.floor(
    totalMinutes / 60,
  )

  const minutes = totalMinutes % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }

  return `${minutes}m`
}