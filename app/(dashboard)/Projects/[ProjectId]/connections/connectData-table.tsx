/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useId, useRef } from "react";
import {
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  VisibilityState,
  getSortedRowModel,
  useReactTable,
  FilterFn,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleXIcon,
  ListFilterIcon,
  Plus,
} from "lucide-react";
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";

import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import AddConnections from "@/components/CRUD/Connections/AddConnections";
import { SelectPolling, SelectType } from "@/types";

import { ScrollArea } from "@/components/ui/scroll-area";
import AddConnectionsWrapper from "@/components/CRUD/Connections/add-connections-wrapper";

interface DataTableProps<TData, TValue> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: any;
  data: TData[];
  selectType: SelectType[];
  selectPolling: SelectPolling[];
  ProjectId: number;
}

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
    // dateBetweenFilterFn: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

const fuzzyFilter: FilterFn<unknown> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

export default function ConnectDataTable<TData, TValue>({
  columns,
  data,
  ProjectId,
}: DataTableProps<TData, TValue>) {
  const id = useId();
  const [globalFilter, setGlobalFilter] = useState<any>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const inputRef = useRef<HTMLInputElement>(null);

  const [dataTable, setDataTable] = useState(data);
  useEffect(() => {
    setDataTable(data);
  }, [data]);

  const table = useReactTable({
    data: dataTable,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="space-y-4">
      {/* Search Filter and Actions Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="w-full sm:w-auto">
          <div className="relative">
            <Input
              id={`${id}-search`}
              ref={inputRef}
              className={cn(
                "w-full sm:min-w-[300px] md:min-w-[400px] ps-9",
                globalFilter && "pe-9"
              )}
              placeholder="Search all columns..."
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              type="text"
              aria-label="Search all columns"
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
              <ListFilterIcon size={16} aria-hidden="true" />
            </div>
            {globalFilter && (
              <button
                className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Clear filter"
                onClick={() => {
                  setGlobalFilter("");
                  if (inputRef.current) inputRef.current.focus();
                }}
              >
                <CircleXIcon size={16} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-start md:justify-end">
          <AddConnectionsWrapper ProjectId={ProjectId} />
        </div>
      </div>

      {/* Table for Large Screens */}
      <div className="hidden lg:block">
        <div className="bg-background overflow-hidden rounded-md border">
          <Table className="custom-border table-fixed">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        style={{ width: `${header.getSize()}px` }}
                        className={`whitespace-nowrap font-semibold text-black dark:text-white ${
                          header.id === "actions" ? "sticky -right-[1px]" : ""
                        }`}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={`whitespace-nowrap ${
                          cell.column.id === "actions"
                            ? "sticky -right-[1px] text-center last:py-0"
                            : ""
                        }`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Cards Grid for Small & Medium Screens */}
      <div className="lg:hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              const actionCell = row
                .getVisibleCells()
                .find((cell) => cell.column.id === "actions");

              return (
                <div
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`relative bg-background border rounded-lg p-3 pb-[10px] pt-0 duration-300 shadow-sm ${
                    row.getIsSelected() ? "border-green-400" : ""
                  } `}
                >
                  {actionCell && (
                    <div className="absolute top-[5px] right-2">
                      {flexRender(
                        actionCell.column.columnDef.cell,
                        actionCell.getContext()
                      )}
                    </div>
                  )}

                  <div className="space-y-2 mt-3">
                    {row
                      .getVisibleCells()
                      .filter((cell) => cell.column.id !== "actions")
                      .map((cell) => {
                        const header = cell.column.columnDef.header;
                        const headerText =
                          typeof header === "string" ? header : cell.column.id;

                        return (
                          <div key={cell.id} className="flex gap-2">
                            <div className="text-sm font-semibold text-muted-foreground min-w-fit">
                              {headerText === "select" ? "" : `${headerText}:`}
                            </div>
                            <div className="text-sm font-normal truncate">
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-background border rounded-lg p-8 text-center col-span-full">
              <p className="text-muted-foreground">No results found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination Section */}
      <div className="flex flex-row items-start sm:items-center justify-between gap-1  md:gap-4 pt-2 border-t ">
        {/* Row count info */}
        <div className="hidden sm:flex sm:items-center">
          <p className="text-xs md:text-sm  text-muted-foreground w-full font-semibold ">
            Total Records: {table.getFilteredRowModel().rows.length}
          </p>
        </div>

        {/* Pagination controls */}
        <div className="flex flex-row justify-between sm:justify-normal items-start sm:items-center gap-2 md:gap-4 w-full sm:w-auto">
          {/* Rows per page */}
          <div className="flex items-center gap-2">
            <Label
              htmlFor={`${id}-rows`}
              className="text-xs md:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sm:max-sm:sr-only"
            >
              Rows per page
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger id={`${id}-rows`} className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Page info and navigation */}
          <div className="flex items-center gap-4">
            <div className=" flex items-center justify-center text-sm font-medium whitespace-nowrap">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                className="hidden sm:flex h-8 w-8 p-0"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <DoubleArrowLeftIcon className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeftIcon className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRightIcon className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                className="hidden sm:flex h-8 w-8 p-0"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <DoubleArrowRightIcon className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
