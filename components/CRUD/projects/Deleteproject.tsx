"use client"
// components/DeleteProject.tsx
import React from "react";
import { Projects } from "@/types";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { deleteProject } from "@/actions/ProjectApi";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "../../ui/button";
import { cn } from "@/lib/utils";
import { CircleAlert } from "lucide-react";

const DeleteProject: React.FC<{ project: Projects }> = ({ project }) => {
  const router = useRouter();

  const handleDeleteProject = async (id: number) => {
    try {
      // await deleteProject(id);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/Projects/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        toast.error(errorText || "Failed to delete project");
      }
      toast.success("Project deleted successfully!");
      // window.location.reload();
      router.refresh(); // Refresh the page
    } catch (err) {
      if (err instanceof Error) {
        toast.error(`Failed to deleted Project: ${err.message}`);
      } else {
        toast.error("Failed to deleted Project due to an unknown error.");
      }
    }
  };

  if (!project) {
    return null;
  }

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle className="flex items-center gap-2">
          <CircleAlert className="opacity-80" size={16} strokeWidth={2} />
          Are you sure?
        </AlertDialogTitle>{" "}
        <AlertDialogDescription>
          This action cannot be undone. You will permanently delete the project{" "}
          <strong>{project.name}</strong>.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={() => handleDeleteProject(project.id)}
          className={cn(buttonVariants({ variant: "destructive" }))}
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );
};

export default DeleteProject;
