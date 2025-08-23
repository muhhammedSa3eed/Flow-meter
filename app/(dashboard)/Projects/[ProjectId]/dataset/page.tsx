import { Suspense } from "react";
import Loading from "@/app/loading";
import { Database } from "lucide-react";
import ProjectIdTabs from "@/components/ProjectIdTabs";
import DatasetTable from "@/components/Data-Tables/DatasetTable";
import { Dataset } from "@/types";
import Header from "@/components/header";
import Link from "next/link";

async function getDatasetByProjectId(projectId: number): Promise<Dataset[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/DS/datasets/${projectId}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function Page({
  params,
}: {
  params: Promise<{
    ProjectId: number;

    datasetId: number;
  }>;
}) {
  const ProjectId = (await params).ProjectId;
  const datasetId = (await params).datasetId;
  const datasets = await getDatasetByProjectId(ProjectId);
  console.log({ datasets });
  return (
    <>
      {datasets && datasets.length > 0 ? (
        <>
          <Header
            title={datasets[0].projectName ?? ""}
            projectId={ProjectId}
            // description={project.description ?? ''}
          />
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="min-h-[100%] flex-1 rounded-xl bg-muted/50 md:min-h-min mt-5 p-2 md:p-10">
              <div className="flex flex-row gap-4 text-custom-green2 mb-3">
                <Database />
                <div className="text-xl font-bold">
                  Dataset for: {datasets[0].projectName}
                </div>
              </div>

              <DatasetTable
                datasetId={datasetId}
                ProjectId={ProjectId}
                datasets={datasets}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center flex-col gap-2 h-[calc(100vh-135px)] shadow-none font-bold">
          <p className="text-4xl text-gray-700">
            No Datasets found for Project ID {ProjectId}
          </p>
          <Link
            href={`/Projects/${ProjectId}/addDataset`}
            className="bg-[#48c389] px-3 py-1.5 text-white rounded-sm text-lg"
          >
            Add Dataset
          </Link>
        </div>
      )}
    </>
  );
}
