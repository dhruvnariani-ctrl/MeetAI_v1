import { CURRENT_USER } from './User'

const MIN = 60000

const PEOPLE = [
  {
    name: 'Aarav Mehta',
    email: 'aarav.mehta@avaada.com',
  },
  {
    name: 'Ananya Rao',
    email: 'ananya.rao@avaada.com',
  },
  {
    name: 'Karan Malhotra',
    email: 'karan.malhotra@avaada.com',
  },
  {
    name: 'Meera Iyer',
    email: 'meera.iyer@avaada.com',
  },
  {
    name: 'Rohan Desai',
    email: 'rohan.desai@avaada.com',
  },
]

/*
 * ---------------------------------------------------------------------------
 * Today's meetings
 * ---------------------------------------------------------------------------
 *
 * The dashboard uses this function to create a schedule relative to "now".
 *
 * Example:
 *
 * m1 = already completed
 * m2 = upcoming / live
 * m3 = upcoming
 * m4 = upcoming
 *
 * The additional meeting information is used by:
 *
 * - Dashboard
 * - Calendar
 * - Recorded Meetings
 * - Meeting Details
 */
export function getTodaysMeetings(
  now = new Date(),
) {
  const t = new Date(now)

  t.setSeconds(0, 0)

  const at = (offsetMin) =>
    new Date(
      t.getTime() + offsetMin * MIN,
    )

  const me = {
    ...CURRENT_USER,
  }

  return [
    /*
     * -----------------------------------------------------------------------
     * Meeting 1
     * Completed meeting
     * -----------------------------------------------------------------------
     */
    {
      id: 'm1',

      title: 'Weekly design review',

      start: at(-90),
      end: at(-60),

      platform: 'Google Meet',

      link:
        'https://meet.google.com/abc-defg-hij',

      participants: [
        {
          ...me,
          attended: true,
        },
        {
          ...PEOPLE[0],
          attended: true,
        },
        {
          ...PEOPLE[1],
          attended: false,
        },
      ],

      /*
       * MeetAI
       */
      meetAI: {
        invited: true,
        attended: true,
      },

      /*
       * Recording
       */
      recording: {
        available: true,
        duration: '30 min',
      },

      /*
       * Transcript
       */
      transcript: {
        available: true,

        text:
          '12:01 PM — The team reviewed the current design progress.\n\n' +
          '12:10 PM — The team discussed the remaining design changes.\n\n' +
          '12:20 PM — The team agreed on the next steps.\n\n' +
          '12:28 PM — Final questions were discussed.\n\n' +
          '12:31 PM — Meeting ended.',
      },

      /*
       * Meeting summary
       */
      meetingSummary:
        'The team reviewed the current design progress, discussed the remaining changes, and agreed on the next steps for the design work.',

      /*
       * Action items
       */
      actionItems: [
        {
          id: 'm1-a1',
          title:
            'Review the revised design',
          owner: 'Dhruv Nariani',
          status: 'Pending',
        },
        {
          id: 'm1-a2',
          title:
            'Share the updated design with the team',
          owner: 'Aarav Mehta',
          status: 'Pending',
        },
      ],

      /*
       * Attendance details
       */
      attendanceDetails: {
        [me.email]: {
          joinedAt: at(-89),
          leftAt: at(-60),
        },

        [PEOPLE[0].email]: {
          joinedAt: at(-87),
          leftAt: at(-62),
        },
      },
    },

    /*
     * -----------------------------------------------------------------------
     * Meeting 2
     * Upcoming / live meeting
     * -----------------------------------------------------------------------
     */
    {
      id: 'm2',

      title: 'Sprint planning',

      start: at(25),
      end: at(85),

      platform: 'Microsoft Teams',

      link:
        'https://teams.microsoft.com/l/meetup-join/sample',

      participants: [
        {
          ...me,
          attended: null,
        },
        {
          ...PEOPLE[0],
          attended: null,
        },
        {
          ...PEOPLE[2],
          attended: null,
        },
        {
          ...PEOPLE[3],
          attended: null,
        },
        {
          ...PEOPLE[4],
          attended: null,
        },
      ],

      /*
       * MeetAI has been invited but has not
       * attended yet because the meeting has
       * not started.
       */
      meetAI: {
        invited: true,
        attended: false,
      },

      /*
       * Recording will become available
       * after the meeting is recorded.
       */
      recording: {
        available: false,
        duration: null,
      },

      transcript: {
        available: false,
        text: null,
      },

      meetingSummary: null,

      actionItems: [],

      attendanceDetails: {},
    },

    /*
     * -----------------------------------------------------------------------
     * Meeting 3
     * Upcoming meeting with recording enabled
     * -----------------------------------------------------------------------
     */
    {
      id: 'm3',

      title: 'Customer sync',

      start: at(150),
      end: at(180),

      platform: 'Zoom',

      link:
        'https://zoom.us/j/123456789',

      participants: [
        {
          ...me,
          attended: null,
        },
        {
          ...PEOPLE[1],
          attended: null,
        },
        {
          ...PEOPLE[4],
          attended: null,
        },
      ],

      meetAI: {
        invited: true,
        attended: false,
      },

      recording: {
        available: false,
        duration: null,
      },

      transcript: {
        available: false,
        text: null,
      },

      meetingSummary: null,

      actionItems: [],

      attendanceDetails: {},
    },

    /*
     * -----------------------------------------------------------------------
     * Meeting 4
     * Upcoming meeting without MeetAI
     * -----------------------------------------------------------------------
     */
    {
      id: 'm4',

      title: '1:1 with Meera',

      start: at(270),
      end: at(300),

      platform: 'Google Meet',

      link:
        'https://meet.google.com/xyz-uvwx-rst',

      participants: [
        {
          ...me,
          attended: null,
        },
        {
          ...PEOPLE[3],
          attended: null,
        },
      ],

      meetAI: {
        invited: false,
        attended: false,
      },

      recording: {
        available: false,
        duration: null,
      },

      transcript: {
        available: false,
        text: null,
      },

      meetingSummary: null,

      actionItems: [],

      attendanceDetails: {},
    },
  ]
}

/*
 * ---------------------------------------------------------------------------
 * Dashboard action items
 * ---------------------------------------------------------------------------
 */

export function getActionItems() {
  return [
    {
      id: 'a1',
      title:
        'Share the revised commissioning timeline',
      meeting: 'Sprint planning',
      due: 'Today',
    },

    {
      id: 'a2',
      title:
        'Review the vendor proposal',
      meeting: 'Customer sync',
      due: 'Tomorrow',
    },

    {
      id: 'a3',
      title:
        'Update the site safety checklist',
      meeting: 'Weekly design review',
      due: 'Friday',
    },

    {
      id: 'a4',
      title:
        'Send MoM to the design team',
      meeting: 'Weekly design review',
      due: 'Friday',
    },
  ]
}