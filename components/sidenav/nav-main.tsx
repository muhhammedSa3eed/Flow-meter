'use client';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { CirclePlus, LucideIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import AddProject from '../CRUD/projects/AddProject';

export function NavMain({
  items,
}: {
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
              } hover:bg-accent hover:text-foreground
              `}
            >
              <AddProject />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <Link href={item.url} className="w-full">
                <SidebarMenuButton
                  tooltip={item.title}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-md transition-colors
                  ${
                    pathname === item.url
                      ? 'bg-custom-green2 text-white dark:bg-custom-green2'
                      : 'bg-gray-200 text-black dark:bg-gray-800 dark:text-white'
                  }
                    hover:bg-accent hover:text-foreground
                    `}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
