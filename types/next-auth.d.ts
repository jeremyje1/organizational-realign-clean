import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      tier?: string
      features?: Record<string, any>
    } & DefaultSession['user']
  }

  interface User {
    id: string
    tier?: string
    features?: Record<string, any>
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    tier?: string
    features?: Record<string, any>
  }
}