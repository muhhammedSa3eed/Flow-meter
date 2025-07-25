'use client';

import { useRouter } from 'next/navigation';
import ProjectActionsDropdown from './CRUD/projects/ProjectActionsDropdown';
import AddProjectButton from './motion/AddProject';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Projects } from '@/types';

interface ProjectsProps {
  projects: Projects;
}
const ProjectsWrapper = ({ projects }: ProjectsProps) => {
  const router = useRouter();
  const handleViewProject = (projectId: number) => {
    router.push(`/Projects/${projectId}`);
  };
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {projects && Array.isArray(projects) && projects.length > 0 ? (
        <div className="grid auto-rows-min gap-4 md:grid-cols-3 p-3">
          {projects.map((project) => (
            <div key={project.id}>
              <Card className="relative rounded-xl border-custom-green shadow-lg">
                <CardHeader className="relative">
                  <CardTitle className="ml-1">{project.name}</CardTitle>
                  <div className="absolute top-0 right-0 p-2 mr-3">
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
                    className="flex items-center justify-center w-full gap-2 text-base p-3"
                    onClick={() => handleViewProject(project.id)}
                  >
                    View {project.name} Details
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
