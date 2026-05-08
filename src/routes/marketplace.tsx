import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useState } from "react";

export const Route = createFileRoute("/marketplace")({
  head: () => ({ meta: [{ title: "Marketplace — SaaS Vala" }, { name: "description", content: "Multi-vendor marketplace - 2000+ products" }] }),
  component: Page,
});

function Page() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const { data: productsData, isLoading } = useQuery({
    queryKey: ["products", page, search, category, status],
    queryFn: async () => {
      const params = new URLSearchParams({
        type: "all",
        page: page.toString(),
        limit: "50",
      });
      if (search) params.append("search", search);
      if (category) params.append("category", category);
      if (status) params.append("status", status);

      const response = await fetch(`/api/products?${params}`);
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    },
  });

  const { data: analyticsData } = useQuery({
    queryKey: ["analytics-products"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/products");
      if (!response.ok) throw new Error("Failed to fetch analytics");
      return response.json();
    },
  });

  const data = productsData?.data;
  const kpis = data?.kpis ? [
    { label: "Total Products", value: data.kpis.totalProducts.toLocaleString(), delta: `+${data.kpis.totalProductsDelta}`, up: data.kpis.totalProductsDelta > 0 },
    { label: "Active", value: data.kpis.activeProducts.toLocaleString(), delta: `+${data.kpis.activeProductsDelta}`, up: data.kpis.activeProductsDelta > 0 },
    { label: "Revenue", value: `$${(data.kpis.totalRevenue / 1000).toFixed(0)}K`, delta: `+${data.kpis.totalRevenueDelta}%`, up: data.kpis.totalRevenueDelta > 0 },
    { label: "Downloads", value: data.kpis.totalDownloads.toLocaleString(), delta: `+${data.kpis.totalDownloadsDelta}`, up: data.kpis.totalDownloadsDelta > 0 }
  ] : [];

  const columns = [
    { key: "name", label: "Product" },
    { key: "vendor", label: "Vendor" },
    { key: "price", label: "Price" },
    { key: "category", label: "Category" },
    { key: "status", label: "Status" }
  ];

  const rows = data?.products?.map((p: any) => ({
    name: p.name,
    vendor: p.vendor?.name || 'Unknown',
    price: `$${p.price.toFixed(2)}`,
    category: p.category || 'General',
    status: p.isActive ? 'Active' : 'Inactive'
  })) || [];

  const pagination = data?.pagination;

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Marketplace" subtitle="Multi-vendor marketplace - 2000+ products" kpis={[]} columns={columns} rows={[]} />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <ModulePage 
        title="Marketplace" 
        subtitle={`Multi-vendor marketplace - ${data?.kpis?.totalProducts?.toLocaleString() || 0} products`}
        kpis={kpis} 
        columns={columns} 
        rows={rows}
        pagination={pagination}
        onPageChange={setPage}
      />
    </AppShell>
  );
}
