"use client";

import { useRouter } from "next/navigation";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh(); 
  };

  return (
    <DropdownMenuItem onClick={handleSignOut} className="text-red-500 cursor-pointer">
      <LogOut className="mr-2 h-4 w-4" />
      Keluar
    </DropdownMenuItem>
  );
}