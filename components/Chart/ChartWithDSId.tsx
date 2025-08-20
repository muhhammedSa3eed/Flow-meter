'use client';
import React, { useEffect, useId, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '../ui/label';
import ReactECharts from 'echarts-for-react';

import { Braces, CaseUpper, ChevronDownIcon, Clock, Hash } from 'lucide-react';
import { Button } from '../ui/button';
import { ChartSchema } from '@/schemas';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '../ui/input';
import { Chart, Dataset, VisualizationTypes } from '@/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import MultipleSelector, { Option } from '@/components/ui/multiselect';
import DataForm from '../ChartOptions/DataForm';
import CustomizeChart from './CustomizeChart';
import { Table, TableBody, TableCell, TableHead, TableRow } from '../ui/table';
import type { TripsLogEntry, TripsLogResponse } from '@/types';
import SampleTable from '../Data-Tables/SampleTable';
import { motion } from 'motion/react';
import EmtyChart from '../motion/EmtyChart';
import CustomizeChartWrapper from './CustomizeChartWrapper';

export default function ChartWithDSId({
  datasetId,
  VisualizationTypeData,
  isAddChart,
}: {
  VisualizationTypeData: VisualizationTypes[];
  datasetId: number;
  isAddChart?: boolean;
}) {
  const id = useId();
  const [open, setOpen] = useState<boolean>(false);
  const [createdChartId, setCreatedChartId] = useState<number | null>(null);
  const [chartData, setChartData] = useState<Chart | null>(null);
  const [datasetDetails, setDatasetDetails] = useState<Dataset | null>(null);
  const [fieldsAndTypes, setFieldsAndTypes] = useState<Record<
    string,
    string
  > | null>(null);
  const [sampleData, setSampleData] = useState<TripsLogEntry[] | null>(null);

  const [columnOptions, setColumnOptions] = useState<Option[]>([]);
  useEffect(() => {
    if (datasetId) {
      form.setValue('datasetId', Number(datasetId));
    }
  }, [datasetId]);
  const form = useForm<z.infer<typeof ChartSchema>>({
    resolver: zodResolver(ChartSchema),
    defaultValues: {
      name: '',
      description: '',
      datasetId: datasetId,
      visualizationTypeId: 0,
      queryContext: '',
      useExistingQuery: true,
      dimensions: [],
    filters: [],
      metrics: [],
      sortBy: [],
      rowLimit: -1,
      customizeOptions: {},
    },
  });

  // const selectedTypeId = form.watch("visualizationTypeId");
  // const selectedTypeName =
  //   VisualizationTypeData.find((type) => type.id === selectedTypeId)?.name ||
  //   "";

  async function onSubmit(values: z.infer<typeof ChartSchema>) {
    console.log('Form submitted with values:', values);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/Charts`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || 'An error occurred.');
        return;
      }

      const createdChart = await response.json();
      setCreatedChartId(createdChart.id);
      toast.success('Chart has been successfully created.');
      const connectionId = createdChart.dataset.dbConnectionId;
      const schemaName = createdChart.dataset.schemaName;
      const tableName = createdChart.dataset.tableName;

      if (connectionId && schemaName && tableName) {
        // console.log(
        //   'connectionId :',
        //   connectionId,
        //   'schemaName :',
        //   schemaName,
        //   'tableName :',
        //   tableName
        // );
        fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/DS/table-data?connectionId=${connectionId}&schemaName=${schemaName}&tableName=${tableName}&limit=100&offset=0`
        )
          .then((res) => res.json())
          .then((data: TripsLogResponse) => {
            setSampleData(data.data);
            console.log(data);
          })
          .catch(() => {
            setSampleData([]);
          });
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error(`Failed to create chart: ${err.message}`);
      } else {
        toast.error('Failed to create chart due to an unknown error.');
      }
    }
  }

  useEffect(() => {
    if (createdChartId) {
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/Charts/${createdChartId}`)
        .then(async (response) => {
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server error: ${errorText}`);
          }
          return response.json();
        })
        .then((data: Chart) => {
          setChartData(data);
        })
        .catch((error) => {
          console.error('Error fetching chart:', error);
          toast.error('Failed to load chart data');
        });
    }
  }, [createdChartId]);

  useEffect(() => {
    if (datasetId) {
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/DS/${datasetId}`)
        .then(async (response) => {
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server error: ${errorText}`);
          }
          return response.json();
        })
        .then((data: Dataset) => {
          setDatasetDetails(data);
          setFieldsAndTypes(data.fieldsAndTypes);

          const options = Object.entries(data.fieldsAndTypes).map(
            ([key, value]) => ({
              value: key,
              label: `${key} (${value})`,
            })
          );
          setColumnOptions(options);
        })
        .catch((error) => {
          console.error('Error fetching dataset details:', error);
          toast.error(error.message);
        });
    }
  }, [datasetId]);

  const getIconForType = (type: string) => {
    if (
      type.includes('integer') ||
      type.includes('real') ||
      type.includes('id')
    ) {
      return <Hash size={16} className="text-muted-foreground" />;
    } else if (type.includes('character varying') || type.includes('string')) {
      return <CaseUpper size={16} className="text-muted-foreground" />;
    } else if (type.includes('timestamp')) {
      return <Clock size={16} className="text-muted-foreground" />;
    } else if (type.includes('json')) {
      return <Braces size={16} className="text-muted-foreground" />;
    }
    return null;
  };
  const isBigNumber = chartData?.visualizationType?.type
    .toLowerCase()
    .includes('bignumber');
  const isPieChart = chartData?.visualizationType?.type
    .toLowerCase()
    .includes('pie');
  const pieChartData = chartData?.data?.map((item) => {
    const keys = Object.keys(item);
    return {
      value: item[keys[1]],
      name: String(item[keys[0]]),
    };
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.log('Form errors:', errors);
        })}
        className="space-y-4"
      >
        <div className="flex gap-4 my-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="group relative">
                    <FormLabel
                      htmlFor={id}
                      className="origin-start absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-sm text-muted-foreground/70 transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium has-[+input:not(:placeholder-shown)]:text-foreground"
                    >
                      <span className="inline-flex bg-background px-2">
                        Enter Chart Name
                      </span>
                    </FormLabel>
                    <Input
                      className="border-none"
                      id={id}
                      type="text"
                      placeholder=""
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Separator className="my-4 bg-custom-green2" />

        <div className="h-[calc(100vh-150px)] w-full">
          <ResizablePanelGroup
            direction="horizontal"
            className="h-full w-full rounded-lg border"
          >
            <ResizablePanel defaultSize={25} minSize={20}>
              <ScrollArea className="h-full w-full">
                <div className="p-6">
                  <span className="font-semibold">
                    <FormField
                      control={form.control}
                      name="datasetId"
                      render={({ field }) => (
                        <input
                          type="hidden"
                          {...field}
                          value={Number(datasetId)}
                        />
                      )}
                    />

                    <div className="*:not-first:mt-2">
                      <Label>Dataset</Label>
                      <div className="bg-background border-input p-3 rounded-md">
                        {datasetDetails && (
                          <p className="font-medium">{datasetDetails.name}</p>
                        )}
                      </div>
                    </div>

                    <Accordion
                      type="single"
                      collapsible
                      className="w-full px-3"
                      defaultValue="item-2"
                    >
                      <AccordionItem value="item-2">
                        <AccordionTrigger>Columns</AccordionTrigger>
                        <AccordionContent>
                          {fieldsAndTypes ? (
                            <div className="space-y-2">
                              {Object.entries(fieldsAndTypes).map(
                                ([field, type]) => (
                                  <div
                                    key={field}
                                    className="flex items-center justify-between"
                                  >
                                    <div className="flex items-center gap-2">
                                      <Tooltip>
                                        <TooltipTrigger>
                                          {getIconForType(type)}
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Type: {type}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                      <span>{field}</span>
                                    </div>
                                  </div>
                                )
                              )}{' '}
                              {/* this is the missing closing paren */}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">
                              No columns selected.
                            </span>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </span>
                </div>
              </ScrollArea>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={25} minSize={20}>
              <ScrollArea className="h-full w-full">
                <div className="p-6">
                  <span className="font-semibold">
                    <Tabs defaultValue="data" className="w-full">
                      <TabsList className="flex w-full">
                        <TabsTrigger
                          value="data"
                          className="flex-1 text-center"
                        >
                          Data
                        </TabsTrigger>
                        <TabsTrigger
                          value="customize"
                          className="flex-1 text-center"
                        >
                          Customize
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="data" className="py-3">
                        <DataForm
                          form={form}
                          selectedDataset={datasetId}
                          VisualizationTypeData={VisualizationTypeData}
                          isAddChart={isAddChart}
                          columnOptions={columnOptions}
                        />
                      </TabsContent>
                      <TabsContent value="customize">
                        <CustomizeChartWrapper
                          chartData={chartData}
                          VisualizationTypeData={VisualizationTypeData}
                          form={form}
                        />
                        {/* <CustomizeChart
                          VisualizationTypeData={VisualizationTypeData}
                          form={form}
                          columnOptions={columnOptions}
                        /> */}
                      </TabsContent>
                    </Tabs>
                  </span>
                </div>
                <div className="p-6">
                  <Button type="submit" variant={'custom'} className="w-full">
                    Create Chart
                  </Button>
                </div>
              </ScrollArea>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="h-full w-full">
                <ResizablePanelGroup
                  direction="vertical"
                  className="h-full w-full rounded-lg border"
                >
                  <ResizablePanel defaultSize={70} minSize={40}>
                    <div className="flex flex-col h-full p-6">
                      <span className="font-semibold">Display chart</span>
                      <div className="flex-1 mt-4 p-4 flex items-center justify-center">
                        {!chartData?.data?.[0] ? (
                          <div className="flex flex-col items-center justify-center h-full">
                            <EmtyChart />
                            <motion.div
                              className="mt-10 text-center space-y-1"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6, delay: 0.2 }}
                            >
                              <p className="text-base text-muted-foreground font-medium">
                                Welcome to Neuss 👋
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Your chart preview will appear here once
                                created.
                              </p>
                            </motion.div>
                          </div>
                        ) : isBigNumber ? (
                          <div className="text-center space-y-2">
                            <div
                              className={`font-bold ${
                                chartData.customizeOptions?.BigNumberFontSize ||
                                'text-8xl'
                              }`}
                            >
                              {chartData.customizeOptions?.CurrencyFormat ===
                              'Prefix'
                                ? chartData.customizeOptions?.Currency || ''
                                : ''}
                              {Object.values(chartData.data[0])[0]}
                              {chartData.customizeOptions?.CurrencyFormat ===
                              'Suffix'
                                ? chartData.customizeOptions?.Currency || ''
                                : ''}
                            </div>
                            {chartData.customizeOptions?.Subtitle && (
                              <div className="text-muted-foreground text-sm">
                                {chartData.customizeOptions.Subtitle}
                              </div>
                            )}
                          </div>
                        ) : isPieChart ? (
                          <ReactECharts
                            option={{
                              title: {
                                text: chartData.name || 'Chart',
                                subtext:
                                  chartData.visualizationType?.type || 'Pie',
                                bottom: 'left',
                              },
                              tooltip: { trigger: 'item' },
                              legend: {
                                orient:
                                  chartData.customizeOptions?.Orientation ||
                                  'horizontal',
                                left: 'center',
                                top:
                                  chartData.customizeOptions?.Margin || 'top',
                                selector: true,
                                type: 'scroll',
                                pageIconColor: '#333',
                                pageIconInactiveColor: '#ccc',
                                pageIconSize: 16,
                                pageButtonGap: 5,
                                pageFormatter: '{current}/{total}',
                                pageIcons: {
                                  horizontal: [
                                    'path://M4,12 L12,4 L20,12',
                                    'path://M4,4 L12,12 L20,4',
                                  ],
                                },
                              },

                              series: [
                                {
                                  name:
                                    chartData.metrics?.[0]?.columnName ||
                                    'Value',
                                  type: 'pie',
                                  radius: chartData.customizeOptions?.Donut
                                    ? ['40%', '70%']
                                    : '50%',
                                  roseType:
                                    chartData.customizeOptions?.RoseType ||
                                    false,
                                  data: pieChartData,
                                  emphasis: {
                                    itemStyle: {
                                      shadowBlur: 10,
                                      shadowOffsetX: 0,
                                      shadowColor: 'rgba(0, 0, 0, 0.5)',
                                    },
                                  },
                                },
                              ],
                            }}
                            style={{ height: 400, width: '100%' }}
                          />
                        ) : (
                          <div className="text-muted-foreground text-sm italic">
                            {/* Optional placeholder for other chart types */}
                            This chart type will be rendered in its respective
                            preview component.
                          </div>
                        )}
                      </div>
                    </div>
                  </ResizablePanel>

                  <ResizableHandle withHandle />

                  <ResizablePanel defaultSize={30} minSize={20}>
                    <Tabs defaultValue="tab-1" className="h-full">
                      <TabsList className="h-auto rounded-none border-b bg-transparent p-0">
                        <TabsTrigger
                          value="tab-1"
                          className="data-[state=active]:after:bg-primary relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                        >
                          Result
                        </TabsTrigger>
                        <TabsTrigger
                          value="tab-2"
                          className="data-[state=active]:after:bg-primary relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                        >
                          Sample
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent
                        value="tab-1"
                        className="h-[calc(100%-40px)] p-4 overflow-auto"
                      >
                        {chartData?.data &&
                        Array.isArray(chartData.data) &&
                        chartData.data.length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left border-collapse">
                              <thead>
                                <tr>
                                  {/* Dynamically get headers from first item */}
                                  {Object.keys(chartData.data[0]).map((key) => (
                                    <th
                                      key={key}
                                      className="border-b p-2 font-medium text-foreground"
                                    >
                                      {key}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {chartData.data.map((row, idx) => (
                                  <tr key={idx}>
                                    {Object.values(row).map((value, vIdx) => (
                                      <td
                                        key={vIdx}
                                        className="border-b p-2 text-muted-foreground"
                                      >
                                        {value === null
                                          ? '-'
                                          : typeof value === 'number'
                                          ? value.toLocaleString()
                                          : String(value)}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <p className="text-muted-foreground text-center text-xs">
                              No valid data available
                            </p>
                          </div>
                        )}
                      </TabsContent>
                      <TabsContent
                        value="tab-2"
                        className="h-[calc(100%-40px)] truncate max-w-[800px]"
                      >
                        <SampleTable sampleData={sampleData ?? []} />{' '}
                      </TabsContent>
                    </Tabs>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </form>
    </Form>
  );
}
