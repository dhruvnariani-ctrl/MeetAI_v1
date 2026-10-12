import { useState } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

import SlidingSegmented from '../SlidingSegmented'

/*
 * Status filters with a shared sliding highlight
 * on the left, and sort menu on the right.
 */
export default function TaskFilters({
  filters,
  filter,
  onFilterChange,
  sortOptions,
  sortBy,
  onSortChange,
}) {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleSortChange = (value) => {
    onSortChange(value)
    setAnchorEl(null)
  }

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
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
          width: '100%',
          px: {
            xs: 1,
            sm: 1.25,
          },
          py: 0.75,
        }}
      >
        {/* Status filters */}
        <Box
          data-tour="tasks-filters"
          sx={{
            minWidth: 0,
            flexShrink: 1,
            overflow: 'hidden',
          }}
        >
          <SlidingSegmented
            value={filter}
            onChange={onFilterChange}
            options={filters}
            ariaLabel="Task status filter"
            size="regular"
          />
        </Box>

        {/* Sort */}
        <Box
          sx={{
            flexShrink: 0,
            ml: 'auto',
          }}
        >
          <Button
            data-tour="tasks-sort"
            size="small"
            variant="outlined"
            endIcon={
              <KeyboardArrowDownIcon
                sx={{ fontSize: 18 }}
              />
            }
            onClick={(event) =>
              setAnchorEl(event.currentTarget)
            }
            sx={{
              minWidth: {
                xs: 130,
                sm: 150,
              },
              height: {
                xs: 38,
                sm: 40,
              },
              px: {
                xs: 1.25,
                sm: 1.5,
              },
              justifyContent: 'space-between',
              textTransform: 'none',
              fontSize: {
                xs: '0.74rem',
                sm: '0.8rem',
              },
              fontWeight: 500,
              color: '#243b5a',
              bgcolor: '#fff',
              borderColor: '#d6dee8',
              borderRadius: 1.75,
              whiteSpace: 'nowrap',

              '&:hover': {
                bgcolor: '#fff',
                borderColor: '#c5d0dc',
                color: '#243b5a',
              },
            }}
          >
            Sort: {sortBy}
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            {sortOptions.map((item) => (
              <MenuItem
                key={item}
                selected={sortBy === item}
                onClick={() => handleSortChange(item)}
                sx={{
                  minWidth: 170,
                  minHeight: 40,
                  fontSize: '0.82rem',
                }}
              >
                {item}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Box>
    </Paper>
  )
}