import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, Handshake, CheckCircle } from "lucide-react";

export function HowItWorks() {
  return (
    <section id="cara-kerja" className="container text-center py-24 sm:py-32">
      <h2 className="text-3xl md:text-4xl font-bold">
        Bagaimana Caranya?
      </h2>
      <p className="md:w-3/4 mx-auto mt-4 mb-8 text-xl text-muted-foreground">
        Hanya butuh 3 langkah mudah untuk mulai meminjam atau meminjamkan barang.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Search className="w-12 h-12 text-primary" />
            </div>
            <CardTitle>1. Cari Barang</CardTitle>
            <CardDescription>
              Gunakan fitur pencarian untuk menemukan barang yang Anda butuhkan di sekitar kampus.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Handshake className="w-12 h-12 text-primary" />
            </div>
            <CardTitle>2. Ajukan Pinjaman</CardTitle>
            <CardDescription>
              Hubungi pemilik, sepakati durasi dan jadwal pengambilan barang.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-12 h-12 text-primary" />
            </div>
            <CardTitle>3. Selesai & Kembalikan</CardTitle>
            <CardDescription>
              Gunakan barang sesuai kebutuhan dan kembalikan tepat waktu. Beri ulasan!
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </section>
  );
}