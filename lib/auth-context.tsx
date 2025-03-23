"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Session, User } from "@supabase/supabase-js"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null; data: any | null }>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

// Create a default context value
const defaultAuthContext: AuthContextType = {
  user: null,
  session: null,
  isLoading: true,
  signIn: async () => ({ error: new Error("Supabase client not initialized"), data: null }),
  signUp: async () => {},
  signOut: async () => {},
}

const AuthContext = createContext<AuthContextType>(defaultAuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [supabase, setSupabase] = useState<any>(null)

  useEffect(() => {
    // Initialize Supabase client on the client side
    try {
      if (typeof window !== "undefined") {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseAnonKey) {
          console.error("Supabase environment variables are missing")
          setIsLoading(false)
          return
        }

        const client = createClient<Database>(supabaseUrl, supabaseAnonKey)
        setSupabase(client)

        // Get initial session
        client.auth.getSession().then(({ data: { session } }) => {
          setSession(session)
          setUser(session?.user ?? null)
          setIsLoading(false)
        })

        // Set up auth state listener
        const {
          data: { subscription },
        } = client.auth.onAuthStateChange((_event, session) => {
          setSession(session)
          setUser(session?.user ?? null)
          setIsLoading(false)
        })

        return () => {
          subscription.unsubscribe()
        }
      }
    } catch (error) {
      console.error("Failed to initialize Supabase client:", error)
      setIsLoading(false)
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!supabase) return { error: new Error("Supabase client not initialized"), data: null }

    try {
      console.log("Attempting to sign in with:", email)
      const response = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log("Sign in response:", JSON.stringify(response))
      return response
    } catch (error) {
      console.error("Error signing in:", error)
      return { error, data: null }
    }
  }

  const signUp = async (email: string, password: string) => {
    if (!supabase) return

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error
    } catch (error) {
      console.error("Error signing up:", error)
      throw error
    }
  }

  const signOut = async () => {
    if (!supabase) return

    try {
      const { error } = await supabase.auth.signOut()

      if (error) throw error
    } catch (error) {
      console.error("Error signing out:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

