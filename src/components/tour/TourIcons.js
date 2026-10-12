import {
  CalendarMonth,
  CheckCircle,
  EventAvailable,
  FilterList,
  Groups,
  HelpOutlined,
  Lightbulb,
  Mic,
  PlayCircleOutlined,
  Search,
  TaskAlt,
  Today,
  VideoLibrary,
} from '@mui/icons-material'
const TOUR_ICONS = {
  Today,
  CalendarMonth,
  CheckCircle,
  EventAvailable,
  FilterList,
  Groups,
  HelpOutlined,
  Lightbulb,
  Mic,
  PlayCircleOutlined,
  TaskAlt,
  VideoLibrary,
  Search
}

export const getTourIcon = (name) => TOUR_ICONS[name] || Lightbulb