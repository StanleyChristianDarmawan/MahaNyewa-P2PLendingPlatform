import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { format } from "date-fns";

async function getMyBorrows() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from("borrows")
    .select(`
      id,
      status,
      start_date,
      end_date,
      items (
        id,
        title,
        image_url
      )
    `)
    .eq("borrower_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching borrows:", error);
    return [];
  }

  return data;
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case "pending":
      return "secondary";
    case "approved":
      return "default";
    case "rejected":
      return "destructive";
    case "returned":
      return "outline";
    default:
      return "secondary";
  }
};

// ... (kode di atas tetap sama)

export default async function MyBorrowsPage() {
  const borrows = await getMyBorrows();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Barang yang Saya Pinjam</h1>

      {borrows.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-12 text-center">
          <h3 className="text-xl font-semibold">Anda belum meminjam apa pun</h3>
          <p className="text-muted-foreground">
            Jelajahi dashboard untuk menemukan barang yang Anda butuhkan.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {borrows.map((borrow) => {
            
             const item = (borrow.items as unknown) as ({ 
                 id: string; 
                 title: string; 
                 image_url: string; 
             } | null);
             
            if (!item) return null;

            const imageUrl = item.image_url || `https://placehold.co/600x400/EDC254/2D2D2D?text=${item.title}`;
            
            return (
              <Card key={borrow.id} className="flex flex-col">
                <CardHeader className="p-0">
                  <img
                    src={imageUrl}
                    alt={item.title}
                    className="w-full h-48 rounded-t-lg object-cover"
                  />
                </CardHeader>
                <CardContent className="flex-1 p-4">
                  <Badge 
                    variant={getStatusVariant(borrow.status)} 
                    className="mb-2 uppercase text-xs font-semibold"
                  >
                    {borrow.status}
                  </Badge>
                  <CardTitle className="text-lg font-semibold mb-2 truncate">
                    {item.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Tanggal Pinjam:
                  </p>
                  <p className="text-sm font-medium">
                    {format(new Date(borrow.start_date), "dd MMM yyyy")} - {format(new Date(borrow.end_date), "dd MMM yyyy")}
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

