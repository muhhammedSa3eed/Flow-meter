// import TestComponents from './testComponent';

import { Share2 } from 'lucide-react';
import { columns } from './columns';
import ConnectDataTable from './connectData-table';
import { getDevices } from '@/lib/getDevice';
import { Suspense } from 'react';
import Loading from '@/app/loading';
import ProjectIdTabs from '@/components/ProjectIdTabs';
import { dataPolling, dataType } from '@/lib/ConnectionsData';

export default async function Page({
  params,
}: {
  params: Promise<{ ProjectId: number }>;
}) {
  const ProjectId = (await params).ProjectId;
  // const projectName = (await params).projectName;
  // const decodedProjectName = decodeURIComponent(projectName);
  const devices = await getDevices();
  // const { projectName} = params;
  console.log({ devices });
  return (
    <Suspense fallback={<Loading />}>
      <ProjectIdTabs projectId={ProjectId} />

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min mt-5 p-10">
          <div className="flex flex-row gap-4 text-custom-green2 mb-3">
            <Share2 />
            <div className="text-xl font-bold">
              Connections for: {devices[0].projectName}
            </div>
          </div>
          <ConnectDataTable
            ProjectId={ProjectId}
            selectType={dataType}
            selectPolling={dataPolling}
            data={devices}
            columns={columns}
          />
        </div>
      </div>
    </Suspense>
  );
}
