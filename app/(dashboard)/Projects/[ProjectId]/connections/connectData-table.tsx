/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect, useId, useRef } from 'react';
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
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Button } from '@/components/ui/button';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleXIcon,
  ListFilterIcon,
  Plus,
} from 'lucide-react';
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons';

import { RankingInfo, rankItem } from '@tanstack/match-sorter-utils';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import AddConnections from '@/components/CRUD/Connections/AddConnections';
import { SelectPolling, SelectType } from '@/types';

import { ScrollArea } from '@/components/ui/scroll-area';
import AddConnectionsWrapper from '@/components/CRUD/Connections/add-connections-wrapper';

interface DataTableProps<TData, TValue> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: any;
  data: TData[];
  selectType: SelectType[];
  selectPolling: SelectPolling[];
  ProjectId: number;
}

declare module '@tanstack/table-core' {
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
  // console.log({ data });
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
  // console.log("table.getColumn('name')", table.getColumn('name'));
  // console.log(
  //   "table.getColumn('name')?.getFilterValue()",
  //   table.getColumn('name')?.getFilterValue()
  // );
  return (
    <div>
      <div className="flex items-center py-4 justify-between">
        <Input
          placeholder="Search all columns..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        {/* <div className="flex items-center gap-3">
          <div className="relative">
            <Input
              id={`${id}-input`}
              ref={inputRef}
              className={cn(
                'peer min-w-60 ps-9',
                Boolean(table.getColumn('name')?.getFilterValue()) && 'pe-9'
              )}
              value={
                (table.getColumn('name')?.getFilterValue() ?? '') as string
              }
              onChange={(e) => {
                console.log('e.target.value', e.target.value);
                table.getColumn('name')?.setFilterValue(e.target.value);
              }}
              placeholder="Search Devices "
              type="text"
              aria-label="Search Devices"
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
              <ListFilterIcon size={16} aria-hidden="true" />
            </div>
            {Boolean(table.getColumn('name')?.getFilterValue()) && (
              <button
                className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Clear filter"
                onClick={() => {
                  table.getColumn('name')?.setFilterValue('');
                  if (inputRef.current) inputRef.current.focus();
                }}
              >
                <CircleXIcon size={16} aria-hidden="true" />
              </button>
            )}
          </div>
        </div> */}

        <div className="flex items-center gap-3">
          <AddConnectionsWrapper ProjectId={ProjectId} />
          {/* <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant={"custom"}>
                {" "}
                <Plus style={{ height: 20, width: 20 }} /> Add New Connection
              </Button>
            </SheetTrigger>

            <SheetContent>
              <div className="h-full flex flex-col">
                <SheetHeader>
                  <SheetTitle> Connection Information</SheetTitle>
                  <SheetDescription
                    className={cn("mb-0 pb-0")}
                  ></SheetDescription>
                </SheetHeader>
                <ScrollArea className="flex-1 mt-4 pr-2">
                  <AddConnections
                    ProjectId={ProjectId}
                    selectType={dataType}
                    selectPolling={dataPolling}
                  />
                </ScrollArea>
              </div>
            </SheetContent>
          </Sheet>{" "} */}
        </div>
      </div>
      <div className="">
        <Table className="custom-border">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={`whitespace-nowrap font-semibold text-black dark:text-white ${
                        header.id === 'actions' ? 'sticky -right-[1px]' : ''
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
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={`whitespace-nowrap ${
                        cell.column.id === 'actions'
                          ? 'sticky -right-[1px]  text-center'
                          : ''
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

      <div className="flex items-center justify-between  px-2 mt-5">
        <div>
          <p className="text-xs md:text-sm font-medium rtl:ml-2 ltr:mr-2">
            Number of Rows : {table.getFilteredRowModel().rows.length}
          </p>
        </div>
        <div className="flex items-center  justify-center space-x-6 lg:space-x-8 flex-wrap md:flex-nowrap">
          <div className="flex items-center space-x-2 flex-wrap">
            <p className="text-xs md:text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
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
          <div className="flex w-[100px] items-center justify-center text-xs md:text-sm font-medium my-2 md:my-0">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2 my-2 justify-center text-xs">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
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
              className="hidden h-8 w-8 p-0 lg:flex"
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
  );
}
