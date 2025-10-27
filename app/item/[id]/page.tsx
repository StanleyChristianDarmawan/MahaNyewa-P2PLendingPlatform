import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BorrowForm } from "./BorrowForm"; 

async function getItemDetails(itemId: string) {
  const supabase = await createClient(); 

  const { data, error } = await supabase
    .from("items")
    .select(`
      *,
      categories ( name ),
      profiles ( full_name, avatar_url )
    `)
    .eq("id", itemId)
    .single();

  if (error) {
    console.error("Error fetching item details:", error);
    return null;
  }  
  return data;
}

const getInitials = (name: string | null | undefined) => {
  if (!name) return "AK";
  const names = name.split(' ');
  if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
  return (names[0][0] + (names.length > 1 ? names[names.length - 1][0] : '')).toUpperCase();
};

export default async function ItemDetailPage(
  props: { params: { id: string } }
) {
  const params = await props.params; 
  const item = await getItemDetails(params.id);

  if (!item) {
    return (
      <div className="container py-10">
        <h1 className="text-2xl font-bold">Barang tidak ditemukan</h1>
      </div>
    );
  }

  const owner = item.profiles;
  const category = item.categories;
  const imageUrl = item.image_url || `https://placehold.co/600x400/EDC254/2D2D2D?text=${item.title}`;

  return (
    <div className="container mx-auto max-w-4xl py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={imageUrl}
            alt={item.title}
            className="w-full h-auto rounded-lg object-cover aspect-square"
          />
        </div>
        <div className="flex flex-col gap-6">
          <div>
            {category?.name && (
              <Badge variant="outline" className="mb-2 text-sm">
                {category.name}
              </Badge>
            )}
            <h1 className="text-4xl font-bold mb-3">{item.title}</h1>
            <p className="text-lg text-foreground/80">
              {item.description || "Tidak ada deskripsi."}
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h3 className="text-sm font-semibold mb-3">Pemilik Barang</h3>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={owner?.avatar_url || undefined} />
                <AvatarFallback>{getInitials(owner?.full_name)}</AvatarFallback>
              </Avatar>
              <span className="font-medium">
                {owner?.full_name || "Pemilik"}
              </span>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Ajukan Peminjaman</h3>
            <BorrowForm itemId={item.id} ownerId={item.owner_id} />
          </div>
        </div>
      </div>
    </div>
  );
}