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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string | null
          duration: number
          id: string
          notes: string | null
          service_name: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          duration?: number
          id?: string
          notes?: string | null
          service_name: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          duration?: number
          id?: string
          notes?: string | null
          service_name?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      business_plans: {
        Row: {
          business_description: string | null
          created_at: string
          executive_summary: string | null
          financials: string | null
          funding: string | null
          id: string
          market_analysis: string | null
          marketing: string | null
          organization: string | null
          products: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          business_description?: string | null
          created_at?: string
          executive_summary?: string | null
          financials?: string | null
          funding?: string | null
          id?: string
          market_analysis?: string | null
          marketing?: string | null
          organization?: string | null
          products?: string | null
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          business_description?: string | null
          created_at?: string
          executive_summary?: string | null
          financials?: string | null
          funding?: string | null
          id?: string
          market_analysis?: string | null
          marketing?: string | null
          organization?: string | null
          products?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      community_news: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          message: string
          priority: number
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          message: string
          priority?: number
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          message?: string
          priority?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      complaints: {
        Row: {
          assigned_to: string | null
          category: string
          created_at: string
          id: string
          message: string
          phone_number: string | null
          priority: string
          resolved_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          category?: string
          created_at?: string
          id?: string
          message: string
          phone_number?: string | null
          priority?: string
          resolved_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          category?: string
          created_at?: string
          id?: string
          message?: string
          phone_number?: string | null
          priority?: string
          resolved_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      course_completions: {
        Row: {
          completion_date: string | null
          course_id: string
          id: string
          nft_token_id: string | null
          user_id: string
        }
        Insert: {
          completion_date?: string | null
          course_id: string
          id?: string
          nft_token_id?: string | null
          user_id: string
        }
        Update: {
          completion_date?: string | null
          course_id?: string
          id?: string
          nft_token_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_completions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          content_url: string
          created_at: string | null
          description: string
          difficulty_level: string
          id: string
          nft_badge_id: string | null
          prerequisites: string[] | null
          skill_category: string
          title: string
        }
        Insert: {
          content_url: string
          created_at?: string | null
          description: string
          difficulty_level: string
          id?: string
          nft_badge_id?: string | null
          prerequisites?: string[] | null
          skill_category: string
          title: string
        }
        Update: {
          content_url?: string
          created_at?: string | null
          description?: string
          difficulty_level?: string
          id?: string
          nft_badge_id?: string | null
          prerequisites?: string[] | null
          skill_category?: string
          title?: string
        }
        Relationships: []
      }
      custom_reminders: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          reminder_date: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          reminder_date: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          reminder_date?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_reminders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          amount: number
          created_at: string
          currency: string
          donation_date: string
          donor_email: string | null
          donor_name: string | null
          donor_phone: string | null
          id: string
          is_anonymous: boolean
          message: string | null
          payment_method: string
          payment_status: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          donation_date?: string
          donor_email?: string | null
          donor_name?: string | null
          donor_phone?: string | null
          id?: string
          is_anonymous?: boolean
          message?: string | null
          payment_method: string
          payment_status?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          donation_date?: string
          donor_email?: string | null
          donor_name?: string | null
          donor_phone?: string | null
          id?: string
          is_anonymous?: boolean
          message?: string | null
          payment_method?: string
          payment_status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      feed_consumption: {
        Row: {
          consumption_date: string
          created_at: string
          feed_id: string
          id: string
          livestock_group: string | null
          notes: string | null
          quantity_used: number
          updated_at: string
          user_id: string
        }
        Insert: {
          consumption_date: string
          created_at?: string
          feed_id: string
          id?: string
          livestock_group?: string | null
          notes?: string | null
          quantity_used: number
          updated_at?: string
          user_id: string
        }
        Update: {
          consumption_date?: string
          created_at?: string
          feed_id?: string
          id?: string
          livestock_group?: string | null
          notes?: string | null
          quantity_used?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feed_consumption_feed_id_fkey"
            columns: ["feed_id"]
            isOneToOne: false
            referencedRelation: "feed_inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_consumption_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_inventory: {
        Row: {
          cost_per_unit: number
          created_at: string
          expiration_date: string | null
          feed_type: string
          id: string
          notes: string | null
          purchase_date: string
          quantity: number
          supplier: string | null
          unit: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cost_per_unit: number
          created_at?: string
          expiration_date?: string | null
          feed_type: string
          id?: string
          notes?: string | null
          purchase_date: string
          quantity: number
          supplier?: string | null
          unit: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cost_per_unit?: number
          created_at?: string
          expiration_date?: string | null
          feed_type?: string
          id?: string
          notes?: string | null
          purchase_date?: string
          quantity?: number
          supplier?: string | null
          unit?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feed_inventory_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_transactions: {
        Row: {
          amount: number
          category: string
          created_at: string
          description: string | null
          id: string
          related_livestock_id: string | null
          transaction_date: string
          transaction_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          description?: string | null
          id?: string
          related_livestock_id?: string | null
          transaction_date: string
          transaction_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          related_livestock_id?: string | null
          transaction_date?: string
          transaction_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_transactions_related_livestock_id_fkey"
            columns: ["related_livestock_id"]
            isOneToOne: false
            referencedRelation: "livestock"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      freelancer_profiles: {
        Row: {
          bio: string | null
          created_at: string | null
          experience_level: string
          hourly_rate: number
          id: string
          location: string | null
          nft_credentials: Json[] | null
          preferred_payment: string | null
          reputation_score: number | null
          skills: string[]
          user_id: string
          web3_skills: string[] | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          experience_level: string
          hourly_rate: number
          id?: string
          location?: string | null
          nft_credentials?: Json[] | null
          preferred_payment?: string | null
          reputation_score?: number | null
          skills?: string[]
          user_id: string
          web3_skills?: string[] | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          experience_level?: string
          hourly_rate?: number
          id?: string
          location?: string | null
          nft_credentials?: Json[] | null
          preferred_payment?: string | null
          reputation_score?: number | null
          skills?: string[]
          user_id?: string
          web3_skills?: string[] | null
        }
        Relationships: []
      }
      health_records: {
        Row: {
          created_at: string
          dosage: string | null
          id: string
          livestock_id: string
          medication: string | null
          notes: string | null
          record_date: string
          record_type: string
          treatment_cost: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dosage?: string | null
          id?: string
          livestock_id: string
          medication?: string | null
          notes?: string | null
          record_date: string
          record_type: string
          treatment_cost?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dosage?: string | null
          id?: string
          livestock_id?: string
          medication?: string | null
          notes?: string | null
          record_date?: string
          record_type?: string
          treatment_cost?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "health_records_livestock_id_fkey"
            columns: ["livestock_id"]
            isOneToOne: false
            referencedRelation: "livestock"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      health_tips: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          priority: number
          tip: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          priority?: number
          tip: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          priority?: number
          tip?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      job_recommendations: {
        Row: {
          created_at: string | null
          freelancer_id: string
          id: string
          job_id: string
          match_score: number
        }
        Insert: {
          created_at?: string | null
          freelancer_id: string
          id?: string
          job_id: string
          match_score: number
        }
        Update: {
          created_at?: string | null
          freelancer_id?: string
          id?: string
          job_id?: string
          match_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "job_recommendations_freelancer_id_fkey"
            columns: ["freelancer_id"]
            isOneToOne: false
            referencedRelation: "freelancer_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_recommendations_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          budget_range: string
          created_at: string | null
          description: string
          experience_level: string
          id: string
          required_skills: string[]
          title: string
        }
        Insert: {
          budget_range: string
          created_at?: string | null
          description: string
          experience_level: string
          id?: string
          required_skills?: string[]
          title: string
        }
        Update: {
          budget_range?: string
          created_at?: string | null
          description?: string
          experience_level?: string
          id?: string
          required_skills?: string[]
          title?: string
        }
        Relationships: []
      }
      livestock: {
        Row: {
          acquisition_cost: number | null
          animal_type: string
          breed: string | null
          created_at: string
          date_acquired: string
          date_of_birth: string | null
          gender: string | null
          id: string
          notes: string | null
          status: string
          tag_number: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          acquisition_cost?: number | null
          animal_type: string
          breed?: string | null
          created_at?: string
          date_acquired: string
          date_of_birth?: string | null
          gender?: string | null
          id?: string
          notes?: string | null
          status?: string
          tag_number?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          acquisition_cost?: number | null
          animal_type?: string
          breed?: string | null
          created_at?: string
          date_acquired?: string
          date_of_birth?: string | null
          gender?: string | null
          id?: string
          notes?: string | null
          status?: string
          tag_number?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "livestock_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      partnership_requests: {
        Row: {
          contact_name: string
          created_at: string
          email: string
          goals: string
          id: string
          message: string | null
          organization_name: string
          partnership_type: string
          phone: string | null
          resources: string | null
          status: string
          timeline: string | null
          user_id: string | null
          website: string | null
        }
        Insert: {
          contact_name: string
          created_at?: string
          email: string
          goals: string
          id?: string
          message?: string | null
          organization_name: string
          partnership_type: string
          phone?: string | null
          resources?: string | null
          status?: string
          timeline?: string | null
          user_id?: string | null
          website?: string | null
        }
        Update: {
          contact_name?: string
          created_at?: string
          email?: string
          goals?: string
          id?: string
          message?: string | null
          organization_name?: string
          partnership_type?: string
          phone?: string | null
          resources?: string | null
          status?: string
          timeline?: string | null
          user_id?: string | null
          website?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          role: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      project_proposals: {
        Row: {
          community_needs: string
          contact_name: string
          created_at: string
          email: string
          expected_outcomes: string
          has_agreed_terms: boolean
          id: string
          location: string
          organization_name: string | null
          phone: string | null
          project_description: string
          project_duration: string | null
          project_title: string
          project_type: string
          resources_needed: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          community_needs: string
          contact_name: string
          created_at?: string
          email: string
          expected_outcomes: string
          has_agreed_terms?: boolean
          id?: string
          location: string
          organization_name?: string | null
          phone?: string | null
          project_description: string
          project_duration?: string | null
          project_title: string
          project_type: string
          resources_needed?: string | null
          status?: string
          user_id?: string | null
        }
        Update: {
          community_needs?: string
          contact_name?: string
          created_at?: string
          email?: string
          expected_outcomes?: string
          has_agreed_terms?: boolean
          id?: string
          location?: string
          organization_name?: string | null
          phone?: string | null
          project_description?: string
          project_duration?: string | null
          project_title?: string
          project_type?: string
          resources_needed?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      recycling_centers: {
        Row: {
          accepted_materials: string[] | null
          address: string
          contact: string | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          operating_hours: string | null
        }
        Insert: {
          accepted_materials?: string[] | null
          address: string
          contact?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          operating_hours?: string | null
        }
        Update: {
          accepted_materials?: string[] | null
          address?: string
          contact?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          operating_hours?: string | null
        }
        Relationships: []
      }
      recycling_mistakes: {
        Row: {
          description: string
          id: string
          impact_level: string
          solution: string
          title: string
        }
        Insert: {
          description: string
          id?: string
          impact_level: string
          solution: string
          title: string
        }
        Update: {
          description?: string
          id?: string
          impact_level?: string
          solution?: string
          title?: string
        }
        Relationships: []
      }
      reputation_events: {
        Row: {
          created_at: string | null
          description: string | null
          event_type: string
          id: string
          score_change: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          event_type: string
          id?: string
          score_change: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          event_type?: string
          id?: string
          score_change?: number
          user_id?: string
        }
        Relationships: []
      }
      semesters: {
        Row: {
          created_at: string | null
          gpa: number | null
          id: string
          title: string
          updated_at: string | null
          user_id: string
          year: string
        }
        Insert: {
          created_at?: string | null
          gpa?: number | null
          id?: string
          title: string
          updated_at?: string | null
          user_id: string
          year: string
        }
        Update: {
          created_at?: string | null
          gpa?: number | null
          id?: string
          title?: string
          updated_at?: string | null
          user_id?: string
          year?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description: string | null
          duration: number
          id: string
          name: string
          price: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration?: number
          id?: string
          name: string
          price?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration?: number
          id?: string
          name?: string
          price?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      student_courses: {
        Row: {
          code: string
          created_at: string | null
          credit_hours: number
          grade: string | null
          grade_point: number | null
          id: string
          semester_id: string
          title: string
          updated_at: string | null
          user_id: string
          year: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          credit_hours: number
          grade?: string | null
          grade_point?: number | null
          id?: string
          semester_id: string
          title: string
          updated_at?: string | null
          user_id: string
          year?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          credit_hours?: number
          grade?: string | null
          grade_point?: number | null
          id?: string
          semester_id?: string
          title?: string
          updated_at?: string | null
          user_id?: string
          year?: string | null
        }
        Relationships: []
      }
      student_profiles: {
        Row: {
          created_at: string | null
          current_level: string | null
          faculty: string | null
          id: string
          name: string | null
          program: string | null
          start_year: string | null
          student_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_level?: string | null
          faculty?: string | null
          id: string
          name?: string | null
          program?: string | null
          start_year?: string | null
          student_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_level?: string | null
          faculty?: string | null
          id?: string
          name?: string | null
          program?: string | null
          start_year?: string | null
          student_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ttfpp_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          user_role: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          user_role?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          user_role?: string | null
        }
        Relationships: []
      }
      user_activities: {
        Row: {
          activity_type: string
          created_at: string | null
          description: string
          details: Json | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          description: string
          details?: Json | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          description?: string
          details?: Json | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ussd_sessions: {
        Row: {
          created_at: string
          current_step: string
          id: string
          input_data: Json | null
          phone_number: string
          session_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_step: string
          id?: string
          input_data?: Json | null
          phone_number: string
          session_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_step?: string
          id?: string
          input_data?: Json | null
          phone_number?: string
          session_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      volunteer_applications: {
        Row: {
          availability: string
          created_at: string
          email: string
          experience: string | null
          first_name: string
          id: string
          last_name: string
          motivation: string | null
          occupation: string | null
          phone: string | null
          skills: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          availability: string
          created_at?: string
          email: string
          experience?: string | null
          first_name: string
          id?: string
          last_name: string
          motivation?: string | null
          occupation?: string | null
          phone?: string | null
          skills?: string | null
          status?: string
          user_id?: string | null
        }
        Update: {
          availability?: string
          created_at?: string
          email?: string
          experience?: string | null
          first_name?: string
          id?: string
          last_name?: string
          motivation?: string | null
          occupation?: string | null
          phone?: string | null
          skills?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      waste_tracking: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          notes: string | null
          tracking_date: string
          unit: string
          user_id: string
          waste_type: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          notes?: string | null
          tracking_date?: string
          unit: string
          user_id: string
          waste_type: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          notes?: string | null
          tracking_date?: string
          unit?: string
          user_id?: string
          waste_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "waste_tracking_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
