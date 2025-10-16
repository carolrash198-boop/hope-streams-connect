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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author_id: string | null
          content: string
          created_at: string | null
          excerpt: string | null
          featured_image_url: string | null
          id: string
          is_published: boolean | null
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          created_at: string | null
          created_by: string | null
          current_amount: number | null
          description: string | null
          end_date: string | null
          featured_image_url: string | null
          goal_amount: number | null
          id: string
          is_active: boolean | null
          slug: string
          start_date: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          current_amount?: number | null
          description?: string | null
          end_date?: string | null
          featured_image_url?: string | null
          goal_amount?: number | null
          id?: string
          is_active?: boolean | null
          slug: string
          start_date?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          current_amount?: number | null
          description?: string | null
          end_date?: string | null
          featured_image_url?: string | null
          goal_amount?: number | null
          id?: string
          is_active?: boolean | null
          slug?: string
          start_date?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string | null
          email: string
          first_name: string
          follow_up_notes: string | null
          id: string
          inquiry_type: string | null
          is_urgent: boolean | null
          last_name: string
          message: string
          phone: string | null
          preferred_contact: string | null
          status: string | null
          subject: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name: string
          follow_up_notes?: string | null
          id?: string
          inquiry_type?: string | null
          is_urgent?: boolean | null
          last_name: string
          message: string
          phone?: string | null
          preferred_contact?: string | null
          status?: string | null
          subject: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string
          follow_up_notes?: string | null
          id?: string
          inquiry_type?: string | null
          is_urgent?: boolean | null
          last_name?: string
          message?: string
          phone?: string | null
          preferred_contact?: string | null
          status?: string | null
          subject?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      donations: {
        Row: {
          amount: number
          campaign_id: string | null
          created_at: string | null
          currency: string | null
          donor_email: string | null
          donor_first_name: string | null
          donor_last_name: string | null
          id: string
          is_anonymous: boolean | null
          is_recurring: boolean | null
          payment_method: string | null
          recurrence_interval: string | null
          status: string | null
          stripe_payment_id: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          campaign_id?: string | null
          created_at?: string | null
          currency?: string | null
          donor_email?: string | null
          donor_first_name?: string | null
          donor_last_name?: string | null
          id?: string
          is_anonymous?: boolean | null
          is_recurring?: boolean | null
          payment_method?: string | null
          recurrence_interval?: string | null
          status?: string | null
          stripe_payment_id?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          campaign_id?: string | null
          created_at?: string | null
          currency?: string | null
          donor_email?: string | null
          donor_first_name?: string | null
          donor_last_name?: string | null
          id?: string
          is_anonymous?: boolean | null
          is_recurring?: boolean | null
          payment_method?: string | null
          recurrence_interval?: string | null
          status?: string | null
          stripe_payment_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      event_registrations: {
        Row: {
          created_at: string | null
          email: string
          event_id: string
          first_name: string
          id: string
          is_volunteer: boolean | null
          last_name: string
          notes: string | null
          phone: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          event_id: string
          first_name: string
          id?: string
          is_volunteer?: boolean | null
          last_name: string
          notes?: string | null
          phone?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          event_id?: string
          first_name?: string
          id?: string
          is_volunteer?: boolean | null
          last_name?: string
          notes?: string | null
          phone?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          capacity: number | null
          created_at: string | null
          created_by: string | null
          current_registrations: number | null
          description: string | null
          end_date: string | null
          featured_image_url: string | null
          id: string
          is_recurring: boolean | null
          location: string | null
          location_map_url: string | null
          recurrence_pattern: string | null
          registration_required: boolean | null
          slug: string
          start_date: string
          status: Database["public"]["Enums"]["event_status"] | null
          title: string
          updated_at: string | null
          volunteer_slots_needed: number | null
        }
        Insert: {
          capacity?: number | null
          created_at?: string | null
          created_by?: string | null
          current_registrations?: number | null
          description?: string | null
          end_date?: string | null
          featured_image_url?: string | null
          id?: string
          is_recurring?: boolean | null
          location?: string | null
          location_map_url?: string | null
          recurrence_pattern?: string | null
          registration_required?: boolean | null
          slug: string
          start_date: string
          status?: Database["public"]["Enums"]["event_status"] | null
          title: string
          updated_at?: string | null
          volunteer_slots_needed?: number | null
        }
        Update: {
          capacity?: number | null
          created_at?: string | null
          created_by?: string | null
          current_registrations?: number | null
          description?: string | null
          end_date?: string | null
          featured_image_url?: string | null
          id?: string
          is_recurring?: boolean | null
          location?: string | null
          location_map_url?: string | null
          recurrence_pattern?: string | null
          registration_required?: boolean | null
          slug?: string
          start_date?: string
          status?: Database["public"]["Enums"]["event_status"] | null
          title?: string
          updated_at?: string | null
          volunteer_slots_needed?: number | null
        }
        Relationships: []
      }
      gallery_items: {
        Row: {
          album: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          event_date: string | null
          id: string
          image_url: string
          is_featured: boolean | null
          photographer: string | null
          tags: string[] | null
          title: string
        }
        Insert: {
          album?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          event_date?: string | null
          id?: string
          image_url: string
          is_featured?: boolean | null
          photographer?: string | null
          tags?: string[] | null
          title: string
        }
        Update: {
          album?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          event_date?: string | null
          id?: string
          image_url?: string
          is_featured?: boolean | null
          photographer?: string | null
          tags?: string[] | null
          title?: string
        }
        Relationships: []
      }
      prayer_requests: {
        Row: {
          created_at: string | null
          email: string | null
          first_name: string
          follow_up_notes: string | null
          id: string
          is_urgent: boolean | null
          message: string
          status: Database["public"]["Enums"]["prayer_status"] | null
          subject: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          first_name: string
          follow_up_notes?: string | null
          id?: string
          is_urgent?: boolean | null
          message: string
          status?: Database["public"]["Enums"]["prayer_status"] | null
          subject: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          first_name?: string
          follow_up_notes?: string | null
          id?: string
          is_urgent?: boolean | null
          message?: string
          status?: Database["public"]["Enums"]["prayer_status"] | null
          subject?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      sermons: {
        Row: {
          audio_url: string | null
          created_at: string | null
          created_by: string | null
          date: string
          download_count: number | null
          duration_minutes: number | null
          featured_image_url: string | null
          format: Database["public"]["Enums"]["sermon_format"] | null
          id: string
          is_featured: boolean | null
          is_published: boolean | null
          preacher: string
          scripture_passages: string[] | null
          seo_description: string | null
          seo_title: string | null
          series: string | null
          show_notes: string | null
          slug: string
          tags: string[] | null
          title: string
          transcript: string | null
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          audio_url?: string | null
          created_at?: string | null
          created_by?: string | null
          date: string
          download_count?: number | null
          duration_minutes?: number | null
          featured_image_url?: string | null
          format?: Database["public"]["Enums"]["sermon_format"] | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          preacher: string
          scripture_passages?: string[] | null
          seo_description?: string | null
          seo_title?: string | null
          series?: string | null
          show_notes?: string | null
          slug: string
          tags?: string[] | null
          title: string
          transcript?: string | null
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          audio_url?: string | null
          created_at?: string | null
          created_by?: string | null
          date?: string
          download_count?: number | null
          duration_minutes?: number | null
          featured_image_url?: string | null
          format?: Database["public"]["Enums"]["sermon_format"] | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          preacher?: string
          scripture_passages?: string[] | null
          seo_description?: string | null
          seo_title?: string | null
          series?: string | null
          show_notes?: string | null
          slug?: string
          tags?: string[] | null
          title?: string
          transcript?: string | null
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
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
      app_role: "admin" | "moderator" | "user"
      event_status: "draft" | "published" | "cancelled"
      prayer_status: "pending" | "public" | "confidential" | "follow_up_needed"
      sermon_format: "audio" | "video" | "both"
      user_role:
        | "super_admin"
        | "content_editor"
        | "media_manager"
        | "finance"
        | "volunteer_coordinator"
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
      app_role: ["admin", "moderator", "user"],
      event_status: ["draft", "published", "cancelled"],
      prayer_status: ["pending", "public", "confidential", "follow_up_needed"],
      sermon_format: ["audio", "video", "both"],
      user_role: [
        "super_admin",
        "content_editor",
        "media_manager",
        "finance",
        "volunteer_coordinator",
      ],
    },
  },
} as const
