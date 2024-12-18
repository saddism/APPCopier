import { RouterProvider } from '@tanstack/react-router'
import { router } from '@/lib/router'
import { HelmetProvider } from 'react-helmet-async'
import { Layout } from '@/components/Layout'

function App() {
  return (
    <HelmetProvider>
      <Layout>
        <RouterProvider router={router} />
      </Layout>
    </HelmetProvider>
  )
}

export default App
