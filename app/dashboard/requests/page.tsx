import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { format } from "date-fns";
import { RequestActions } from "@/app/dashboard/requests/RequestActions";

async function getMyRequests() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const PEMINJAM_RELATIONSHIP = 'profiles!borrows_borrower_id_fkey';
  const ITEM_RELATIONSHIP = 'items';

  const { data, error } = await supabase
    .from("borrows")
    .select(`
      id,
      status,
      start_date,
      end_date,
      total_price,
      platform_fee,
      
      ${ITEM_RELATIONSHIP} (
        id,
        title,
        image_url
      ),
      
      ${PEMINJAM_RELATIONSHIP} (  
        id,
        full_name,
        avatar_url
      )
    `)
    .eq("owner_id", user.id)
    .eq("status", "pending") 
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching requests:", error); 
    return [];
  }

  return data;
}

export default async function MyRequestsPage() {
  const requests = await getMyRequests();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Permintaan Pinjaman Masuk</h1>

      {requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-12 text-center">
          <h3 className="text-xl font-semibold">Belum ada permintaan masuk</h3>
          <p className="text-muted-foreground">
            Saat seseorang ingin meminjam barang Anda, permintaannya akan muncul di sini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {requests.map((req) => {
            const item = (req.items as unknown) as ({ 
                id: string; 
                title: string; 
                image_url: string; 
            } | null);
            const borrower = (req.profiles as unknown) as ({ 
                id: string; 
                full_name: string; 
                avatar_url: string; 
            } | null);
            if (!item || !borrower) return null;
            const profit = req.total_price - req.platform_fee;

            return (
              <Card key={req.id} className="flex flex-col">
                <CardHeader>
                  <CardDescription>Permintaan untuk:</CardDescription>
                  <CardTitle className="text-lg font-semibold truncate">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <div>
                    <p className="text-sm font-semibold">Pemohon:</p>
                    <p className="text-sm text-muted-foreground">{borrower.full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Tanggal Pinjam:</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(req.start_date), "dd MMM")} - {format(new Date(req.end_date), "dd MMM yyyy")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Detail Pembayaran:</p>
                    <div className="text-sm text-muted-foreground">
                      <p>Total Sewa: Rp {req.total_price.toLocaleString('id-ID')}</p>
                      <p>Biaya Admin (10%): -Rp {req.platform_fee.toLocaleString('id-ID')}</p>
                    </div>
                    <p className="text-sm font-medium border-t mt-1 pt-1">
                      Estimasi Pendapatan: Rp {profit.toLocaleString('id-ID')}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <RequestActions 
                    borrowId={req.id} 
                    itemId={item.id} 
                  />
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
