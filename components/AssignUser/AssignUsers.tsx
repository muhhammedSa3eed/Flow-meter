/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect, useRef, useId } from "react";
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
  ChevronLeft,
  ChevronRight,
  CircleXIcon,
  ListFilterIcon,
} from "lucide-react";
import { usePagination } from "@/hooks/use-pagination";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  FilterFn,
  getFacetedUniqueValues,
} from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import { User } from "@/types";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

const fuzzyFilter: FilterFn<unknown> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({
    itemRank,
  });
  return itemRank.passed;
};

const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
    size: 180,
    filterFn: (row, _columnId, filterValue) => {
      const searchableRowContent = `${row.original.name}
         ${row.original.id}
        `.toLowerCase();
      const searchTerm = (filterValue ?? "").toLowerCase();
      return searchableRowContent.includes(searchTerm);
    },
    enableHiding: false,
  },
  {
    header: "Email",
    accessorKey: "email",
    size: 220,
  },
  {
    header: "Phone number",
    accessorKey: "phoneNumber",
    size: 180,
  },
];

export default function AssignUser({
  ProjectId,
  projectName,
}: {
  ProjectId: number;
  projectName: string;
}) {
  const id = useId();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [columnVisibility, setColumnVisibility] = useState({});
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/Projects/users/without-projects`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.statusText}`);
        }

        const data = await response.json();
        setUsers(data);
      } catch (err) {
        if (err instanceof Error) {
          toast.error(`Failed to fetch users: ${err.message}`);
        } else {
          toast.error("Failed to fetch users due to an unknown error.");
        }
      }
    };

    fetchUsers();
  }, []);

  // Handle assigning users
  const handleAssignUsers = async () => {
    const selectedUserIds = table
      .getSelectedRowModel()
      .rows.map((row) => row.original.id);

    if (selectedUserIds.length === 0) {
      toast.error("Please select at least one user!");
      return;
    }

    try {
      console.log("selectedUserIds===>", selectedUserIds);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/Projects/${ProjectId}/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedUserIds),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error:", response.status, errorData);
        toast.error(
          errorData.message || `An error occurred. Status: ${response.status}`
        );
        return;
      }
      toast.success("Users have been assigned successfully.");
      router.refresh();
      setRowSelection({});
    } catch (err) {
      if (err instanceof Error) {
        toast.error(`Failed to assign Users: ${err.message}`);
      } else {
        toast.error("Failed to assign Users due to an unknown error.");
      }
    }
  };

  // Initialize the table
  const table = useReactTable<User>({
    data: users,
    columns,
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
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
  });

  useEffect(() => {
    table.setPageSize(10);
  }, []);

  // Pagination logic
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();
  const paginationItemsToDisplay = 5;

  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage,
    totalPages,
    paginationItemsToDisplay,
  });

  return (
    <div className="space-y-4">
      {/* Search Filter Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="w-full sm:w-auto">
          <div className="relative">
            <Input
              id={`${id}-input`}
              ref={inputRef}
              className={cn(
                "w-full sm:min-w-[300px] md:min-w-[400px] ps-9",
                Boolean(table.getColumn("name")?.getFilterValue()) && "pe-9"
              )}
              value={
                (table.getColumn("name")?.getFilterValue() ?? "") as string
              }
              onChange={(e) =>
                table.getColumn("name")?.setFilterValue(e.target.value)
              }
              placeholder="Search Users"
              type="text"
              aria-label="Search Users"
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
              <ListFilterIcon size={16} aria-hidden="true" />
            </div>
            {Boolean(table.getColumn("name")?.getFilterValue()) && (
              <button
                className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Clear filter"
                onClick={() => {
                  table.getColumn("name")?.setFilterValue("");
                  if (inputRef.current) inputRef.current.focus();
                }}
              >
                <CircleXIcon size={16} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {/* Selected count info */}
        <div className="text-sm text-muted-foreground whitespace-nowrap">
          {table.getSelectedRowModel().rows.length} of {table.getRowCount()}{" "}
          selected
        </div>
      </div>

      {/* Table for Large Screens */}
      <div className="hidden lg:block">
        <div className="bg-background overflow-hidden rounded-md border">
          <Table className="w-full table-fixed">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      style={{ width: `${header.getSize()}px` }}
                      className="whitespace-nowrap font-semibold text-black dark:text-white"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
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
                    className="has-[[data-state=checked]]:bg-muted/50"
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
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
              const selectCell = row
                .getVisibleCells()
                .find((cell) => cell.column.id === "select");

              return (
                <div
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`relative bg-background border rounded-lg p-3 pb-[10px] duration-300 shadow-sm ${
                    row.getIsSelected() ? "border-blue-400 bg-blue-50/50" : ""
                  }`}
                >
                  {selectCell && (
                    <div className="absolute top-[8px] right-3">
                      {flexRender(
                        selectCell.column.columnDef.cell,
                        selectCell.getContext()
                      )}
                    </div>
                  )}

                  <div className="space-y-2 mt-3 pr-8">
                    {row
                      .getVisibleCells()
                      .filter((cell) => cell.column.id !== "select")
                      .map((cell) => {
                        const header = cell.column.columnDef.header;
                        const headerText =
                          typeof header === "string" ? header : cell.column.id;

                        return (
                          <div key={cell.id} className="flex gap-2">
                            <div className="text-sm font-semibold text-muted-foreground min-w-fit">
                              {`${headerText}:`}
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
      <div className="flex  flex-row items-center justify-between gap-0 md:gap-4  border-t">
        {/* Page info */}
        <div className="flex items-center">
          <p className="text-sm text-muted-foreground whitespace-nowrap">
            Page{" "}
            <span className="text-foreground font-medium">{currentPage}</span>{" "}
            of <span className="text-foreground font-medium">{totalPages}</span>
          </p>
        </div>

        {/* Pagination controls */}
        <div className="flex flex-row sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          {/* Pagination */}
          <div className="flex items-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationLink
                    className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                    onClick={() => table.previousPage()}
                    aria-label="Go to previous page"
                    aria-disabled={!table.getCanPreviousPage()}
                  >
                    <ChevronLeft size={16} strokeWidth={2} aria-hidden="true" />
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
                    className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                    onClick={() => table.nextPage()}
                    aria-label="Go to next page"
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

          {/* Page size selector */}
          <div className="flex items-center gap-2">
            <Label
              htmlFor={`${id}-rows`}
              className="text-sm font-medium whitespace-nowrap"
            >
              Show
            </Label>
            <Select
              value={table.getState().pagination.pageSize.toString()}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger
                id={`${id}-rows`}
                className="w-fit whitespace-nowrap"
              >
                <SelectValue placeholder="Select number of results" />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={pageSize.toString()}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Assign Users Button */}
      <div className="flex justify-between items-center pt-4 border-t">
        {/* <div className="text-sm text-muted-foreground">
          {table.getSelectedRowModel().rows.length > 0 && (
            <span>
              {table.getSelectedRowModel().rows.length} user
              {table.getSelectedRowModel().rows.length === 1 ? "" : "s"}{" "}
              selected
            </span>
          )}
        </div> */}
        <Button
          variant="custom"
          size="sm"
          onClick={handleAssignUsers}
          disabled={table.getSelectedRowModel().rows.length === 0}
          className="whitespace-nowrap"
        >
          Assign Selected Users to {projectName}
        </Button>
      </div>
    </div>
  );
}
