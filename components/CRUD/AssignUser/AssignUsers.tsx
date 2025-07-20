// /* eslint-disable react-hooks/exhaustive-deps */
// 'use client';
// import { useState, useEffect } from 'react';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import {
//   Pagination,
//   PaginationContent,
//   PaginationEllipsis,
//   PaginationItem,
//   PaginationLink,
// } from '@/components/ui/pagination';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import { usePagination } from '@/hooks/use-pagination';
// import {
//   ColumnDef,
//   flexRender,
//   getCoreRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   getFilteredRowModel,
//   useReactTable,
//   SortingState,
//   ColumnFiltersState,
// } from '@tanstack/react-table';
// import { Checkbox } from '@/components/ui/checkbox';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { User } from '@/types';
// import toast from 'react-hot-toast';
// const columns: ColumnDef<User>[] = [
//   {
//     id: 'select',
//     header: ({ table }) => (
//       <Checkbox
//         checked={table.getIsAllPageRowsSelected()}
//         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//         aria-label="Select all"
//       />
//     ),
//     cell: ({ row }) => (
//       <Checkbox
//         checked={row.getIsSelected()}
//         onCheckedChange={(value) => row.toggleSelected(!!value)}
//         aria-label="Select row"
//       />
//     ),
//   },
//   {
//     accessorKey: 'username',
//     header: 'Username',
//   },
//   {
//     accessorKey: 'email',
//     header: 'Email',
//   },
 
// ];

// export default function AssignUser({
//   onClose,
//   ProjectId,
//   projectName,
//   fetchUsers,
// }: {
//   onClose: () => void;
//   ProjectId: string;
//   projectName: string;
//   fetchUsers: () => Promise<void>;
// }) {
//   const [users, setUsers] = useState<User[]>([]);
//   const [sorting, setSorting] = useState<SortingState>([]);
//   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
//   const [rowSelection, setRowSelection] = useState({});

// //   Fetch users from the API
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/projects/${ProjectId}/unassignedusers`,
//           {
//             method: 'GET',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             credentials: 'include',
//           }
//         );

//         if (!response.ok) {
//           throw new Error(`Failed to fetch users: ${response.statusText}`);
//         }

//         const data = await response.json();
//         setUsers(data);
//       } catch (err) {
//         if (err instanceof Error) {
//           toast.error(`Failed to fetch users: ${err.message}`);
//         } else {
//           toast.error('Failed to fetch users due to an unknown error.');
//         }
//       }
//     };

//     fetchUsers();
//   }, []);

// //   Handle assigning users
//   const handleAssignUsers = async () => {
//     const selectedUserIds = table
//       .getSelectedRowModel()
//       .rows.map((row) => row.original.Id);

//     if (selectedUserIds.length === 0) {
//       toast.error('Please select at least one user!');
//       return;
//     }

//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/projects/${ProjectId}/assignusers`,
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           credentials: 'include',
//           body: JSON.stringify({ userIds: selectedUserIds }),
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         console.error('API Error:', response.status, errorData);
//         toast.error(
//           errorData.message || `An error occurred. Status: ${response.status}`
//         );
//         return;
//       }

//       onClose();
//       fetchUsers();
//       toast.success('Users have been assigned successfully.');
//       setRowSelection({});
//     } catch (err) {
//       if (err instanceof Error) {
//         toast.error(`Failed to assigned Users: ${err.message}`);
//       } else {
//         toast.error('Failed to assigned Users due to an unknown error.');
//       }
//     }
//   };

// //   Initialize the table
//   const table = useReactTable({
//       data: users,
//       columns,
//       state: {
//           sorting,
//           columnFilters,
//           rowSelection,
//       },
//       onSortingChange: setSorting,
//       onColumnFiltersChange: setColumnFilters,
//       onRowSelectionChange: setRowSelection,
//       getCoreRowModel: getCoreRowModel(),
//       getPaginationRowModel: getPaginationRowModel(),
//       getSortedRowModel: getSortedRowModel(),
//       getFilteredRowModel: getFilteredRowModel(),
//       filterFns: undefined
//   });

//   useEffect(() => {
//     table.setPageSize(5);
//   }, []);

// //   Pagination logic
//   const currentPage = table.getState().pagination.pageIndex + 1; // +1 because pageIndex is zero-based
//   const totalPages = table.getPageCount();
//   const paginationItemsToDisplay = 5;

//   const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
//     currentPage,
//     totalPages,
//     paginationItemsToDisplay,
//   });

//   return (
//     <div className="w-full max-w-full overflow-auto">
//       {/* Filter by Name */}
//       <div className="flex items-center py-4">
//         <Input
//           placeholder="Filter by username..."
//           value={
//             (table.getColumn('username')?.getFilterValue() as string) ?? ''
//           }
//           onChange={(event) =>
//             table.getColumn('username')?.setFilterValue(event.target.value)
//           }
//         />
//       </div>

//       {/* Table */}
//       <Table className="w-full">
//         <TableHeader>
//           {table.getHeaderGroups().map((headerGroup) => (
//             <TableRow key={headerGroup.id} className="hover:bg-transparent">
//               {headerGroup.headers.map((header) => (
//                 <TableHead key={header.id}>
//                   {flexRender(
//                     header.column.columnDef.header,
//                     header.getContext()
//                   )}
//                 </TableHead>
//               ))}
//             </TableRow>
//           ))}
//         </TableHeader>
//         <TableBody>
//           {table.getRowModel().rows?.length ? (
//             table.getRowModel().rows.map((row) => (
//               <TableRow
//                 key={row.id}
//                 className="has-[[data-state=checked]]:bg-muted/50"
//                 data-state={row.getIsSelected() && 'selected'}
//               >
//                 {row.getVisibleCells().map((cell) => (
//                   <TableCell key={cell.id}>
//                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             ))
//           ) : (
//             <TableRow>
//               <TableCell colSpan={columns.length} className="h-24 text-center">
//                 No results.
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>

//       {/* Pagination and Actions */}
//       <div className="flex items-center justify-between gap-3 mt-2">
        
//         <p
//           className="flex-1 whitespace-nowrap text-sm text-muted-foreground"
//           aria-live="polite"
//         >
//           Page <span className="text-foreground">{currentPage}</span> of{" "}
//           <span className="text-foreground">{totalPages}</span>
//         </p>

//         <div className="grow">
//           <Pagination>
//             <PaginationContent>
//               <PaginationItem>
//                 <PaginationLink
//                   className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
//                   onClick={() => table.previousPage()}
//                   aria-label="Go to previous page"
//                   aria-disabled={!table.getCanPreviousPage()}
//                 >
//                   <ChevronLeft size={16} strokeWidth={2} aria-hidden="true" />
//                 </PaginationLink>
//               </PaginationItem>

//               {showLeftEllipsis && (
//                 <PaginationItem>
//                   <PaginationEllipsis />
//                 </PaginationItem>
//               )}

              
//               {pages.map((page) => (
//                 <PaginationItem key={page}>
//                   <PaginationLink
//                     onClick={() => table.setPageIndex(page - 1)} // -1 because pageIndex is zero-based
//                     isActive={page === currentPage}
//                   >
//                     {page}
//                   </PaginationLink>
//                 </PaginationItem>
//               ))}
//               {showRightEllipsis && (
//                 <PaginationItem>
//                   <PaginationEllipsis />
//                 </PaginationItem>
//               )}

//               <PaginationItem>
//                 <PaginationLink
//                   className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
//                   onClick={() => table.nextPage()}
//                   aria-label="Go to next page"
//                   aria-disabled={!table.getCanNextPage()}
//                 >
//                   <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
//                 </PaginationLink>
//               </PaginationItem>
//             </PaginationContent>
//           </Pagination>
//         </div>

//         <Select
//           value={table.getState().pagination.pageSize.toString()}
//           onValueChange={(value) => {
//             table.setPageSize(Number(value));
//           }}
//         >
//           <SelectTrigger
//             id="results-per-page"
//             className="w-fit whitespace-nowrap"
//           >
//             <SelectValue placeholder="Select number of results" />
//           </SelectTrigger>
//           <SelectContent>
//             {[5, 10, 20, 30, 40, 50].map((pageSize) => (
//               <SelectItem key={pageSize} value={pageSize.toString()}>
//                 Show {pageSize}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>

//       <Button
//         className="ml-auto"
//         variant="custom"
//         size="sm"
//         onClick={handleAssignUsers}
//       >
//         Assign Selected Users for {projectName}
//       </Button>
//     </div>
//   );
// }
