import React, { Suspense } from 'react';
import Loading from '@/app/loading';
import ProjectIdTabs from '@/components/ProjectIdTabs';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Chart, VisualizationTypes } from '@/types';
// import EditChartWrapper from '@/components/CRUD/ChartOP/EditChartWrapper';
import { getAllVisualizationTypes } from '@/lib/projectData';
import Header from '@/components/header';
import EditChartWrapper from '@/components/CRUD/ChartOP/EditChartWrapper';

async function getChartData(chartId: number): Promise<Chart> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/Charts/${chartId}`,
    {
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch chart data: ${res.statusText}`);
  }

  const response = await res.json();
  console.log('Chart data:', response);
  return response;
}

export default async function EditChart({
  params,
}: {
  params: Promise<{
    ProjectId: number;
    projectName: string;
    chartId: number;
  }>;
}) {
  // const { ProjectId, projectName, chartId } = await params;
  const ProjectId = (await params).ProjectId;
  const projectName = (await params).projectName;
  const chartId = (await params).chartId;
  const [VisualizationTypeData, chartDataDetails] = await Promise.all([
    getAllVisualizationTypes(),
    getChartData(chartId),
  ]);

  // console.log('from server', { chartDataDetails });
  return (
    <>
      <Header
        title={projectName ?? ''}
        projectId={ProjectId}
        // description={project.description ?? ''}
      />

      <Label className="font-bold  my-2">Update Chart </Label>

      <EditChartWrapper
        VisualizationTypeData={VisualizationTypeData}
        chartId={chartId}
        ProjectId={ProjectId}
        projectName={projectName}
        chartDetails={chartDataDetails}
      />
    </>
  );
}
