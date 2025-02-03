CREATE TABLE public.notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    title TEXT NOT NULL,
    encrypted_content TEXT NOT NULL,
    iv TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE public.todos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    encrypted_content TEXT NOT NULL,
    iv TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE public.files (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    name TEXT NOT NULL,
    storage_key TEXT NOT NULL,
    iv TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own notes"
ON public.notes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own notes"
ON public.notes FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes"
ON public.notes FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes"
ON public.notes FOR DELETE
USING (auth.uid() = user_id);

-- Create policies for todos
CREATE POLICY "Users can create their own todos"
ON public.todos FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own todos"
ON public.todos FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own todos"
ON public.todos FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own todos"
ON public.todos FOR DELETE
USING (auth.uid() = user_id);

-- Create policies for files
CREATE POLICY "Users can create their own files"
ON public.files FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own files"
ON public.files FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own files"
ON public.files FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own files"
ON public.files FOR DELETE
USING (auth.uid() = user_id);

INSERT INTO storage.buckets (id, name, public)
VALUES ('encrypted-files', 'encrypted-files', false);

CREATE POLICY "Users can upload their own files to storage"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'encrypted-files' AND auth.uid() = owner);

CREATE POLICY "Users can read their own files from storage"
ON storage.objects FOR SELECT
USING (bucket_id = 'encrypted-files' AND auth.uid() = owner);

CREATE POLICY "Users can delete their own files from storage"
ON storage.objects FOR DELETE
USING (bucket_id = 'encrypted-files' AND auth.uid() = owner);