import { useState } from 'react'

import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'

import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

const dropdownButtonSx = {
  minWidth: { xs: '100%', sm: 130 },
  justifyContent: 'space-between',
  textTransform: 'none',
  fontSize: '0.8rem',
  fontWeight: 500,
  color: 'text.primary',
  borderColor: '#d6dee8',
  whiteSpace: 'nowrap',
  '&:hover': { borderColor: '#aebaca', bgcolor: '#f8fafc' },
}

/* Search box + date filter menu + sort menu. */
export default function RecordedFilters({
  search,
  onSearchChange,
  dateFilters,
  dateFilter,
  onDateFilterChange,
  sortOptions,
  sortBy,
  onSortChange,
}) {
  const [dateAnchorEl, setDateAnchorEl] = useState(null)
  const [sortAnchorEl, setSortAnchorEl] = useState(null)

  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid #dce3eb',
        borderRadius: 2.5,
        bgcolor: '#fff',
        p: { xs: 1.5, sm: 2 },
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.25}
      >
        {/* Search */}
        <TextField
          data-tour="recorded-search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search meetings or people"
          size="small"
          fullWidth
          Inputprops={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon sx={{ fontSize: 20, color: '#7b8ba1' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: '0.82rem' },
          }}
        />

        {/* Date filter */}
        <Button
          data-tour="recorded-filters"
          size="small"
          variant="outlined"
          endIcon={<KeyboardArrowDownIcon />}
          onClick={(event) => setDateAnchorEl(event.currentTarget)}
          sx={dropdownButtonSx}
        >
          {dateFilter}
        </Button>

        <Menu
          anchorEl={dateAnchorEl}
          open={Boolean(dateAnchorEl)}
          onClose={() => setDateAnchorEl(null)}
        >
          {dateFilters.map((item) => (
            <MenuItem
              key={item}
              selected={dateFilter === item}
              onClick={() => {
                onDateFilterChange(item)
                setDateAnchorEl(null)
              }}
              sx={{ minWidth: 160, minHeight: 42, fontSize: '0.85rem' }}
            >
              {item}
            </MenuItem>
          ))}
        </Menu>

        {/* Sort */}
        <Button
          data-tour="recorded-sort"
          size="small"
          variant="outlined"
          endIcon={<KeyboardArrowDownIcon />}
          onClick={(event) => setSortAnchorEl(event.currentTarget)}
          sx={dropdownButtonSx}
        >
          Sort: {sortBy}
        </Button>

        <Menu
          anchorEl={sortAnchorEl}
          open={Boolean(sortAnchorEl)}
          onClose={() => setSortAnchorEl(null)}
        >
          {sortOptions.map((item) => (
            <MenuItem
              key={item}
              selected={sortBy === item}
              onClick={() => {
                onSortChange(item)
                setSortAnchorEl(null)
              }}
              sx={{ minWidth: 175, minHeight: 42, fontSize: '0.85rem' }}
            >
              {item}
            </MenuItem>
          ))}
        </Menu>
      </Stack>
    </Paper>
  )
}