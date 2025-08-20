'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface ChartDataTableProps {
  dataTable: {
    columns: string[];
    rows: (string | number | null | undefined)[][];
  }[];
  options: any;
}

const ChartDataTable = ({ dataTable, options }: ChartDataTableProps) => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const columns: string[] = dataTable[0]?.columns ?? [];
  const rows: (string | number | null | undefined)[][] =
    (dataTable[0]?.rows as (string | number | null | undefined)[][]) ?? [];

  const showSearchBox = options?.SearchBox;
  const pageLength: number = options?.PageLength || 10;
  const showCellBar = options?.ShowCellBar || false;
  const filteredRows = rows.filter((row) =>
    row.some((value) =>
      value?.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const tableData = showSearchBox ? filteredRows : rows;
  const startIndex = (currentPage - 1) * pageLength;
  const endIndex = startIndex + pageLength;
  const paginatedData = tableData.slice(startIndex, endIndex);

  const totalPages = Math.ceil(tableData.length / pageLength);
  const numericValues = rows
    .map((row) => (typeof row[1] === 'number' ? row[1] : 0))
    .filter((n) => typeof n === 'number') as number[];
  const maxValue = Math.max(...numericValues, 0);
  console.log({ showCellBar });
  return (
    <div>
      {rows.length > 0 && showSearchBox && (
        <div className="mb-4">
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-1/3"
          />
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col}>{col}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => {
                    const isNumeric = typeof cell === 'number';
                    let percentage = 0;

                    if (isNumeric && maxValue > 0) {
                      percentage = (cell / maxValue) * 100;
                    }

                    return (
                      <TableCell key={cellIndex} className="relative">
                        {showCellBar && isNumeric && cell > 0 && (
                          <div
                            className="absolute left-0 top-0 h-full bg-gray-300 opacity-50 "
                            style={{ width: `${percentage}%` }}
                          />
                        )}
                        <span className="relative z-10 text-center">{cell ?? '-'}</span>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          {/* <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {(row as (string | number | null | undefined)[]).map(
                    (cell, cellIndex) => (
                      <TableCell key={cellIndex}>
                        {cell !== null && cell !== undefined && cell !== ''
                          ? cell
                          : '-'}
                      </TableCell>
                    )
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody> */}
        </Table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <Button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChartDataTable;

// 'use client';

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from 'react';
// import { Input } from '../ui/input';
// import { Button } from '../ui/button';
// interface DataItem {
//   [key: string]: string | number;
// }

// interface ChartDataTableProps {
//   dataTable: {
//     columns: string[];
//     rows: (string | number | null | undefined)[][];
//   }[];
//   options: any;
// }

// const ChartDataTable = ({ dataTable, options }: ChartDataTableProps) => {

//   console.log('xxxx', JSON.stringify(dataTable));
//   const [search, setSearch] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   // const columns = dataTable.length > 0 ? Object.keys(dataTable[0]) : [];
//   const columns = dataTable[0]?.columns || [];
//   // const rows = dataTable[0]?.rows || [];
//   const rows: (string | number | null | undefined)[][] =
//     dataTable[0]?.rows || [];
//   const showSearchBox = options?.SearchBox;
//   console.log({ rows });
//   const pageLength: number = options?.PageLength || 10;
//   // const filteredRows = rows.filter((row: any[]) =>
//   //   row.some((value) =>
//   //     value.toString().toLowerCase().includes(search.toLowerCase())
//   //   )
//   // );
//   const filteredRows = rows.filter((row) =>
//     row.some((value) =>
//       value?.toString().toLowerCase().includes(search.toLowerCase())
//     )
//   );

//   // const filteredData = dataTable.filter((row) =>
//   //   Object.values(row).some((value) =>
//   //     value.toString().toLowerCase().includes(search.toLowerCase())
//   //   )
//   // );

//   const tableData = showSearchBox ? filteredRows : dataTable;
//   const startIndex = (currentPage - 1) * pageLength;
//   const endIndex = startIndex + pageLength;
//   const paginatedData = tableData.slice(startIndex, endIndex);

//   const totalPages = Math.ceil(tableData.length / pageLength);
//   return (
//     <div>
//       {rows.length > 0 && showSearchBox && (
//         <div className="mb-4">
//           <Input
//             placeholder="Search..."
//             value={search}
//             onChange={(e) => {
//               setSearch(e.target.value);
//               setCurrentPage(1);
//             }}
//             className="w-1/3"
//           />
//         </div>
//       )}

//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               {columns.map((col) => (
//                 <TableHead key={col}>{col}</TableHead>
//               ))}
//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {paginatedData.length > 0 ? (
//               paginatedData.map((row, rowIndex) => (
//                 <TableRow key={rowIndex}>
//                   {row.map((cell: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined, cellIndex: Key | null | undefined) => (
//                     <TableCell key={cellIndex}>
//                       {cell !== null && cell !== undefined && cell !== ''
//                         ? cell
//                         : '-'}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={columns.length} className="text-center">
//                   No data available
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {/* Pagination Controls */}
//       {totalPages > 1 && (
//         <div className="flex items-center justify-between mt-4">
//           <Button
//             onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//             disabled={currentPage === 1}
//           >
//             Previous
//           </Button>
//           <span>
//             Page {currentPage} of {totalPages}
//           </span>
//           <Button
//             onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//             disabled={currentPage === totalPages}
//           >
//             Next
//           </Button>
//         </div>
//       )}
//     </div>

//   );
// };

// export default ChartDataTable;

// {/* {dataTable.length > 0 && showSearchBox && (
//         <div className="mb-4">
//           <Input
//             placeholder="Search..."
//             value={search}
//             onChange={(e) => {
//               setSearch(e.target.value);
//               setCurrentPage(1);
//             }}
//             className="w-1/3"
//           />
//         </div>
//       )}
//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               {columns.map((col) => (
//                 <TableHead key={col}>{col}</TableHead>
//               ))}
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {paginatedData.length > 0 ? (
//               paginatedData.map((row, rowIndex) => (
//                 <TableRow key={rowIndex}>
//                   {columns.map((col) => (
//                     <TableCell key={col}>{row[col]}</TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={columns.length} className="text-center">
//                   No data available
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div> */}
//       {/* Pagination Controls */}
//       {/* {totalPages > 1 && (
//         <div className="flex items-center justify-between mt-4">
//           <Button
//             onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//             disabled={currentPage === 1}
//           >
//             Previous
//           </Button>
//           <span>
//             Page {currentPage} of {totalPages}
//           </span>
//           <Button
//             onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//             disabled={currentPage === totalPages}
//           >
//             Next
//           </Button>
//         </div>
//       )} */}
