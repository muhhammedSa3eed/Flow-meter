"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import EditDashboard from "@/components/CRUD/Views/EditDashboard";
import DeleteDashboard from "@/components/CRUD/Views/DeleteDashboard";
import { Dashboard } from "@/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
interface ViewActionsDropdownProps {
  projectId: number | null;
  views: Dashboard;
}

const ViewActionsDropdown = ({
  projectId,
  views,
}: ViewActionsDropdownProps) => {
  const [isEditViewOpen, setIsEditViewOpen] = useState(false);
  const [isDeleteViewOpen, setIsDeleteViewOpen] = useState(false);

  const handleEditViewOpen = () => {
    setIsEditViewOpen(true);
  };

  const handleDeleteViewOpen = () => {
    setIsDeleteViewOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditViewOpen(false); // Close the edit dialog
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="mr-3" asChild>
          <span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <MoreHorizontal />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit or Delete Dashboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={handleEditViewOpen}
            className="flex justify-between items-center"
          >
            <span>Edit Dashboard</span>
            <Pencil className="text-blue-500" />
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDeleteViewOpen}
            className="flex justify-between items-center"
          >
            <span>Delete Dashboard</span>

            <Trash2 className="text-red-500" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dashboard Dialog */}
      <Dialog open={isEditViewOpen} onOpenChange={setIsEditViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Dashboard</DialogTitle>
          </DialogHeader>
          <EditDashboard
            projectId={projectId}
            dashboard={views}
            onClose={handleCloseEditDialog}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Dashboard Dialog */}
      <AlertDialog open={isDeleteViewOpen} onOpenChange={setIsDeleteViewOpen}>
        <AlertDialogContent>
          <DeleteDashboard projectId={projectId} dashboard={views} />
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ViewActionsDropdown;
