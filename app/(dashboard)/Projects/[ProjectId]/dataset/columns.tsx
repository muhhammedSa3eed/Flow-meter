import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { RowActions } from "./RowActions";
import { Dataset } from "@/types";
import { formatToDateAndTime } from "@/lib/formate-date";

export const getColumns = (
  ProjectId: number,
  // fetchDataset: () => void,
): ColumnDef<Dataset>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
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
    size: 28,
    enableSorting: false,
    enableHiding: false,
    enableColumnFilter: true,

  },
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
    size: 180,
    filterFn: (row, _columnId, filterValue) => {
      const searchableRowContent =
        `${row.original.name}
         ${row.original.tableName}
         ${row.original.schemaName}
        `.toLowerCase();
      const searchTerm = (filterValue ?? "").toLowerCase();
      return searchableRowContent.includes(searchTerm);
    },
    enableHiding: false,
    enableColumnFilter: true,

  },
  {
    header: "Table Name",
    accessorKey: "tableName",
    cell: ({ row }) => <div>{row.getValue("tableName")}</div>,
    size: 220,
    enableColumnFilter: true,

  },
  {
    header: "Schema Name",
    accessorKey: "schemaName",
    cell: ({ row }) => <div>{row.getValue("schemaName")}</div>,
    size: 200,
    enableColumnFilter: true,

  },
  {
    header: "Created At",
    accessorKey: "createdAt",
    cell: ({ row }) => <div>{formatToDateAndTime(row.getValue("createdAt"))}</div>,
    size: 200,
    enableColumnFilter: true,

  },
  {
    header: "Updated At",
    accessorKey: "updatedAt",
    cell: ({ row }) => <div>{formatToDateAndTime(row.getValue("updatedAt"))}</div>,
    size: 200,
    enableColumnFilter: true,

  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <RowActions ProjectId={ProjectId} datasetId={row.original.id} row={row}  />
      // fetchDataset={fetchDataset}
    ),
    size: 60,
    enableHiding: false,
  },
];