"use client"
import React from "react";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { Chart } from "@/types";
import { buttonVariants } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DeleteChart({
    chart,
  // fetchChart,
}: {
  chart:Chart
  // fetchChart: () => Promise<void>;
}) {
  const router = useRouter();

  const handleDeleteDevice = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/Charts/${chart.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to delete the chart.");
        return; // Exit early if the response is not OK
      }

      // fetchChart();
      toast.success("The Chart has been deleted successfully.");
      router.refresh()
      // window.location.reload()
    } catch (err) {
      if (err instanceof Error) {
        toast.error(`Failed to delete Chart: ${err.message}`);
      } else {
        toast.error("Failed to delete Chart due to an unknown error.");
      }
    }
  };

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle className="flex items-center gap-2">
          <CircleAlert className="opacity-80" size={16} strokeWidth={2} />
          Are you sure?
        </AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. You will permanently delete the Chart{" "}
          <strong>{chart.name}</strong>.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={handleDeleteDevice}
          className={cn(buttonVariants({ variant: "destructive" }))}
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );
}
