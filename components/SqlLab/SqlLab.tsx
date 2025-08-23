// "use client";
// import React, { useEffect, useState, useId } from "react";
// import {
//   ResizablePanel,
//   ResizablePanelGroup,
//   ResizableHandle,
// } from "@/components/ui/resizable";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import { Label } from "@/components/ui/label";
// import {
//   Popover,
//   PopoverTrigger,
//   PopoverContent,
// } from "@/components/ui/popover";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "@/components/ui/command";
// import { ChevronDownIcon } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import MultipleSelector from "@/components/ui/multiselect";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";

// import SqlEditor from "./SqlEditor";
// import type { Database, TableDataResponse } from "@/types";

// export default function SqlLab({ ProjectId }: { ProjectId: number }) {
//   const [sqlText, setSqlText] = useState<string>("");
//   const [queryResult, setQueryResult] = useState<TableDataResponse | null>(
//     null
//   );
//   const id = useId();
//   const [databases, setDatabases] = useState<Database[]>([]);
//   const [schemas, setSchemas] = useState<string[]>([]);
//   const [tables, setTables] = useState<string[]>([]);
//   const [selectedDatabase, setSelectedDatabase] = useState<number | null>(null);
//   const [selectedSchema, setSelectedSchema] = useState<string | null>(null);
//   const [selectedTable, setSelectedTable] = useState<string[]>([]);
//   const [fieldsByTable, setFieldsByTable] = useState<
//     Record<string, Record<string, string>>
//   >({});
//   const [tableDataByTable, setTableDataByTable] = useState<
//     Record<string, TableDataResponse>
//   >({});
//   const [openItems, setOpenItems] = useState<string[]>([]);
//   const [openDB, setOpenDB] = useState(false);
//   const [openSchema, setOpenSchema] = useState(false);

//   // ✅ fetch databases
//   useEffect(() => {
//     fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/DB`)
//       .then((res) => res.json())
//       .then((data) => setDatabases(data))
//       .catch((err) => console.error(err));
//   }, []);

//   // ✅ fetch schemas
//   useEffect(() => {
//     if (selectedDatabase) {
//       fetch(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/DS/schemas?connectionId=${selectedDatabase}`
//       )
//         .then((res) => res.json())
//         .then((data) => setSchemas(data))
//         .catch((err) => console.error(err));
//     }
//   }, [selectedDatabase]);

//   // ✅ fetch tables
//   useEffect(() => {
//     if (selectedDatabase && selectedSchema) {
//       fetch(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/DS/tables?connectionId=${selectedDatabase}&schemaName=${selectedSchema}`
//       )
//         .then((res) => res.json())
//         .then((data) => setTables(data))
//         .catch((err) => console.error(err));
//     }
//   }, [selectedDatabase, selectedSchema]);

//   const getIconForType = (dataType: string) => {
//     if (
//       dataType.includes("integer") ||
//       dataType.includes("real") ||
//       dataType.includes("id") ||
//       dataType.includes("name") ||
//       dataType.includes("text")
//     ) {
//       return <span className="text-xs text-muted-foreground">#</span>;
//     } else if (
//       dataType.includes("character varying") ||
//       dataType.includes("string")
//     ) {
//       return <span className="text-xs text-muted-foreground">Abc</span>;
//     } else if (dataType.includes("timestamp")) {
//       return <span className="text-xs text-muted-foreground">🕒</span>;
//     } else if (dataType.includes("json")) {
//       return <span className="text-xs text-muted-foreground">{`{}`}</span>;
//     }
//     return null;
//   };
//   useEffect(() => {
//     if (!selectedDatabase || !selectedSchema || selectedTable.length === 0)
//       return;

//     selectedTable.forEach((table) => {
//       if (!fieldsByTable[table]) {
//         fetch(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/DS/fields?connectionId=${selectedDatabase}&schemaName=${selectedSchema}&tableName=${table}`
//         )
//           .then(async (res) => {
//             if (!res.ok) throw new Error(await res.text());
//             return res.json();
//           })
//           .then((data: Record<string, string>) => {
//             setFieldsByTable((prev) => ({ ...prev, [table]: data }));
//           })
//           .catch((err) => {
//             console.error("Error loading fields for", table, err);
//           });
//       }
//     });
//   }, [selectedDatabase, selectedSchema, JSON.stringify(selectedTable)]);
//   return (
//     <div className="flex gap-4 my-3">
//       <div className="h-[calc(90vh-150px)] w-full">
//         <ResizablePanelGroup
//           direction="horizontal"
//           className="h-[calc(100vh-150px)] w-full rounded-lg border flex !flex-col lg:!flex-row"
//         >
//           {/* 🟩 القسم الأول */}
//           <ResizablePanel defaultSize={25} minSize={20}>
//             <ScrollArea className="h-full w-full">
//               <div className="flex flex-col p-2">
//                 {/* Database */}
//                 <div className="mb-5">
//                   <Label className="font-semibold">Database</Label>
//                   <Popover open={openDB} onOpenChange={setOpenDB}>
//                     <PopoverTrigger asChild>
//                       <Button
//                         id={id}
//                         variant="outline"
//                         role="combobox"
//                         aria-expanded={openDB}
//                         className="w-full justify-between"
//                       >
//                         {selectedDatabase !== null
//                           ? databases.find(
//                               (d) => Number(d.id) === selectedDatabase
//                             )?.name
//                           : "Select database"}
//                         <ChevronDownIcon size={16} />
//                       </Button>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-full p-0">
//                       <Command>
//                         <CommandInput placeholder="Search databases..." />
//                         <CommandList>
//                           <CommandEmpty>No database found.</CommandEmpty>
//                           <CommandGroup>
//                             {databases.map((db) => (
//                               <CommandItem
//                                 key={db.id}
//                                 onSelect={() => {
//                                   setSelectedDatabase(Number(db.id));
//                                   setOpenDB(false);
//                                 }}
//                               >
//                                 {db.name}
//                               </CommandItem>
//                             ))}
//                           </CommandGroup>
//                         </CommandList>
//                       </Command>
//                     </PopoverContent>
//                   </Popover>
//                 </div>

//                 {/* Schema */}
//                 <div className="mb-5">
//                   <Label className="font-semibold">Schema</Label>
//                   <Popover open={openSchema} onOpenChange={setOpenSchema}>
//                     <PopoverTrigger asChild>
//                       <Button
//                         variant="outline"
//                         role="combobox"
//                         aria-expanded={openSchema}
//                         className="w-full justify-between"
//                       >
//                         {selectedSchema || "Select schema"}
//                         <ChevronDownIcon size={16} />
//                       </Button>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-full p-0">
//                       <Command>
//                         <CommandInput placeholder="Search schemas..." />
//                         <CommandList>
//                           <CommandEmpty>No schema found.</CommandEmpty>
//                           <CommandGroup>
//                             {schemas.map((schema) => (
//                               <CommandItem
//                                 key={schema}
//                                 onSelect={() => {
//                                   setSelectedSchema(schema);
//                                   setOpenSchema(false);
//                                 }}
//                               >
//                                 {schema}
//                               </CommandItem>
//                             ))}
//                           </CommandGroup>
//                         </CommandList>
//                       </Command>
//                     </PopoverContent>
//                   </Popover>
//                 </div>

//                 {/* Table */}
//                 <div className="mb-5">
//                   <Label className="font-semibold">Table</Label>
//                   <MultipleSelector
//                     value={selectedTable.map((t) => ({ value: t, label: t }))}
//                     onChange={(options) => {
//                       const selected = options.map((o) => o.value);
//                       setSelectedTable(selected);
//                       setOpenItems(selected);
//                     }}
//                     options={tables.map((t) => ({ value: t, label: t }))}
//                     placeholder={
//                       tables.length === 0
//                         ? "Select schema first"
//                         : "Select table"
//                     }
//                   />
//                 </div>
//               </div>

//               {/* Accordion */}
//               <Accordion
//                 type="multiple"
//                 className="w-full px-3"
//                 value={openItems}
//                 onValueChange={setOpenItems}
//               >
//                 {selectedTable.map((table) => (
//                   <AccordionItem key={table} value={table}>
//                     <AccordionTrigger className="font-semibold">
//                       {table}
//                     </AccordionTrigger>
//                     <AccordionContent>
//                       {fieldsByTable[table] ? (
//                         <div className="space-y-2">
//                           {Object.entries(fieldsByTable[table]).map(
//                             ([field, type]) => (
//                               <div
//                                 key={field}
//                                 className="flex items-center gap-2 text-sm"
//                               >
//                                 <Tooltip>
//                                   <TooltipTrigger>
//                                     {getIconForType(type)}
//                                   </TooltipTrigger>
//                                   <TooltipContent>
//                                     <p>Type: {type}</p>
//                                   </TooltipContent>
//                                 </Tooltip>
//                                 <span>{field}</span>
//                               </div>
//                             )
//                           )}
//                         </div>
//                       ) : (
//                         <span className="text-muted-foreground">
//                           Loading columns...
//                         </span>
//                       )}
//                     </AccordionContent>
//                   </AccordionItem>
//                 ))}
//               </Accordion>
//             </ScrollArea>
//           </ResizablePanel>

//           <ResizableHandle withHandle />

//           <ResizablePanel defaultSize={75} minSize={20}>
//             <SqlEditor
//               ProjectId={ProjectId}
//               tables={tables}
//               selectedTables={selectedTable}
//               selectedDatabase={selectedDatabase}
//               selectedSchema={selectedSchema}
//               value={sqlText}
//               onChange={setSqlText}
//               onRunResult={(res) => setQueryResult(res)}
//             />
//           </ResizablePanel>
//         </ResizablePanelGroup>
//       </div>
//     </div>
//   );
// }

"use client";
import React, { useEffect, useState, useId } from "react";
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/multiselect";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import SqlEditor from "./SqlEditor";
import type { Database, TableDataResponse } from "@/types";

export default function SqlLab({ ProjectId }: { ProjectId: number }) {
  const [sqlText, setSqlText] = useState<string>("");
  const [queryResult, setQueryResult] = useState<TableDataResponse | null>(
    null
  );
  const id = useId();
  const [databases, setDatabases] = useState<Database[]>([]);
  const [schemas, setSchemas] = useState<string[]>([]);
  const [tables, setTables] = useState<string[]>([]);
  const [selectedDatabase, setSelectedDatabase] = useState<number | null>(null);
  const [selectedSchema, setSelectedSchema] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<string[]>([]);
  const [fieldsByTable, setFieldsByTable] = useState<
    Record<string, Record<string, string>>
  >({});
  const [tableDataByTable, setTableDataByTable] = useState<
    Record<string, TableDataResponse>
  >({});
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [openDB, setOpenDB] = useState(false);
  const [openSchema, setOpenSchema] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(false);

  // Detect screen size to toggle layout
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024); // lg breakpoint
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch databases
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/DB`)
      .then((res) => res.json())
      .then((data) => setDatabases(data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch schemas
  useEffect(() => {
    if (selectedDatabase) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/DS/schemas?connectionId=${selectedDatabase}`
      )
        .then((res) => res.json())
        .then((data) => setSchemas(data))
        .catch((err) => console.error(err));
    }
  }, [selectedDatabase]);

  // Fetch tables
  useEffect(() => {
    if (selectedDatabase && selectedSchema) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/DS/tables?connectionId=${selectedDatabase}&schemaName=${selectedSchema}`
      )
        .then((res) => res.json())
        .then((data) => setTables(data))
        .catch((err) => console.error(err));
    }
  }, [selectedDatabase, selectedSchema]);

  const getIconForType = (dataType: string) => {
    if (
      dataType.includes("integer") ||
      dataType.includes("real") ||
      dataType.includes("id") ||
      dataType.includes("name") ||
      dataType.includes("text")
    ) {
      return <span className="text-xs text-muted-foreground">#</span>;
    } else if (
      dataType.includes("character varying") ||
      dataType.includes("string")
    ) {
      return <span className="text-xs text-muted-foreground">Abc</span>;
    } else if (dataType.includes("timestamp")) {
      return <span className="text-xs text-muted-foreground">🕒</span>;
    } else if (dataType.includes("json")) {
      return <span className="text-xs text-muted-foreground">{`{}`}</span>;
    }
    return null;
  };

  // Fetch fields for selected tables
  useEffect(() => {
    if (!selectedDatabase || !selectedSchema || selectedTable.length === 0)
      return;

    selectedTable.forEach((table) => {
      if (!fieldsByTable[table]) {
        fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/DS/fields?connectionId=${selectedDatabase}&schemaName=${selectedSchema}&tableName=${table}`
        )
          .then(async (res) => {
            if (!res.ok) throw new Error(await res.text());
            return res.json();
          })
          .then((data: Record<string, string>) => {
            setFieldsByTable((prev) => ({ ...prev, [table]: data }));
          })
          .catch((err) => {
            console.error("Error loading fields for", table, err);
          });
      }
    });
  }, [selectedDatabase, selectedSchema, JSON.stringify(selectedTable)]);

  return (
    <div className="flex gap-4 my-3 h-[calc(100vh-150px)] w-full px-2 sm:px-4">
      {isLargeScreen ? (
        // Large screens: Horizontal ResizablePanelGroup
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full w-full rounded-lg border flex lg:flex-row"
        >
          {/* Sidebar */}
          <ResizablePanel defaultSize={25} minSize={20} className="h-full">
            <ScrollArea className="h-full w-full">
              <div className="flex flex-col p-2 sm:p-4">
                {/* Database */}
                <div className="mb-4">
                  <Label className="font-semibold text-sm sm:text-base">
                    Database
                  </Label>
                  <Popover open={openDB} onOpenChange={setOpenDB}>
                    <PopoverTrigger asChild>
                      <Button
                        id={id}
                        variant="outline"
                        role="combobox"
                        aria-expanded={openDB}
                        className="w-full justify-between text-sm sm:text-base"
                      >
                        {selectedDatabase !== null
                          ? databases.find(
                              (d) => Number(d.id) === selectedDatabase
                            )?.name
                          : "Select database"}
                        <ChevronDownIcon size={16} />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search databases..." />
                        <CommandList>
                          <CommandEmpty>No database found.</CommandEmpty>
                          <CommandGroup>
                            {databases.map((db) => (
                              <CommandItem
                                key={db.id}
                                onSelect={() => {
                                  setSelectedDatabase(Number(db.id));
                                  setOpenDB(false);
                                }}
                              >
                                {db.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Schema */}
                <div className="mb-4">
                  <Label className="font-semibold text-sm sm:text-base">
                    Schema
                  </Label>
                  <Popover open={openSchema} onOpenChange={setOpenSchema}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openSchema}
                        className="w-full justify-between text-sm sm:text-base"
                      >
                        {selectedSchema || "Select schema"}
                        <ChevronDownIcon size={16} />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search schemas..." />
                        <CommandList>
                          <CommandEmpty>No schema found.</CommandEmpty>
                          <CommandGroup>
                            {schemas.map((schema) => (
                              <CommandItem
                                key={schema}
                                onSelect={() => {
                                  setSelectedSchema(schema);
                                  setOpenSchema(false);
                                }}
                              >
                                {schema}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Table */}
                <div className="mb-4">
                  <Label className="font-semibold text-sm sm:text-base">
                    Table
                  </Label>
                  <MultipleSelector
                    value={selectedTable.map((t) => ({ value: t, label: t }))}
                    onChange={(options) => {
                      const selected = options.map((o) => o.value);
                      setSelectedTable(selected);
                      setOpenItems(selected);
                    }}
                    options={tables.map((t) => ({ value: t, label: t }))}
                    placeholder={
                      tables.length === 0
                        ? "Select schema first"
                        : "Select table"
                    }
                    className="text-sm sm:text-base rounded-md border border-input bg-background shadow-sm focus-within:ring-2 focus-within:ring-ring"
                    maxMenuHeight={200}
                    hidePlaceholderWhenSelected
                    badgeClassName="bg-primary/10 text-primary font-medium text-xs sm:text-sm px-2 py-1 rounded-full flex items-center gap-1 hover:bg-primary/20"
                    menuClassName="w-full max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-3rem)] bg-background border border-input rounded-md shadow-lg"
                    inputClassName="text-sm sm:text-base placeholder:text-muted-foreground"
                    clearIndicatorClassName="text-muted-foreground hover:text-primary cursor-pointer"
                  />
                </div>

                {/* Accordion */}
                <Accordion
                  type="multiple"
                  className="w-full px-2 sm:px-3"
                  value={openItems}
                  onValueChange={setOpenItems}
                >
                  {selectedTable.map((table) => (
                    <AccordionItem key={table} value={table}>
                      <AccordionTrigger className="font-semibold text-sm sm:text-base">
                        {table}
                      </AccordionTrigger>
                      <AccordionContent>
                        {fieldsByTable[table] ? (
                          <div className="space-y-2">
                            {Object.entries(fieldsByTable[table]).map(
                              ([field, type]) => (
                                <div
                                  key={field}
                                  className="flex items-center gap-2 text-xs sm:text-sm"
                                >
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
                              )
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs sm:text-sm">
                            Loading columns...
                          </span>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </ScrollArea>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={75} minSize={20} className="h-full">
            <SqlEditor
              ProjectId={ProjectId}
              tables={tables}
              selectedTables={selectedTable}
              selectedDatabase={selectedDatabase}
              selectedSchema={selectedSchema}
              value={sqlText}
              onChange={setSqlText}
              onRunResult={(res) => setQueryResult(res)}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        // Small and Medium screens: Vertical layout
        <div className="flex flex-col h-full w-full rounded-lg border">
          {/* Sidebar */}
          <div className="h-[50vh] sm:h-[45vh] w-full border-b">
            <ScrollArea className="h-full w-full">
              <div className="flex flex-col p-2 sm:p-4">
                {/* Database */}
                <div className="mb-4">
                  <Label className="font-semibold text-sm sm:text-base">
                    Database
                  </Label>
                  <Popover open={openDB} onOpenChange={setOpenDB}>
                    <PopoverTrigger asChild>
                      <Button
                        id={id}
                        variant="outline"
                        role="combobox"
                        aria-expanded={openDB}
                        className="w-full justify-between text-sm sm:text-base"
                      >
                        {selectedDatabase !== null
                          ? databases.find(
                              (d) => Number(d.id) === selectedDatabase
                            )?.name
                          : "Select database"}
                        <ChevronDownIcon size={16} />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[calc(100vw-2rem)] sm:w-[calc(100vw-3rem)] p-0">
                      <Command>
                        <CommandInput placeholder="Search databases..." />
                        <CommandList>
                          <CommandEmpty>No database found.</CommandEmpty>
                          <CommandGroup>
                            {databases.map((db) => (
                              <CommandItem
                                key={db.id}
                                onSelect={() => {
                                  setSelectedDatabase(Number(db.id));
                                  setOpenDB(false);
                                }}
                              >
                                {db.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Schema */}
                <div className="mb-4">
                  <Label className="font-semibold text-sm sm:text-base">
                    Schema
                  </Label>
                  <Popover open={openSchema} onOpenChange={setOpenSchema}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openSchema}
                        className="w-full justify-between text-sm sm:text-base"
                      >
                        {selectedSchema || "Select schema"}
                        <ChevronDownIcon size={16} />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[calc(100vw-2rem)] sm:w-[calc(100vw-3rem)] p-0">
                      <Command>
                        <CommandInput placeholder="Search schemas..." />
                        <CommandList>
                          <CommandEmpty>No schema found.</CommandEmpty>
                          <CommandGroup>
                            {schemas.map((schema) => (
                              <CommandItem
                                key={schema}
                                onSelect={() => {
                                  setSelectedSchema(schema);
                                  setOpenSchema(false);
                                }}
                              >
                                {schema}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Table */}
                <div className="mb-4">
                  <Label className="font-semibold text-sm sm:text-base">
                    Table
                  </Label>
                  <MultipleSelector
                    value={selectedTable.map((t) => ({ value: t, label: t }))}
                    onChange={(options) => {
                      const selected = options.map((o) => o.value);
                      setSelectedTable(selected);
                      setOpenItems(selected);
                    }}
                    options={tables.map((t) => ({ value: t, label: t }))}
                    placeholder={
                      tables.length === 0
                        ? "Select schema first"
                        : "Select table"
                    }
                    className="text-sm sm:text-base rounded-md border border-input bg-background shadow-sm focus-within:ring-2 focus-within:ring-ring"
                    maxMenuHeight={200}
                    hidePlaceholderWhenSelected
                    badgeClassName="bg-primary/10 text-primary font-medium text-xs sm:text-sm px-2 py-1 rounded-full flex items-center gap-1 hover:bg-primary/20"
                    menuClassName="w-full max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-3rem)] bg-background border border-input rounded-md shadow-lg"
                    inputClassName="text-sm sm:text-base placeholder:text-muted-foreground"
                    clearIndicatorClassName="text-muted-foreground hover:text-primary cursor-pointer"
                  />
                </div>

                {/* Accordion */}
                <Accordion
                  type="multiple"
                  className="w-full px-2 sm:px-3"
                  value={openItems}
                  onValueChange={setOpenItems}
                >
                  {selectedTable.map((table) => (
                    <AccordionItem key={table} value={table}>
                      <AccordionTrigger className="font-semibold text-sm sm:text-base">
                        {table}
                      </AccordionTrigger>
                      <AccordionContent>
                        {fieldsByTable[table] ? (
                          <div className="space-y-2">
                            {Object.entries(fieldsByTable[table]).map(
                              ([field, type]) => (
                                <div
                                  key={field}
                                  className="flex items-center gap-2 text-xs sm:text-sm"
                                >
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
                              )
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs sm:text-sm">
                            Loading columns...
                          </span>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </ScrollArea>
          </div>

          {/* Editor */}
          <div className="h-[50vh] sm:h-[55vh] w-full">
            <SqlEditor
              ProjectId={ProjectId}
              tables={tables}
              selectedTables={selectedTable}
              selectedDatabase={selectedDatabase}
              selectedSchema={selectedSchema}
              value={sqlText}
              onChange={setSqlText}
              onRunResult={(res) => setQueryResult(res)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
