import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { Database } from "@/types/supabase";

type ItemWithCategory = Database['public']['Tables']['items']['Row'] & {
  categories: {
    name: string;
  } | null;
};

interface ItemCardProps {
  item: ItemWithCategory;
}

export function ItemCard({ item }: ItemCardProps) {
  const imageUrl = item.image_url || "https://placehold.co/600x400/004AAD/FFFFFF?text=Barang";

  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="p-0">
        <img
          src={imageUrl}
          alt={item.title}
          className="w-full h-48 object-cover"
        />
      </CardHeader>
      <CardContent className="flex-1 p-4">
        {item.categories && (
          <Badge variant="outline" className="mb-2">
            {item.categories.name}
          </Badge>
        )}
        <CardTitle className="text-lg font-semibold mb-1 truncate">
          {item.title}
        </CardTitle>
        <CardDescription className="line-clamp-2 h-[40px]">
          {item.description || "Tidak ada deskripsi"}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href="#">Lihat Detail</Link> 
        </Button>
      </CardFooter>
    </Card>
  );
}