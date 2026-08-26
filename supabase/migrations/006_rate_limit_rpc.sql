-- ============================================
-- MIGRATION 006: Durable rate limiting RPC
-- ============================================
-- Run this in Supabase SQL Editor
-- Safe to re-run (idempotent)
--
-- The middleware limiter in middleware.ts is in-memory: it resets on every
-- deploy and each serverless instance keeps its own counter. Endpoints with
-- outbound side effects (email / Slack) need a store shared across instances,
-- so this backs them with the existing rate_limits table.

CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_identifier      TEXT,
  p_identifier_type TEXT,
  p_action          TEXT,
  p_limit           INTEGER,
  p_window_seconds  INTEGER
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_window_start TIMESTAMPTZ := NOW() - MAKE_INTERVAL(secs => p_window_seconds);
  v_count        INTEGER;
BEGIN
  -- Serialise concurrent checks for this identifier so a burst of parallel
  -- requests cannot all read the pre-increment count and slip through.
  PERFORM pg_advisory_xact_lock(hashtext(p_identifier || ':' || p_action));

  -- Opportunistic cleanup of expired windows
  DELETE FROM public.rate_limits
   WHERE window_end < NOW() - INTERVAL '1 day';

  SELECT COALESCE(SUM(requests), 0)
    INTO v_count
    FROM public.rate_limits
   WHERE identifier = p_identifier
     AND action     = p_action
     AND window_start > v_window_start;

  IF v_count >= p_limit THEN
    RETURN JSONB_BUILD_OBJECT(
      'allowed',     FALSE,
      'count',       v_count,
      'limit',       p_limit,
      'retry_after', p_window_seconds
    );
  END IF;

  INSERT INTO public.rate_limits
    (identifier, identifier_type, action, requests, window_start, window_end)
  VALUES
    (p_identifier, p_identifier_type, p_action, 1, NOW(),
     NOW() + MAKE_INTERVAL(secs => p_window_seconds));

  RETURN JSONB_BUILD_OBJECT(
    'allowed', TRUE,
    'count',   v_count + 1,
    'limit',   p_limit
  );
END;
$$;

REVOKE ALL ON FUNCTION public.check_rate_limit(TEXT, TEXT, TEXT, INTEGER, INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.check_rate_limit(TEXT, TEXT, TEXT, INTEGER, INTEGER) TO anon, authenticated;

CREATE INDEX IF NOT EXISTS idx_rate_limits_window_lookup
  ON public.rate_limits (identifier, action, window_start DESC);
