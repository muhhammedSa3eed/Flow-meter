/* eslint-disable @typescript-eslint/no-unused-vars */
import { DashboardWrapper } from '@/components/dashboard/dashboard-wrapper';
import { getAllCharts } from '@/lib/projectData';
import { ChartItem, Dashboard } from '@/types';

async function getDashboardsById(
  ProjectId: number,
  dashboardId: number
): Promise<Dashboard> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/projects/${ProjectId}/dashboards/${dashboardId}`,
    {
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
}
// async function getAllCharts(): Promise<ChartItem[]> {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/Charts`, {
//     cache: 'no-store',
//   });

//   if (!res.ok) {
//     throw new Error('Failed to fetch data');
//   }

//   return res.json();
// }

const EditScreenPage = async ({
  params,
}: {
  params: Promise<{ dashboardId: number; ProjectId: number }>;
}) => {
  const { ProjectId, dashboardId } = await params;
  const dashboard = await getDashboardsById(ProjectId, dashboardId);
  const chartData = await getAllCharts();
  // console.log({ dashboard });
  return (
    <div>
      <DashboardWrapper
        ProjectId={ProjectId}
        charts={chartData}
        dashboardId={dashboardId}
        dashboardName={dashboard.name}
      />
    </div>
  );
};

export default EditScreenPage;
