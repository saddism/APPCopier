import { RouterProvider } from '@tanstack/react-router'
import { router } from '@/lib/router'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from '@/providers/AuthProvider'

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </HelmetProvider>
  )
}

export default App
