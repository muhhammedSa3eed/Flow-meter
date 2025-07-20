// columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { VisualizationTypes } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { RowActions } from "./RowActions";

export const columns: ColumnDef<VisualizationTypes>[] = [
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
  },
  {
    header: "ID",
    accessorKey: "id",
    size: 80,
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
         ${row.original.id}
        `.toLowerCase();
      const searchTerm = (filterValue ?? "").toLowerCase();
      return searchableRowContent.includes(searchTerm);
    },
    enableHiding: false,
  },
  {
    header: "Type",
    accessorKey: "type",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("type")}</div>
    ),
    size: 180,
    filterFn: (row, _columnId, filterValue) => {
      const searchableRowContent =
        `${row.original.type}
         ${row.original.id}
        `.toLowerCase();
      const searchTerm = (filterValue ?? "").toLowerCase();
      return searchableRowContent.includes(searchTerm);
    },
    enableHiding: false,
  },
  {
    header: "Display Fields",
    accessorKey: "displayFields",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {Object.entries(row.original.displayFields).map(([key, value]) => (
          <Badge 
            key={key} 
            variant={value ? "default" : "outline"}
            className={value ? "bg-custom-green2" : "bg-gray-200 text-gray-600"}
          >
             {value }
          </Badge>
        ))}
      </div>
    ),
    size: 200,
  },
 
  {
    header: "Options Fields",
    accessorKey: "optionsFields",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {Object.entries(row.original.optionsFields).map(([key, value]) => (
          <Badge 
            key={key} 
            variant={value ? "default" : "outline"}
            className={value ? "bg-blue-500" : "bg-gray-200 text-gray-600"}
          >
             {value }
          </Badge>
        ))}
      </div>
    ),
    size: 200,
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <RowActions row={row} />,
    size: 60,
    enableHiding: false,
  },
];