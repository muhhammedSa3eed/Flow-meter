// import TestComponents from './testComponent';

import { Share2 } from "lucide-react";
import { columns } from "./columns";
import ConnectDataTable from "./connectData-table";
import { getDevices } from "@/lib/getDevice";
import { Suspense } from "react";
import Loading from "@/app/loading";
import ProjectIdTabs from "@/components/ProjectIdTabs";
import { dataPolling, dataType } from "@/lib/ConnectionsData";
import Header from "@/components/header";
import Link from "next/link";
import AddConnectionsWrapper from "@/components/CRUD/Connections/add-connections-wrapper";

export default async function Page({
  params,
}: {
  params: Promise<{ ProjectId: number }>;
}) {
  const ProjectId = (await params).ProjectId;
  // const projectName = (await params).projectName;
  // const decodedProjectName = decodeURIComponent(projectName);
  const devices = await getDevices(ProjectId);
  // const { projectName} = params;
  console.log({ devices });
  return (
    <>
      {devices && devices.length > 0 ? (
        <>
          <Header
            title={devices[0].projectName ?? ""}
            projectId={ProjectId}
            // description={project.description ?? ''}
          />
          {/* <ProjectIdTabs projectId={ProjectId} /> */}

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
        </>
      ) : (
        <div>
          <div className="flex items-center justify-center flex-col gap-4 h-[calc(100vh-135px)] shadow-none font-bold">
            <p className="text-4xl text-gray-700">
              No Connections found for Project ID {ProjectId}
            </p>
            <AddConnectionsWrapper ProjectId={ProjectId} />
            {/* <Link
              href={`/Projects/${ProjectId}/addChart`}
              className="bg-[#48c389] px-3 py-1.5 text-white rounded-sm text-lg"
            >
              Add Chart
            </Link> */}
          </div>
        </div>
      )}
    </>
  );
}
