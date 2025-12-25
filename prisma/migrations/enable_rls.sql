-- Enable Row Level Security (RLS) on all tables
-- This migration enables RLS for better database security

-- Enable RLS on accounts table
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own accounts
CREATE POLICY "Users can view own accounts"
  ON public.accounts FOR SELECT
  USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert own accounts"
  ON public.accounts FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own accounts"
  ON public.accounts FOR UPDATE
  USING (auth.uid()::text = "userId");

-- Enable RLS on sessions table
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own sessions
CREATE POLICY "Users can view own sessions"
  ON public.sessions FOR SELECT
  USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert own sessions"
  ON public.sessions FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can delete own sessions"
  ON public.sessions FOR DELETE
  USING (auth.uid()::text = "userId");

-- Enable RLS on mood_check_ins table
ALTER TABLE public.mood_check_ins ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own mood check-ins
CREATE POLICY "Users can view own mood check-ins"
  ON public.mood_check_ins FOR SELECT
  USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert own mood check-ins"
  ON public.mood_check_ins FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own mood check-ins"
  ON public.mood_check_ins FOR UPDATE
  USING (auth.uid()::text = "userId");

-- Enable RLS on relaxation_sessions table
ALTER TABLE public.relaxation_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own relaxation sessions
CREATE POLICY "Users can view own relaxation sessions"
  ON public.relaxation_sessions FOR SELECT
  USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert own relaxation sessions"
  ON public.relaxation_sessions FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own relaxation sessions"
  ON public.relaxation_sessions FOR UPDATE
  USING (auth.uid()::text = "userId");

-- Enable RLS on session_items table
ALTER TABLE public.session_items ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access session items for their own sessions
CREATE POLICY "Users can view own session items"
  ON public.session_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.relaxation_sessions
      WHERE relaxation_sessions.id = session_items."relaxationSessionId"
      AND relaxation_sessions."userId" = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert own session items"
  ON public.session_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.relaxation_sessions
      WHERE relaxation_sessions.id = session_items."relaxationSessionId"
      AND relaxation_sessions."userId" = auth.uid()::text
    )
  );

-- Enable RLS on content_items table
-- Content items are read-only for all authenticated users (public content library)
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;

-- Policy: All authenticated users can read content items (public library)
CREATE POLICY "Authenticated users can view content items"
  ON public.content_items FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Only service role can modify content items (admin/seed operations)
-- Note: This requires using service role key for content management
CREATE POLICY "Service role can manage content items"
  ON public.content_items FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

