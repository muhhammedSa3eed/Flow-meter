/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import Link from 'next/link';
import { Columns3 } from 'lucide-react';
import { Projects } from '@/types';
import ViewActionsDropdown from '../CRUD/Views/ViewActionsDropdown';
import { Dashboard } from '@/types';
import AddDashboard from '../CRUD/Views/AddDashboard';
// import { useRouter } from 'next/navigation';

export function NavProjects({
  projects,
  projectId,
}: {
  projects: Projects[];
  projectId: number | null;
}) {
  const [views, setViews] = useState<Dashboard[]>([]);
  
 
  useEffect(() => {
    if (projectId) {
      const getProjects = async () => {
        try {
          const data = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/projects/${projectId}/dashboards`
          );
          const result = await data.json();
          setViews(result);
        } catch (error) {
          console.error('Error fetching projects:', error);
        } finally {
          // setLoading(false);
        }
      };

      getProjects();
    }
  }, []);

  const currentProject = projects.find((project) => project.id === projectId);

  return (
    <div>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <AddDashboard projectId={projectId} />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={`/Projects/${projectId}`}>
                <SidebarGroupLabel className="font-bold text-md">
                  Dashboards <Columns3 className="ml-auto" />
                </SidebarGroupLabel>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Go to Projects Page</p>
            </TooltipContent>
          </Tooltip>

          <SidebarMenu>
            {currentProject ? (
              views.length > 0 ? (
                views.map((view) => (
                  <SidebarMenuItem key={view.id}>
                    <span className="text-md font-semibold cursor-pointer">
                      <SidebarMenuAction showOnHover>
                        <ViewActionsDropdown
                          views={view}
                          projectId={projectId}
                        />
                        <span className="sr-only">More</span>
                      </SidebarMenuAction>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            href={`/Projects/${projectId}/dashboard/${view.id}?edit=false`}
                          >
                            <SidebarMenuButton className="hover:bg-custom-green2">
                              {view.name}
                            </SidebarMenuButton>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Dashboard {view.name} Details</p>
                        </TooltipContent>
                      </Tooltip>
                    </span>
                  </SidebarMenuItem>
                ))
              ) : (
                <SidebarMenuItem className="pl-3">
                  No dashboards available{' '}
                </SidebarMenuItem>
              )
            ) : (
              <SidebarMenuItem>No project selected</SidebarMenuItem>
            )}
          </SidebarMenu>
        </TooltipProvider>
      </SidebarGroup>
    </div>
  );
}
