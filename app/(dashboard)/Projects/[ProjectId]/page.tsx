import Loading from '@/app/loading';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import React, { Suspense } from 'react';
import Link from 'next/link';
import { Projects } from '@/types';
import ViewActionsDropdown from '@/components/CRUD/Views/ViewActionsDropdown';
import { Eye, Pencil } from 'lucide-react';
import ViewButton from '@/components/motion/ViewButton';
import ProjectIdTabs from '@/components/ProjectIdTabs';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Button } from '@/components/ui/button';

async function getProjectById(id: number): Promise<Projects> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/projects/${id}`,
    {
      cache: 'no-store',
    }
  );
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ ProjectId: number }>;
}) {
  const ProjectId = (await params).ProjectId;
  const project = await getProjectById(ProjectId);
  // console.log({ project });
  return (
    <Suspense fallback={<Loading />}>
      <div className="flex flex-nowrap">
        <div className="m-4">
          {' '}
          <HoverCard>
            <HoverCardTrigger className="font-semibold">
              <Button variant="outline">
                <strong>Project name :</strong> {project.name}
              </Button>
            </HoverCardTrigger>

            <HoverCardContent className="rounded-[2vw]">
              <p className="m-2">
                <strong className="text-custom-green2">Description:</strong>{' '}
                {project.description || 'No description available'}
              </p>
              <p className="m-2">
                <strong className="text-custom-green2">Created At:</strong>{' '}
                {new Date(project.createdAt).toLocaleString()}
              </p>
              <p className="m-2">
                <strong className="text-custom-green2">Updated At:</strong>{' '}
                {new Date(project.updatedAt).toLocaleString()}
              </p>{' '}
            </HoverCardContent>
          </HoverCard>
        </div>
        <div>
          {' '}
          <ProjectIdTabs projectName={project.name} projectId={ProjectId} />
        </div>
      </div>

      <div className="flex flex-col gap-6 m-6">
        {project ? (
          <>
            {/* <Card className="border shadow-md">
              <CardHeader className="relative">
                <CardTitle>{project.name}</CardTitle>
                <div className="absolute top-0 right-0  ">
                  <ProjectIdTabs
                    projectName={project.name}
                    projectId={ProjectId}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  <p>
                    <strong>Description:</strong>{" "}
                    {project.description || "No description available"}
                  </p>
                  <p>
                    <strong>Created At:</strong>{" "}
                    {new Date(project.createdAt).toLocaleString()}
                  </p>
                  <p>
                    <strong>Updated At:</strong>{" "}
                    {new Date(project.updatedAt).toLocaleString()}
                  </p>
                </CardDescription>
              </CardContent>
            </Card> */}

            {/* Views Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg">
                  Dashboards for {project.name}
                </h2>
              </div>
              <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                {project.dashboards && project.dashboards.length > 0 ? (
                  project.dashboards.map((view) => (
                    <Card
                      key={view.id}
                      className={`border shadow-md bg-${view.background}`}
                      style={{ backgroundColor: view.background }}
                    >
                      <CardHeader className="relative">
                        <CardTitle>{view.name}</CardTitle>
                        <div className="absolute top-0 right-0 p-2 mr-5">
                          <ViewActionsDropdown
                            projectId={ProjectId}
                            views={view}
                          />{' '}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>
                          <p>
                            <strong>Description:</strong>{' '}
                            {view.description || 'No description'}
                          </p>
                          <p>
                            <strong>Created At:</strong>{' '}
                            {new Date(view.createdAt).toLocaleString()}
                          </p>
                          <p>
                            <strong>Updated At:</strong>{' '}
                            {new Date(view.updatedAt).toLocaleString()}
                          </p>
                        </CardDescription>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center space-x-3">
                        <Link
                          className="w-full"
                          href={`/Projects/${ProjectId}/dashboard/${view.id}?edit=true`}
                          passHref
                        >
                          <ViewButton className="flex items-center">
                            Edit <Pencil className="ml-3" size={18} />
                          </ViewButton>
                        </Link>

                        <Link
                          href={`/Projects/${ProjectId}/dashboard/${view.id}?edit=false`}
                          passHref
                          className="w-full"
                        >
                          <ViewButton className="flex items-center">
                            View <Eye size={18} className="ml-3" />
                          </ViewButton>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <p className="text-gray-500">
                    No views available for this project.
                  </p>
                )}
              </div>
            </div>
          </>
        ) : (
          <p className="text-gray-500">Failed to load project details.</p>
        )}
      </div>
    </Suspense>
  );
}
