// RowActions.tsx
"use client";

import { useState } from "react";
import { Row } from "@tanstack/react-table";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EllipsisIcon, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import DeleteAssignUser from "@/components/CRUD/AssignUser/DeleteAssignUser";
import EditAssignUser from "@/components/CRUD/AssignUser/EditAssignUser";


export function RowActions({ row,  ProjectId,projectName}: { row: Row<User> ,ProjectId:number ,projectName:string  }) {
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);

  const handleEditUserOpen = () => setIsEditUserOpen(true);
  const handleDeleteUserOpen = () => setIsDeleteUserOpen(true);
  // const handleCloseEditDialog = () => setIsEditUserOpen(false);

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
            {/* <DropdownMenuItem onClick={handleEditUserOpen} className="flex justify-between items-center">
              <span>Edit Assign User</span>
              <Pencil className="text-blue-500" />
            </DropdownMenuItem> */}
            <DropdownMenuItem onClick={handleDeleteUserOpen} className="flex justify-between items-center">
              <span>Delete Assign User</span>
              <Trash2 className="text-red-500" />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit User Dialog */}
      {/* <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Assign User</DialogTitle>
          </DialogHeader>
          <EditAssignUser  ProjectId={ProjectId}   users={row.original} />
        </DialogContent>
      </Dialog> */}

      {/* Delete User Dialog */}
      <AlertDialog open={isDeleteUserOpen} onOpenChange={setIsDeleteUserOpen}>
        <AlertDialogContent>
          <DeleteAssignUser ProjectId={ProjectId} projectName={projectName}   users={row.original} />
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}