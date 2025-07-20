'use client';
import DeleteConnections from '@/components/CRUD/Connections/DeleteConnections';
import EditConnections from '@/components/CRUD/Connections/EditConnections';
import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { fetchDevice } from '@/lib/assests';
import { dataType } from '@/lib/data';
import { cn } from '@/lib/utils';
import { EllipsisIcon, Pencil, Trash2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';

interface CellProps {
  row: {
    getValue: (key: string) => string;
    original: {
      id: number;
      name: string;
      dbType: string;
      host: string;
      port: number;
      databaseName: string;
      username: string;
      password: string;
      additionalOptions: string | null;
      isActive: boolean;
      lastConnected: string;
      description: string;
      dataAccess: string;
    };
  };
}

const RowActions = ({ row }: CellProps) => {
  const [isEditDeviceOpen, setIsEditDeviceOpen] = useState(false);
  const [isDeleteDeviceOpen, setIsDeleteDeviceOpen] = useState(false);
  const params = useParams();
  // console.log({ params });
  const projectId = Number(params.ProjectId);
  // console.log('xxxxx=>', { projectId });
  const handleEditUserOpen = async (id: number) => {
    await fetchDevice({ id });
    setIsEditDeviceOpen(true);
  };

  const handleDeleteUserOpen = () => setIsDeleteDeviceOpen(true);
  const handleCloseEditDialog = () => setIsEditDeviceOpen(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex justify-end">
            <Button
              size="icon"
              variant="ghost"
              title="More options"
              className="focus:ring-0"
              aria-label="Open options menu"
            >
              <EllipsisIcon size={16} aria-hidden="true" />
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => handleEditUserOpen(row.original.id)}
              className="flex justify-between items-center"
            >
              <span>Edit Connection</span>
              <Pencil className="text-blue-500" />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDeleteUserOpen}
              className="flex justify-between items-center"
            >
              <span>Delete Connection</span>
              <Trash2 className="text-red-500" />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Sheet open={isEditDeviceOpen} onOpenChange={setIsEditDeviceOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Connection</SheetTitle>
          </SheetHeader>
          <EditConnections
            onClose={handleCloseEditDialog}
            device={row.original}
            selectType={dataType}
            ProjectId={projectId}
          />
          <SheetDescription className={cn('m-0 p-0')}></SheetDescription>
        </SheetContent>
      </Sheet>

      <AlertDialog
        open={isDeleteDeviceOpen}
        onOpenChange={setIsDeleteDeviceOpen}
      >
        <AlertDialogContent>
          <DeleteConnections
            device={row.original.name}
            deviceId={row.original.id}
          />
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default RowActions;

// import DeleteConnections from '@/components/CRUD/Connections/DeleteConnections';
// import EditConnections from '@/components/CRUD/Connections/EditConnections';
// import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog';
// import { Button } from '@/components/ui/button';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from '@/components/ui/sheet';
// import { fetchDevice } from '@/lib/assests';
// import { dataType } from '@/lib/data';
// import { cn } from '@/lib/utils';
// import { EllipsisIcon, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
// import { useParams } from 'next/navigation';
// import { useState } from 'react';

// interface CellProps {
//   row: {
//     getValue: (key: string) => string;
//     original: {
//       id: number;
//       name: string;
//       dbType: string;
//       host: string;
//       port: number;
//       databaseName: string;
//       username: string;
//       password: string;
//       additionalOptions: string | null;
//       isActive: boolean;
//     };
//   };
// }
// const RowActions = ({ row }: CellProps) => {
//   const [isEditDeviceOpen, setIsEditDeviceOpen] = useState(false);
//   const [isDeleteDeviceOpen, setIsDeleteDeviceOpen] = useState(false);

//   const params = useParams();
//   // const projectId = params.projectId;
//   const projectId = Number(params.projectId) || 0;
//   const handleEditUserOpen = (id: number) => {
//     setIsEditDeviceOpen(true);
//     fetchDevice({ id });
//   };
//   const handleDeleteUserOpen = () => setIsDeleteDeviceOpen(true);
//   const handleCloseEditDialog = () => setIsEditDeviceOpen(false);
//   // console.log('xxxxx', row.original);
//   return (
//     <>
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <div className="flex justify-end">
//             <Button
//               size="icon"
//               variant="ghost"
//               className="shadow-none"
//               aria-label="Edit item"
//             >
//               <EllipsisIcon size={16} aria-hidden="true" />
//             </Button>
//           </div>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent align="end">
//           <DropdownMenuGroup>
//             <DropdownMenuItem
//               onClick={() => handleEditUserOpen(row.original.id)}
//               className="flex justify-between items-center"
//             >
//               <span>Edit Device</span>
//               <Pencil className="text-blue-500" />
//             </DropdownMenuItem>
//             <DropdownMenuItem
//               onClick={handleDeleteUserOpen}
//               className="flex justify-between items-center"
//             >
//               <span>Delete Device</span>
//               <Trash2 className="text-red-500" />
//             </DropdownMenuItem>
//           </DropdownMenuGroup>
//         </DropdownMenuContent>
//       </DropdownMenu>

//       <Sheet open={isEditDeviceOpen} onOpenChange={setIsEditDeviceOpen}>
//         <SheetTrigger
//           onClick={() => fetchDevice({ id: row.original.id })}
//           className="shadow p-2  rounded text-primary dark:bg-gray-200"
//         >
//           Edit Device
//         </SheetTrigger>
//         <SheetContent>
//           <SheetHeader>
//             <SheetTitle className={cn('mb-0 pb-0')}></SheetTitle>
//             <SheetDescription className={cn('mb-0 pb-0')}></SheetDescription>
//           </SheetHeader>
//           <EditConnections
//             // fetchDevices={fetchDevices}
//             onClose={handleCloseEditDialog}
//             devices={row.original}
//             selectType={dataType}
//             ProjectId={projectId}
//           />
//         </SheetContent>
//       </Sheet>

//       {/* Delete User Dialog */}
//       <AlertDialog
//         open={isDeleteDeviceOpen}
//         onOpenChange={setIsDeleteDeviceOpen}
//       >
//         <AlertDialogContent>
//           <DeleteConnections
//             // fetchDevices={fetchDevices}
//             device={row.original.name}
//             deviceId={row.original.id}
//           />
//         </AlertDialogContent>
//       </AlertDialog>
//     </>
//   );
// };

// export default RowActions;
