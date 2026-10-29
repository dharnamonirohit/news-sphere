-- Quick Fix: Allow news articles to be ingested and updated by backend and client sync
DROP POLICY IF EXISTS "Articles can be inserted by everyone" ON public.articles;
CREATE POLICY "Articles can be inserted by everyone"
    ON public.articles FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Articles can be updated by everyone" ON public.articles;
CREATE POLICY "Articles can be updated by everyone"
    ON public.articles FOR UPDATE
    USING (true);
