'use client';

import * as React from 'react';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import UseAnimationFrame from '@/components/motion/UseAnimationFrame';
import RotatingCube from '@/components/motion/UseAnimationFrame';
import Link from 'next/link';

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string;
    logo: string;
    plan: string;
  }[];
}) {
  const { isMobile } = useSidebar();
  const [activeTeam] = React.useState(teams[0]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex flex-row items-center gap-2">
          {!isMobile && (
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
              <RotatingCube />
            </div>
          )}

          <SidebarMenuButton
            size="lg"
            className="flex-1 data-[state=open]:bg-sidebar-accent  data-[state=open]:text-sidebar-accent-foreground hover:bg-custom-green2"
          >
            <Link href="/Projects" passHref>
              <div className="grid text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeTeam.name}
                </span>
                <span className="truncate text-xs">{activeTeam.plan}</span>
              </div>
            </Link>
          </SidebarMenuButton>
          <SidebarTrigger className="-ml-1" />
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
