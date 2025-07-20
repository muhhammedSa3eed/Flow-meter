import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { RowActions } from "./RowActions";
import { Chart } from "@/types";

export const getColumns = (
  ProjectId: number,
): ColumnDef<Chart>[] => [
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
    header: "Id",
    accessorKey: "id",
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
    size: 220,
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
         ${row.original.visualizationTypeId}
        `.toLowerCase();
      const searchTerm = (filterValue ?? "").toLowerCase();
      return searchableRowContent.includes(searchTerm);
    },
    enableHiding: false,
  },

  {
    header: "Visualization Type",
    accessorKey: "visualizationType",
    cell: ({ row }) => {
      const vis = row.getValue("visualizationType") as { name?: string };
      return <div>{vis?.name ?? ""}</div>;
    },
    size: 200,
  },
  // {
  //   header: "Count",
  //   accessorKey: "data.Id_Count", 
  //   cell: ({ row }) => <div>{row.original.data.Id_Count}</div>, 
  //   size: 200,
  // },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <RowActions ProjectId={ProjectId}  chartId={row.original.id} row={row}  />  
      // fetchChart={fetchChart}
    ),
    size: 60,
    enableHiding: false,
  },
];