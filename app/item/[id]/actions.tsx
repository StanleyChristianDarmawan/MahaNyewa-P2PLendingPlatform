"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function getDayDifference(start: Date, end: Date): number {
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 0 ? 1 : diffDays;
}

const PLATFORM_FEE_RATE = 0.10;

interface BorrowRequest {
  itemId: string;
  ownerId: string;
  startDate: Date;
  endDate: Date;
}

export async function createBorrowRequest(request: BorrowRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Anda harus login untuk meminjam" };
  }
  if (user.id === request.ownerId) {
    return { success: false, error: "Anda tidak bisa meminjam barang Anda sendiri" };
  }
  const { data: itemData, error: itemError } = await supabase
    .from("items")
    .select("price_per_day, status")
    .eq("id", request.itemId)
    .single();

  if (itemError || !itemData) {
    return { success: false, error: "Barang tidak ditemukan." };
  }

  if (itemData.status === 'borrowed') {
    return { success: false, error: "Barang ini sedang dipinjam." };
  }
  const durationDays = getDayDifference(request.startDate, request.endDate);
  const itemPricePerDay = parseFloat(itemData.price_per_day || 0);
  const calculatedTotalPrice = itemPricePerDay * durationDays;
  const calculatedPlatformFee = calculatedTotalPrice * PLATFORM_FEE_RATE;
  const { error } = await supabase.from("borrows").insert({
    item_id: request.itemId,
    owner_id: request.ownerId,
    borrower_id: user.id,
    start_date: request.startDate.toISOString(),
    end_date: request.endDate.toISOString(),
    status: "pending",
    total_price: calculatedTotalPrice,
    platform_fee: calculatedPlatformFee,
  });

  if (error) {
    console.error("Error creating borrow request:", error);
    return { success: false, error: "Gagal mengajukan peminjaman. Coba lagi." };
  }

  revalidatePath("/dashboard/borrows");
  redirect("/dashboard/borrows");
}
