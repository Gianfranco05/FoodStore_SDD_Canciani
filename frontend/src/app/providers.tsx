import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { queryClient } from '../lib/queryClient'
import { ErrorBoundary } from './ErrorBoundary'
import { ThemeProvider } from './ThemeProvider'
import { ToastContainer } from '../shared/ui/Toast'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider>
            {children}
            <ToastContainer />
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
