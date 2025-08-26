"use client";

import { useRouter } from "next/navigation";
import ProjectActionsDropdown from "./CRUD/projects/ProjectActionsDropdown";
import AddProjectButton from "./motion/AddProject";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Projects } from "@/types";
import Link from "next/link";

interface ProjectsProps {
  projects: Projects;
}
const ProjectsWrapper = ({ projects }: ProjectsProps) => {
  const router = useRouter();
  const handleViewProject = (projectId: number) => {
    router.push(`/Projects/${projectId}`);
  };
  return (
    <div className="flex flex-1 flex-col gap-4 p-1 md:p-4 pt-0">
      {projects && Array.isArray(projects) && projects.length > 0 ? (
        <div className="grid auto-rows-min gap-4 md:grid-cols-2 p-3 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id}>
              <Card className="relative rounded-xl border-custom-green shadow-lg ">
                <CardHeader className="relative pt-4">
                  <CardTitle className="ml-1">{project.name}</CardTitle>
                  <div className="absolute top-0 right-0 p-2 mr-0">
                    <ProjectActionsDropdown projects={project} />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="ml-1">
                    {project.description}
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <AddProjectButton
                    className="flex items-center justify-center w-48 gap-x-2 text-base mx-auto  "
                    // onClick={() => handleViewProject(project.id)}
                  >
                    <Link
                      href={`/Projects/${project.id}`}
                      className="p-1 py-2 block w-full rounded-md"
                    >
                      View Details
                    </Link>
                  </AddProjectButton>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <h1 className="flex items-center justify-center h-4/5 text-center text-gray-500">
          No Projects Available
        </h1>
      )}
    </div>
  );
};

export default ProjectsWrapper;
