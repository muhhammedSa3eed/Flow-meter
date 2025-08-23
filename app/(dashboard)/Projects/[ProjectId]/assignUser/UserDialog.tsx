"use client";

import { useState, useId } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
// import AssignUser from "@/components/CRUD/AssignUser/AssignUsers";
import { motion } from "framer-motion";
import { containerCampaignForm as container } from "@/constants/framer-motion";
import InviteUser from "@/components/CRUD/Users/InviteUser";
import AssignUser from "@/components/AssignUser/AssignUsers";

export function UserDialog({
  ProjectId,
  projectName,
}: {
  ProjectId: number;
  projectName: string;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFormType, setSelectedFormType] = useState<"assign" | "add">(
    "assign"
  ); // Default to "assign"
  const id = useId();

  // const handleDialogClose = () => {
  //   setDialogOpen(false);
  // };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant={"custom"}>Assign/Invite User for {projectName}</Button>
      </DialogTrigger>

      <DialogContent className="p-4 md:p-8 w-[95%] h-auto lg:h-auto  md:w-auto mx-auto overflow-auto ">
        <DialogTitle className="text-center uppercase text-xs md:text-md lg:text-2xl">
          Assign or Invite Users for {projectName}
        </DialogTitle>

        {/* Toggle Switch to choose between Assign and Add */}
        <div className="relative inline-grid h-9 grid-cols-[1fr_1fr] items-center text-sm font-medium  font-mono mb-4">
          <Switch
            id={id}
            checked={selectedFormType === "add"}
            onCheckedChange={(checked) =>
              setSelectedFormType(checked ? "add" : "assign")
            }
            className="peer font-mono absolute inset-0 h-[inherit] w-auto data-[state=checked]:bg-input/50 data-[state=unchecked]:bg-input/50 
                      [&_span]:h-full [&_span]:w-1/2 [&_span]:transition-transform [&_span]:duration-300 [&_span]:bg-custom-green2 
                      [&_span]:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] 
                      data-[state=checked]:[&_span]:translate-x-full rtl:data-[state=checked]:[&_span]:-translate-x-full"
          />
          <span className=" font-mono pointer-events-none relative ms-0.5 flex min-w-8 items-center justify-center text-center peer-data-[state=checked]:text-muted-foreground/70">
            <span className="text-[15px] font-medium font-mono ">
              Assign User
            </span>
          </span>
          <span className="pointer-events-none relative me-0.5 flex w-full items-center justify-center text-center peer-data-[state=unchecked]:text-muted-foreground/70">
            <span className="text-[15px] font-medium  font-mono">
              Invite User
            </span>
          </span>
        </div>
        <Label htmlFor={id} className="sr-only uppercase">
          Toggle Assign/Add User
        </Label>

        {/* Conditional Rendering of Forms */}
        {selectedFormType === "assign" ? (
          <motion.div
            variants={container}
            className="flex flex-col"
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <AssignUser ProjectId={ProjectId} projectName={projectName} />
          </motion.div>
        ) : (
          <motion.div
            variants={container}
            className="flex flex-col"
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <InviteUser ProjectId={ProjectId} />
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}
