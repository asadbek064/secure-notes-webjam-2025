export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      notes: {
        Row: {
          id: string
          user_id: string
          title: string
          encrypted_content: string
          iv: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          encrypted_content: string
          iv: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          encrypted_content?: string
          iv?: string
          created_at?: string
          updated_at?: string
        }
      }
      todos: {
        Row: {
          id: string
          user_id: string
          encrypted_content: string
          iv: string
          completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          encrypted_content: string
          iv: string
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          encrypted_content?: string
          iv?: string
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      files: {
        Row: {
          id: string
          user_id: string
          name: string
          storage_key: string
          iv: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          storage_key: string
          iv: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          storage_key?: string
          iv?: string
          created_at?: string
        }
      }
    }
  }
}