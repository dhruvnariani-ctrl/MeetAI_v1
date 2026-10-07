/*
 * Icons are STRINGS and must match a key in TOUR_ICONS (TourRunner.jsx).
 * Only targets that really exist in the Dashboard are listed here.
 */
export const DASHBOARD_TOUR_STEPS = [
  {
    path: '/',
    target: '[data-tour="dashboard-welcome"]',
    title: 'Welcome to your dashboard',
    icon: 'Today',
    body:
      'This is your main MeetAI screen. It gives you a quick overview of your meetings, upcoming events, and tasks that need your attention.',
    action: 'Take a moment to look at the information on your dashboard.',
    tip: 'You can always return here when you want a quick overview of your day.',
  },

  {
    path: '/',
    target: '[data-tour="dashboard-todays-meetings"]',
    title: "Today's meetings",
    icon: 'CalendarMonth',
    body:
      'This section shows the meetings scheduled for today. You can quickly see what has already happened and what is coming next.',
    action: 'Look through the meetings shown here.',
    tip: 'Completed and upcoming meetings are shown differently so they are easier to recognise.',
  },

  {
    path: '/',
    target: '[data-tour="dashboard-next-meeting"]',
    title: 'Your next meeting',
    icon: 'EventAvailable',
    body:
      'This shows the meeting you need to pay attention to next, including its time and important meeting information.',
    action: 'Check the time of your next meeting.',
    tip: 'You do not need to open the full calendar just to see what is coming next.',
  },

  {
    path: '/',
    target: '[data-tour="dashboard-join-meeting"]',
    title: 'Join a meeting',
    icon: 'PlayCircleOutlined',
    body:
      'When it is time to join, use the Join button. It will open the meeting using its video platform.',
    action: 'Use the Join button when you are ready to enter a meeting.',
    tip: 'The meeting may open in Google Meet, Microsoft Teams, Zoom, or another supported platform.',
  },

  {
    path: '/',
    target: '[data-tour="dashboard-meetai-status"]',
    title: 'MeetAI status',
    icon: 'Mic',
    body:
      'These switches show whether MeetAI is invited to a meeting and whether video recording is on.',
    action: 'Select the switches to change MeetAI settings for a meeting.',
    tip: 'MeetAI is optional. You can decide whether to invite it for each meeting.',
  },

  {
    path: '/',
    target: '[data-tour="dashboard-action-items"]',
    title: 'Action items',
    icon: 'TaskAlt',
    body:
      'Action items are follow-up tasks from your meetings. This section helps you remember what needs to be done.',
    action: 'Look at the action items shown on the dashboard.',
    tip: 'You can open My Tasks to see all of your action items together.',
  },

  {
    path: '/',
    target: '[data-tour="dashboard-calendar-link"]',
    title: 'Open your calendar',
    icon: 'CalendarMonth',
    body:
      'The dashboard gives you a quick overview. Use View all meetings when you want to see your complete schedule.',
    action: 'Open the calendar.',
    tip: 'Calendar gives you Day, Week, and Month views.',
  },

  {
    path: '/',
    target: '[data-tour="dashboard-new-meeting"]',
    title: 'Create a new meeting',
    icon: 'EventAvailable',
    body:
      'Use Create new meeting when you want to schedule a meeting with other people.',
    action: 'Select Create new meeting to open the meeting form.',
    tip: 'You can add the title, date, time, participants, and MeetAI settings.',
    opensDialog: true,
  },
]