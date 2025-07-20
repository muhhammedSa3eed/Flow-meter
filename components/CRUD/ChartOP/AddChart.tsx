// import React, { Suspense } from "react";
// import Loading from "@/app/loading";
// import ProjectIdTabs from "@/components/ProjectIdTabs";
// import { Separator } from "@/components/ui/separator";
// import { Label } from "@radix-ui/react-dropdown-menu";
// import { Input } from "@/components/ui/input";
// import ChooseChart from "@/components/Chart/ChooseChart";


// export default async function AddChart({
//   params,
// }: {
//   params: Promise<{ ProjectId: number; projectName: string }>;
// }) {
//   const ProjectId = (await params).ProjectId;
//   const projectName = (await params).projectName;
//   return (
//     <Suspense fallback={<Loading />}>
//       <ProjectIdTabs projectName={projectName} projectId={ProjectId} />
//       <Label className="font-bold ml-4 my-2">Chart</Label>
//       <Input
//         type="text"
//         placeholder="Chart name"
//         className="border-none ml-4"
//       />
//       <Separator className="my-4 bg-custom-green2" />

//       <div className="flex flex-row ">

//         <Separator
//           orientation="vertical"
//           className="mx-4 h-6 bg-custom-green2"
//         />
//         <div className="basis-64"><ChooseChart/></div>
//         <Separator
//           orientation="vertical"
//           className="mx-4 h-6 bg-custom-green2"
//         />
//         <div className="basis-128">03</div>
//       </div>
//     </Suspense>
//   );
// }
