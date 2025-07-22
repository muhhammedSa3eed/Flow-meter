"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Table,
  Cable,
  Users,
  ShieldCheck,
  Shapes,
  ChartNoAxesCombined,
  Share2,
  Database,
  Settings,
  List,
  Info,
} from "lucide-react";
import RotatingCube from "../motion/UseAnimationFrame";
import Link from "next/link";
import { NavUserProjects } from "./nav-userProjects";
import { NavMainProjects } from "./nav-mainProjects";
import { Projects } from "@/types";

const getNavMainItems = (projectId: number) => [
  {
    title: "Project Detiels",
    url: `/Projects/${projectId}`,
    icon: Info,
  },
  {
    title: "Chart",
    url: `/Projects/${projectId}/chart`,
    icon: ChartNoAxesCombined,
  },
  {
    title: "Connections",
    url: `/Projects/${projectId}/connections`,
    icon: Share2,
  },
  {
    title: "Assign Users",
    url: `/Projects/${projectId}/assignUser`,
    icon: Users,
  },
  {
    title: "Users",
    url: "/Projects/user",
    icon: Users,
  },
  {
    title: "Visualization types",
    url: "/Projects/VisualizationTypes",
    icon: Shapes,
  },
  {
    title: "Dataset",
    url: `/Projects/${projectId}/dataset`,
    icon: Database,
  },
  {
    title: "Projects",
    url: `/Projects`,
    icon: List,
  },
  {
    title: "settings",
    url: `/Projects/${projectId}/settings`,
    icon: Settings,
  },
];

export function AppSidebarProjects({
  projectId,
  projects,
  ...props
}: { projectId: number } &{projects:Projects[] } & React.ComponentProps<typeof Sidebar>) {
  const user = {
    name: "Neuss",
    des: "Created By Neuss",
    avatar: "/assets/logo.webp.png",
  };
  const navMainItems = getNavMainItems(projectId);
  return (
    <Sidebar  {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/Projects">
                <RotatingCube />
                <span className="text-base font-semibold ml-3">Neuss</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMainProjects items={navMainItems} projectId={projectId} projects={projects}  />
      </SidebarContent>
      <SidebarFooter>
        <NavUserProjects user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
