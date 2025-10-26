import { DashboardNavbar } from "@/components/layout/DashboardNavbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardNavbar />
      <main className="container flex-1 py-6">
        {children}
      </main>
    </div>
  );
}