import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const STALE = 30_000;

export function useAuthorProducts() {
  return useQuery({
    queryKey: ["author", "products"],
    staleTime: STALE,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("author_products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useAuthorVersions() {
  return useQuery({
    queryKey: ["author", "versions"],
    staleTime: STALE,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("author_product_versions")
        .select("*, author_products(name)")
        .order("released_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useAuthorOrders() {
  return useQuery({
    queryKey: ["author", "orders"],
    staleTime: STALE,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("author_orders")
        .select("*, author_products(name)")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useAuthorLicenses() {
  return useQuery({
    queryKey: ["author", "licenses"],
    staleTime: STALE,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("author_licenses")
        .select("*, author_products(name)")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useAuthorSubscriptions() {
  return useQuery({
    queryKey: ["author", "subscriptions"],
    staleTime: STALE,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("author_subscriptions")
        .select("*, author_products(name)")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useAuthorRenewals() {
  return useQuery({
    queryKey: ["author", "renewals"],
    staleTime: STALE,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("author_subscription_renewals")
        .select("*")
        .order("renewed_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useAuthorReviews() {
  return useQuery({
    queryKey: ["author", "reviews"],
    staleTime: STALE,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("author_reviews")
        .select("*, author_products(name)")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useAuthorPayouts() {
  return useQuery({
    queryKey: ["author", "payouts"],
    staleTime: STALE,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("author_payouts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useAuthorRevenue() {
  return useQuery({
    queryKey: ["author", "revenue"],
    staleTime: STALE,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("author_revenue_events")
        .select("*, author_products(name)")
        .order("occurred_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export const money = (cents: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format((cents ?? 0) / 100);

export const num = (n: number) => new Intl.NumberFormat("en-US").format(n ?? 0);

export const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

export function sum<T>(rows: T[], pick: (r: T) => number) {
  return rows.reduce((acc, r) => acc + (pick(r) || 0), 0);
}
