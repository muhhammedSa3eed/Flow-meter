import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { AppSidebarProjects } from "@/components/SidenavProjects/app-sideBarProjects";
import WelcomeMessage from "@/components/WelcomeMessage";
import Logout from "@/app/Logout";
import { CookiesProvider } from "next-client-cookies/server";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { Separator } from "@/components/ui/separator";
async function getProjects() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/projects`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
}
export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ ProjectId: number }>;
}) {
  const projectId = (await params).ProjectId;
  const projects = await getProjects();

  return (
    <>
      <AppSidebarProjects projects={projects} projectId={projectId} />
     
      <SidebarInset>
        <CookiesProvider>{children}</CookiesProvider>
      </SidebarInset>
    </>
  );
}
