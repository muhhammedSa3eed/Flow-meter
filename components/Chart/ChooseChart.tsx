'use client';
import React, { useEffect, useId, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '../ui/button';
import type { TripsLogEntry, TripsLogResponse } from '@/types';
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
import { Chart, Dataset } from '@/types';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';

import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Option } from '@/components/ui/multiselect';

import { VisualizationTypes } from '@/types';
import DataForm from '../ChartOptions/DataForm';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import SampleTable from '../Data-Tables/SampleTable';
import CustomizeChartWrapper from './CustomizeChartWrapper';
import ChartDisplay from './ChartDisplay';
import DatasetSelector from './DatasetSelector';

export default function ChooseChart({
  VisualizationTypeData,
  dataSet,
}: {
  VisualizationTypeData: VisualizationTypes[];
  dataSet: Dataset[];
}) {
  console.log({ dataSet });
  const id = useId();
  const [createdChartId, setCreatedChartId] = useState<number | null>(null);
  const [chartData, setChartData] = useState<Chart | null>(null);
  const [databases, setDataset] = useState<Dataset[]>([]);
  const [openDataset, setOpenDataset] = useState<boolean>(false);
  const [selectedDataset, setSelectedDataset] = useState<number | null>(null);
  const [fieldsAndTypes, setFieldsAndTypes] = useState<Record<
    string,
    string
  > | null>(null);
  const [sampleData, setSampleData] = useState<TripsLogEntry[] | null>(null);
  const [columnOptions, setColumnOptions] = useState<Option[]>([]);
  const [isAddChart, setIsAddChart] = useState<boolean>(true);
  const form = useForm<z.infer<typeof ChartSchema>>({
    resolver: zodResolver(ChartSchema),
    defaultValues: {
      id: 0,
      name: '',
      description: '',
      datasetId: 0,
      visualizationTypeId: 0,
      queryContext: '',
      useExistingQuery: true,
      dimensions: [],
      dynamicFilters: [],
      metrics: [],
      sortBy: [],
      rowLimit: null,
      customizeOptions: {},
      xAxis: {},
      xAxisSortBy: '',
      xAxisSortAscending: null,
    },
  });
  const [updateTrigger, setUpdateTrigger] = useState<boolean>(false);

  const handleUpdateTrigger = () => {
    setUpdateTrigger((prev) => !prev);
    setIsAddChart(false);
  };
  

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
          console.log('Chart data updated:', data);
        })
        .catch((error) => {
          console.error('Error fetching chart:', error);
          toast.error('Failed to load chart data');
        });
    }
  }, [createdChartId, updateTrigger]);

  async function onSubmit(values: z.infer<typeof ChartSchema>) {
    console.log('Form submitted!');
    console.log('Form values:', JSON.stringify(values));
    try {
      const url = createdChartId
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/Charts/${createdChartId}`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/Charts`;

      const method = createdChartId ? 'PUT' : 'POST';
      // createdChartId ? setIsAddChart(false) : setIsAddChart(true);
      console.log(`Request Method: ${method}, URL: ${url}`);

      const payload = {
        ...values,
        id: createdChartId ?? values.id,
      };

      console.log('Payload:', payload);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get('Content-Type');

      if (!response.ok) {
        let errorMessage = 'An error occurred.';

        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } else {
          errorMessage = await response.text();
        }

        toast.error(errorMessage);
        console.error(`Error Response: ${errorMessage}`);
        return;
      }

      let chartResponse: any;

      if (contentType && contentType.includes('application/json')) {
        chartResponse = await response.json();
      } else {
        chartResponse = await response.text();
      }

      if (!createdChartId) {
        setCreatedChartId(chartResponse.id);
        form.setValue('id', chartResponse.id);
        toast.success('Chart has been successfully created.');
      } else {
        toast.success('Chart has been successfully updated.');
      }

      handleUpdateTrigger();

      const connectionId = chartResponse.dataset?.dbConnectionId;
      const schemaName = chartResponse.dataset?.schemaName;
      const tableName = chartResponse.dataset?.tableName;

      if (connectionId && schemaName && tableName) {
        console.log(
          'connectionId :',
          connectionId,
          'schemaName :',
          schemaName,
          'tableName :',
          tableName
        );

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
        toast.error(
          `Failed to ${createdChartId ? 'update' : 'create'} chart: ${
            err.message
          }`
        );
      } else {
        toast.error(
          `Failed to ${
            createdChartId ? 'update' : 'create'
          } chart due to an unknown error.`
        );
      }
    }
  }

  // useEffect(() => {
  //   fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/DS`)
  //     .then(async (response) => {
  //       if (!response.ok) {
  //         const errorText = await response.text();
  //         throw new Error(`Server error: ${errorText}`);
  //       }
  //       return response.json();
  //     })
  //     .then((data: Dataset[]) => {
  //       console.log('xxxxxx=>', { data });
  //       setDataset(data);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching dataset:', error);
  //     });
  // }, []);

  useEffect(() => {
    if (selectedDataset) {
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/DS/${selectedDataset}`)
        .then(async (response) => {
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server error: ${errorText}`);
          }
          return response.json();
        })
        .then((data: Dataset) => {
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
          console.error('Error fetching columns:', error);
        });
    }
  }, [selectedDataset]);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-4 my-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <div className="group relative ">
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
                  <DatasetSelector
                    databases={dataSet}
                    openDataset={openDataset}
                    setOpenDataset={setOpenDataset}
                    selectedDataset={selectedDataset}
                    setSelectedDataset={setSelectedDataset}
                    fieldsAndTypes={fieldsAndTypes}
                    control={form.control}
                  />
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
                            selectedDataset={selectedDataset}
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
                        </TabsContent>
                      </Tabs>
                    </span>
                  </div>
                  <div className="p-6">
                    <Button type="submit" variant={'custom'} className="w-full">
                      {createdChartId ? 'Update Chart' : 'Create Chart'}
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
                        <ChartDisplay
                          chartData={chartData}
                          createdChartId={createdChartId}
                        />
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
                              <Table className="text-sm border-collapse w-full">
                                <TableHeader>
                                  <TableRow>
                                    {Object.keys(chartData.data[0]).map(
                                      (key) => (
                                        <TableHead
                                          key={key}
                                          className="whitespace-nowrap p-2 border-b font-medium text-foreground"
                                        >
                                          {key}
                                        </TableHead>
                                      )
                                    )}
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {chartData.data.map((row, i) => (
                                    <TableRow key={i}>
                                      {Object.values(row).map((val, j) => (
                                        <TableCell
                                          key={j}
                                          className="whitespace-nowrap p-2 border-b text-muted-foreground"
                                        >
                                          {val === null
                                            ? '-'
                                            : typeof val === 'number'
                                            ? val.toLocaleString()
                                            : String(val)}
                                        </TableCell>
                                      ))}
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
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
    </>
  );
}
