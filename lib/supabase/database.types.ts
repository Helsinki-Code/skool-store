export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          gradient: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon?: string | null
          gradient?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          icon?: string | null
          gradient?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          title: string
          subtitle: string | null
          slug: string
          description: string
          long_description: string | null
          price: number
          category_id: string | null
          features: Json | null
          image_url: string | null
          is_featured: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          subtitle?: string | null
          slug: string
          description: string
          long_description?: string | null
          price: number
          category_id?: string | null
          features?: Json | null
          image_url?: string | null
          is_featured?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          subtitle?: string | null
          slug?: string
          description?: string
          long_description?: string | null
          price?: number
          category_id?: string | null
          features?: Json | null
          image_url?: string | null
          is_featured?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          status: string
          total_amount: number
          payment_intent_id: string | null
          checkout_session_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          status?: string
          total_amount: number
          payment_intent_id?: string | null
          checkout_session_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          status?: string
          total_amount?: number
          payment_intent_id?: string | null
          checkout_session_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity?: number
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
          created_at?: string
        }
      }
      user_products: {
        Row: {
          id: string
          user_id: string
          product_id: string
          order_id: string | null
          purchased_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          order_id?: string | null
          purchased_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          order_id?: string | null
          purchased_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

