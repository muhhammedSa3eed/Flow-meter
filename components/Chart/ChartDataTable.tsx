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
interface DataItem {
  [key: string]: string | number;
}

interface ChartDataTableProps {
  dataTable: DataItem[];
  options: any;
}
const ChartDataTable = ({ dataTable, options }: ChartDataTableProps) => {
  console.log('xxxx', JSON.stringify(dataTable));
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const columns = dataTable.length > 0 ? Object.keys(dataTable[0]) : [];
  const showSearchBox = options?.SearchBox;
  const pageLength: number = options?.PageLength || 10;

  const filteredData = dataTable.filter((row) =>
    Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const tableData = showSearchBox ? filteredData : dataTable;
  const startIndex = (currentPage - 1) * pageLength;
  const endIndex = startIndex + pageLength;
  const paginatedData = tableData.slice(startIndex, endIndex);

  const totalPages = Math.ceil(tableData.length / pageLength);
  return (
    <div>
      {dataTable.length > 0 && showSearchBox && (
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
                  {columns.map((col) => (
                    <TableCell key={col}>{row[col]}</TableCell>
                  ))}
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
