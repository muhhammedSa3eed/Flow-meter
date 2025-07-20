"use client";

import {  Users } from "lucide-react";
import {
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function UserNav() {

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/Projects/user" passHref>
                <SidebarGroupLabel className="font-bold text-md text-gray-400 hover:text-blue-500">
                  Users
                  <Users className="ml-auto " />
                </SidebarGroupLabel>
              </Link>
            </TooltipTrigger>
            <TooltipContent className="bg-blue-500 text-white">
              <p>View Users</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </SidebarMenuItem>
      <hr />
    </SidebarMenu>
  );
}
