// columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { RowActions } from "./RowActions";

export const getColumns = (ProjectId: number, projectName: string): ColumnDef<User>[] => [  
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
    header: "name",
    accessorKey: "name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
    size: 180,
    filterFn: (row, filterValue) => {
      const searchableRowContent =
        `${row.original.name} ${row.original.email}`.toLowerCase();
      const searchTerm = (filterValue ?? "").toLowerCase();
      return searchableRowContent.includes(searchTerm);
    },
    enableHiding: false,
    enableColumnFilter: true,

  },
  {
    header: "Email",
    accessorKey: "email",
    size: 220,
    enableColumnFilter: true,

  },
  {
    header: "Phone number",
    accessorKey: "phoneNumber",
   
    size: 180,
    enableColumnFilter: true,

  },
  // {
  //   header: "Role",
  //   accessorKey: "role",

  //   size: 180,
  // },


  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <RowActions ProjectId={ProjectId} projectName={projectName}   row={row} />,
    size: 60,
    enableHiding: false,
  },
];
