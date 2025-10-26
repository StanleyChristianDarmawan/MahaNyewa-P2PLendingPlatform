import { createClient } from "@/lib/supabase/server";
import { ItemCard } from "@/components/items/ItemCard";
import type { Database } from "@/types/supabase";

type ItemWithCategory = Database['public']['Tables']['items']['Row'] & {
  categories: { name: string; } | null;
};

async function getItems() {
  const supabase = await createClient(); 

  const { data, error } = await supabase
    .from("items")
    .select("*, categories ( name )")
    .limit(10)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching items:", error);
    return [];
  }
  return data as ItemWithCategory[];
}

export default async function DashboardPage() {
  const items = await getItems();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Barang Terbaru</h1>
      
      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-12 text-center">
          <h3 className="text-xl font-semibold">Belum ada barang</h3>
          <p className="text-muted-foreground">
            Mulai pinjamkan barangmu dengan klik tombol "Tambah Barang".
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}