import {
  SidebarGroup,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { Projects } from "@/types";
import AddProject from "../CRUD/projects/AddProject";
import { GetProject } from "../CRUD/projects/GetProject";
type NavMainPrpos = {
  projects :Projects[]
};
export function NavMain({projects} :NavMainPrpos) {


  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <AddProject/>

      <SidebarMenu>
        <GetProject projects={projects} />
      </SidebarMenu>
    </SidebarGroup>
  );
}
