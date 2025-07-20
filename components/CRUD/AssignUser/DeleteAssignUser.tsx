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
import { buttonVariants } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { User } from "@/types";
import { CircleAlert } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DeleteAssignUser({
  users,
  ProjectId,
  projectName,
 
}: {
  users: User;
  ProjectId: number;
  projectName: string;
  
}) {
  const router = useRouter()
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/Projects/${ProjectId}/users/${users.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
         
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(
          errorData.message || `Failed to revoke the ${users.name}`
        );
      }
      toast.success(
        `Permissions for ${users.name} have been successfully revoked from ${projectName}.`
      );
      // window.location.reload();
      router.refresh()
    } catch (err) {
      if (err instanceof Error) {
        toast.error(`Failed to revoked user: ${err.message}`);
      } else {
        toast.error("Failed to revoked user due to an unknown error.");
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
          Are you sure you want to revoke permission for{" "}
          <strong>{users.name}</strong> for <strong>{projectName}</strong>?
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          className={cn(buttonVariants({ variant: "destructive" }))}
          onClick={handleDelete}
        >
          Revoke
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );
}
