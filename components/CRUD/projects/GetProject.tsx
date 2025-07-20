import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Projects } from "@/types";

import ProjectActionsDropdown from "./ProjectActionsDropdown";
import { List,  } from "lucide-react";
import Link from "next/link";
export function GetProject({ projects }: { projects: Projects[] }) {
  // const currentPath = usePathname();
  // const basePath = currentPath.split("/").slice(0, 2).join("/");


  const projectList = Array.isArray(projects) ? projects : [];

  return (
    <div>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
            <Link href={"/Projects"}>
            <SidebarGroupLabel className="font-bold text-md">
              Projects <List className="ml-auto" />
            </SidebarGroupLabel>
          </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Go to Projects Page</p>
            </TooltipContent>
          </Tooltip>
       
          <SidebarMenu>
            {projectList.length > 0 ? (
              projectList.map((projects) => (
                <SidebarMenuItem key={projects.id}>
                  <span className="text-md font-semibold cursor-pointer">
                    <SidebarMenuAction showOnHover>
                      <ProjectActionsDropdown projects={projects} />
                      <span className="sr-only">More</span>
                    </SidebarMenuAction>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href={`/Projects/${projects.id}`}>
                          <SidebarMenuButton className="hover:bg-custom-green2">
                            {projects.name}
                          </SidebarMenuButton>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View {projects.name} Details</p>
                      </TooltipContent>
                    </Tooltip>
                  </span>
                </SidebarMenuItem>
              ))
            ) : (
              <SidebarMenuItem>No projects available</SidebarMenuItem>
            )}
          </SidebarMenu>
        </TooltipProvider>
      </SidebarGroup>
    </div>
  );
}
