import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { createClient } from "@/lib/supabase/server";

const getInitials = (name: string | null | undefined) => {
  if (!name) return "AK";
  const names = name.split(' ');
  if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
  return (names[0][0] + (names.length > 1 ? names[names.length - 1][0] : '')).toUpperCase();
};

export async function DashboardNavbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let fullName: string | null = null;
  let avatarUrl: string | null = null;
  let userEmail: string | null = user?.email || null;
  let initials: string = "AK";

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, avatar_url')
      .eq('id', user.id)
      .single();
    
    if (profile) {
      fullName = profile.full_name;
      avatarUrl = profile.avatar_url;
      initials = getInitials(profile.full_name);
    } else if (user.email) {
      initials = getInitials(user.email);
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <span className="font-bold">MahaNyewa</span>
          </Link>
          <Link
            href="/dashboard"
            className="text-foreground/70 transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>
        </nav>

        <div className="flex w-full items-center justify-end gap-4">
          <Button asChild size="sm" className="gap-1">
            <Link href="/dashboard/add">
              <PlusCircle className="h-4 w-4" />
              Tambah Barang
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src={avatarUrl || undefined} />
                  <AvatarFallback>{initials}</AvatarFallback> 
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {fullName || userEmail || "Akun Saya"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">Profil</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <SignOutButton />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}