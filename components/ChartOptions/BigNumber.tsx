// import React, { useEffect, useId, useState } from "react";
// import { Label } from "@radix-ui/react-dropdown-menu";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { z } from "zod";
// import { ChartSchema } from "@/schemas";
// import { UseFormReturn } from "react-hook-form";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import MultipleSelector, { Option } from "@/components/ui/multiselect";
// import { Plus } from "lucide-react";
// import { Dataset } from "@/types";
// import { Textarea } from "../ui/textarea";

// const aggregate: Option[] = [
//   { value: "AVG", label: "AVG" },
//   { value: "COUNT", label: "COUNT" },
//   { value: "COUNT_DISTINCT", label: "COUNT_DISTINCT" },
//   { value: "MAX", label: "MAX" },
//   { value: "MIN", label: "MIN" },
//   { value: "SUM", label: "SUM" },
// ];

// const operators: Option[] = [
//   { value: "Equals(=)", label: "Equals(=)" },
//   { value: "Not Equals(!=)", label: "Not Equals(!=)" },
//   { value: "Greater Than(>)", label: "Greater Than(>)" },
//   { value: "Less Than(<)", label: "Less Than(<)" },
//   { value: "Greater Than or Equal(>=)", label: "Greater Than or Equal(>=)" },
//   { value: "Less Than or Equal(<=)", label: "Less Than or Equal" },
// ];

// type ChartFormValues = z.infer<typeof ChartSchema>;

// interface BigNumberProps {
//   form: UseFormReturn<ChartFormValues>;
//   selectedDataset: number | null;
// }

// export default function BigNumber({ form, selectedDataset }: BigNumberProps) {
//   const id = useId();

//   const [selectedAggregate, setSelectedAggregate] = useState<Option | null>(
//     null
//   );
//   const [selectedFilterColumn, setSelectedFilterColumn] =
//     useState<Option | null>(null);
//   const [selectedOperator, setSelectedOperator] = useState<Option | null>(null);
//   const [isPopoverOpen, setIsPopoverOpen] = useState(false);
//   const [isPopoveFiltersOpen, setIsPopoverFiltersOpen] = useState(false);
//   const [columnOptions, setColumnOptions] = useState<Option[]>([]);

//   useEffect(() => {
//     if (selectedDataset) {
//       fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/DS/${selectedDataset}`)
//         .then(async (response) => {
//           if (!response.ok) {
//             const errorText = await response.text();
//             throw new Error(`Server error: ${errorText}`);
//           }
//           return response.json();
//         })
//         .then((data: Dataset) => {
//           const options = Object.entries(data.fieldsAndTypes).map(
//             ([key, value]) => ({
//               value: key,
//               label: `${key} (${value})`,
//             })
//           );
//           setColumnOptions(options);
//         })
//         .catch((error) => {
//           console.error("Error fetching columns:", error);
//         });
//     }
//   }, [selectedDataset]);

//   const metrics = form.watch("metrics") || [];
//   const filters = form.watch("filters") || [];

//   const handleSaveMetrics = () => {
//     if (selectedAggregate && selectedFilterColumn) {
//       const newMetric = {
//         columnName: selectedFilterColumn.value,
//         aggregationFunction: selectedAggregate.value,
//         customSqlExpression: ""
//       };
//       form.setValue("metrics", [...metrics, newMetric]);
//       setSelectedAggregate(null);
//       setSelectedFilterColumn(null);
//     }
//     setIsPopoverOpen(false);
//   };

//   const handleSaveFilters = () => {
//     if (selectedFilterColumn && selectedOperator) {
//       const newFilter = {
//         columnName: selectedFilterColumn.value,
//         operator: selectedOperator.value,
//       };
//       form.setValue("filters", [...filters, newFilter]);
//       setSelectedFilterColumn(null);
//       setSelectedOperator(null);
//     }
//     setIsPopoverFiltersOpen(false);
//   };

//   return (
//     <>
//       <Label>Big Number Chart</Label>

//       {/* Metrics Section */}
//       <FormField
//         control={form.control}
//         name="metrics"
//         render={({ field }) => (
//           <FormItem className="mt-2 w-full flex-1">
//             <FormLabel>Metrics</FormLabel>
//             <FormControl>
//               <div className="*:not-first:mt-2">
//                 <Label>Select Metrics</Label>
//                 <div className="flex items-center gap-2">
//                   <MultipleSelector
//                     value={metrics.map((metric) => ({
//                       value: `${metric.aggregationFunction}(${metric.columnName})`,
//                       label: `${metric.aggregationFunction}(${metric.columnName})`,
//                     }))}
//                     onChange={(values) => {
//                       const newMetrics = values.map((value) => {
//                         const [aggregationFunction, columnName] =
//                           value.value.split(/\(|\)/);
//                         return { columnName, aggregationFunction,customSqlExpression: "" };
//                       });
//                       field.onChange(newMetrics);
//                     }}
//                     placeholder="Select metrics..."
//                     hideClearAllButton
//                     hidePlaceholderWhenSelected
//                     emptyIndicator={
//                       <p className="text-center text-sm">No metrics selected</p>
//                     }
//                   />
//                   <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
//                     <PopoverTrigger asChild>
//                       <Button
//                         variant="outline"
//                         size="icon"
//                         className="h-10 w-10"
//                       >
//                         <Plus className="h-4 w-4" />
//                       </Button>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-96">
//                       <Tabs defaultValue="simple">
//                         <TabsList className="grid w-full grid-cols-2">
//                           <TabsTrigger value="simple">Simple</TabsTrigger>
//                           <TabsTrigger value="custom">Custom SQL</TabsTrigger>
//                         </TabsList>
//                         <TabsContent value="simple">
//                           <div className="space-y-4">
//                             <div>
//                               <Label>Column Name</Label>
//                               <Select
//                                 value={selectedFilterColumn?.value || ""}
//                                 onValueChange={(value) => {
//                                   const selected = columnOptions.find(
//                                     (item) => item.value === value
//                                   );
//                                   setSelectedFilterColumn(selected || null);
//                                 }}
//                               >
//                                 <SelectTrigger>
//                                   <SelectValue placeholder="Select Column" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                   <SelectGroup>
//                                     {columnOptions.map((item) => (
//                                       <SelectItem
//                                         key={item.value}
//                                         value={item.value}
//                                       >
//                                         {item.label}
//                                       </SelectItem>
//                                     ))}
//                                   </SelectGroup>
//                                 </SelectContent>
//                               </Select>
//                             </div>
//                             <div>
//                               <Label>Aggregate</Label>
//                               <Select
//                                 value={selectedAggregate?.value || ""}
//                                 onValueChange={(value) => {
//                                   const selected = aggregate.find(
//                                     (item) => item.value === value
//                                   );
//                                   setSelectedAggregate(selected || null);
//                                 }}
//                               >
//                                 <SelectTrigger>
//                                   <SelectValue placeholder="Select Aggregate" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                   <SelectGroup>
//                                     {aggregate.map((item) => (
//                                       <SelectItem
//                                         key={item.value}
//                                         value={item.value}
//                                       >
//                                         {item.label}
//                                       </SelectItem>
//                                     ))}
//                                   </SelectGroup>
//                                 </SelectContent>
//                               </Select>
//                             </div>
//                           </div>
//                         </TabsContent>
//                         <TabsContent value="custom">
//                           <div className="space-y-4">
//                             <div className="group relative">
//                               <span className="inline-flex bg-background px-2">
//                                 Enter Custom SQL Query
//                               </span>
//                               <Textarea id={id} placeholder="" />
//                             </div>{" "}
//                           </div>
//                         </TabsContent>
//                       </Tabs>
//                       <div className="flex justify-end gap-2 mt-4">
//                         <Button
//                           variant="outline"
//                           onClick={() => setIsPopoverOpen(false)}
//                         >
//                           Cancel
//                         </Button>
//                         <Button onClick={handleSaveMetrics}>Save</Button>
//                       </div>
//                     </PopoverContent>
//                   </Popover>
//                 </div>
//               </div>
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )}
//       />

//       {/* Filters Section */}
//       <FormField
//         control={form.control}
//         name="filters"
//         render={({ field }) => (
//           <FormItem className="mt-2 w-full flex-1">
//             <FormLabel>Filters</FormLabel>
//             <FormControl>
//               <div className="*:not-first:mt-2">
//                 <Label>Select Filters</Label>
//                 <div className="flex items-center gap-2">
//                   <MultipleSelector
//                     value={filters.map((filter) => ({
//                       value: `${filter.columnName} ${filter.operator}`,
//                       label: `${filter.columnName} ${filter.operator}`,
//                     }))}
//                     onChange={(values) => {
//                       const newFilters = values.map((value) => {
//                         const [columnName, operator] = value.value.split(" ");
//                         return { columnName, operator };
//                       });
//                       field.onChange(newFilters);
//                     }}
//                     placeholder="Select filters..."
//                     hideClearAllButton
//                     hidePlaceholderWhenSelected
//                     emptyIndicator={
//                       <p className="text-center text-sm">No filters selected</p>
//                     }
//                   />
//                   <Popover
//                     open={isPopoveFiltersOpen}
//                     onOpenChange={setIsPopoverFiltersOpen}
//                   >
//                     <PopoverTrigger asChild>
//                       <Button
//                         variant="outline"
//                         size="icon"
//                         className="h-10 w-10"
//                       >
//                         <Plus className="h-4 w-4" />
//                       </Button>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-96">
//                       <Tabs defaultValue="simple">
//                         <TabsList className="grid w-full grid-cols-2">
//                           <TabsTrigger value="simple">Simple</TabsTrigger>
//                           <TabsTrigger value="custom">Custom SQL</TabsTrigger>
//                         </TabsList>
//                         <TabsContent value="simple">
//                           <div className="space-y-4">
//                             <div>
//                               <Label>Column Name</Label>
//                               <Select
//                                 value={selectedFilterColumn?.value || ""}
//                                 onValueChange={(value) => {
//                                   const selected = columnOptions.find(
//                                     (item) => item.value === value
//                                   );
//                                   setSelectedFilterColumn(selected || null);
//                                 }}
//                               >
//                                 <SelectTrigger>
//                                   <SelectValue placeholder="Select Column" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                   <SelectGroup>
//                                     {columnOptions.map((item) => (
//                                       <SelectItem
//                                         key={item.value}
//                                         value={item.value}
//                                       >
//                                         {item.label}
//                                       </SelectItem>
//                                     ))}
//                                   </SelectGroup>
//                                 </SelectContent>
//                               </Select>
//                             </div>
//                             <div>
//                               <Label>Operator</Label>
//                               <Select
//                                 value={selectedOperator?.value || ""}
//                                 onValueChange={(value) => {
//                                   const selected = operators.find(
//                                     (item) => item.value === value
//                                   );
//                                   setSelectedOperator(selected || null);
//                                 }}
//                               >
//                                 <SelectTrigger>
//                                   <SelectValue placeholder="Select Operator" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                   <SelectGroup>
//                                     {operators.map((item) => (
//                                       <SelectItem
//                                         key={item.value}
//                                         value={item.value}
//                                       >
//                                         {item.label}
//                                       </SelectItem>
//                                     ))}
//                                   </SelectGroup>
//                                 </SelectContent>
//                               </Select>
//                             </div>
//                           </div>
//                         </TabsContent>
//                         <TabsContent value="custom">
//                           <div className="space-y-4">
//                           <div className="group relative">
//                               <span className="inline-flex bg-background px-2">
//                                 Enter Custom SQL Query
//                               </span>
//                               <Textarea id={id} placeholder="" />
//                             </div>{" "}                          </div>
//                         </TabsContent>
//                       </Tabs>
//                       <div className="flex justify-end gap-2 mt-4">
//                         <Button
//                           variant="outline"
//                           onClick={() => setIsPopoverFiltersOpen(false)}
//                         >
//                           Cancel
//                         </Button>
//                         <Button onClick={handleSaveFilters}>Save</Button>
//                       </div>
//                     </PopoverContent>
//                   </Popover>
//                 </div>
//               </div>
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )}
//       />
//     </>
//   );
// }
