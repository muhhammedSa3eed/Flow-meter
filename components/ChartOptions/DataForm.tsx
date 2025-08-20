import React, { useEffect, useId, useState } from 'react';
import { Label } from '@radix-ui/react-dropdown-menu';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { ChartSchema } from '@/schemas';
import { UseFormReturn } from 'react-hook-form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import MultipleSelector, { Option } from '@/components/ui/multiselect';
import {
  AreaChart,
  BarChart,
  ChartBarStacked,
  ChartPie,
  ChevronDownIcon,
  LineChart,
  LineChartIcon,
  PieChart,
  Plus,
  Radius,
  SquareAsterisk,
  Table,
} from 'lucide-react';
import { Chart, Dataset, DistinctValue, VisualizationTypes } from '@/types';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  aggregate,
  IconOptions,
  operators,
  RowLimit,
} from '@/lib/chart-assets';
import DataFormTable from './DataFormTable';
// import { Separator } from "../ui/separator";
// import { Switch } from "../ui/switch";
// const aggregate: Option[] = [
//   { value: "AVG", label: "AVG" },
//   { value: "COUNT", label: "COUNT" },
//   { value: "COUNT_DISTINCT", label: "COUNT_DISTINCT", disable: true },
//   { value: "MAX", label: "MAX" },
//   { value: "MIN", label: "MIN" },
//   { value: "SUM", label: "SUM" },
// ];

// const RowLimit = [
//   { value: "none", label: "none" },
//   { value: 10, label: "10" },
//   { value: 20, label: "20" },
//   { value: 50, label: "50" },
//   { value: 100, label: "100" },
//   { value: 250, label: "250" },
//   { value: 500, label: "500" },
//   { value: 1000, label: "1000" },
//   { value: 5000, label: "5000" },
//   { value: 10000, label: "10000" },
// ];

// const operators: Option[] = [
//   { value: "Equals", label: "Equals to (=)" },
//   { value: "NotEquals", label: "Not Equals to (≠)" },
//   { value: "GreaterThan", label: "Greater Than (>)" },
//   { value: "LessThan", label: "Less Than (<)" },
//   { value: "GreaterThanOrEqual", label: "Greater  or Equal (>=)" },
//   { value: "LessThanOrEqual", label: "Less  or Equal (<=)" },
//   { value: "NotNull", label: "Not null" },
//   { value: "In", label: "In" },
//   { value: "NotIn", label: "Not in" },
// ];

// export const ChartItems = [
//   {
//     value: "table",
//     label: "Table",
//     icon: Table,
//   },
//   {
//     value: "line chart",
//     label: "Line chart",
//     icon: LineChartIcon,
//   },
//   {
//     value: "piechart",
//     label: "Pie chart",
//     icon: ChartPie,
//   },
//   {
//     value: "bar chart",
//     label: "Bar chart",
//     icon: ChartBarStacked,
//   },
//   {
//     value: "bignumber",
//     label: "Big number",
//     icon: Radius,
//   },
// ];

// export const IconOptions = [
//   { id: 1, value: "bar", label: "Bar Chart", icon: <BarChart size={20} /> },
//   { id: 2, value: "pie", label: "Pie Chart", icon: <PieChart size={20} /> },
//   { id: 3, value: "line", label: "Line Chart", icon: <LineChart size={20} /> },
//   { id: 4, value: "area", label: "Area Chart", icon: <AreaChart size={20} /> },
//   { id: 5, value: "table", label: "Table", icon: <Table size={20} /> },
//   {
//     id: 6,
//     value: "bignumber",
//     label: "Big number",
//     icon: <SquareAsterisk size={20} />,
//   },
// ];

type ChartFormValues = z.infer<typeof ChartSchema>;
interface DataFormProps {
  form: UseFormReturn<ChartFormValues>;
  selectedDataset: number | null;
  VisualizationTypeData: VisualizationTypes[];
  chartData?: Chart | null;
  isAddChart?: boolean;
  columnOptions: any;
}
export default function DataForm({
  form,
  selectedDataset,
  VisualizationTypeData,
  chartData,
  isAddChart,
  columnOptions,
}: DataFormProps) {
  console.log({ isAddChart });
  const id = useId();
  const [selectedAggregate, setSelectedAggregate] = useState<Option | null>(
    null
  );
  const [open, setOpen] = useState<boolean>(false);
  const [filterOptions, setFilterOptions] = useState<Option[]>([]);
  const [selectedFilterColumn, setSelectedFilterColumn] =
    useState<Option | null>(null);
  const [showXAxis, setShowXAxis] = useState(false);
  const [selectedMetricsColumn, setSelectedMetricsColumn] =
    useState<Option | null>(null);
  const [selectedOperator, setSelectedOperator] = useState<Option | null>(null);
  const [isPopoverDimensionsOpen, setIsPopoverDimensionsOpen] = useState(false);
  const [isPopoverXaxisOpen, setIsPopoverXaxisOpen] = useState(false);
  const [showTableColumn, setShowTableColumn] = useState<Boolean | null>(false);
  const [isPopoverMetricsOpen, setIsPopoverMetricsOpen] = useState(false);
  const [isPopoverXAxisOpen, setIsPopoverXAxisOpen] = useState(false);
  const [selectedDimensionColumn, setSelectedDimensionColumn] =
    useState<Option | null>(null);
  const [selectedXAxisColumn, setSelectedXAxisColumn] = useState<Option | null>(
    null
  );
  const [isPopoveFiltersOpen, setIsPopoverFiltersOpen] = useState(false);

  const [selectedFilterValues, setSelectedFilterValues] = useState<Option[]>(
    []
  );

  useEffect(() => {
    if (!chartData?.filters || chartData.filters.length === 0) return;

    const firstFilter = chartData.filters[0];

    const matchedColumn = columnOptions.find(
      (opt: any) => opt.value === firstFilter.columnName
    );

    const matchedOperator = operators.find(
      (opt) => opt.value === firstFilter.operator
    );

    if (matchedColumn) setSelectedFilterColumn(matchedColumn);
    if (matchedOperator) setSelectedOperator(matchedOperator);

    // set values for MultipleSelector (filterOptions)
    const values = firstFilter.values.map((val: any) => ({
      value: val,
      label: val,
    }));
    setFilterOptions(values);
  }, [chartData, columnOptions]);

  const metrics = form.watch('metrics') || [];
  const filters = form.watch('filters') || [];
  const dimensions = form.watch('dimensions') || [];
  const xAxis = form.watch('xAxis') || [];

  const handleSaveXAxis = () => {
    if (selectedXAxisColumn) {
      const newXAxis = {
        column: selectedXAxisColumn.value,
        forceCategorical: false,
      };

      form.setValue('xAxis', newXAxis);
      setSelectedXAxisColumn(null);
    }
    setIsPopoverXAxisOpen(false);
  };
  const handleSaveDimensions = () => {
    if (selectedDimensionColumn) {
      form.setValue('dimensions', [
        ...dimensions,
        selectedDimensionColumn.value,
      ]);
      setSelectedDimensionColumn(null);
    }
    setIsPopoverDimensionsOpen(false);
  };
  // const handleSaveXaxis = () => {
  //   if (selectedDimensionColumn) {
  //     form.setValue("xAxis", [...xAxis, selectedXaxisColumn.value]);
  //     setSelectedXaxisColumn(null);
  //   }
  //   setIsPopoverXaxisOpen(false);
  // };

  const handleSaveMetrics = () => {
    if (selectedAggregate && selectedMetricsColumn) {
      const newMetric = {
        columnName: selectedMetricsColumn.value,
        aggregationFunction: selectedAggregate.value,
      };
      form.setValue('metrics', [...metrics, newMetric]);
      setSelectedAggregate(null);
      setSelectedFilterColumn(null);
    }
    setIsPopoverMetricsOpen(false);
  };

  const handleSaveFilters = () => {
    if (
      !selectedFilterColumn ||
      !selectedOperator ||
      selectedFilterValues.length === 0
    )
      return;

    const filterValues = selectedFilterValues.map((opt) => opt.value);
    const newFilter = {
      columnName: selectedFilterColumn.value,
      operator: selectedOperator.value,
      values: filterValues,
      customSql: '',
      isHavingFilter: false,
      timeRangeType: 'NoFilter',
    };

    const updatedFilters = (form.watch('filters') || []).filter(
      (f: { columnName: string }) => f.columnName !== selectedFilterColumn.value
    );

    updatedFilters.push(newFilter);

    form.setValue('filters', updatedFilters);
    setSelectedFilterColumn(null);
    setSelectedOperator(null);
    setFilterOptions([]);
    setSelectedFilterValues([]);
    setIsPopoverFiltersOpen(false);
  };
  console.log("form.watch('filters')=>", form.watch('filters'));
  const handleSortByChange = (checked: boolean) => {
    if (checked) {
      const newSortBy = metrics.map((metric) => ({
        columnName: metric.columnName,
        sortDirection: 'ASC',
      }));
      form.setValue('sortBy', newSortBy);
    } else {
      form.setValue('sortBy', []);
    }
  };

  const selectedTypeId = form.watch('visualizationTypeId');
  const selectedTypeName =
    VisualizationTypeData.find((type) => type.id === selectedTypeId)?.type ||
    '';
  const selectedTypeData = VisualizationTypeData.find(
    (type) => type.id === selectedTypeId
  );
  const displayFields = selectedTypeData?.displayFields || [];
  const showFiltersSection = displayFields.includes('Filters');
  const showDimensionsSection = displayFields.includes('Dimensions');
  const showRowLimitSection = displayFields.includes('RowLimit');
  const showSortBySection = displayFields.includes('SortBy');
  const showXAxsisSection = displayFields.includes('X-axis');

  const visualizationType = chartData?.visualizationType;
  console.log({ selectedTypeName });
  useEffect(() => {
    if (!selectedFilterColumn) return;

    const controller = new AbortController();

    fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/DS/distinct?datasetId=${selectedDataset}&&columnName=${selectedFilterColumn.value}`,
      { signal: controller.signal }
    )
      .then(async (res) => {
        const data = await res.json();
        if (!Array.isArray(data)) {
          throw new Error('Expected an array but got: ' + JSON.stringify(data));
        }

        const options = (data as DistinctValue[]).map((item) => {
          const value = Object.values(item)[0];
          return { value: String(value), label: String(value) };
        });

        setFilterOptions(options);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') console.error(err);
      });

    return () => controller.abort();
  }, [selectedFilterColumn]);
  const arrayToOptions = (values: string[], optionsList: Option[]) =>
    values.map(
      (key) =>
        optionsList.find((opt) => opt.value === key) || {
          value: key,
          label: key,
        }
    );

  return (
    <>
      <FormField
        control={form.control}
        name="visualizationTypeId"
        render={({ field }) => (
          <FormItem className="group relative mb-5">
            <div className="*:not-first:mt-2">
              <Label>Types</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild disabled={!isAddChart}>
                  <Button
                    id={id}
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
                  >
                    {field.value ? (
                      <span className="flex min-w-0 items-center gap-2">
                        {(() => {
                          const selectedItem = VisualizationTypeData.find(
                            (item) => item.id === field.value
                          );
                          const icon = IconOptions.find(
                            (i) => i.value === selectedItem?.type
                          )?.icon;

                          return (
                            <>
                              {icon}
                              <span className="truncate capitalize">
                                {selectedItem?.type}
                              </span>
                            </>
                          );
                        })()}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        Select Chart
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
                    <CommandInput placeholder="Search Chart..." />
                    <CommandList>
                      <CommandEmpty>No Chart found.</CommandEmpty>
                      <CommandGroup>
                        {VisualizationTypeData.map((item) => (
                          <CommandItem
                            key={item.id}
                            value={item.id.toString()}
                            onSelect={(currentValue) => {
                              const selectedId = Number(currentValue);
                              field.onChange(selectedId);

                              const selectedItem = VisualizationTypeData.find(
                                (item) => item.id === selectedId
                              );
                              console.log('Selected item:', selectedItem);

                              setShowXAxis(selectedItem?.type === 'line');
                              setShowTableColumn(
                                selectedItem?.type === 'table'
                              );
                              setOpen(false);
                            }}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              {
                                IconOptions.find((i) => i.value === item.type)
                                  ?.icon
                              }
                              <span className="truncate capitalize">
                                {item.type} - {item.name}
                              </span>
                            </div>
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
      {showTableColumn ? (
        <>
          <DataFormTable
            form={form}
            selectedDataset={selectedDataset}
            VisualizationTypeData={VisualizationTypeData}
            isAddChart={isAddChart}
            columnOptions={columnOptions}
          />
        </>
      ) : (
        <>
          {showXAxsisSection && (
            <>
              <FormField
                control={form.control}
                name="xAxis.column"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>X-Axis</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select X-axis" />
                        </SelectTrigger>
                        <SelectContent>
                          {columnOptions.map(
                            (item: { value: string; label: string }) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="xAxis.forceCategorical"
                render={({ field }) => (
                  <FormItem className="mt-2 w-full flex-1">
                    <FormControl>
                      <div className="flex items-start gap-2">
                        <Checkbox
                          id={id}
                          aria-describedby={`${id}-description`}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <div className="grid grow gap-2">
                          <FormLabel>Force Categorical</FormLabel>
                          <p
                            id={`${id}-description`}
                            className="text-muted-foreground text-xs"
                          >
                            You can use this checkbox with a label and a
                            description.
                          </p>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {/* Dimensions Section */}
          {showDimensionsSection && (
            <FormField
              control={form.control}
              name="dimensions"
              render={({ field }) => (
                <FormItem className="mt-2 w-full flex-1">
                  <FormLabel>Dimensions</FormLabel>
                  <FormControl>
                    <div className="*:not-first:mt-2">
                      <Label>Select Dimensions</Label>
                      <div className="flex items-center gap-2">
                        <MultipleSelector
                          value={
                            field.value?.map((dimension) => ({
                              value: dimension,
                              label: dimension,
                            })) || []
                          }
                          creatable
                          onChange={(values) => {
                            const newDimensions = values.map(
                              (val) => val.value
                            );
                            field.onChange(newDimensions);
                          }}
                          placeholder="Select Dimensions..."
                          hideClearAllButton
                          hidePlaceholderWhenSelected
                          emptyIndicator={
                            <p className="text-center text-sm">
                              No Dimensions selected
                            </p>
                          }
                        />
                        <Popover
                          open={isPopoverDimensionsOpen}
                          onOpenChange={setIsPopoverDimensionsOpen}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-10 w-10"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-96">
                            <Tabs defaultValue="simple">
                              <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="simple">Simple</TabsTrigger>
                                <TabsTrigger value="custom">
                                  Custom SQL
                                </TabsTrigger>
                              </TabsList>
                              <TabsContent value="simple">
                                <div className="space-y-4">
                                  <div>
                                    <Select
                                      value={
                                        selectedDimensionColumn?.value || ''
                                      }
                                      onValueChange={(value) => {
                                        const selected = columnOptions.find(
                                          (item: any) => item.value === value
                                        );
                                        setSelectedDimensionColumn(
                                          selected || null
                                        );
                                      }}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select Column(s)" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectGroup>
                                          {columnOptions.map((item: any) => (
                                            <SelectItem
                                              key={item.value}
                                              value={item.value}
                                            >
                                              {item.label}
                                            </SelectItem>
                                          ))}
                                        </SelectGroup>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </TabsContent>
                              <TabsContent value="custom">
                                <div className="space-y-4">
                                  <div className="group relative">
                                    <span className="inline-flex bg-background px-2">
                                      Enter Custom SQL Query
                                    </span>
                                    <Textarea id={id} placeholder="" />
                                  </div>{' '}
                                </div>
                              </TabsContent>
                            </Tabs>
                            <div className="flex justify-end gap-2 mt-4">
                              <Button
                                variant="outline"
                                onClick={() =>
                                  setIsPopoverDimensionsOpen(false)
                                }
                              >
                                Cancel
                              </Button>
                              <Button onClick={handleSaveDimensions}>
                                Save
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {/* Metrics Section */}

          <FormField
            control={form.control}
            name="metrics"
            render={({ field }) => (
              <FormItem className="mt-2 w-full flex-1">
                <FormLabel>Metrics</FormLabel>
                <FormControl>
                  <div className="*:not-first:mt-2">
                    <Label>Select Metrics</Label>
                    <div className="flex items-center gap-2">
                      <MultipleSelector
                        value={metrics.map((metric) => ({
                          value: `${metric.aggregationFunction}(${metric.columnName})`,
                          label: `${metric.aggregationFunction}(${metric.columnName})`,
                        }))}
                        creatable
                        onChange={(values) => {
                          const newMetrics = values.map((value) => {
                            const [aggregationFunction, columnName] =
                              value.value.split(/\(|\)/);
                            return {
                              columnName,
                              aggregationFunction,
                            };
                          });
                          field.onChange(newMetrics);
                        }}
                        placeholder="Select metrics..."
                        hideClearAllButton
                        hidePlaceholderWhenSelected
                        emptyIndicator={
                          <p className="text-center text-sm">
                            No metrics selected
                          </p>
                        }
                        // Only allow one metric if chart type is Pie
                        maxSelected={
                          selectedTypeName.toLowerCase() === 'pie'
                            ? 1
                            : undefined
                        }
                        // Disable adding more metrics if Pie chart and already has one
                        disabled={
                          selectedTypeName.toLowerCase() === 'pie' &&
                          metrics.length >= 1
                        }
                      />
                      {metrics.length === 0 ||
                      selectedTypeName.toLowerCase() !== 'pie' ? (
                        <Popover
                          open={isPopoverMetricsOpen}
                          onOpenChange={setIsPopoverMetricsOpen}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-10 w-10"
                              disabled={
                                selectedTypeName.toLowerCase() === 'pie' &&
                                metrics.length >= 1
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-96">
                            <Tabs defaultValue="simple">
                              <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="simple">Simple</TabsTrigger>
                                <TabsTrigger value="custom">
                                  Custom SQL
                                </TabsTrigger>
                              </TabsList>
                              <TabsContent value="simple">
                                <div className="space-y-4">
                                  <div>
                                    <Select
                                      value={selectedMetricsColumn?.value || ''}
                                      onValueChange={(value) => {
                                        const selected = columnOptions.find(
                                          (item: any) => item.value === value
                                        );
                                        setSelectedMetricsColumn(
                                          selected || null
                                        );
                                      }}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select Column(s)" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectGroup>
                                          {columnOptions.map((item: any) => (
                                            <SelectItem
                                              key={item.value}
                                              value={item.value}
                                            >
                                              {item.label}
                                            </SelectItem>
                                          ))}
                                        </SelectGroup>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Select
                                      value={selectedAggregate?.value || ''}
                                      onValueChange={(value) => {
                                        const selected = aggregate.find(
                                          (item) => item.value === value
                                        );
                                        setSelectedAggregate(selected || null);
                                      }}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select Aggregate" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectGroup>
                                          {aggregate.map((item) => (
                                            <SelectItem
                                              key={item.value}
                                              value={item.value}
                                            >
                                              {item.label}
                                            </SelectItem>
                                          ))}
                                        </SelectGroup>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </TabsContent>
                              <TabsContent value="custom">
                                <div className="space-y-4">
                                  <div className="group relative">
                                    <span className="inline-flex bg-background px-2">
                                      Enter Custom SQL Query
                                    </span>
                                    <Textarea id={id} placeholder="" />
                                  </div>
                                </div>
                              </TabsContent>
                            </Tabs>
                            <div className="flex justify-end gap-2 mt-4">
                              <Button
                                variant="outline"
                                onClick={() => setIsPopoverMetricsOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button onClick={handleSaveMetrics}>Save</Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      ) : null}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Filters Section */}
          {showFiltersSection && (
            <FormField
              control={form.control}
              name="filters"
              render={({ field }) => (
                <FormItem className="mt-2 w-full flex-1">
                  <FormLabel>Filters</FormLabel>
                  <FormControl>
                    <div className="*:not-first:mt-2">
                      <Label>Select Filters</Label>
                      <div className="flex items-center gap-2">
                        <MultipleSelector
                          value={filters.map(
                            (filter: {
                              columnName: any;
                              operator: any;
                              values: any[];
                            }) => ({
                              value: JSON.stringify(filter),
                              label: `${filter.columnName} ${
                                filter.operator
                              } ${filter?.values?.join(', ')}`,
                            })
                          )}
                          onChange={(values) => {
                            const newFilters = values
                              .map((val) => {
                                try {
                                  return JSON.parse(val.value);
                                } catch (e) {
                                  return null;
                                }
                              })
                              .filter((f) => f !== null);
                            field.onChange(newFilters);
                          }}
                          placeholder="Select filters..."
                          hideClearAllButton
                          hidePlaceholderWhenSelected
                          emptyIndicator={
                            <p className="text-center text-sm">
                              No filters selected
                            </p>
                          }
                        />
                        <Popover
                          open={isPopoveFiltersOpen}
                          onOpenChange={setIsPopoverFiltersOpen}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-10 w-10"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-96">
                            <Tabs defaultValue="simple">
                              <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="simple">Simple</TabsTrigger>
                                <TabsTrigger value="custom">
                                  Custom SQL
                                </TabsTrigger>
                              </TabsList>
                              <TabsContent value="simple">
                                <div className="space-y-4">
                                  {/* Column Name */}
                                  <Select
                                    value={selectedFilterColumn?.value || ''}
                                    onValueChange={(value) => {
                                      const selected = columnOptions.find(
                                        (item: any) => item.value === value
                                      );
                                      setSelectedFilterColumn(selected || null);
                                    }}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select column(s)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectGroup>
                                        {columnOptions.map((item: any) => (
                                          <SelectItem
                                            key={item.value}
                                            value={item.value}
                                          >
                                            {item.label}
                                          </SelectItem>
                                        ))}
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>

                                  {/* Operator */}
                                  <Select
                                    value={selectedOperator?.value || ''}
                                    onValueChange={(value) => {
                                      const selected = operators.find(
                                        (item) => item.value === value
                                      );
                                      setSelectedOperator(selected || null);
                                    }}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select operator(s)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectGroup>
                                        {operators.map((item) => (
                                          <SelectItem
                                            key={item.value}
                                            value={item.value}
                                          >
                                            {item.label}
                                          </SelectItem>
                                        ))}
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>

                                  {/* Filter Values */}
                                  <MultipleSelector
                                    value={selectedFilterValues}
                                    onChange={(vals) => {
                                      setSelectedFilterValues(vals);
                                    }}
                                    options={filterOptions}
                                    creatable
                                    placeholder="Select or create filter values"
                                    emptyIndicator={
                                      <p className="text-center text-sm">
                                        No results found
                                      </p>
                                    }
                                  />
                                </div>
                              </TabsContent>
                              <TabsContent value="custom">
                                <div className="space-y-4">
                                  <div className="group relative">
                                    <span className="inline-flex bg-background px-2">
                                      Enter Custom SQL Query
                                    </span>
                                    <Textarea id={id} placeholder="" />
                                  </div>{' '}
                                </div>
                              </TabsContent>
                            </Tabs>
                            <div className="flex justify-end gap-2 mt-4">
                              <Button
                                variant="outline"
                                onClick={() => setIsPopoverFiltersOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button onClick={handleSaveFilters}>Save</Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {/* Row Limit Section */}
          {showRowLimitSection && (
            <FormField
              control={form.control}
              name="rowLimit"
              render={({ field }) => (
                <FormItem className="mt-2 w-full flex-1">
                  <FormLabel>Row Limit</FormLabel>
                  <FormControl>
                    <div className="*:not-first:mt-2">
                      <Select
                        value={
                          field.value == null ? 'none' : field.value.toString()
                        }
                        onValueChange={(value) => {
                          field.onChange(
                            value === 'none' ? null : Number(value)
                          );
                        }}
                      >
                        <SelectTrigger id={id}>
                          <SelectValue placeholder="Select row limit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {RowLimit.map((item) => (
                              <SelectItem
                                key={item.value}
                                value={item.value?.toString() ?? ''}
                              >
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <p
                        className="text-muted-foreground mt-2 text-xs"
                        role="region"
                        aria-live="polite"
                      >
                        Select the maximum number of rows to display.
                      </p>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {showSortBySection && (
            <FormField
              control={form.control}
              name="sortBy"
              render={({ field }) => (
                <FormItem className="mt-2 w-full flex-1">
                  <FormControl>
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id={id}
                        aria-describedby={`${id}-description`}
                        checked={field.value && field.value.length > 0}
                        onCheckedChange={(checked) => {
                          handleSortByChange(checked as boolean);
                        }}
                      />
                      <div className="grid grow gap-2">
                        <FormLabel>
                          Sort By
                          <span className="text-muted-foreground text-xs leading-[inherit] font-normal">
                            (Metrics)
                          </span>
                        </FormLabel>
                        <p
                          id={`${id}-description`}
                          className="text-muted-foreground text-xs"
                        >
                          You can use this checkbox with a label and a
                          description.
                        </p>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </>
      )}
    </>
  );
}
