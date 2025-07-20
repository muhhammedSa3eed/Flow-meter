import { Suspense } from 'react';
import Loading from '@/app/loading';
import { Shapes } from 'lucide-react';
import ProjectIdTabs from '@/components/ProjectIdTabs';
import { VisualizationTypes } from '@/types';
import VisualizationTypesTable from '@/components/Data-Tables/VisualizationTypesTable';
async function getAllVisualizationTypes(): Promise<VisualizationTypes[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/VisualizationTypes`,
    {
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  const response = await res.json();
  return response.data;
}

export default async function Page({
  params,
}: {
  params: Promise<{ ProjectId: number }>;
}) {
  const ProjectId = (await params).ProjectId;

  const VisualizationTypeData = await getAllVisualizationTypes();

  return (
    <Suspense fallback={<Loading />}>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min mt-5 p-10">
          <div className="flex flex-row gap-4 text-custom-green2 mb-3">
            <Shapes />
            <div className="text-xl font-bold">Visualization Types</div>
          </div>

          <VisualizationTypesTable
            VisualizationTypesData={VisualizationTypeData}
          />
        </div>
      </div>
    </Suspense>
  );
}
