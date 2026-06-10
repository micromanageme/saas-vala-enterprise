
-- Enums
CREATE TYPE public.author_product_status AS ENUM ('draft','review','published','archived');
CREATE TYPE public.author_order_status AS ENUM ('pending','paid','refunded','failed','cancelled');
CREATE TYPE public.author_license_status AS ENUM ('active','expired','revoked','suspended');
CREATE TYPE public.author_subscription_status AS ENUM ('trialing','active','past_due','cancelled','expired');
CREATE TYPE public.author_payout_status AS ENUM ('pending','processing','paid','failed');

-- Helper trigger
CREATE OR REPLACE FUNCTION public.author_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- PRODUCTS
CREATE TABLE public.author_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT,
  status public.author_product_status NOT NULL DEFAULT 'draft',
  price_cents INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  cover_url TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.author_products TO authenticated;
GRANT ALL ON public.author_products TO service_role;
ALTER TABLE public.author_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "view products" ON public.author_products FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert own products" ON public.author_products FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "update own products" ON public.author_products FOR UPDATE TO authenticated USING (auth.uid() = owner_id OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager'));
CREATE POLICY "delete own products" ON public.author_products FOR DELETE TO authenticated USING (auth.uid() = owner_id OR public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_author_products_updated BEFORE UPDATE ON public.author_products FOR EACH ROW EXECUTE FUNCTION public.author_set_updated_at();

-- VERSIONS
CREATE TABLE public.author_product_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.author_products(id) ON DELETE CASCADE,
  version TEXT NOT NULL,
  changelog TEXT,
  download_url TEXT,
  file_size BIGINT,
  released_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.author_product_versions TO authenticated;
GRANT ALL ON public.author_product_versions TO service_role;
ALTER TABLE public.author_product_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "view versions" ON public.author_product_versions FOR SELECT TO authenticated USING (true);
CREATE POLICY "manage versions" ON public.author_product_versions FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.author_products p WHERE p.id = product_id AND (p.owner_id = auth.uid() OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager'))))
  WITH CHECK (EXISTS (SELECT 1 FROM public.author_products p WHERE p.id = product_id AND (p.owner_id = auth.uid() OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager'))));
CREATE TRIGGER trg_versions_updated BEFORE UPDATE ON public.author_product_versions FOR EACH ROW EXECUTE FUNCTION public.author_set_updated_at();

-- ORDERS
CREATE TABLE public.author_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.author_products(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  buyer_email TEXT,
  buyer_name TEXT,
  amount_cents INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  status public.author_order_status NOT NULL DEFAULT 'pending',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.author_orders TO authenticated;
GRANT ALL ON public.author_orders TO service_role;
ALTER TABLE public.author_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "view orders scoped" ON public.author_orders FOR SELECT TO authenticated USING (
  buyer_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.author_products p WHERE p.id = product_id AND p.owner_id = auth.uid())
  OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager')
);
CREATE POLICY "insert orders" ON public.author_orders FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update orders owner" ON public.author_orders FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.author_products p WHERE p.id = product_id AND p.owner_id = auth.uid())
  OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager')
);
CREATE POLICY "delete orders owner" ON public.author_orders FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.author_products p WHERE p.id = product_id AND p.owner_id = auth.uid())
  OR public.has_role(auth.uid(),'admin')
);
CREATE TRIGGER trg_orders_updated BEFORE UPDATE ON public.author_orders FOR EACH ROW EXECUTE FUNCTION public.author_set_updated_at();

-- LICENSES
CREATE TABLE public.author_licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.author_products(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.author_orders(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  license_key TEXT NOT NULL UNIQUE,
  status public.author_license_status NOT NULL DEFAULT 'active',
  seats INTEGER NOT NULL DEFAULT 1,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.author_licenses TO authenticated;
GRANT ALL ON public.author_licenses TO service_role;
ALTER TABLE public.author_licenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "view licenses" ON public.author_licenses FOR SELECT TO authenticated USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.author_products p WHERE p.id = product_id AND p.owner_id = auth.uid())
  OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager')
);
CREATE POLICY "manage licenses owner" ON public.author_licenses FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.author_products p WHERE p.id = product_id AND p.owner_id = auth.uid()) OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.author_products p WHERE p.id = product_id AND p.owner_id = auth.uid()) OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager'));
CREATE TRIGGER trg_licenses_updated BEFORE UPDATE ON public.author_licenses FOR EACH ROW EXECUTE FUNCTION public.author_set_updated_at();

-- SUBSCRIPTIONS
CREATE TABLE public.author_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.author_products(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_email TEXT,
  plan TEXT NOT NULL DEFAULT 'standard',
  status public.author_subscription_status NOT NULL DEFAULT 'active',
  mrr_cents INTEGER NOT NULL DEFAULT 0,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.author_subscriptions TO authenticated;
GRANT ALL ON public.author_subscriptions TO service_role;
ALTER TABLE public.author_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "view subs" ON public.author_subscriptions FOR SELECT TO authenticated USING (
  customer_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.author_products p WHERE p.id = product_id AND p.owner_id = auth.uid())
  OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager')
);
CREATE POLICY "manage subs owner" ON public.author_subscriptions FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.author_products p WHERE p.id = product_id AND p.owner_id = auth.uid()) OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.author_products p WHERE p.id = product_id AND p.owner_id = auth.uid()) OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager'));
CREATE TRIGGER trg_subs_updated BEFORE UPDATE ON public.author_subscriptions FOR EACH ROW EXECUTE FUNCTION public.author_set_updated_at();

-- RENEWALS
CREATE TABLE public.author_subscription_renewals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES public.author_subscriptions(id) ON DELETE CASCADE,
  renewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  amount_cents INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  status public.author_order_status NOT NULL DEFAULT 'paid',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.author_subscription_renewals TO authenticated;
GRANT ALL ON public.author_subscription_renewals TO service_role;
ALTER TABLE public.author_subscription_renewals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "view renewals" ON public.author_subscription_renewals FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.author_subscriptions s JOIN public.author_products p ON p.id = s.product_id
          WHERE s.id = subscription_id AND (s.customer_id = auth.uid() OR p.owner_id = auth.uid()))
  OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager')
);
CREATE POLICY "manage renewals owner" ON public.author_subscription_renewals FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.author_subscriptions s JOIN public.author_products p ON p.id = s.product_id WHERE s.id = subscription_id AND p.owner_id = auth.uid()) OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.author_subscriptions s JOIN public.author_products p ON p.id = s.product_id WHERE s.id = subscription_id AND p.owner_id = auth.uid()) OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager'));

-- REVIEWS
CREATE TABLE public.author_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.author_products(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title TEXT,
  body TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.author_reviews TO authenticated;
GRANT ALL ON public.author_reviews TO service_role;
ALTER TABLE public.author_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "view reviews" ON public.author_reviews FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert review" ON public.author_reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = reviewer_id);
CREATE POLICY "update own review" ON public.author_reviews FOR UPDATE TO authenticated USING (auth.uid() = reviewer_id OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager'));
CREATE POLICY "delete own review" ON public.author_reviews FOR DELETE TO authenticated USING (auth.uid() = reviewer_id OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager'));
CREATE TRIGGER trg_reviews_updated BEFORE UPDATE ON public.author_reviews FOR EACH ROW EXECUTE FUNCTION public.author_set_updated_at();

-- PAYOUTS
CREATE TABLE public.author_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount_cents INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  status public.author_payout_status NOT NULL DEFAULT 'pending',
  period_start DATE,
  period_end DATE,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.author_payouts TO authenticated;
GRANT ALL ON public.author_payouts TO service_role;
ALTER TABLE public.author_payouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "view payouts" ON public.author_payouts FOR SELECT TO authenticated USING (
  owner_id = auth.uid() OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager')
);
CREATE POLICY "manage payouts" ON public.author_payouts FOR ALL TO authenticated
  USING (owner_id = auth.uid() OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager'))
  WITH CHECK (owner_id = auth.uid() OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager'));
CREATE TRIGGER trg_payouts_updated BEFORE UPDATE ON public.author_payouts FOR EACH ROW EXECUTE FUNCTION public.author_set_updated_at();

-- REVENUE EVENTS
CREATE TABLE public.author_revenue_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.author_products(id) ON DELETE SET NULL,
  source TEXT NOT NULL DEFAULT 'order',
  amount_cents INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.author_revenue_events TO authenticated;
GRANT ALL ON public.author_revenue_events TO service_role;
ALTER TABLE public.author_revenue_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "view revenue" ON public.author_revenue_events FOR SELECT TO authenticated USING (
  owner_id = auth.uid() OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager')
);
CREATE POLICY "manage revenue" ON public.author_revenue_events FOR ALL TO authenticated
  USING (owner_id = auth.uid() OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager'))
  WITH CHECK (owner_id = auth.uid() OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager'));

-- Indexes
CREATE INDEX idx_author_products_owner ON public.author_products(owner_id);
CREATE INDEX idx_author_versions_product ON public.author_product_versions(product_id);
CREATE INDEX idx_author_orders_product ON public.author_orders(product_id);
CREATE INDEX idx_author_orders_buyer ON public.author_orders(buyer_id);
CREATE INDEX idx_author_licenses_product ON public.author_licenses(product_id);
CREATE INDEX idx_author_licenses_user ON public.author_licenses(user_id);
CREATE INDEX idx_author_subs_product ON public.author_subscriptions(product_id);
CREATE INDEX idx_author_subs_customer ON public.author_subscriptions(customer_id);
CREATE INDEX idx_author_renewals_sub ON public.author_subscription_renewals(subscription_id);
CREATE INDEX idx_author_reviews_product ON public.author_reviews(product_id);
CREATE INDEX idx_author_payouts_owner ON public.author_payouts(owner_id);
CREATE INDEX idx_author_revenue_owner ON public.author_revenue_events(owner_id);
