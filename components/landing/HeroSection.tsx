import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="container grid lg:grid-cols-2 w-full place-items-center py-20 md:py-32 gap-10">
      <div className="text-center lg:text-start space-y-6">
        <main className="text-5xl md:text-6xl font-bold">
          <h1 className="inline">
            <span className="inline bg-gradient-to-r from-[#004AAD] to-[#007BFF] text-transparent bg-clip-text">
              Pinjam & Pinjamkan
            </span>{" "}
            Barang Antar Mahasiswa
          </h1>
        </main>

        <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          Platform P2P untuk kebutuhan barang di kampus. Mudah, cepat, dan aman. Dari buku, alat elektronik, hingga perlengkapan olahraga.
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <Button className="w-full md:w-1/3 text-lg" asChild>
            <Link href="/login">Cari Barang Sekarang</Link>
          </Button>
        </div>
      </div>

      <div className="hidden lg:block">
        <img
          src="https://placehold.co/600x400/004AAD/FFFFFF?text=Ilustrasi+Kampus"
          alt="Hero"
          className="rounded-lg shadow-lg"
        />
      </div>
    </section>
  )
}