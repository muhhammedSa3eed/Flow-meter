import React, { Suspense } from "react";
import Loading from "@/app/loading";
import ProjectIdTabs from "@/components/ProjectIdTabs";

import { Label } from "@radix-ui/react-dropdown-menu";
import { Projects } from "@/types";
import EditDatasetPage from "@/components/Dataset/EditDatasetPage";
async function getProjectById(id: number): Promise<Projects> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/DB/project/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
export default async function EditDataset({
  params,
}: {
  params: Promise<{
    ProjectId: number;
    projectName: string;
    projectData: Projects;
    datasetId: number;
  }>;
}) {
  const ProjectId = (await params).ProjectId;
  const projectName = (await params).projectName;
  const datasetId = (await params).datasetId;


  const project = await getProjectById(ProjectId);
 
  return (
    <>
      <ProjectIdTabs  projectName={projectName} projectId={ProjectId} />
      <Label className="font-bold ml-4 my-2">Update Dataset </Label>

      <EditDatasetPage datasetId={datasetId} ProjectId={ProjectId} projectName={projectName} />
    </>
  );
}
