import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { ModeToggle } from '@/components/ui/ModeToggle';
import { Separator } from '@/components/ui/separator';
import { AppSidebar } from '@/components/sidenav/app-sidebar';
import Logout from '../../Logout';
import WelcomeMessage from '../../../components/WelcomeMessage';
import { Suspense } from 'react';
import Loading from '../../loading';
import { CookiesProvider } from 'next-client-cookies/server';
// import { getProjects } from '@/actions/ProjectApi';

async function getProjects() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/projects`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
}
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const projects = await getProjects();
  return (
    <SidebarProvider>
      <AppSidebar projects={projects} />
      {/* <Suspense fallback={<Loading />}>
        
      </Suspense> */}
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 justify-between">
          <div className="flex items-center gap-8 px-4">
            <Separator orientation="vertical" className="mr-2" />
            <WelcomeMessage />
          </div>
          <div className="flex items-center gap-3 justify-end p-6">
            <div className="flex items-center gap-6 pr-4">
              <Logout />
              <ModeToggle />
            </div>
          </div>
        </header>
        <div className="bg-[hsl(var(--background-chlidren))] text-foreground border border-border rounded-lg shadow-md p-4 m-4 ">
          <CookiesProvider>{children}</CookiesProvider>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
