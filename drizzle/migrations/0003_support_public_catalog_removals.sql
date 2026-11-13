ALTER TABLE public.store_settings
ADD COLUMN hidden_product_ids text[] NOT NULL DEFAULT '{}';

CREATE OR REPLACE FUNCTION public.list_hidden_product_ids()
RETURNS text[]
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(hidden_product_ids, '{}'::text[])
  FROM public.store_settings
  WHERE id = 1
$$;
REVOKE ALL ON FUNCTION public.list_hidden_product_ids() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.list_hidden_product_ids() TO anon, authenticated, service_role;