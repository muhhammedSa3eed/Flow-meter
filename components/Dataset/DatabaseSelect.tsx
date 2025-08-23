"use client";
import React, { useState, useEffect, useId, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Database } from "@/types";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Braces,
  CaseUpper,
  ChevronDownIcon,
  Clock,
  Grid3x3,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "../ui/label";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { DatasetSchema } from "@/schemas";
import toast from "react-hot-toast";
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
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";

export default function DatabaseSelect({
  ProjectId,
  projectName,
}: {
  ProjectId: number;
  projectName: string;
}) {
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
  const form = useForm({
    resolver: zodResolver(DatasetSchema),
    defaultValues: {
      datasetName: "",
      database: "",
      schema: "",
      table: "",
    },
  });

  // Fetch databases on component mount
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/DB/project/${ProjectId}`)
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

  const onSubmit = async (data: z.infer<typeof DatasetSchema>) => {
    if (!selectedDatabase || !selectedSchema || !selectedTable) {
      setError("Please select a database, schema, and table.");
      return;
    }
    console.log({ data });
    const payload = {
      Name: data.datasetName,
      TableName: selectedTable,
      SchemaName: selectedSchema,
      DbConnectionId: selectedDatabase,
      projectId: Number(ProjectId),
      projectName: projectName,
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
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="datasetName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="Dataset Name"
                  className="border-none ml-4"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator className="my-4 bg-custom-green2" />

        <div className="flex flex-col p-4 lg:flex-row">
          <div className="basis-1/3 pr-4">
            <div className="flex flex-col">
              {error && <div className="text-red-500 mb-5">Error: {error}</div>}

              {/* Database Select */}
              <FormField
                control={form.control}
                name="database"
                render={({ field }) => (
                  <FormItem className="group relative mb-5">
                    <div className="*:not-first:mt-2">
                      <Label htmlFor={id}>Database</Label>
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
                              <CommandEmpty>No database found.</CommandEmpty>
                              <CommandGroup>
                                {databases.map((item) => (
                                  <CommandItem
                                    key={item.id}
                                    value={item.id.toString()}
                                    onSelect={(currentValue: string) => {
                                      field.onChange(currentValue);
                                      setSelectedDatabase(Number(currentValue));
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
                      <Label htmlFor="schema">Schema</Label>
                      <Popover open={openSchema} onOpenChange={setOpenSchema}>
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
                              <CommandEmpty>No schema found.</CommandEmpty>
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
                    <div className="*:not-first:mt-2">
                      <Label htmlFor="table">Table</Label>
                      <Popover open={openTable} onOpenChange={setOpenTable}>
                        <PopoverTrigger asChild>
                          <Button
                            id="table"
                            variant="outline"
                            role="combobox"
                            aria-expanded={openTable}
                            className="bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
                            disabled={!selectedSchema} // Disable if no schema is selected
                          >
                            {field.value ? (
                              <span className="flex min-w-0 items-center gap-2">
                                <span className="truncate">
                                  {tables.find(
                                    (table) => table === field.value
                                  )}
                                </span>
                              </span>
                            ) : (
                              <span className="text-muted-foreground">
                                Select table
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
                            <CommandInput placeholder="Search tables..." />
                            <CommandList>
                              <CommandEmpty>No table found.</CommandEmpty>
                              <CommandGroup>
                                {tables.map((table) => (
                                  <CommandItem
                                    key={table}
                                    value={table}
                                    onSelect={(currentValue: string) => {
                                      field.onChange(currentValue);
                                      setSelectedTable(currentValue);
                                      setOpenTable(false);
                                    }}
                                    className="flex items-center justify-between"
                                  >
                                    <div className="flex items-center gap-2">
                                      {table}
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
            </div>
          </div>

          <Separator
            orientation="vertical"
            className="mx-4 h-auto bg-custom-green2"
          />

          <div className="basis-2/3 ">
            {tableColumns ? (
              <div className="[&>div]:max-h-96">
                <Suspense fallback={<Loading />}>
                  <Table className="[&_td]:border-border [&_th]:border-border border-separate border-spacing-0 [&_tfoot_td]:border-t [&_th]:border-b [&_tr]:border-none [&_tr:not(:last-child)_td]:border-b">
                    <TableHeader className="bg-background/90 sticky top-0 z-10 backdrop-blur-xs">
                      <TableRow className="hover:bg-transparent">
                        <TableHead>Column Name</TableHead>
                        <TableHead>Data Type</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(tableColumns).map(
                        ([columnName, dataType]) => (
                          <TableRow key={columnName}>
                            <TableCell>{columnName}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                {getIconForType(dataType)}
                                {dataType}
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </Suspense>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center min-h-96 pb-5 gap-4 p-6 rounded-lg shadow-md">
                <Grid3x3 size={300} strokeWidth={0.5} className="opacity-20" />
                <Label className="text-lg font-semibold text-custom-green2">
                  Select Dataset Source
                </Label>
                <p className="text-center max-w-md opacity-50">
                  Datasets can be created from database tables or SQL queries.
                  Select a database table to the left or create a dataset from
                  an SQL query to open SQL Lab. From there, you can save the
                  query as a dataset.
                </p>
              </div>
            )}
            <div className="flex justify-center mt-2 lg:justify-end">
              <Button type="submit" variant={"custom"} className="mt-2">
                Create dataset and create chart
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
