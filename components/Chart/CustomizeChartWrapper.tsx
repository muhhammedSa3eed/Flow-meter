'use client';

import { ChartSchema } from '@/schemas';
import { Chart, VisualizationTypes } from '@/types';
import { UseFormReturn, useWatch } from 'react-hook-form';
import { z } from 'zod';
import CustomizeChart from './CustomizeChart';
import CustomizeChartBigNumber from './CustomizeChartBigNumber';

const CustomizeChartWrapper = ({
  form,
  VisualizationTypeData,
  
}: {
  form: UseFormReturn<z.infer<typeof ChartSchema>>;
  VisualizationTypeData: VisualizationTypes[];
  chartData?: Chart | null;
}) => {
  const selectedTypeId = useWatch({
    control: form.control,
    name: 'visualizationTypeId',
  });

  const selectedTypeData = VisualizationTypeData.find(
    (type) => type.id === selectedTypeId
  );
  console.log('12345', { selectedTypeId });
  console.log({ VisualizationTypeData });
  console.log('selectedTypeData.type', selectedTypeData?.type);
  const activecustomizeOptions: Record<string, boolean> =
    selectedTypeData?.optionsFields?.reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    ) || {};
  return (
    <div>
      {selectedTypeData?.type == 'pie' ? (
        <CustomizeChart
          VisualizationTypeData={VisualizationTypeData}
          form={form}
          activeCustomizeOptions={activecustomizeOptions}
        />
      ) : selectedTypeData?.type == 'bignumber' ? (
        <CustomizeChartBigNumber
          VisualizationTypeData={VisualizationTypeData}
          form={form}
          activeCustomizeOptions={activecustomizeOptions}
        />
      ) : null}
    </div>
  );
};

export default CustomizeChartWrapper;
