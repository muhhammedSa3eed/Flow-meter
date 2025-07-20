'use client';

import { Shapes, Users } from 'lucide-react';
import {
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import Link from 'next/link';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
const VisualizationNav = () => {
  return (
    // <Tooltip>
    //   <TooltipTrigger asChild>
    //     <div
    //       className="flex items-center cursor-pointer"
    //       onClick={() => handleNavigation(`/Projects/VisualizationTypes`)}
    //     >
    //       <Shapes
    //         className="-ms-0.5 me-1.5 opacity-60"
    //         size={16}
    //         aria-hidden="true"
    //       />
    //       Visualization types
    //     </div>
    //   </TooltipTrigger>
    //   <TooltipContent>Go to VisualizationTypes</TooltipContent>
    // </Tooltip>
    <SidebarMenu>
      <SidebarMenuItem>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/Projects/VisualizationTypes" passHref>
                <SidebarGroupLabel className="font-bold text-md text-gray-400 hover:text-blue-500">
                  Visualization Types
                  <Shapes className="ml-auto" />
                </SidebarGroupLabel>
              </Link>
            </TooltipTrigger>
            <TooltipContent className="bg-blue-500 text-white">
              <p>View Visualization Types</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </SidebarMenuItem>
      {/* <hr /> */}
    </SidebarMenu>
  );
};

export default VisualizationNav;
