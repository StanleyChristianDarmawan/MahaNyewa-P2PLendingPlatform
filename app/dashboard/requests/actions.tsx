"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function rejectRequestAction(borrowId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authorized" };

  const { error } = await supabase
    .from("borrows")
    .update({ status: 'rejected' })
    .eq("id", borrowId)
    .eq("owner_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/requests");
  return { success: true };
}

export async function approveRequestAction(borrowId: string, itemId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authorized" };

  const { error } = await supabase.rpc('approve_borrow_request', {
    target_borrow_id: borrowId,
    target_item_id: itemId
  });

  if (error) {
    console.error("Error approving request:", error);
    return { success: false, error: "Gagal memproses persetujuan." };
  }
  
  revalidatePath("/dashboard/requests");
  revalidatePath("/dashboard/borrows");
  revalidatePath("/dashboard");
  return { success: true };
}
