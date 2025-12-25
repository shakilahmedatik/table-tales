import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/clerk-react'
import * as Sentry from '@sentry/react'
import { BrowserRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Clerk setup
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
if (!PUBLISHABLE_KEY) {
  throw new Error(
    'Missing VITE_CLERK_PUBLISHABLE_KEY. Add your Clerk Publishable Key to .env.local'
  )
}

// Sentry setup
const dsn = import.meta.env.VITE_SENTRY_DSN
if (!dsn) {
  throw new Error('Missing VITE_SENTRY_DSN. Add your Sentry DSN to .env.local')
}
Sentry.init({
  dsn,
  sendDefaultPii: true,
  integrations: [Sentry.replayIntegration()],
  replaysSessionSampleRate:
    import.meta.env.VITE_NODE_ENV === 'development' ? 1.0 : 0.1,
  replaysOnErrorSampleRate: 1.0,
})

// Tanstack Query setup
const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </ClerkProvider>
    </BrowserRouter>
  </StrictMode>
)
