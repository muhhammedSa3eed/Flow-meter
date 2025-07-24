import { Suspense } from 'react';
import Loading from '@/app/loading';
import { ChartNoAxesCombined } from 'lucide-react';
import ProjectIdTabs from '@/components/ProjectIdTabs';
import ChartTable from '@/components/Data-Tables/ChartTable';
import { Chart } from '@/types';
import { getAllCharts } from '@/lib/projectData';
import Header from '@/components/header';
// async function getAllCharts(): Promise<Chart[]> {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/Charts`, {
//     cache: 'no-store',
//   });

//   if (!res.ok) {
//     throw new Error('Failed to fetch data');
//   }

//   return res.json();
// }
export default async function Page({
  params,
}: {
  params: Promise<{ ProjectId: number }>;
}) {
  const ProjectId = (await params).ProjectId;

  const chart = await getAllCharts();
  console.log({ chart });

  return (
    <>
      <Header
        title={chart[0].dataset.projectName ?? ''}
        projectId={ProjectId}
        // description={project.description ?? ''}
      />
      {/* <ProjectIdTabs projectId={ProjectId} /> */}
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min mt-5 p-10">
          <div className="flex flex-row gap-4 text-custom-green2 mb-3">
            <ChartNoAxesCombined />
            <div className="text-xl font-bold">
              Charts for: {chart[0].dataset.projectName}
            </div>
          </div>

          <ChartTable ProjectId={ProjectId} chart={chart} />
        </div>
      </div>
    </>
  );
}
