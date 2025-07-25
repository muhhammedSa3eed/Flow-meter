'use client';
import React, { useEffect, useId, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Braces, CaseUpper, ChevronDownIcon, Clock, Hash } from 'lucide-react';

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
import {
  Chart,
  Dataset,
  TripsLogEntry,
  TripsLogResponse,
  VisualizationTypes,
} from '@/types';
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
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

import CustomizeChart from '@/components/Chart/CustomizeChart';
import DataForm, { IconOptions } from '@/components/ChartOptions/DataForm';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import SampleTable from '@/components/Data-Tables/SampleTable';
import { motion } from 'motion/react';
import EmtyChart from '@/components/motion/EmtyChart';
import ReactECharts from 'echarts-for-react';
import { formatToDateAndTime } from '@/lib/formate-date';
import { useRouter } from 'next/navigation';
import { Option } from '@/components/ui/multiselect';
import CustomizeChartBigNumber from '@/components/Chart/CustomizeChartBigNumber';
import CustomizeChartWrapper from '@/components/Chart/CustomizeChartWrapper';

export default function EditChartWrapper({
  ProjectId,
  projectName,
  chartId,
  VisualizationTypeData,
  chartDetails,
}: {
  ProjectId: number;
  projectName: string;
  chartId: number;
  VisualizationTypeData: VisualizationTypes[];
  chartDetails: Chart;
}) {
  const id = useId();
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<number>(0);
  const [chartData, setChartData] = useState<Chart>(chartDetails);
  const [databases, setDataset] = useState<Dataset[]>([]);
  const [openDataset, setOpenDataset] = useState<boolean>(false);
  const [selectedDataset, setSelectedDataset] = useState<number | null>(null);
  const [fieldsAndTypes, setFieldsAndTypes] = useState<Record<
    string,
    string
  > | null>(null);
  const [sampleData, setSampleData] = useState<TripsLogEntry[] | null>(null);
  const router = useRouter();
  const [columnOptions, setColumnOptions] = useState<Option[]>([]);
  // console.log('server xxxxx', chartDetails);
  console.log('chartData?.data?.[0]', chartData?.data?.[0]);
  console.log('chartDetails?.data?.[0]', chartDetails?.data?.[0]);
  // Initialize form with default values
  const form = useForm<z.infer<typeof ChartSchema>>({
    resolver: zodResolver(ChartSchema),
    defaultValues: {
      id: chartData?.id,
      name: chartData?.name,
      description: chartData?.description || '',
      datasetId: chartData?.dataset.id,
      // dataset: chartData.dataset,
      visualizationTypeId: chartData?.visualizationTypeId,
      metrics: chartData?.metrics || [],
      dynamicFilters:
        chartData.dynamicFilters?.map(
          (f: {
            columnName: any;
            operator: any;
            values: any;
            customSql: any;
          }) => ({
            columnName: f.columnName,
            operator: f.operator,
            values: f.values,
            customSql: f.customSql ?? '',
          })
        ) || [],
      sortBy: chartData.sortBy || [],
      rowLimit: chartData.rowLimit || null,
      customizeOptions: chartData.customizeOptions || {},
      displayFields: chartData.displayFields || {},
      dimensions: chartData.dimensions || [],
      // name: '',
      // description: '',
      // datasetId: 0,
      // visualizationTypeId: 0,
      // queryContext: '',
      // useExistingQuery: true,
      // dimensions: [],
      // filters: [],
      // metrics: [],
      // sortBy: [],
      // rowLimit: null,
      // customizeOptions: {},
    },
  });
  const selectedType = form.watch('visualizationTypeId');
  const handleOptionChange = (key: string, value: any) => {
    const updatedOptions = {
      ...form.getValues('customizeOptions'),
      [key]: value,
    };
    form.setValue('customizeOptions', updatedOptions);
  };
  // console.log('123================>', { chartData });
  // useEffect(() => {
  // if (chartData) {
  //   form.reset({
  //     ...chartData,
  //     customizeOptions: chartData.customizeOptions || {},
  //   });
  // }
  // }, [chartData, form]);
  // Define the onSubmit function
  // : z.infer<typeof ChartSchema>

  const onSubmit = async (values: z.infer<typeof ChartSchema>) => {
    // console.log('SUBMIT TRIGGERED', values);
    // console.log('customizeOptions', values.customizeOptions);
    try {
      const payload = {
        ...values,
        id: chartId,
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/Charts/${chartId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(payload),
        }
      );
      // console.log('form Submit update chart :', values);

      if (!response.ok) {
        throw new Error(`Failed to update chart: ${response.statusText}`);
      }

      const updatedChart = await response.json();

      setChartData(updatedChart);
      toast.success('Chart updated successfully');

      await fetchData();
      router.refresh();
      // window.location.reload();
    } catch (error) {
      console.error('Error updating chart:', error);
      toast.error('Failed to update chart');
    }
  };

  const fetchData = async () => {
    try {
      // Fetch chart data
      // const chartResponse = await fetch(
      //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/Charts/${chartId}`
      // );

      // if (!chartResponse.ok) {
      //   throw new Error(`Failed to fetch chart: ${chartResponse.statusText}`);
      // }

      // const chartData: Chart = await chartResponse.json();
      // console.log('xxxxx', chartData);
      // setChartData(chartData);
      const connectionId = chartDetails.dataset.dbConnectionId;
      const schemaName = chartDetails.dataset.schemaName;
      const tableName = chartDetails.dataset.tableName;

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
            // console.log('from useEffect', data);
          })
          .catch(() => {
            setSampleData([]);
          });
      }
      console.log(
        'chartData.visualizationTypeId',
        chartData.visualizationTypeId
      );
      // form.reset({
      //   id: chartData.id,
      //   name: chartData.name,
      //   description: chartData.description || '',
      //   datasetId: chartData.dataset.id,
      //   // dataset: chartData.dataset,
      //   visualizationTypeId: chartData.visualizationTypeId,
      //   metrics: chartData.metrics || [],
      //   filters:
      //     chartData.filters?.map(
      //       (f: {
      //         columnName: any;
      //         operator: any;
      //         values: any;
      //         customSql: any;
      //       }) => ({
      //         columnName: f.columnName,
      //         operator: f.operator,
      //         values: f.values,
      //         customSql: f.customSql ?? '',
      //       })
      //     ) || [],
      //   sortBy: chartData.sortBy || [],
      //   rowLimit: chartData.rowLimit || null,
      //   customizeOptions: chartData.customizeOptions || {},
      //   displayFields: chartData.displayFields || {},
      //   dimensions: chartData.dimensions || [],
      // });

      // Set the selected dataset and visualization type
      setSelectedDataset(chartDetails.dataset.id);
      setValue(chartDetails.visualizationTypeId);

      // Fetch datasets
      const datasetsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/DS`
      );
      if (!datasetsResponse.ok) {
        throw new Error(
          `Failed to fetch datasets: ${datasetsResponse.statusText}`
        );
      }
      const datasets: Dataset[] = await datasetsResponse.json();
      setDataset(datasets);
      router.refresh();
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    }
  };
  // Fetch chart data and datasets on component mount
  useEffect(() => {
    fetchData();
  }, [chartId, form]);

  useEffect(() => {
    const loadInitialFilterValues = async () => {
      const currentFilters = chartData?.filters || [];

      const newFilters = await Promise.all(
        currentFilters.map(async (filter: { columnName: any }) => {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/DS/distinct?datasetId=${chartData?.dataset.id}&columnName=${filter.columnName}`
          );
          const values = await res.json();
          return {
            ...filter,
          };
        })
      );

      form.setValue('dynamicFilters', newFilters);
    };

    if (Array.isArray(chartData?.filters) && chartData.filters.length > 0) {
      loadInitialFilterValues();
    }
  }, [chartData]);

  useEffect(() => {
    const fetchFieldsAndTypes = async () => {
      if (selectedDataset) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/DS/${selectedDataset}`
          );

          if (!response.ok) {
            throw new Error(
              `Failed to fetch dataset fields: ${response.statusText}`
            );
          }

          const data: Dataset = await response.json();
          setFieldsAndTypes(data.fieldsAndTypes);
          const options = Object.entries(data.fieldsAndTypes).map(
            ([key, value]) => ({
              value: key,
              label: `${key} (${value})`,
            })
          );
          setColumnOptions(options);
          // router.refresh();
        } catch (error) {
          console.error('Error fetching columns:', error);
          toast.error('Failed to load dataset fields');
        }
      }
    };

    fetchFieldsAndTypes();
  }, [selectedDataset]);

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
  const isBigNumber = chartDetails?.visualizationType?.type
    .toLowerCase()
    .includes('bignumber');
  const isPieChart = chartDetails?.visualizationType?.type
    .toLowerCase()
    .includes('pie');

  const dimensionKey = chartData?.dimensions?.[0];
  const metricBase = chartData?.metrics?.[0]?.columnName;
  const metricKey = metricBase ? `count_${metricBase}` : undefined;

  const pieChartData =
    dimensionKey && metricKey
      ? chartData?.data?.map((item: { [x: string]: any }) => ({
          value: item[metricKey as keyof typeof item],
          name: String(item[dimensionKey as keyof typeof item]),
        }))
      : [];
  console.log({ pieChartData });
  console.log({ isPieChart });
  console.log(
    'chartData.visualizationType?.type',
    chartData.visualizationType?.type
  );
  const chartTitle = chartData?.name || 'Chart Title';
  const chartSubtitle = chartData?.description || '';

  const formatData = (value: any) => {
    const numberFormat = chartData?.customizeOptions?.NumberFormat || 'none';
    const dateFormat = chartData?.customizeOptions?.DateFormat || 'YYYY-MM-DD';
    const forceDateFormat = chartData?.customizeOptions?.ForceDateFormat;

    if (forceDateFormat && !isNaN(Date.parse(value))) {
      const date = new Date(value);
      switch (dateFormat) {
        case 'YYYY-MM-DD':
          return date.toISOString().split('T')[0];
        case 'DD/MM/YYYY':
          return date.toLocaleDateString('en-GB');
        case 'MM/DD/YYYY':
          return date.toLocaleDateString('en-US');
        case 'DD MMM YYYY':
          return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          });
        default:
          return date.toISOString().split('T')[0];
      }
    }

    if (typeof value === 'number') {
      switch (numberFormat) {
        case 'comma':
          return value.toLocaleString('en-US');
        case 'dot':
          return value.toLocaleString('de-DE');
        case 'space':
          return value.toLocaleString('fr-FR').replace(/,/g, ' ');
        default:
          return value;
      }
    }

    return value;
  };

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

          <ResizablePanelGroup
            direction="horizontal"
            className="h-[calc(100vh-150px)] w-full"
          >
            <ResizablePanel defaultSize={25} minSize={20} className="min-w-0">
              <ScrollArea className="h-full w-full">
                <div className="p-6">
                  <span className="font-semibold">
                    <FormField
                      control={form.control}
                      name="datasetId"
                      render={({ field }) => (
                        <FormItem className="group relative mb-5">
                          <div className="*:not-first:mt-2">
                            <Label htmlFor={id}>Dataset</Label>
                            <Popover
                              open={openDataset}
                              onOpenChange={setOpenDataset}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  id={id}
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={open}
                                  className="bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
                                >
                                  {field.value ? (
                                    <span className="flex min-w-0 items-center gap-2">
                                      <span className="truncate">
                                        {
                                          databases.find(
                                            (item) => item.id === field.value
                                          )?.name
                                        }
                                      </span>
                                    </span>
                                  ) : (
                                    <span className="text-muted-foreground">
                                      Select dataset
                                    </span>
                                  )}
                                  <ChevronDownIcon
                                    size={16}
                                    className="text-muted-foreground/80 shrink-0"
                                    aria-hidden="true"
                                  />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
                                align="start"
                              >
                                <Command>
                                  <CommandInput placeholder="Search databases..." />
                                  <CommandList>
                                    <CommandEmpty>
                                      No dataset found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {databases.map((item) => (
                                        <CommandItem
                                          key={item.id}
                                          value={item.id.toString()}
                                          onSelect={(currentValue: string) => {
                                            const selectedId =
                                              Number(currentValue);
                                            setSelectedDataset(selectedId);
                                            field.onChange(selectedId);
                                            setOpenDataset(false);
                                          }}
                                          className="flex items-center justify-between"
                                        >
                                          <div className="flex items-center gap-2">
                                            {item.name}
                                          </div>
                                          <span className="text-muted-foreground text-xs">
                                            {item.id.toLocaleString()}
                                          </span>
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                              )}
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

            <ResizablePanel defaultSize={25} minSize={20} className="min-w-0">
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
                          chartData={chartData}
                          form={form}
                          selectedDataset={selectedDataset}
                          VisualizationTypeData={VisualizationTypeData}
                          columnOptions={columnOptions}
                        />
                      </TabsContent>
                      <TabsContent value="customize">
                        {/* <CustomizeChart
                          chartData={chartData}
                          VisualizationTypeData={VisualizationTypeData}
                          form={form}
                        /> */}
                        {/* <CustomizeChartBigNumber
                          chartData={chartData}
                          VisualizationTypeData={VisualizationTypeData}
                          form={form}
                        /> */}
                        <CustomizeChartWrapper
                          // chartData={chartData}
                          VisualizationTypeData={VisualizationTypeData}
                          form={form}
                        />
                      </TabsContent>
                    </Tabs>
                  </span>
                </div>
                <div className="p-6">
                  <Button type="submit" variant={'custom'} className="w-full">
                    Update Chart
                  </Button>
                </div>
              </ScrollArea>
            </ResizablePanel>
            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={50} minSize={30} className="min-w-0">
              <div className="h-full w-full">
                <ResizablePanelGroup
                  direction="vertical"
                  className="h-full w-full rounded-lg border"
                >
                  <ResizablePanel defaultSize={70} minSize={40}>
                    <div className="flex flex-col h-full p-6">
                      <span className="font-semibold">Display chart</span>
                      <div className="flex-1 mt-4 p-4 flex items-center justify-center">
                        {!chartDetails?.data?.[0] ? (
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
                              {chartData?.data?.[0]
                                ? chartData?.customizeOptions?.ForceDateFormat
                                  ? formatData(
                                      Object.values(chartData.data[0])[0]
                                    )
                                  : `${Object.values(chartData.data[0])[0]}${
                                      chartData.customizeOptions
                                        ?.CurrencyFormat === 'Suffix'
                                        ? ` ${
                                            chartData.customizeOptions
                                              ?.Currency || ''
                                          }`
                                        : ''
                                    }`
                                : 0}
                            </div>
                            {chartData?.customizeOptions?.Subtitle && (
                              <div
                                className={`text-muted-foreground ${
                                  chartData?.customizeOptions
                                    ?.SubheaderFontSize || 'text-sm'
                                }`}
                              >
                                {chartData.customizeOptions.Subtitle}
                              </div>
                            )}
                          </div>
                        ) : isPieChart && pieChartData ? (
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
                                    'path://M12 2 L2 12 L12 22',
                                    'path://M2 2 L12 12 L2 22',
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
                                    ? [
                                        `${chartData.customizeOptions?.InnerRadius}%`,
                                        `${chartData.customizeOptions?.OuterRadius}%`,
                                      ]
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

                  <ResizablePanel
                    defaultSize={30}
                    minSize={20}
                    className="min-w-0"
                  >
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
                                  {Object.keys(chartData.data[0]).map((key) => (
                                    <TableHead
                                      key={key}
                                      className="w-1/2  p-2 border-b font-medium text-foreground"
                                    >
                                      {key}
                                    </TableHead>
                                  ))}
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {/* {chartData.data.map((row, i) => (
                                  <TableRow key={i}>
                                    {Object.values(row).map((val, j) => (
                                      <TableCell
                                        key={j}
                                        className="whitespace-nowrap w-1/2 p-2 border-b text-muted-foreground"
                                      >
                                        <p>{j}</p>
                                        {val === null
                                          ? '-'
                                          : typeof val === 'number'
                                          ? val.toLocaleString()
                                          : String(val)}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                ))} */}
                                {chartData.data.map(
                                  (
                                    row: { [x: string]: any },
                                    i: React.Key | null | undefined
                                  ) => (
                                    <TableRow key={i}>
                                      {Object.keys(row).map((key, j) => {
                                        const val = row[key];
                                        return (
                                          <TableCell
                                            key={j}
                                            className="whitespace-nowrap w-1/2 p-2 border-b text-muted-foreground"
                                          >
                                            {val === null
                                              ? '-'
                                              : key === 'ExistDate'
                                              ? formatToDateAndTime(val)
                                              : typeof val === 'number'
                                              ? val.toLocaleString()
                                              : String(val)}
                                          </TableCell>
                                        );
                                      })}
                                    </TableRow>
                                  )
                                )}
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
        </form>
      </Form>
    </>
  );
}
