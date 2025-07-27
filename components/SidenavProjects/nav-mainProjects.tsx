'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { LucideIcon, Plus } from 'lucide-react';
import { usePathname } from 'next/navigation';
import AddDashboard from '../CRUD/Views/AddDashboard';
import { Projects } from '@/types';

export function NavMainProjects({
  items,
  projectId,
  projects,
}: {
  projectId: number;
  projects: Projects[];
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-md transition-colors
    ${
      pathname === '/dashboard/flow-meter-form'
        ? 'bg-custom-green2 text-white dark:bg-custom-green2'
        : 'bg-gray-200 text-black dark:bg-gray-800 dark:text-white'
    }
    hover:bg-accent hover:text-foreground
  `}
            >
              <AddDashboard projectId={projectId} />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="projects">
            <AccordionTrigger className="text-base px-3 py-2">
              <Link href={'/Projects'} >Projects</Link>
            </AccordionTrigger>
            <AccordionContent>
              <SidebarMenu className="pt-2">
                {projects.map((project) => {
                  const isActive = pathname.startsWith(
                    `/Projects/${project.id}`
                  );
                  return (
                    <SidebarMenuItem key={project.id}>
                      <Link href={`/Projects/${project.id}`} className="w-full">
                        <SidebarMenuButton
                          tooltip={project.name}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-md transition-colors
                    ${
                      isActive
                        ? 'bg-custom-green2 text-white dark:bg-custom-green2'
                        : 'bg-gray-200 text-black dark:bg-gray-800 dark:text-white'
                    }
                    hover:bg-accent hover:text-foreground
                  `}
                        >
                          <span>{project.name}</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
