"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState, useTransition } from "react";
import { approveRequestAction, rejectRequestAction } from "./actions";

interface RequestActionsProps {
  borrowId: string;
  itemId: string;
}

export function RequestActions({ borrowId, itemId }: RequestActionsProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleApprove = () => {
    startTransition(async () => {
      const result = await approveRequestAction(borrowId, itemId);
      if (result.success) {
        toast({ title: "Berhasil!", description: "Permintaan telah disetujui." });
      } else {
        toast({ title: "Gagal", description: result.error, variant: "destructive" });
      }
    });
  };

  const handleReject = () => {
    startTransition(async () => {
      const result = await rejectRequestAction(borrowId);
      if (result.success) {
        toast({ title: "Berhasil", description: "Permintaan telah ditolak." });
      } else {
        toast({ title: "Gagal", description: result.error, variant: "destructive" });
      }
    });
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <Button 
        variant="outline" 
        className="w-full"
        onClick={handleReject}
        disabled={isPending}
      >
        Tolak
      </Button>
      <Button 
        className="w-full"
        onClick={handleApprove}
        disabled={isPending}
      >
        {isPending ? "Memproses..." : "Setujui"}
      </Button>
    </div>
  );
}
