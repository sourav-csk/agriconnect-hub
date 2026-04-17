
CREATE TABLE public.transport_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  pickup TEXT NOT NULL,
  delivery TEXT NOT NULL,
  weight NUMERIC NOT NULL,
  preferred_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.transport_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own transport requests" ON public.transport_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users create own transport requests" ON public.transport_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own transport requests" ON public.transport_requests
  FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_transport_requests_updated_at
  BEFORE UPDATE ON public.transport_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
