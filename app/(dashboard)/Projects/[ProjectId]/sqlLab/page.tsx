import React from 'react';
import ProjectIdTabs from '@/components/ProjectIdTabs';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Dataset } from '@/types';
import { getAllVisualizationTypes } from '@/lib/projectData';
import SqlLab from '@/components/SqlLab/SqlLab';



export default async function SqlLabPage({
  params,
}: {
  params: Promise<{
    ProjectId: number;
  }>;
}) {
  const ProjectId = (await params).ProjectId;
  return (
    <>
      <ProjectIdTabs projectId={ProjectId} />
      <SqlLab ProjectId={ProjectId}/>
    </>
  );
}
