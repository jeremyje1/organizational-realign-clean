'use client'

import { useEffect, useState } from 'react'
import { Wifi, WifiOff, RefreshCw, Home, BookOpen, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    setIsOnline(navigator.onLine)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
    if (navigator.onLine) {
      window.location.reload()
    }
  }

  const handleGoHome = () => {
    window.location.href = '/'
  }

  if (isOnline) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
              <Wifi className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-white">Connection Restored!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-white/80 mb-6">
              Your internet connection has been restored. Redirecting you back to the application...
            </p>
            <Button onClick={handleGoHome} className="w-full bg-blue-600 hover:bg-blue-700">
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mb-4">
            <WifiOff className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-white">You&apos;re Offline</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white/80 text-center mb-6">
            It looks like you&apos;ve lost your internet connection. Some features may not be available until you&apos;re back online.
          </p>
          
          <div className="space-y-4">
            <Button 
              onClick={handleRetry} 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={retryCount > 3}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {retryCount > 3 ? 'Too many retries' : 'Try Again'}
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                onClick={handleGoHome}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/contact'}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Phone className="w-4 h-4 mr-2" />
                Contact
              </Button>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-white/5 rounded-lg">
            <h3 className="text-white font-medium mb-2 flex items-center">
              <BookOpen className="w-4 h-4 mr-2" />
              Available Offline
            </h3>
            <ul className="text-sm text-white/70 space-y-1">
              <li>• Previously viewed assessments</li>
              <li>• Cached reports and analytics</li>
              <li>• Basic navigation</li>
              <li>• Contact information</li>
            </ul>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-xs text-white/50">
              Your data will sync automatically when connection is restored
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
