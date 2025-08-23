import { Suspense } from "react";
import Loading from "@/app/loading";
import { Users } from "lucide-react";
import { UsersTypes } from "@/types";
import ProjectIdTabs from "@/components/ProjectIdTabs";
import AssignUsersTable from "@/components/Data-Tables/AssignUserTable";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";

async function getUserByProjectId(ProjectId: number): Promise<UsersTypes> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/Projects/${ProjectId}/users`,
    {
      cache: "no-store",
    }
  );
  console.log(res);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function Page({
  params,
}: {
  params: Promise<{ ProjectId: number }>;
}) {
  const ProjectId = (await params).ProjectId;
  const users = await getUserByProjectId(ProjectId);
  console.log({ users });
  return (
    <>
      {/* <ProjectIdTabs projectId={ProjectId} /> */}
      <Header
        title={users.projectName ?? ""}
        projectId={ProjectId}
        // description={project.description ?? ''}
      />
      {/* <div className="flex flex-nowrap">
        <div className="m-4">
          {' '}
          <HoverCard>
            <HoverCardTrigger className="font-semibold">
              <Button variant="outline">
                <strong>Project name :</strong> {users.projectName}
              </Button>
            </HoverCardTrigger>

            <HoverCardContent className="rounded-[2vw]">
              <p className="m-2">
                <strong className="text-custom-green2">Description:</strong>{' '}
                {users.description || 'No description available'}
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
          <ProjectIdTabs
            projectName={users.projectName}
            projectId={ProjectId}
          />
        </div>
      </div> */}
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[100%] flex-1 rounded-xl bg-muted/50 md:min-h-min mt-5 p-2 md:p-10">
          <div className="flex flex-row gap-4 text-custom-green2 mb-3">
            <div>
              <Users />
            </div>
            <div className="text-xl font-bold gap-2">
              Assign or invite Users for: {users.projectName}
            </div>
          </div>
          <AssignUsersTable
            ProjectId={ProjectId}
            projectName={users.projectName}
            users={users.users}
          />
        </div>
      </div>
    </>
  );
}
