-- Supabase SQL migration: Create selected_cases table for solution round selection
CREATE TABLE IF NOT EXISTS public.selected_cases (
    id SERIAL PRIMARY KEY,
    user_id uuid NOT NULL,
    case_id integer NOT NULL,
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(user_id)
);

-- Optional: Add foreign key if you have a users table
-- ALTER TABLE public.selected_cases ADD CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES public.users(id);

-- Enable RLS (Row Level Security) if needed
-- ALTER TABLE public.selected_cases ENABLE ROW LEVEL SECURITY;

-- Grant API access to anon role (for Supabase client)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.selected_cases TO anon;
GRANT USAGE, SELECT ON SEQUENCE public.selected_cases_id_seq TO anon;
