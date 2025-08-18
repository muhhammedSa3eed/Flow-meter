"use client";
import React, { useEffect, useId, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Database, TableDataResponse } from "@/types";
import { DatasetSchema, SqlLabDatasetSchema } from "@/schemas";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import MultipleSelector, { Option } from "@/components/ui/multiselect";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";

import { useRouter } from "next/navigation";
import {
  Braces,
  CaseUpper,
  ChevronDownIcon,
  Clock,
  Hash,
  Table2,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DynamicTable from "../Data-Tables/DynamicTable";
import SqlEditor from "./SqlEditor";
import { cn } from "@/lib/utils";
type DatasetFormValues = z.infer<typeof SqlLabDatasetSchema>;

export default function SqlLab({ ProjectId }: { ProjectId: number }) {
  const arrayToOptions = (values: string[], optionsList: Option[]) =>
    values.map(
      (key) =>
        optionsList.find((opt) => opt.value === key) || {
          value: key,
          label: key,
        }
    );
  const [tableDataByTable, setTableDataByTable] = useState<
    Record<string, TableDataResponse>
  >({});
  const router = useRouter();

  const id = useId();
  const [databases, setDatabases] = useState<Database[]>([]);
  const [schemas, setSchemas] = useState<string[]>([]);
  const [tables, setTables] = useState<string[]>([]);
  const [selectedDatabase, setSelectedDatabase] = useState<number | null>(null);
  const [selectedSchema, setSelectedSchema] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tableColumns, setTableColumns] = useState<Record<
    string,
    string
  > | null>(null);
  const [openSchema, setOpenSchema] = useState(false);
  const [openTable, setOpenTable] = useState(false);
  const [open, setOpen] = useState<boolean>(false);
  const form = useForm<DatasetFormValues>({
    resolver: zodResolver(SqlLabDatasetSchema),
    defaultValues: {
      datasetName: "",
      database: "",
      schema: "",
      table: [],
    },
  });
  const [fieldsByTable, setFieldsByTable] = useState<
    Record<string, Record<string, string>>
  >({});
  // Fetch databases on component mount
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/DB`)
      .then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Server error: ${errorText}`);
        }
        return response.json();
      })
      .then((data: Database[]) => setDatabases(data))
      .catch((error) => {
        console.error("Error fetching databases:", error);
        setError(error.message);
      });
  }, []);

  // Fetch schemas when a database is selected
  useEffect(() => {
    if (selectedDatabase) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/DS/schemas?connectionId=${selectedDatabase}`
      )
        .then(async (response) => {
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server error: ${errorText}`);
          }
          return response.json();
        })
        .then((data: string[]) => setSchemas(data))
        .catch((error) => {
          console.error("Error fetching schemas:", error);
          setError(error.message);
        });
    }
  }, [selectedDatabase]);

  // Fetch tables when a schema is selected
  useEffect(() => {
    if (selectedDatabase && selectedSchema) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/DS/tables?connectionId=${selectedDatabase}&schemaName=${selectedSchema}`
      )
        .then(async (response) => {
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server error: ${errorText}`);
          }
          return response.json();
        })
        .then((data: string[]) => setTables(data))
        .catch((error) => {
          console.error("Error fetching tables:", error);
          setError(error.message);
        });
    }
  }, [selectedDatabase, selectedSchema]);

  // Fetch table columns and data when a table is selected
  useEffect(() => {
    if (selectedDatabase && selectedSchema && selectedTable) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/DS/fields?connectionId=${selectedDatabase}&schemaName=${selectedSchema}&tableName=${selectedTable}`
      )
        .then(async (response) => {
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server error: ${errorText}`);
          }
          return response.json();
        })
        .then((data) => {
          setTableColumns(data);
        })
        .catch((error) => {
          console.error("Error fetching table metadata:", error);
          setError(error.message);
        });
    }
  }, [selectedDatabase, selectedSchema, selectedTable]);

  const onSubmit = async (data: z.infer<typeof SqlLabDatasetSchema>) => {
    if (!selectedDatabase || !selectedSchema || !selectedTable) {
      setError("Please select a database, schema, and table.");
      return;
    }

    const payload = {
      Name: data.datasetName,
      TableName: selectedTable,
      SchemaName: selectedSchema,
      DbConnectionId: selectedDatabase,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/DS`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${errorText}`);
      }

      const result = await response.json();
      const datasetId = result.id;

      router.push(`/Projects/${ProjectId}/addChart/${datasetId}`);

      console.log("Dataset created successfully:", result);
      setError(null);
      toast.success("Dataset created successfully!");
    } catch (error) {
      console.error("Error creating dataset:", error);
    }
  };
  const getIconForType = (dataType: string) => {
    if (
      dataType.includes("integer") ||
      dataType.includes("real") ||
      dataType.includes("id") ||
      dataType.includes("name") ||
      dataType.includes("text")
    ) {
      return <Hash size={16} className="text-muted-foreground" />;
    } else if (
      dataType.includes("character varying") ||
      dataType.includes("string")
    ) {
      return <CaseUpper size={16} className="text-muted-foreground" />;
    } else if (dataType.includes("timestamp")) {
      return <Clock size={16} className="text-muted-foreground" />;
    } else if (dataType.includes("json")) {
      return <Braces size={16} className="text-muted-foreground" />;
    }

    return null;
  };
  const [queryResult, setQueryResult] = useState<TableDataResponse | null>(
    null
  );

  const [openItems, setOpenItems] = useState<string[]>([]);

  useEffect(() => {
    setOpenItems(form.watch("table"));
  }, [form.watch("table")]);

  const [previewTable, setPreviewTable] = useState<string | null>(null);

  const watchedTables = form.watch("table") as string[];
  useEffect(() => {
    if (!watchedTables?.length) return setPreviewTable(null);
    if (!previewTable || !watchedTables.includes(previewTable)) {
      setPreviewTable(watchedTables[0]);
    }
  }, [JSON.stringify(watchedTables)]);
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-4 my-3"></div>

          <div className="h-[calc(100vh-150px)] w-full">
            <ResizablePanelGroup
              direction="horizontal"
              className="h-full w-full rounded-lg border"
            >
              <ResizablePanel defaultSize={25} minSize={20}>
                <ScrollArea className="h-full w-full">
                  <div className="flex flex-col p-2">
                    {/* Database Select */}
                    <FormField
                      control={form.control}
                      name="database"
                      render={({ field }) => (
                        <FormItem className="group relative mb-5">
                          <div className="*:not-first:mt-2">
                            <Label htmlFor={id} className="font-semibold">
                              Database
                            </Label>
                            <Popover open={open} onOpenChange={setOpen}>
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
                                            (item) =>
                                              item.id.toString() === field.value
                                          )?.name
                                        }
                                      </span>
                                    </span>
                                  ) : (
                                    <span className="text-muted-foreground">
                                      Select database
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
                                      No database found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {databases.map((item) => (
                                        <CommandItem
                                          key={item.id}
                                          value={item.id.toString()}
                                          onSelect={(currentValue: string) => {
                                            field.onChange(currentValue);
                                            setSelectedDatabase(
                                              Number(currentValue)
                                            );
                                            setOpen(false);
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

                    {/* Schema Select */}
                    <FormField
                      control={form.control}
                      name="schema"
                      render={({ field }) => (
                        <FormItem className="group relative mb-5">
                          <div className="*:not-first:mt-2">
                            <Label htmlFor="schema" className="font-semibold">
                              Schema
                            </Label>
                            <Popover
                              open={openSchema}
                              onOpenChange={setOpenSchema}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  id="schema"
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={openSchema}
                                  className="bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
                                >
                                  {field.value ? (
                                    <span className="flex min-w-0 items-center gap-2">
                                      <span className="truncate">
                                        {schemas.find(
                                          (schema) => schema === field.value
                                        )}
                                      </span>
                                    </span>
                                  ) : (
                                    <span className="text-muted-foreground">
                                      Select schema
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
                                  <CommandInput placeholder="Search schemas..." />
                                  <CommandList>
                                    <CommandEmpty>
                                      No schema found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {schemas.map((schema) => (
                                        <CommandItem
                                          key={schema}
                                          value={schema}
                                          onSelect={(currentValue: string) => {
                                            field.onChange(currentValue);
                                            setSelectedSchema(currentValue);
                                            setOpenSchema(false);
                                          }}
                                          className="flex items-center justify-between"
                                        >
                                          <div className="flex items-center gap-2">
                                            {schema}
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

                    {/* Table Select */}
                    <FormField
                      control={form.control}
                      name="table"
                      render={({ field }) => (
                        <FormItem className="group relative mb-5">
                          <Label className="mb-2 block font-semibold">
                            Table
                          </Label>
                          <FormControl>
                            <MultipleSelector
                              value={arrayToOptions(
                                field.value,
                                tables.map((t) => ({ value: t, label: t }))
                              )}
                              onChange={(options) => {
                                const selected = options.map(
                                  (opt) => opt.value
                                );
                                field.onChange(selected);

                                // Load fields for each selected table
                                selected.forEach((table) => {
                                  if (!fieldsByTable[table]) {
                                    fetch(
                                      `${process.env.NEXT_PUBLIC_API_BASE_URL}/DS/fields?connectionId=${selectedDatabase}&schemaName=${selectedSchema}&tableName=${table}`
                                    )
                                      .then(async (res) => {
                                        if (!res.ok)
                                          throw new Error(await res.text());
                                        return res.json();
                                      })
                                      .then((data) => {
                                        setFieldsByTable((prev) => ({
                                          ...prev,
                                          [table]: data,
                                        }));
                                      })
                                      .catch((err) =>
                                        console.error(
                                          "Error loading fields for",
                                          table,
                                          err
                                        )
                                      );
                                  }

                                  if (!tableDataByTable[table]) {
                                    fetch(
                                      `${process.env.NEXT_PUBLIC_API_BASE_URL}/DS/table-data?connectionId=${selectedDatabase}&schemaName=${selectedSchema}&tableName=${table}&limit=100&offset=0`
                                    )
                                      .then(async (res) => {
                                        if (!res.ok)
                                          throw new Error(await res.text());
                                        return res.json();
                                      })
                                      .then((data) => {
                                        console.log(
                                          "✅ Table data for",
                                          table,
                                          data
                                        );

                                        setTableDataByTable((prev) => ({
                                          ...prev,
                                          [table]: data,
                                        }));
                                      })
                                      .catch((err) =>
                                        console.error(
                                          "Error loading table data for",
                                          table,
                                          err
                                        )
                                      );
                                  }
                                });

                                // Update selected table for preview (optional logic)
                                if (selected.length === 1) {
                                  setSelectedTable(selected[0]);
                                } else {
                                  setSelectedTable(null);
                                }
                              }}
                              disabled={!selectedSchema}
                              options={tables.map((table) => ({
                                value: table,
                                label: table,
                              }))}
                              placeholder={
                                tables.length === 0
                                  ? "Select schema first"
                                  : "Select table "
                              }
                              emptyIndicator={
                                <p className="text-center text-sm text-muted-foreground">
                                  No tables found.
                                </p>
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Accordion
                    type="multiple"
                    className="w-full px-3"
                    value={openItems}
                    onValueChange={setOpenItems}
                  >
                    {form.watch("table").map((table) => (
                      <AccordionItem key={table} value={table}>
                        <AccordionTrigger className="font-semibold">
                          {table}
                        </AccordionTrigger>
                        <AccordionContent>
                          {fieldsByTable[table] ? (
                            <div className="space-y-2">
                              {Object.entries(fieldsByTable[table]).map(
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
                            <span className="text-muted-foreground font-semibold">
                              Loading columns...
                            </span>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </ScrollArea>
              </ResizablePanel>

              <ResizableHandle withHandle />

              <ResizablePanel defaultSize={75} minSize={50}>
                <div className="h-full w-full">
                  <ResizablePanelGroup
                    direction="vertical"
                    className="h-full w-full rounded-lg border"
                  >
                    <ResizablePanel defaultSize={50} minSize={20}>
                      <div className="flex flex-col h-full w-full p-2 gap-2">
                        <div className="flex-1">
                          <FormField
                            control={form.control}
                            name="query"
                            render={({ field }) => (
                              <FormItem className="group relative mb-5">
                                {/* <Label className="mb-2 block">Query</Label> */}
                                <FormControl>
                                  <SqlEditor
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                    tables={tables}
                                    onRunResult={(res) => setQueryResult(res)} // 🆕
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </ResizablePanel>

                    <ResizableHandle withHandle />

                    <ResizablePanel
                      defaultSize={50}
                      minSize={20}
                      className="min-h-0 min-w-0 overflow-hidden" // 👈 مهم
                    >
                      <div className="flex flex-col h-full min-h-0 min-w-0">
                        {" "}
                        {/* 👈 مهم */}
                        <div className="flex mt-2 justify-end p-3 shrink-0">
                          <Button variant="default" type="submit">
                            Save Dataset
                          </Button>
                        </div>
                        <Tabs
                          defaultValue="tab-1"
                          className="flex-1 min-h-0 min-w-0 flex flex-col"
                        >
                          {" "}
                          <TabsList className="h-auto rounded-none border-b bg-transparent p-0 shrink-0 flex justify-start">
                            <TabsTrigger
                              value="tab-1"
                              className="data-[state=active]:after:bg-primary relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none font-semibold"
                            >
                              Result
                            </TabsTrigger>
                            {watchedTables.map((table) => (
                              <TabsTrigger
                                key={table}
                                value={`preview:${table}`}
                                className="font-semibold data-[state=active]:after:bg-primary relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5"
                                title={`Preview: ${table}`}
                              >
                                Preview:{" "}
                                <span className="ml-1 truncate max-w-[180px]">{`'${table}'`}</span>
                              </TabsTrigger>
                            ))}
                          </TabsList>
                          {/* 🟩 Result Tab Content */}
                          <TabsContent
                            value="tab-1"
                            className="h-[calc(100%-40px)]  p-4  max-w-7xl"
                          >
                            {queryResult?.fields && queryResult?.data ? (
                              <DynamicTable response={queryResult} />
                            ) : (
                              <p className=" font-semibold text-muted-foreground text-lg">
                                No data available.
                              </p>
                            )}
                          </TabsContent>
                          {/* 🟦 Preview Tab Content */}
                          {watchedTables.map((table) => {
                            const resp = tableDataByTable[table];
                            return (
                              <TabsContent
                                key={table}
                                value={`preview:${table}`}
                                className="h-[calc(100%-40px)] p-4 max-w-7xl"
                              >
                                {resp?.fields && resp?.data ? (
                                  <DynamicTable response={resp} />
                                ) : (
                                  <p className="text-muted-foreground text-sm">
                                    Loading…
                                  </p>
                                )}
                              </TabsContent>
                            );
                          })}
                        </Tabs>
                      </div>
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
