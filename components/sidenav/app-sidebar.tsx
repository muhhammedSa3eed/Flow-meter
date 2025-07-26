// 'use client';

// import * as React from 'react';
// import { UserNav } from '@/components/sidenav/nav-user';
// import { TeamSwitcher } from '@/components/sidenav/team-switcher';
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarHeader,
//   SidebarMenuButton,
//   SidebarRail,
// } from '@/components/ui/sidebar';
// import { Projects } from '@/types';
// import { NavMain } from './nav-main';
// import { NavProjects } from './nav-projects'; // Import NavProjects here
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { List, SquareTerminal } from 'lucide-react';
// import VisualizationNav from './nav-visualization';

// // This is sample data.
// const data = {
//   user: {
//     name: 'Neuss_HMI',
//     des: 'Created By Neuss',
//     avatar: '/3896504.png',
//   },
//   teams: [
//     {
//       name: 'Neuss HMI',
//       logo: '',
//       plan: 'Human-Machine Interface',
//     },
//   ],
// };

// export function AppSidebar({
//   projects,
//   ...props
// }: { projects: Projects[] } & React.ComponentProps<typeof Sidebar>) {
//   const pathname = usePathname();
//   const segments = pathname.split('/'); // تقسيم المسار إلى أجزاء
//   const projectId = segments[2];
//   // // Check if the current path matches '/Projects/{projectId}' where projectId is a valid UUID
//   // const isProjectDetailPage =
//   //   /^\/Projects\/[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/.test(
//   //     pathname
//   //   );

//   // // Extract projectId from the URL if it's a project detail page
//   // const projectId = isProjectDetailPage ? pathname.split('/')[2] : null;
//   // const projectIdNumber = projectId && parseInt(projectId);

//   return (
//     <Sidebar collapsible="icon" {...props}>
//       <SidebarHeader>
//         <TeamSwitcher teams={data.teams} />
       
//       </SidebarHeader>
//       <SidebarContent>
//         {/* Show NavMain in all paths except '/Projects/{projectId}' */}
//         {!projectId && <NavMain projects={projects} />}

//         {/* Show NavProjects only if the path matches '/Projects/{projectId}' */}
//         {projectId && (
//           <NavProjects projects={projects} projectId={parseInt(projectId)} />
//         )}
//       </SidebarContent>
//       <SidebarFooter>
//         <VisualizationNav />
//         <UserNav />
//       </SidebarFooter>

//       <SidebarMenuButton
//         size="lg"
//         className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:hidden"
//       >
//         <div className="grid flex-1 text-left text-sm leading-tight p-2 ">
//           <span className=" text-xs text-custom-green">
//             {' '}
//             &#169; {data.user.des} 2025
//           </span>
//         </div>
//       </SidebarMenuButton>
//       <SidebarRail />
//     </Sidebar>
//   );
// }






"use client";

import * as React from "react";
import { useState, useEffect } from "react";


import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Table, Cable, Users, ShieldCheck, Shapes } from "lucide-react";
import RotatingCube from "../motion/UseAnimationFrame";
import Link from "next/link";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

const navMainItems = [

  {
    title: "Projects",
    url: "/Projects",
    icon: Table,
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

];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  

  const user = {
    name: "Neuss",
    des: "Created By Neuss",
    avatar: "/assets/logo.webp.png",
  };

  return (
    <Sidebar collapsible="icon"  {...props}>
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
        <NavMain items={navMainItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
