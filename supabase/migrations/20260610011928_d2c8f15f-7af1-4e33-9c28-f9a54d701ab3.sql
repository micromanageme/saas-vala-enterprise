
DROP POLICY IF EXISTS "insert orders" ON public.author_orders;
CREATE POLICY "insert orders scoped" ON public.author_orders FOR INSERT TO authenticated WITH CHECK (
  (buyer_id IS NULL OR buyer_id = auth.uid())
  AND (
    buyer_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.author_products p WHERE p.id = product_id AND p.owner_id = auth.uid())
    OR public.has_role(auth.uid(),'admin')
    OR public.has_role(auth.uid(),'manager')
  )
);
