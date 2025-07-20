// "use client";

// import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Button } from "@/components/ui/button"; 
// import { useFormContext } from "react-hook-form";
// import { label } from "motion/react-client";

// const Step4 = () => {
//   const { control } = useFormContext();
// const RPOptins =[
//   {id :1, value :"Disabled" , label:"Disabled"},
//   {id :2, value :"7 days" , label:"7 days"},
//   {id :3, value :"30 days" , label:"30 days"},
//   {id :4, value :"90 days" , label:"90 days"},
//   {id :5, value :"1 year" , label:"1 year"},
//   {id :6, value :"3 years" , label:"3 years"},
//   {id :7, value :"5 years" , label:"5 years"},
// ];
//   const handleClearData = () => {
//     console.log("Clear all alarms and history ");
//   };

//   return (
//     <Card className="p-5 w-full">
//       <CardHeader className="pl-0">
//         <CardTitle>{"Alarms Configuration"}</CardTitle>
//         <CardDescription>{"Configure the retention period and clear data below."}</CardDescription>
//       </CardHeader>

//       <div className="flex flex-nowrap justify-between gap-8 my-7">
//         {/* Retention Period */}
//         <div className="w-2/4">
//           <FormField
//             control={control}
//             name="stepFour.Alarmsretention"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>{"Retention Period"}</FormLabel>
//                 <FormControl>
//                   <Select onValueChange={field.onChange} value={field.value}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select retention period" />
//                     </SelectTrigger>
//                     <SelectContent>
//                    {RPOptins.map((item)=>(
//                     <SelectItem key={item.id} value={item.value}>
//                       {item.label}
//                     </SelectItem>
//                    ))}
//                     </SelectContent>
//                   </Select>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
//       </div>

//       {/* Button to Clear All Alarms and History */}
//       <div className="mt-5">
//         <Button onClick={handleClearData}>Clear all alarms and history</Button>
//       </div>
//     </Card>
//   );
// };

// export default Step4;
