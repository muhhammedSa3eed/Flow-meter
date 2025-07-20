import React from 'react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal,Settings, Share2, List } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
export default function ProjectLink() {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="mr-3" asChild>
          <span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <MoreHorizontal />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Configration</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-48 rounded-lg"
          side="right"
          align="start"
        >
          <DropdownMenuItem className="text-blue-500" >
            <List />
            <span>Assign users</span>
          </DropdownMenuItem>
          <DropdownMenuItem className=" text-green-500" >
            <Share2  />
            <span>Connections</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem className=" text-gray-600" >
            <Settings  />
            <span>Setting</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
