export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      author_licenses: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          license_key: string
          order_id: string | null
          product_id: string
          seats: number
          status: Database["public"]["Enums"]["author_license_status"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          license_key: string
          order_id?: string | null
          product_id: string
          seats?: number
          status?: Database["public"]["Enums"]["author_license_status"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          license_key?: string
          order_id?: string | null
          product_id?: string
          seats?: number
          status?: Database["public"]["Enums"]["author_license_status"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "author_licenses_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "author_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "author_licenses_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "author_products"
            referencedColumns: ["id"]
          },
        ]
      }
      author_orders: {
        Row: {
          amount_cents: number
          buyer_email: string | null
          buyer_id: string | null
          buyer_name: string | null
          created_at: string
          currency: string
          id: string
          metadata: Json
          product_id: string
          status: Database["public"]["Enums"]["author_order_status"]
          updated_at: string
        }
        Insert: {
          amount_cents?: number
          buyer_email?: string | null
          buyer_id?: string | null
          buyer_name?: string | null
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json
          product_id: string
          status?: Database["public"]["Enums"]["author_order_status"]
          updated_at?: string
        }
        Update: {
          amount_cents?: number
          buyer_email?: string | null
          buyer_id?: string | null
          buyer_name?: string | null
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json
          product_id?: string
          status?: Database["public"]["Enums"]["author_order_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "author_orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "author_products"
            referencedColumns: ["id"]
          },
        ]
      }
      author_payouts: {
        Row: {
          amount_cents: number
          created_at: string
          currency: string
          id: string
          owner_id: string
          period_end: string | null
          period_start: string | null
          processed_at: string | null
          status: Database["public"]["Enums"]["author_payout_status"]
          updated_at: string
        }
        Insert: {
          amount_cents?: number
          created_at?: string
          currency?: string
          id?: string
          owner_id: string
          period_end?: string | null
          period_start?: string | null
          processed_at?: string | null
          status?: Database["public"]["Enums"]["author_payout_status"]
          updated_at?: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          currency?: string
          id?: string
          owner_id?: string
          period_end?: string | null
          period_start?: string | null
          processed_at?: string | null
          status?: Database["public"]["Enums"]["author_payout_status"]
          updated_at?: string
        }
        Relationships: []
      }
      author_product_versions: {
        Row: {
          changelog: string | null
          created_at: string
          download_url: string | null
          file_size: number | null
          id: string
          product_id: string
          released_at: string
          updated_at: string
          version: string
        }
        Insert: {
          changelog?: string | null
          created_at?: string
          download_url?: string | null
          file_size?: number | null
          id?: string
          product_id: string
          released_at?: string
          updated_at?: string
          version: string
        }
        Update: {
          changelog?: string | null
          created_at?: string
          download_url?: string | null
          file_size?: number | null
          id?: string
          product_id?: string
          released_at?: string
          updated_at?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "author_product_versions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "author_products"
            referencedColumns: ["id"]
          },
        ]
      }
      author_products: {
        Row: {
          category: string | null
          cover_url: string | null
          created_at: string
          currency: string
          description: string | null
          id: string
          metadata: Json
          name: string
          owner_id: string
          price_cents: number
          slug: string
          status: Database["public"]["Enums"]["author_product_status"]
          updated_at: string
        }
        Insert: {
          category?: string | null
          cover_url?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          metadata?: Json
          name: string
          owner_id: string
          price_cents?: number
          slug: string
          status?: Database["public"]["Enums"]["author_product_status"]
          updated_at?: string
        }
        Update: {
          category?: string | null
          cover_url?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          metadata?: Json
          name?: string
          owner_id?: string
          price_cents?: number
          slug?: string
          status?: Database["public"]["Enums"]["author_product_status"]
          updated_at?: string
        }
        Relationships: []
      }
      author_revenue_events: {
        Row: {
          amount_cents: number
          created_at: string
          currency: string
          id: string
          metadata: Json
          occurred_at: string
          owner_id: string
          product_id: string | null
          source: string
        }
        Insert: {
          amount_cents?: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json
          occurred_at?: string
          owner_id: string
          product_id?: string | null
          source?: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json
          occurred_at?: string
          owner_id?: string
          product_id?: string | null
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "author_revenue_events_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "author_products"
            referencedColumns: ["id"]
          },
        ]
      }
      author_reviews: {
        Row: {
          body: string | null
          created_at: string
          id: string
          product_id: string
          rating: number
          reviewer_id: string
          title: string | null
          updated_at: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          product_id: string
          rating: number
          reviewer_id: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          product_id?: string
          rating?: number
          reviewer_id?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "author_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "author_products"
            referencedColumns: ["id"]
          },
        ]
      }
      author_subscription_renewals: {
        Row: {
          amount_cents: number
          created_at: string
          currency: string
          id: string
          renewed_at: string
          status: Database["public"]["Enums"]["author_order_status"]
          subscription_id: string
        }
        Insert: {
          amount_cents?: number
          created_at?: string
          currency?: string
          id?: string
          renewed_at?: string
          status?: Database["public"]["Enums"]["author_order_status"]
          subscription_id: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          currency?: string
          id?: string
          renewed_at?: string
          status?: Database["public"]["Enums"]["author_order_status"]
          subscription_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "author_subscription_renewals_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "author_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      author_subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          customer_email: string | null
          customer_id: string | null
          id: string
          mrr_cents: number
          plan: string
          product_id: string
          status: Database["public"]["Enums"]["author_subscription_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          customer_email?: string | null
          customer_id?: string | null
          id?: string
          mrr_cents?: number
          plan?: string
          product_id: string
          status?: Database["public"]["Enums"]["author_subscription_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          customer_email?: string | null
          customer_id?: string | null
          id?: string
          mrr_cents?: number
          plan?: string
          product_id?: string
          status?: Database["public"]["Enums"]["author_subscription_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "author_subscriptions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "author_products"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_to: string | null
          company: string | null
          created_at: string
          email: string | null
          estimated_value: number
          id: string
          name: string
          notes: string | null
          owner_id: string
          phone: string | null
          source: Database["public"]["Enums"]["lead_source"]
          status: Database["public"]["Enums"]["lead_status"]
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          estimated_value?: number
          id?: string
          name: string
          notes?: string | null
          owner_id: string
          phone?: string | null
          source?: Database["public"]["Enums"]["lead_source"]
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          estimated_value?: number
          id?: string
          name?: string
          notes?: string | null
          owner_id?: string
          phone?: string | null
          source?: Database["public"]["Enums"]["lead_source"]
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      sales_invoices: {
        Row: {
          assigned_to: string | null
          created_at: string
          currency: string
          customer_company: string | null
          customer_email: string | null
          customer_name: string
          due_date: string | null
          id: string
          line_items: Json
          notes: string | null
          number: string
          order_id: string | null
          owner_id: string
          paid_at: string | null
          status: Database["public"]["Enums"]["invoice_status"]
          subtotal: number
          tax: number
          total: number
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          currency?: string
          customer_company?: string | null
          customer_email?: string | null
          customer_name: string
          due_date?: string | null
          id?: string
          line_items?: Json
          notes?: string | null
          number: string
          order_id?: string | null
          owner_id: string
          paid_at?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          subtotal?: number
          tax?: number
          total?: number
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          currency?: string
          customer_company?: string | null
          customer_email?: string | null
          customer_name?: string
          due_date?: string | null
          id?: string
          line_items?: Json
          notes?: string | null
          number?: string
          order_id?: string | null
          owner_id?: string
          paid_at?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          subtotal?: number
          tax?: number
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_invoices_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "sales_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_orders: {
        Row: {
          assigned_to: string | null
          created_at: string
          currency: string
          customer_company: string | null
          customer_email: string | null
          customer_name: string
          id: string
          line_items: Json
          notes: string | null
          number: string
          owner_id: string
          quote_id: string | null
          status: Database["public"]["Enums"]["order_status"]
          subtotal: number
          tax: number
          total: number
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          currency?: string
          customer_company?: string | null
          customer_email?: string | null
          customer_name: string
          id?: string
          line_items?: Json
          notes?: string | null
          number: string
          owner_id: string
          quote_id?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          tax?: number
          total?: number
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          currency?: string
          customer_company?: string | null
          customer_email?: string | null
          customer_name?: string
          id?: string
          line_items?: Json
          notes?: string | null
          number?: string
          owner_id?: string
          quote_id?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          tax?: number
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_orders_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "sales_quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_quotes: {
        Row: {
          assigned_to: string | null
          created_at: string
          currency: string
          customer_company: string | null
          customer_email: string | null
          customer_name: string
          id: string
          line_items: Json
          notes: string | null
          number: string
          owner_id: string
          status: Database["public"]["Enums"]["quote_status"]
          subtotal: number
          tax: number
          total: number
          updated_at: string
          valid_until: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          currency?: string
          customer_company?: string | null
          customer_email?: string | null
          customer_name: string
          id?: string
          line_items?: Json
          notes?: string | null
          number: string
          owner_id: string
          status?: Database["public"]["Enums"]["quote_status"]
          subtotal?: number
          tax?: number
          total?: number
          updated_at?: string
          valid_until?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          currency?: string
          customer_company?: string | null
          customer_email?: string | null
          customer_name?: string
          id?: string
          line_items?: Json
          notes?: string | null
          number?: string
          owner_id?: string
          status?: Database["public"]["Enums"]["quote_status"]
          subtotal?: number
          tax?: number
          total?: number
          updated_at?: string
          valid_until?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "manager" | "sales_rep"
      author_license_status: "active" | "expired" | "revoked" | "suspended"
      author_order_status:
        | "pending"
        | "paid"
        | "refunded"
        | "failed"
        | "cancelled"
      author_payout_status: "pending" | "processing" | "paid" | "failed"
      author_product_status: "draft" | "review" | "published" | "archived"
      author_subscription_status:
        | "trialing"
        | "active"
        | "past_due"
        | "cancelled"
        | "expired"
      invoice_status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
      lead_source:
        | "website"
        | "referral"
        | "cold_outreach"
        | "event"
        | "ad"
        | "other"
      lead_status:
        | "new"
        | "contacted"
        | "qualified"
        | "proposal"
        | "won"
        | "lost"
      order_status:
        | "pending"
        | "processing"
        | "shipped"
        | "completed"
        | "cancelled"
      quote_status: "draft" | "sent" | "accepted" | "rejected" | "expired"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "manager", "sales_rep"],
      author_license_status: ["active", "expired", "revoked", "suspended"],
      author_order_status: [
        "pending",
        "paid",
        "refunded",
        "failed",
        "cancelled",
      ],
      author_payout_status: ["pending", "processing", "paid", "failed"],
      author_product_status: ["draft", "review", "published", "archived"],
      author_subscription_status: [
        "trialing",
        "active",
        "past_due",
        "cancelled",
        "expired",
      ],
      invoice_status: ["draft", "sent", "paid", "overdue", "cancelled"],
      lead_source: [
        "website",
        "referral",
        "cold_outreach",
        "event",
        "ad",
        "other",
      ],
      lead_status: ["new", "contacted", "qualified", "proposal", "won", "lost"],
      order_status: [
        "pending",
        "processing",
        "shipped",
        "completed",
        "cancelled",
      ],
      quote_status: ["draft", "sent", "accepted", "rejected", "expired"],
    },
  },
} as const
