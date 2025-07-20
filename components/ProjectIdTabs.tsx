'use client';
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Layers,
  Settings,
  Share2,
  List,
  Database,
  ChartNoAxesCombined,
  Shapes,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Loading from '@/app/loading';

interface ProjectIdTabsProps {
  projectId: number;
  projectName?: string;
}

export default function ProjectIdTabs({
  projectId,
  projectName,
}: ProjectIdTabsProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const handlePageLoaded = () => setIsNavigating(false);
    window.addEventListener('pageLoaded', handlePageLoaded);
    return () => window.removeEventListener('pageLoaded', handlePageLoaded);
  }, []);

  const getDefaultValue = () => {
    if (pathname.includes('/connections')) return 'connections';
    if (pathname.includes('/assignUser')) return 'assign-users';
    if (pathname.includes('/settings')) return 'settings';
    if (pathname.includes('/VisualizationTypes')) return 'VisualizationTypes';
    if (
      pathname.includes('/dataset') ||
      pathname.includes('/addDataset') ||
      pathname.includes('/editDataset')
    ) {
      return 'dataset';
    }
    if (
      pathname.includes('/chart') ||
      pathname.includes('/addChart') ||
      pathname.includes('/editChart')
    ) {
      return 'chart';
    }
    return 'project-details';
  };

  const handleNavigation = (href: string) => {
    setIsNavigating(true);
    router.push(href);
  };

  return (
    <div className="m-4">
      <Tabs defaultValue={getDefaultValue()}>
        <ScrollArea>
          <TabsList className="mb-3">
            {/* Project Details Tab */}
            <TabsTrigger value="project-details">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => handleNavigation(`/Projects/${projectId}`)}
                  >
                    <Layers
                      className="-ms-0.5 me-1.5 opacity-60"
                      size={16}
                      aria-hidden="true"
                    />
                    Project Details
                  </div>
                </TooltipTrigger>
                <TooltipContent>Go to details</TooltipContent>
              </Tooltip>
            </TabsTrigger>

            {/* Assign Users Tab */}
            <TabsTrigger value="assign-users">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() =>
                      handleNavigation(`/Projects/${projectId}/assignUser`)
                    }
                  >
                    <List
                      className="-ms-0.5 me-1.5 opacity-60"
                      size={16}
                      aria-hidden="true"
                    />
                    Assign Users
                  </div>
                </TooltipTrigger>
                <TooltipContent>Go to Assign Users</TooltipContent>
              </Tooltip>
            </TabsTrigger>

            {/* Connections Tab */}
            <TabsTrigger value="connections">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() =>
                      handleNavigation(`/Projects/${projectId}/connections`)
                    }
                  >
                    <Share2
                      className="-ms-0.5 me-1.5 opacity-60"
                      size={16}
                      aria-hidden="true"
                    />
                    Connections
                  </div>
                </TooltipTrigger>
                <TooltipContent>Go to Connections</TooltipContent>
              </Tooltip>
            </TabsTrigger>

            {/* Dataset Tab */}
            <TabsTrigger value="dataset">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() =>
                      handleNavigation(`/Projects/${projectId}/dataset`)
                    }
                  >
                    <Database
                      className="-ms-0.5 me-1.5 opacity-60"
                      size={16}
                      aria-hidden="true"
                    />
                    Dataset
                  </div>
                </TooltipTrigger>
                <TooltipContent>Go to Dataset</TooltipContent>
              </Tooltip>
            </TabsTrigger>

            {/* Chart Tab */}
            <TabsTrigger value="chart">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() =>
                      handleNavigation(`/Projects/${projectId}/chart`)
                    }
                  >
                    <ChartNoAxesCombined
                      className="-ms-0.5 me-1.5 opacity-60"
                      size={16}
                      aria-hidden="true"
                    />
                    Chart
                  </div>
                </TooltipTrigger>
                <TooltipContent>Go to Chart</TooltipContent>
              </Tooltip>
            </TabsTrigger>

            {/* VisualizationTypes Tab */}
            {/* <TabsTrigger value="VisualizationTypes">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() =>
                      handleNavigation(`/Projects/VisualizationTypes`)
                    }
                  >
                    <Shapes
                      className="-ms-0.5 me-1.5 opacity-60"
                      size={16}
                      aria-hidden="true"
                    />
                    Visualization types
                  </div>
                </TooltipTrigger>
                <TooltipContent>Go to VisualizationTypes</TooltipContent>
              </Tooltip>
            </TabsTrigger> */}

            {/* Settings Tab */}
            <TabsTrigger value="settings">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() =>
                      handleNavigation(`/Projects/${projectId}/settings`)
                    }
                  >
                    <Settings
                      className="-ms-0.5 me-1.5 opacity-60"
                      size={16}
                      aria-hidden="true"
                    />
                    Settings
                  </div>
                </TooltipTrigger>
                <TooltipContent>Go to Settings</TooltipContent>
              </Tooltip>
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </Tabs>

      {isNavigating && (
        <div className="fixed inset-0 flex items-center justify-center  z-50">
          <Loading />
        </div>
      )}
    </div>
  );
}
