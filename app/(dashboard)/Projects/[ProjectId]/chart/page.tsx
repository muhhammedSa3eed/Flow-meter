import { Suspense } from 'react';
import Loading from '@/app/loading';
import { ChartNoAxesCombined } from 'lucide-react';
import ProjectIdTabs from '@/components/ProjectIdTabs';
import ChartTable from '@/components/Data-Tables/ChartTable';
import { Chart } from '@/types';
import { getAllCharts, getChartsByProjectId } from '@/lib/projectData';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
// async function getChartsByProjectId(): Promise<Chart[]> {
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

  // const chart = await getAllCharts();
  const chart = await getChartsByProjectId(ProjectId);
  console.log({ chart });

  return (
    <>
      {chart && chart.length > 0 ? (
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
      ) : (
        <div className="flex items-center justify-center flex-col gap-2 h-[calc(100vh-135px)] shadow-none font-bold">
          <p className="text-4xl text-gray-700">
            No charts found for Project ID {ProjectId}
          </p>
          <Link
            href={`/Projects/${ProjectId}/addChart`}
            className="bg-[#48c389] px-3 py-1.5 text-white rounded-sm text-lg"
          >
            Add Chart
          </Link>
        </div>
      )}
    </>
  );
}
