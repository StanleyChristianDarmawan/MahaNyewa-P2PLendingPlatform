"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { createBorrowRequest } from "./actions";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Label } from "@/components/ui/label";

interface BorrowFormProps {
  itemId: string;
  ownerId: string;
}

export function BorrowForm({ itemId, ownerId }: BorrowFormProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 3),
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!date?.from || !date?.to) {
      toast({
        title: "Tanggal tidak valid",
        description: "Silakan pilih rentang tanggal peminjaman.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await createBorrowRequest({
        itemId,
        ownerId,
        startDate: date.from,
        endDate: date.to,
      });

      if (result?.error) {
        throw new Error(result.error);
      }
      
      toast({
        title: "Permintaan Terkirim!",
        description: "Menunggu persetujuan pemilik...",
      });
      
    } catch (error: any) {
      toast({
        title: "Terjadi kesalahan",
        description: error.message,
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label className="text-sm font-medium">Rentang Tanggal Pinjam</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pilih tanggal</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={1}
              disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <Button onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? "Mengirim..." : "Ajukan Piminjaman"}
      </Button>
    </div>
  );
}