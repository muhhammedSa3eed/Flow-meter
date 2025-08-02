import React, { Suspense } from 'react';
import Loading from '@/app/loading';
import ProjectIdTabs from '@/components/ProjectIdTabs';
import { Label } from '@radix-ui/react-dropdown-menu';
import ChooseChart from '@/components/Chart/ChooseChart';
import { Dataset } from '@/types';
import { getAllVisualizationTypes } from '@/lib/projectData';

async function getDataSet(): Promise<Dataset[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/DS`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  const response = await res.json();
  // console.log('data', response);
  return response;
}

export default async function AddChart({
  params,
}: {
  params: Promise<{
    ProjectId: number;
    projectName: string;
    datasetId: number;
  }>;
}) {
  const ProjectId = (await params).ProjectId;
  // console.log('dataset :', datasetId);
  const VisualizationTypeData = await getAllVisualizationTypes();
  const dataSet = await getDataSet();
  return (
    <>
      <ProjectIdTabs projectId={ProjectId} />
      <Label className="font-bold my-2">Chart</Label>
      <ChooseChart VisualizationTypeData={VisualizationTypeData} dataSet={dataSet}/>
    </>
  );
}
