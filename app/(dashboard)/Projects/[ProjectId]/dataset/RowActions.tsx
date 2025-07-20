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



import {  Dataset } from "@/types";
import Link from "next/link";
import DeleteDataset from "@/components/Dataset/DeleteDataset";

export function RowActions({
  row,
  ProjectId,
  datasetId,
  // fetchDataset,
}: {
  row: Row<Dataset>;
  ProjectId: number;
  datasetId: number;
  // fetchDataset: () => void,
}) {
  console.log("datasetId in RowActions:", datasetId);
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
            <Link href={`/Projects/${ProjectId}/editDataset/${datasetId}`}>
            <DropdownMenuItem
              className="flex justify-between items-center"
            >
              <span>Edit Dataset</span>
              <Pencil className="text-blue-500" />
            </DropdownMenuItem>
            </Link>
            <DropdownMenuItem
              onClick={handleDeleteUserOpen}
              className="flex justify-between items-center"
            >
              <span>Delete Dataset</span>
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
          <DeleteDataset  dataset={row.original} />
          {/* fetchDataset={fetchDataset} */}
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
