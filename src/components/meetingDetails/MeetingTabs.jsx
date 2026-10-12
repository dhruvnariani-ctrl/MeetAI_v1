import Paper from '@mui/material/Paper'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'

import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined'
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'

const TABS = [
  { value: 'overview', label: 'Overview', Icon: CalendarMonthOutlinedIcon },
  { value: 'recording', label: 'Recording', Icon: PlayArrowOutlinedIcon },
  { value: 'transcript', label: 'Transcript', Icon: DescriptionOutlinedIcon },
  { value: 'actions', label: 'Action items', Icon: TaskAltOutlinedIcon },
]

export const VALID_TABS = TABS.map((tab) => tab.value)

export default function MeetingTabs({ value, onChange }) {
  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid #dce3eb',
        borderRadius: 2.5,
        bgcolor: '#fff',
        overflow: 'hidden',
      }}
    >
      <Tabs
        value={value}
        onChange={onChange}
        variant="scrollable"
        scrollButtons={false}
        sx={{
          minHeight: 54,
          px: { xs: 0.5, sm: 1 },
          '& .MuiTab-root': {
            minHeight: 54,
            minWidth: { xs: 105, sm: 125 },
            textTransform: 'none',
            fontSize: '.78rem',
            fontWeight: 600,
            color: '#66778d',
          },
          '& .Mui-selected': { color: 'primary.main' },
          '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0' },
        }}
      >
        {TABS.map(({ value: tabValue, label, Icon }) => (
          <Tab
            key={tabValue}
            value={tabValue}
            label={label}
            icon={<Icon sx={{ fontSize: 18 }} />}
            iconPosition="start"
          />
        ))}
      </Tabs>
    </Paper>
  )
}