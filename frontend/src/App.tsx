import { RouterProvider } from '@tanstack/react-router'
import { router } from '@/lib/router'
import { HelmetProvider } from 'react-helmet-async'

function App() {
  return (
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  )
}

export default App
