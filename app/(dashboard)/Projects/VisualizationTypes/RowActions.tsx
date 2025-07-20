// RowActions.tsx
"use client";

import { useState } from "react";
import { Row } from "@tanstack/react-table";
import { VisualizationTypes } from "@/types";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EllipsisIcon, Pencil, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import EditVisualizationTypes from "@/components/CRUD/Visualization types/EditVisualizationTypes";
import DeleteVisualizationTypes from "@/components/CRUD/Visualization types/DeleteVisualizationTypes";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from "@/components/ui/scroll-area";

export function RowActions({ row }: { row: Row<VisualizationTypes> }) {
  const [isEditVisualizationOpen, setIsEditVisualizationOpen] = useState(false);
  const [isDeleteVisualizationOpen, setIsDeleteVisualizationOpen] = useState(false);
  
  const handleEditVisualizationOpen = () => setIsEditVisualizationOpen(true);
  const handleDeleteVisualizationOpen = () => setIsDeleteVisualizationOpen(true);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex justify-end">
            <Button size="icon" variant="ghost" className="shadow-none" aria-label="Edit item">
              <EllipsisIcon size={16} aria-hidden="true" />
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem 
              onClick={handleEditVisualizationOpen}
              className="flex justify-between items-center"
            >
              <span>Edit Visualization types</span>
              <Pencil className="text-blue-500" />
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleDeleteVisualizationOpen}
              className="flex justify-between items-center"
            >
              <span>Delete Visualization types</span>
              <Trash2 className="text-red-500" />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Visualization Dialog */}
      <Sheet open={isEditVisualizationOpen} onOpenChange={setIsEditVisualizationOpen}>
        <SheetContent>
        <div className="h-full flex flex-col">
          <SheetHeader>
            <SheetTitle>Edit Visualization type</SheetTitle>
          </SheetHeader>
          <ScrollArea className="flex-1 mt-4 pr-2">
          <EditVisualizationTypes VisualizationTypes={row.original} />
          </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Visualization Dialog */}
      <AlertDialog open={isDeleteVisualizationOpen} onOpenChange={setIsDeleteVisualizationOpen}>
        <AlertDialogContent>
          <DeleteVisualizationTypes VisualizationTypes={row.original} />
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}