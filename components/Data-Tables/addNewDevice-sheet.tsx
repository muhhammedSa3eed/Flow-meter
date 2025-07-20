// 'use client';
// // import { Button } from '@/components/ui/button';
// // import { Input } from '@/components/ui/input';
// // import { Label } from '@/components/ui/label';
// // import {
// //   Sheet,
// //   SheetClose,
// //   SheetContent,
// //   SheetDescription,
// //   SheetFooter,
// //   SheetHeader,
// //   SheetTitle,
// //   SheetTrigger,
// // } from '@/components/ui/sheet';
// // import { cn } from '@/lib/utils';
// // import { Plus } from 'lucide-react';
// // // import AddConnections from '../CRUD/Connections/AddConnections';
// // // import { dataType } from '@/lib/ConnectionsData';
// // const AddNewDeviceSheet = () => {
// //   return (
// //     <Sheet>
// //       <SheetTrigger asChild>
// //         <SheetTrigger asChild>
// //           <Button variant={'outline'}>
// //             {' '}
// //             <Plus style={{ height: 20, width: 20 }} /> Add New device
// //           </Button>
// //         </SheetTrigger>
// //       </SheetTrigger>
// //       <SheetContent>
// //         {/* <SheetHeader>
// //           <SheetTitle>Edit profile</SheetTitle>
// //           <SheetDescription>
// //             Make changes to your profile here. Click save when you're done.
// //           </SheetDescription>
// //         </SheetHeader> */}
// //         <SheetHeader>
// //           <SheetTitle>Device Property</SheetTitle>
// //           <SheetDescription className={cn('mb-0 pb-0')}></SheetDescription>
// //         </SheetHeader>
// //         {/* <AddConnections
// //           // fetchDevices={fetchDevices}
// //           ProjectId={2}
// //           selectType={dataType}
// //           //   onClose={handleSheetClose}
// //         /> */}
// //         <SheetFooter>
// //           <SheetClose asChild>
// //             <Button type="submit">Save changes</Button>
// //           </SheetClose>
// //         </SheetFooter>
// //       </SheetContent>
// //     </Sheet>
// //   );
// // };

// // export default AddNewDeviceSheet;

// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import {
//   Sheet,
//   SheetClose,
//   SheetContent,
//   SheetDescription,
//   SheetFooter,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from '@/components/ui/sheet';
// import AddConnections from '../CRUD/Connections/AddConnections';
// import { dataType } from '@/lib/data';

// export default function AddNewDeviceSheet() {
//   return (
//     <Sheet>
//       <SheetTrigger asChild>
//         <Button variant="outline">Add New Device</Button>
//       </SheetTrigger>
//       <SheetContent>
//         <SheetHeader>
//           <SheetTitle>Edit profile</SheetTitle>
//           <SheetDescription>
//             Make changes to your profile here. Click save when you're done.
//           </SheetDescription>
//         </SheetHeader>
//         <div className="grid gap-4 py-4">
//           <AddConnections
//             ProjectId={2}
//             selectType={dataType}
//             //           //   onClose={handleSheetClose}
//           />
//         </div>
       
//       </SheetContent>
//     </Sheet>
//   );
// }
