import { createClient } from "@/lib/supabase/server";
import { AddItemForm } from "@/components/items/AddItemForm";

async function getCategories() {
  const supabase = await createClient(); 
  
  const { data, error } = await supabase.from("categories").select("*");
  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
  return data;
}

export default async function AddItemPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Pinjamkan Barangmu</h1>
      <AddItemForm categories={categories} />
    </div>
  );
}