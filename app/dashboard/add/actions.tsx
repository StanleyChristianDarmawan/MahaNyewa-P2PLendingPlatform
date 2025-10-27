"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addItemAction(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const categoryId = formData.get("category") as string;
  const imageFile = formData.get("image") as File;
  const pricePerDay = formData.get("price_per_day") as string;
  const parsedPrice = parseFloat(pricePerDay) || 0;

  let imageUrl = null;

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `public/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("item-images")
      .upload(filePath, imageFile);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw new Error("Failed to upload image");
    }

    const { data: publicUrlData } = supabase.storage
      .from("item-images")
      .getPublicUrl(filePath);

    imageUrl = publicUrlData.publicUrl;
  }

  const { error: insertError } = await supabase.from("items").insert({
    title: title,
    description: description,
    category_id: parseInt(categoryId),
    image_url: imageUrl,
    owner_id: user.id,
    price_per_day: parsedPrice,
  });

  if (insertError) {
    console.error("Insert error:", insertError);
    throw new Error("Gagal menambahkan barang. Error DB.");
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}