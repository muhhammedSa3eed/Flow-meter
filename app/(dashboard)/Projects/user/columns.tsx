// columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { RowActions } from "./RowActions";

export const columns: ColumnDef<User>[] = [
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
    header: "Email",
    accessorKey: "email",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('email')}</div>
    ),
    size: 220,
  },
  {
    header: "Phone number",
    accessorKey: "phoneNumber",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('phoneNumber')}</div>
    ),
    size: 180,
  },
  // {
  //   header: "Role",
  //   accessorKey: "role",
  //   cell: ({ row }) => (
  //     <div className="font-medium">{row.getValue('role')}</div>
  //   ),

  //   size: 180,
  // },


  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <RowActions  row={row} />,
    size: 60,
    enableHiding: false,
  },
];
