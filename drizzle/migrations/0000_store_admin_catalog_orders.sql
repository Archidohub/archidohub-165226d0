CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role text NOT NULL CHECK (role IN ('admin')),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own store role" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.is_store_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = 'admin'
  )
$$;
REVOKE ALL ON FUNCTION public.is_store_admin(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_store_admin(uuid) TO authenticated, service_role;

CREATE TABLE public.products (
  id text PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  original_price numeric(10,2) NOT NULL DEFAULT 0 CHECK (original_price >= 0),
  image text NOT NULL,
  description text NOT NULL DEFAULT '',
  features text[] NOT NULL DEFAULT '{}',
  badge text,
  tags text[] NOT NULL DEFAULT '{}',
  rating numeric(2,1) NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  reviews integer NOT NULL DEFAULT 0 CHECK (reviews >= 0),
  created_at date NOT NULL DEFAULT CURRENT_DATE,
  popularity integer NOT NULL DEFAULT 0 CHECK (popularity >= 0 AND popularity <= 100),
  is_active boolean NOT NULL DEFAULT true
);
GRANT SELECT ON public.products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read active products" ON public.products FOR SELECT TO anon USING (is_active);
CREATE POLICY "Customers and admins can read visible products" ON public.products FOR SELECT TO authenticated USING (is_active OR public.is_store_admin(auth.uid()));
CREATE POLICY "Store admins can add products" ON public.products FOR INSERT TO authenticated WITH CHECK (public.is_store_admin(auth.uid()));
CREATE POLICY "Store admins can update products" ON public.products FOR UPDATE TO authenticated USING (public.is_store_admin(auth.uid())) WITH CHECK (public.is_store_admin(auth.uid()));
CREATE POLICY "Store admins can remove products" ON public.products FOR DELETE TO authenticated USING (public.is_store_admin(auth.uid()));

CREATE TABLE public.store_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  price_adjustment_percent numeric(6,2) NOT NULL DEFAULT 0 CHECK (price_adjustment_percent >= -90 AND price_adjustment_percent <= 500),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.store_settings TO authenticated;
GRANT ALL ON public.store_settings TO service_role;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Store admins can read store settings" ON public.store_settings FOR SELECT TO authenticated USING (public.is_store_admin(auth.uid()));
CREATE POLICY "Store admins can create store settings" ON public.store_settings FOR INSERT TO authenticated WITH CHECK (public.is_store_admin(auth.uid()));
CREATE POLICY "Store admins can update store settings" ON public.store_settings FOR UPDATE TO authenticated USING (public.is_store_admin(auth.uid())) WITH CHECK (public.is_store_admin(auth.uid()));

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  shipping_address text NOT NULL,
  items jsonb NOT NULL,
  subtotal_amount numeric(10,2) NOT NULL CHECK (subtotal_amount >= 0),
  shipping_fee numeric(10,2) NOT NULL CHECK (shipping_fee >= 0),
  total_amount numeric(10,2) NOT NULL CHECK (total_amount >= 0),
  payment_method text NOT NULL CHECK (payment_method IN ('cash_on_delivery', 'cashfree')),
  payment_status text NOT NULL CHECK (payment_status IN ('cod_confirmed', 'awaiting_payment', 'paid', 'payment_failed')),
  cashfree_order_id text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Store admins can read product photos" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'product-images' AND public.is_store_admin(auth.uid()));
CREATE POLICY "Store admins can upload product photos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images' AND public.is_store_admin(auth.uid()));
CREATE POLICY "Store admins can update product photos" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'product-images' AND public.is_store_admin(auth.uid())) WITH CHECK (bucket_id = 'product-images' AND public.is_store_admin(auth.uid()));
CREATE POLICY "Store admins can remove product photos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'product-images' AND public.is_store_admin(auth.uid()));