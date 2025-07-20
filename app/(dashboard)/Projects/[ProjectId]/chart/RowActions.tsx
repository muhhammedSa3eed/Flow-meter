// RowActions.tsx
"use client";

import { useState } from "react";
import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisIcon, Pencil, Trash2 } from "lucide-react";

import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";



import { Chart } from "@/types";
import DeleteChart from "@/components/CRUD/ChartOP/Deletechart";
import Link from "next/link";

export function RowActions({
  row,
  ProjectId,
  chartId,
  
}: {
  row: Row<Chart>;
  ProjectId: number;
  
  chartId: number;
  // fetchChart: () => Promise<void>;
}) {
  const [isDeleteDeviceOpen, setIsDeleteDeviceOpen] = useState(false);

  const handleDeleteUserOpen = () => setIsDeleteDeviceOpen(true);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex justify-end">
            <Button
              size="icon"
              variant="ghost"
              className="shadow-none"
              aria-label="Edit item"
            >
              <EllipsisIcon size={16} aria-hidden="true" />
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
          <Link href={`/Projects/${ProjectId}/editChart/${chartId}`}>
            <DropdownMenuItem
              className="flex justify-between items-center"
            >
              <span>Edit Chart</span>
              <Pencil className="text-blue-500" />
            </DropdownMenuItem>
            </Link>
            <DropdownMenuItem
              onClick={handleDeleteUserOpen}
              className="flex justify-between items-center"
            >
              <span>Delete Chart</span>
              <Trash2 className="text-red-500" />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

    

      {/* Delete User Dialog */}
      <AlertDialog
        open={isDeleteDeviceOpen}
        onOpenChange={setIsDeleteDeviceOpen}
      >
        <AlertDialogContent>
          <DeleteChart  chart={row.original} />
          {/* fetchChart={fetchChart} */}
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
