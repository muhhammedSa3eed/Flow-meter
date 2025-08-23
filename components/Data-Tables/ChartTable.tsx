/* eslint-disable react-hooks/exhaustive-deps */
// ChartTable.tsx
"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getFacetedUniqueValues,
  flexRender,
  ColumnFiltersState,
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  ChevronDownIcon,
  ChevronLeft,
  ChevronRight,
  ChevronUpIcon,
  ListFilterIcon,
  Plus,
} from "lucide-react";

import { CircleXIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

import { usePagination } from "@/hooks/use-pagination";
import { Chart } from "@/types";
import { getColumns } from "@/app/(dashboard)/Projects/[ProjectId]/chart/columns";
import Link from "next/link";
import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

const fuzzyFilter: FilterFn<Chart> = (row, _columnId, value, addMeta) => {
  const searchTerm = String(value).toLowerCase();

  const searchable = [
    row.original.id?.toString() ?? "",
    row.original.name ?? "",
    row.original.visualizationType?.toString() ?? "",
    row.original.type ?? "",
  ]
    .join(" ")
    .toLowerCase();

  const itemRank = rankItem(searchable, searchTerm);
  addMeta?.({ itemRank });
  return itemRank.passed;
};

export default function ChartTable({
  ProjectId,
  chart,
}: {
  ProjectId: number;
  chart: Chart[];
}) {
  const id = useId();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const [sorting, setSorting] = useState([{ id: "id", desc: false }]);

  const data = chart;
  const columns = getColumns(ProjectId);

  const table = useReactTable<Chart>({
    data,
    columns,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: { sorting, pagination, columnFilters, columnVisibility },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
  });

  useEffect(() => {
    table.setPageSize(10);
  }, []);

  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();
  const paginationItemsToDisplay = 10;

  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage,
    totalPages,
    paginationItemsToDisplay,
  });

  return (
    <>
      {/* Table For Large Screen */}
      <div className="space-y-4">
        {/* Search Filter and Actions Section */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Input
                id={`${id}-input`}
                ref={inputRef}
                className={cn(
                  "peer min-w-60 ps-9",
                  Boolean(table.getState().globalFilter) && "pe-9"
                )}
                value={(table.getState().globalFilter as string) ?? ""}
                onChange={(e) => table.setGlobalFilter(e.target.value)}
                placeholder="Search Charts"
                type="text"
                aria-label="Search Charts"
              />
              <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                <ListFilterIcon size={16} aria-hidden="true" />
              </div>
              {Boolean(table.getState().globalFilter) && (
                <button
                  className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Clear filter"
                  onClick={() => {
                    table.setGlobalFilter("");
                    if (inputRef.current) inputRef.current.focus();
                  }}
                >
                  <CircleXIcon size={16} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href={`/Projects/${ProjectId}/addChart`}>
              <Button variant={"custom"}>
                <Plus style={{ height: 20, width: 20 }} /> Add New Chart
              </Button>
            </Link>
          </div>
        </div>

        {/* Table for Large Screens */}
        <div className="hidden lg:block">
          <div className="bg-background overflow-hidden rounded-md border">
            <Table className="table-fixed">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="hover:bg-transparent"
                  >
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        style={{ width: `${header.getSize()}px` }}
                        className={`whitespace-nowrap font-semibold text-black dark:text-white ${
                          header.id === "actions" ? "sticky -right-[1px]" : ""
                        }`}
                      >
                        {header.isPlaceholder ? null : header.column.getCanSort() ? (
                          <div
                            className={cn(
                              header.column.getCanSort() &&
                                "flex h-full cursor-pointer items-center justify-between gap-2 select-none"
                            )}
                            onClick={header.column.getToggleSortingHandler()}
                            onKeyDown={(e) => {
                              if (
                                header.column.getCanSort() &&
                                (e.key === "Enter" || e.key === " ")
                              ) {
                                e.preventDefault();
                                header.column.getToggleSortingHandler()?.(e);
                              }
                            }}
                            tabIndex={
                              header.column.getCanSort() ? 0 : undefined
                            }
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: (
                                <ChevronUpIcon
                                  className="shrink-0 opacity-60"
                                  size={16}
                                  aria-hidden="true"
                                />
                              ),
                              desc: (
                                <ChevronDownIcon
                                  className="shrink-0 opacity-60"
                                  size={16}
                                  aria-hidden="true"
                                />
                              ),
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        ) : (
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )
                        )}
                      </TableHead>
                    ))}
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
                        <TableCell key={cell.id} className="last:py-0">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const actionCell = row
                  .getVisibleCells()
                  .find((cell) => cell.column.id === "actions");

                return (
                  <div
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={`relative bg-background border rounded-lg px-3 pb-[10px] duration-300 ${
                      row.getIsSelected() ? "border-green-400" : "shadow-sm"
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
                            typeof header === "string"
                              ? header
                              : cell.column.id;

                          return (
                            <div key={cell.id} className="flex gap-1">
                              <div className="text-sm font-semibold text-muted-foreground">
                                {headerText === "select"
                                  ? ""
                                  : `${headerText}:`}
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

        {/* Pagination */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-4">
          <div className="hidden sm:flex sm:items-center">
            <p className="text-xs md:text-sm  text-muted-foreground w-full font-semibold ">
              Total Records : {table.getFilteredRowModel().rows.length}
            </p>
          </div>
          {/* Combined: Rows per page and Pagination Controls */}
          <div className="flex items-center gap-4 justify-between w-full sm:w-auto">
            {/* Rows per page */}
            <div className="flex items-center gap-3">
              <Label htmlFor={`${id}-rows`} className="sm:max-sm:sr-only">
                Rows per page
              </Label>
              <Select
                value={table.getState().pagination.pageSize.toString()}
                onValueChange={(value) => table.setPageSize(Number(value))}
              >
                <SelectTrigger
                  id={`${id}-rows`}
                  className="w-fit whitespace-nowrap"
                >
                  <SelectValue placeholder="Select number of results" />
                </SelectTrigger>
                <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
                  {[5, 10, 25, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={pageSize.toString()}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => table.previousPage()}
                      aria-disabled={!table.getCanPreviousPage()}
                    >
                      <ChevronLeft
                        size={16}
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                    </PaginationLink>
                  </PaginationItem>

                  {showLeftEllipsis && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  {pages.map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => table.setPageIndex(page - 1)}
                        isActive={page === currentPage}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  {showRightEllipsis && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    <PaginationLink
                      onClick={() => table.nextPage()}
                      aria-disabled={!table.getCanNextPage()}
                    >
                      <ChevronRight
                        size={16}
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                    </PaginationLink>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
