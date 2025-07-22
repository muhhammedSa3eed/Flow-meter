import React, { Suspense } from "react";
import MultiStepCampaign from "@/app/multi-step-form/(campaign)/_components/multi-step-campaign";
import Loading from "@/app/loading";
import ProjectIdTabs from "@/components/ProjectIdTabs";

  export default async function Settings({
    params,
  }: {
    params: Promise<{ ProjectId: number; projectName: string }>
  }) {
    const ProjectId = (await params).ProjectId
    const projectName = (await params).projectName
  return (
    <>
      <div className="flex flex-col">
        <div className="flex justify-center items-center">
        <ProjectIdTabs projectName={projectName} projectId={ProjectId} />

        </div>
        <div className="flex justify-center items-center min-h-96 pb-5">
          <MultiStepCampaign projectName={projectName} ProjectId={ProjectId} />
        </div>
      </div>
    </>
  );
}
