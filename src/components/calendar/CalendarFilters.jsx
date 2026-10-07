import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'

const FILTERS = [
  'All',
  'Live',
  'Upcoming',
  'Done',
]

export default function CalendarFilters({
  value,
  onChange,
}) {
  return (
    <Stack
      direction="row"
      spacing={0.75}
      sx={{ mb: 1.5 }}
    >
      {FILTERS.map((filter) => {
        const selected = value === filter

        return (
          <Button
            key={filter}
            size="small"
            variant={selected ? 'contained' : 'outlined'}
            onClick={() => onChange(filter)}
            sx={{
              minWidth: 55,
              px: 1.25,
              py: 0.4,
              textTransform: 'none',
              fontSize: '0.72rem',
              fontWeight: 600,
            }}
          >
            {filter}
          </Button>
        )
      })}
    </Stack>
  )
}