import { useId } from 'react'
import { Link as RouterLink } from 'react-router-dom'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

export function ActionItemList({ items }) {
  return (
    <Box
      component="ul"
      role="list"
      sx={{
        listStyle: 'none',
        m: 0,
        p: 0,
        display: 'grid',
        gap: 1.25,
      }}
    >
      {items.map((item) => (
        <Box
          component="li"
          key={item.id}
          sx={{
            display: 'flex',
            gap: 1,
            alignItems: 'flex-start',
          }}
        >
          <RadioButtonUncheckedIcon
            sx={{
              fontSize: 18,
              mt: '2px',
              color: 'text.secondary',
              flexShrink: 0,
            }}
            aria-hidden="true"
          />

          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: '0.875rem',
                fontWeight: 600,
                lineHeight: 1.35,
              }}
            >
              {item.title}
            </Typography>

            <Typography
              sx={{
                fontSize: '0.8125rem',
                color: 'text.secondary',
              }}
            >
              {item.meeting}
              {item.due ? ` · Due ${item.due}` : ''}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  )
}

export default function ActionItemsCard({
  items = [],
  limit = 3,
}) {
  const headingId = useId()

  const visibleItems = items.slice(0, limit)

  return (
    <Paper
      data-tour="dashboard-action-items"
      component="section"
      aria-labelledby={headingId}
      variant="outlined"
      sx={{
        p: 2.5,
        borderRadius: '20px',
        bgcolor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          mb: 1.5,
        }}
      >
        <Typography
          id={headingId}
          component="h2"
          sx={{
            fontSize: '1rem',
            fontWeight: 700,
          }}
        >
          Action items
        </Typography>

        <Button
          component={RouterLink}
          to="/tasks"
          size="small"
          endIcon={
            <ArrowForwardIcon sx={{ fontSize: 16 }} />
          }
          sx={{
            pt: 0,
            alignSelf: 'flex-start',
            fontSize: '0.8125rem',
            fontWeight: 500,
            textTransform: 'none',
          }}
        >
          View all tasks
        </Button>
      </Box>

      {visibleItems.length === 0 ? (
        <Typography
          sx={{
            color: 'text.secondary',
          }}
        >
          You&apos;re all caught up.
        </Typography>
      ) : (
        <ActionItemList items={visibleItems} />
      )}
    </Paper>
  )
}