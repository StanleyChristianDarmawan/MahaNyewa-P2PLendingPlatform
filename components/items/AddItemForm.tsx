"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addItemAction } from "@/app/dashboard/add/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Database } from "@/types/supabase";

type Category = Database['public']['Tables']['categories']['Row'];

interface AddItemFormProps {
  categories: Category[];
}

export function AddItemForm({ categories }: AddItemFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    
    try {
      await addItemAction(formData);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Gagal menambahkan barang");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Nama Barang</Label>
        <Input id="title" name="title" required placeholder="Cth: Kamera Sony A6000" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Kategori</Label>
        <Select name="category" required>
          <SelectTrigger>
            <SelectValue placeholder="Pilih kategori" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={String(category.id)}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea id="description" name="description" placeholder="Cth: Kondisi mulus, lengkap dengan tas dan 2 baterai..." />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Foto Barang</Label>
        <Input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} />
        {imagePreview && (
          <div className="mt-4">
            <img src={imagePreview} alt="Pratinjau Gambar" className="w-full max-w-xs rounded-md object-contain" />
          </div>
        )}
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
          Batal
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Menyimpan..." : "Simpan Barang"}
        </Button>
      </div>
    </form>
  );
}