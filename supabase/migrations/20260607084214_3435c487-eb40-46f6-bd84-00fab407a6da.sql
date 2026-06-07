
-- Enums
CREATE TYPE public.quote_status AS ENUM ('draft','sent','accepted','rejected','expired');
CREATE TYPE public.order_status AS ENUM ('pending','processing','shipped','completed','cancelled');
CREATE TYPE public.invoice_status AS ENUM ('draft','sent','paid','overdue','cancelled');

-- ============ QUOTES ============
CREATE TABLE public.sales_quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number text NOT NULL UNIQUE,
  customer_name text NOT NULL,
  customer_email text,
  customer_company text,
  line_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  subtotal numeric NOT NULL DEFAULT 0,
  tax numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  status quote_status NOT NULL DEFAULT 'draft',
  valid_until date,
  notes text,
  owner_id uuid NOT NULL,
  assigned_to uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sales_quotes TO authenticated;
GRANT ALL ON public.sales_quotes TO service_role;
ALTER TABLE public.sales_quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signed-in users view all quotes" ON public.sales_quotes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Signed-in users insert as owner" ON public.sales_quotes FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Owner/assignee/admin/manager update quotes" ON public.sales_quotes FOR UPDATE TO authenticated
  USING (owner_id = auth.uid() OR assigned_to = auth.uid() OR has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'manager'::app_role))
  WITH CHECK (owner_id = auth.uid() OR assigned_to = auth.uid() OR has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'manager'::app_role));
CREATE POLICY "Owner/admin/manager delete quotes" ON public.sales_quotes FOR DELETE TO authenticated
  USING (owner_id = auth.uid() OR has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'manager'::app_role));
CREATE TRIGGER set_updated_at_sales_quotes BEFORE UPDATE ON public.sales_quotes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ ORDERS ============
CREATE TABLE public.sales_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number text NOT NULL UNIQUE,
  quote_id uuid REFERENCES public.sales_quotes(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  customer_email text,
  customer_company text,
  line_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  subtotal numeric NOT NULL DEFAULT 0,
  tax numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  status order_status NOT NULL DEFAULT 'pending',
  notes text,
  owner_id uuid NOT NULL,
  assigned_to uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sales_orders TO authenticated;
GRANT ALL ON public.sales_orders TO service_role;
ALTER TABLE public.sales_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signed-in users view all orders" ON public.sales_orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Signed-in users insert as owner" ON public.sales_orders FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Owner/assignee/admin/manager update orders" ON public.sales_orders FOR UPDATE TO authenticated
  USING (owner_id = auth.uid() OR assigned_to = auth.uid() OR has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'manager'::app_role))
  WITH CHECK (owner_id = auth.uid() OR assigned_to = auth.uid() OR has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'manager'::app_role));
CREATE POLICY "Owner/admin/manager delete orders" ON public.sales_orders FOR DELETE TO authenticated
  USING (owner_id = auth.uid() OR has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'manager'::app_role));
CREATE TRIGGER set_updated_at_sales_orders BEFORE UPDATE ON public.sales_orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ INVOICES ============
CREATE TABLE public.sales_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number text NOT NULL UNIQUE,
  order_id uuid REFERENCES public.sales_orders(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  customer_email text,
  customer_company text,
  line_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  subtotal numeric NOT NULL DEFAULT 0,
  tax numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  status invoice_status NOT NULL DEFAULT 'draft',
  due_date date,
  paid_at timestamptz,
  notes text,
  owner_id uuid NOT NULL,
  assigned_to uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sales_invoices TO authenticated;
GRANT ALL ON public.sales_invoices TO service_role;
ALTER TABLE public.sales_invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signed-in users view all invoices" ON public.sales_invoices FOR SELECT TO authenticated USING (true);
CREATE POLICY "Signed-in users insert as owner" ON public.sales_invoices FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Owner/assignee/admin/manager update invoices" ON public.sales_invoices FOR UPDATE TO authenticated
  USING (owner_id = auth.uid() OR assigned_to = auth.uid() OR has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'manager'::app_role))
  WITH CHECK (owner_id = auth.uid() OR assigned_to = auth.uid() OR has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'manager'::app_role));
CREATE POLICY "Owner/admin/manager delete invoices" ON public.sales_invoices FOR DELETE TO authenticated
  USING (owner_id = auth.uid() OR has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'manager'::app_role));
CREATE TRIGGER set_updated_at_sales_invoices BEFORE UPDATE ON public.sales_invoices FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
