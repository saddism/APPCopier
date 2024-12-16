import React from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthContext } from '../providers/AuthProvider'
import { VideoUploader } from '../components/VideoUploader'
import { Helmet } from 'react-helmet-async'
import { Link } from '@tanstack/react-router'

interface RouteContext {
  auth: {
    isAuthenticated: boolean
  }
}

export const dashboardRoute = createFileRoute('/dashboard')({
  beforeLoad: ({ context }: { context: RouteContext }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/auth',
        search: {
          redirect: '/dashboard',
        },
      })
    }
  },
  component: () => {
    const { user } = useAuthContext()

    return (
      <>
        <Helmet>
          <title>控制台 - APP视频分析系统</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-center mb-6">视频分析控制台</h1>
          <VideoUploader />
        </div>
      </>
    )
  },
})
