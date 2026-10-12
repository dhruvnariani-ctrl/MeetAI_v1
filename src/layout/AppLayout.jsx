import {
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  Outlet,
  useLocation,
} from 'react-router-dom'

import Box from '@mui/material/Box'

import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import CompanionFab from '../components/CompanionFab'
import InstantJoinDialog from '../components/instant/InstantJoinDialog'
import CreateEventDialog from '../components/event/CreateEventDialog'

import { searchDirectory } from '../data/Directory'

import useCurrentUser from '../hooks/useCurrentUser'

export default function AppLayout() {
  // Sidebar starts expanded on desktop, closed on small screens
  const [navOpen, setNavOpen] =
    useState(() =>
      window.matchMedia(
        '(min-width: 900px)',
      ).matches,
    )

  const [query, setQuery] =
    useState('')

  const [lastSynced, setLastSynced] =
    useState(() => new Date())

  const [createOpen, setCreateOpen] =
    useState(false)

  const [createKey, setCreateKey] =
    useState(0)

  const [instantOpen, setInstantOpen] =
    useState(false)

  const [instantKey, setInstantKey] =
    useState(0)

  const currentUser =
    useCurrentUser()

  const mainRef = useRef(null)

  const { pathname } =
    useLocation()

  const firstRender =
    useRef(true)

  // After navigating, reset scroll and move focus to the new page so keyboard/screen-reader users start at the top.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }

    mainRef.current?.scrollTo(0, 0)
    mainRef.current?.focus()
  }, [pathname])

  const openCreate = () => {
    setCreateKey((k) => k + 1)
    setCreateOpen(true)
  }

  const openInstant = () => {
    setInstantKey((k) => k + 1)
    setInstantOpen(true)
  }

  const handleCreate = (event) => {
    console.log(
      'Create event',
      event,
    )

    setCreateOpen(false)
  }

  const handleRecord = (details) => {
    console.log(
      'Start recording',
      details,
    )

    setInstantOpen(false)
  }

  return (
    <Box
      sx={{
        position: 'relative',
        height: '100dvh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      <Box
        component="a"
        href="#main"
        sx={{
          position: 'absolute',
          left: 12,
          top: -60,
          zIndex: 2000,
          px: 2,
          py: 1.25,
          borderRadius: 2,
          bgcolor: 'text.primary',
          color: '#fff',
          '&:focus': {
            top: 12,
          },
        }}
      >
        Skip to main content
      </Box>

      <Header
        navOpen={navOpen}
        onToggleNav={() =>
          setNavOpen((o) => !o)
        }
        query={query}
        onQueryChange={setQuery}
      />

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
        }}
      >
        <Sidebar
          open={navOpen}
          onToggle={() =>
            setNavOpen((o) => !o)
          }
          onInstantJoin={openInstant}
          lastSynced={lastSynced}
          onSync={() =>
            setLastSynced(new Date())
          }
        />

        <Box
          component="main"
          id="main"
          ref={mainRef}
          tabIndex={-1}
          sx={{
            position: 'relative',
            flex: 1,
            minWidth: 0,
            overflow: 'auto',
            outline: 'none',
            bgcolor: '#fff',
            m: {
              xs: 0,
              md: '2px 2px 0 2px',
            },
            borderRadius: {
              xs: 0,
              md: '16px 16px 0 0',
            },
            border: {
              md: '1px solid #dde5ef',
            },
            px: '18px',
            pt: '14px',
            pb: 12,
          }}
        >
          <Outlet
            context={{
              openCreate,
              openInstant,
              currentUser,
              query,
            }}
          />
        </Box>
      </Box>

      <CreateEventDialog
        key={`create-${createKey}`}
        open={createOpen}
        onClose={() =>
          setCreateOpen(false)
        }
        onSubmit={handleCreate}
        currentUser={currentUser}
        searchDirectory={
          searchDirectory
        }
      />

      <InstantJoinDialog
        key={`instant-${instantKey}`}
        open={instantOpen}
        onClose={() =>
          setInstantOpen(false)
        }
        onSubmit={handleRecord}
        currentUser={currentUser}
        searchDirectory={
          searchDirectory
        }
      />

      <CompanionFab
        onClick={() =>
          console.log(
            'open companion',
          )
        }
      />
    </Box>
  )
}