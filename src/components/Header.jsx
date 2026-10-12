import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'

import MenuIcon from '@mui/icons-material/Menu'

import AccountMenu from './AccountMenu'
import HeaderSearch from './HeaderSearch'
import Logo from './Logo'
import { startAppTour } from './TourRunner'
import { APP_TOUR_STEPS } from '../data/tours'
import useCurrentUser from '../hooks/useCurrentUser'

// Header: sidebar toggle, logo, search and profile.
export default function Header({
  navOpen,
  onToggleNav,
  query,
  onQueryChange,
}) {
  const currentUser = useCurrentUser()

  const navLabel = navOpen
    ? 'Collapse navigation'
    : 'Expand navigation'

  return (
    <AppBar
      component="header"
      position="static"
      color="inherit"
      elevation={0}
      sx={{
        bgcolor: '#fff',
        borderBottom: '1px solid',
        borderColor: 'divider',
        overflow: 'visible',
      }}
    >
      <Toolbar
        variant="dense"
        disableGutters
        sx={{
          px: 1,
          gap: 2,
          overflow: 'visible',
        }}
      >
        {/* Sidebar toggle + logo */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: { md: 259 },
            flexShrink: 0,
          }}
        >
          <Tooltip title={navLabel}>
            <IconButton
              aria-label={navLabel}
              aria-expanded={navOpen}
              aria-controls="sidebar"
              onClick={onToggleNav}
              sx={{ color: 'primary.main' }}
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>

          <Box
            sx={{
              flex: 1,
              display: {
                xs: 'none',
                md: 'flex',
              },
              justifyContent: 'center',
            }}
          >
            <Logo />
          </Box>
        </Box>

        {/* Search */}
        <HeaderSearch
          query={query}
          onQueryChange={onQueryChange}
        />

        {/* Account */}
        <Box
          sx={{
            ml: 'auto',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <AccountMenu
            user={currentUser}
            onStartTour={() =>
              startAppTour(APP_TOUR_STEPS)
            }
          />
        </Box>
      </Toolbar>
    </AppBar>
  )
}