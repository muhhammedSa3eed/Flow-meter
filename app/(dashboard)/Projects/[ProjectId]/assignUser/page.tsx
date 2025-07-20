import { Suspense } from 'react';
import Loading from '@/app/loading';
import { Users } from 'lucide-react';
import { UsersTypes } from '@/types';
import ProjectIdTabs from '@/components/ProjectIdTabs';
import AssignUsersTable from '@/components/Data-Tables/AssignUserTable';

async function getUserByProjectId(ProjectId: number): Promise<UsersTypes> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/Projects/${ProjectId}/users`,
    {
      cache: 'no-store',
    }
  );
  console.log(res);
  if (!res.ok) {
    throw new Error('Failed to fetch data');
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
    <Suspense fallback={<Loading />}>
      <ProjectIdTabs projectId={ProjectId} />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min mt-5 p-10">
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
    </Suspense>
  );
}
