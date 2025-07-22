import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ModeToggle } from '@/components/ui/ModeToggle';
import { Separator } from '@/components/ui/separator';
import { AppSidebar } from '@/components/sidenav/app-sidebar';
import Logout from '../../Logout';
import WelcomeMessage from '../../../components/WelcomeMessage';
import { CookiesProvider } from 'next-client-cookies/server';
import { AppSidebarProjects } from '@/components/SidenavProjects/app-sideBarProjects';
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
 
  
    <>
        <SidebarProvider>

        <AppSidebar   />
        <SidebarInset>
          
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 justify-between">
        
          <div className="flex items-center gap-8 px-4">
          <SidebarTrigger />
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
        <div className="bg-[hsl(var(--background-primary))] text-foreground border border-border rounded-lg shadow-md p-4 m-4 ">
          <CookiesProvider>{children}</CookiesProvider>
        </div>
          </SidebarInset>
          </SidebarProvider>
        </>
  );
}
