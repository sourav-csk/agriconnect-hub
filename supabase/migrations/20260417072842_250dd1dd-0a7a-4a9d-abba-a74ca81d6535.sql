
INSERT INTO storage.buckets (id, name, public) VALUES ('crop-photos', 'crop-photos', true);

CREATE POLICY "Crop photos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'crop-photos');

CREATE POLICY "Users can upload own crop photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'crop-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own crop photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'crop-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own crop photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'crop-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
