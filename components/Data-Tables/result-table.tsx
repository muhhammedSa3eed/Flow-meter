'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { transformChartDataToTable } from '@/lib/chart-assets';
import { formatToDateAndTime } from '@/lib/formate-date';

interface ChartProps {
  chartDetails: any;
  chartData: any;
}

const ResultTable = ({ chartDetails, chartData }: ChartProps) => {
  const chartType = chartDetails?.visualizationType?.type?.toLowerCase() || '';
  const isBigNumber = chartType.includes('bignumber');
  const isPieChart = chartType.includes('pie');
  const isLineChart = chartType.includes('line');
  const isBarChart = chartType.includes('bar');
  const isTableChart = chartType.includes("table")
  const tableData = transformChartDataToTable(chartData?.data?.[0]);
  const headers =
    tableData &&
    Array.from(new Set(tableData.flatMap((obj: {}) => Object.keys(obj))));

  const renderRawTable = () => {
    return chartData?.data &&
      Array.isArray(chartData.data) &&
      chartData.data.length > 0 ? (
      <div className="overflow-x-auto">
        <Table className="text-sm border-collapse w-full">
          <TableHeader>
            <TableRow>
              {Object.keys(chartData.data[0]).map((key) => (
                <TableHead
                  key={key}
                  className="whitespace-nowrap p-2 border-b font-medium text-foreground"
                >
                  {key}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {chartData.data.map((row:any, i:any) => (
              <TableRow key={i}>
                {Object.values(row).map((val, j) => (
                  <TableCell
                    key={j}
                    className="whitespace-nowrap p-2 border-b text-muted-foreground"
                  >
                    {val === null
                      ? '-'
                      : typeof val === 'number'
                      ? val.toLocaleString()
                      : String(val)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    ) : (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground text-center text-xs">
          No valid data available
        </p>
      </div>
    );
    // return chartData?.data &&
    //   Array.isArray(chartData.data) &&
    //   chartData.data.length > 0 ? (
    //   <div className="overflow-x-auto">
    //     <Table className="text-sm border-collapse w-full">
    //       <TableHeader>
    //         <TableRow>
    //           {Object.keys(chartData.data[0]).map((key) => (
    //             <TableHead
    //               key={key}
    //               className="w-1/2 p-2 border-b font-medium text-foreground"
    //             >
    //               {key}
    //             </TableHead>
    //           ))}
    //         </TableRow>
    //       </TableHeader>
    //       <TableBody>
    //         {chartData.data.map((row: any, i: number) => (
    //           <TableRow key={i}>
    //             {Object.values(row).map((val, j) => (
    //               <TableCell
    //                 key={j}
    //                 className="whitespace-nowrap w-1/2 p-2 border-b text-muted-foreground"
    //               >
    //                 <p>{j}</p>
    //                 {val === null
    //                   ? '-'
    //                   : typeof val === 'number'
    //                   ? val.toLocaleString()
    //                   : String(val)}
    //               </TableCell>
    //             ))}
    //           </TableRow>
    //         ))}
    //         {chartData.data.map((row: any, i: number) => (
    //           <TableRow key={`date-${i}`}>
    //             {Object.keys(row).map((key, j) => {
    //               const val = row[key];
    //               return (
    //                 <TableCell
    //                   key={j}
    //                   className="whitespace-nowrap w-1/2 p-2 border-b text-muted-foreground"
    //                 >
    //                   {val === null
    //                     ? '-'
    //                     : key === 'ExistDate'
    //                     ? formatToDateAndTime(val)
    //                     : typeof val === 'number'
    //                     ? val.toLocaleString()
    //                     : String(val)}
    //                 </TableCell>
    //               );
    //             })}
    //           </TableRow>
    //         ))}
    //       </TableBody>
    //     </Table>
    //   </div>
    // ) : (
    //   <div className="flex items-center justify-center h-full">
    //     <p className="text-muted-foreground text-center text-xs">
    //       No valid data available
    //     </p>
    //   </div>
    // );
  };

  const renderFormattedTable = () => {
    return tableData && tableData.length > 0 ? (
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((key: any) => (
              <TableHead key={key}>{key}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((row: any, rowIndex: number) => (
            <TableRow key={rowIndex}>
              {headers.map((key: any) => (
                <TableCell key={key}>
                  {row[key] !== undefined ? row[key] : '-'}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    ) : (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground text-center text-xs">
          No valid data available
        </p>
      </div>
    );
  };

  return (
    <>
      {(isBigNumber || isPieChart || isTableChart) && renderRawTable()}
      {(isLineChart || isBarChart) && renderFormattedTable()}
    </>
  );
};

export default ResultTable;

// 'use client';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { transformChartDataToTable } from '@/lib/chart-assets';
// import { formatToDateAndTime } from '@/lib/formate-date';
// interface ChartProps {
//   chartDetails: any;
//   chartData: any;
// }
// const ResultTable = ({ chartDetails, chartData }: ChartProps) => {
//   const isBigNumber = chartDetails?.visualizationType?.type
//     .toLowerCase()
//     .includes('bignumber');
//   const isPieChart = chartDetails?.visualizationType?.type
//     .toLowerCase()
//     .includes('pie');
//   const isLineChart = chartDetails?.visualizationType?.type
//     .toLowerCase()
//     .includes('line');
//   const isBarChart = chartDetails?.visualizationType?.type
//     .toLowerCase()
//     .includes('bar');
//   const tableData = transformChartDataToTable(chartData?.data?.[0]);
//   const headers =
//     tableData &&
//     Array.from(new Set(tableData.flatMap((obj: {}) => Object.keys(obj))));
//   return (
//     <>
//       {tableData && tableData.length > 0 && (
//         <Table>
//           <TableHeader>
//             <TableRow>
//               {headers.map((key: any) => (
//                 <TableHead key={key}>{key}</TableHead>
//               ))}
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {tableData.map(
//               (row: any, rowIndex: React.Key | null | undefined) => (
//                 <TableRow key={rowIndex}>
//                   {headers.map((key: any) => (
//                     <TableCell key={key}>
//                       {row[key] !== undefined ? row[key] : '-'}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               )
//             )}
//           </TableBody>
//         </Table>
//       )}
//       {chartData?.data &&
//       Array.isArray(chartData.data) &&
//       chartData.data.length > 0 ? (
//         <div className="overflow-x-auto">
//           <Table className="text-sm border-collapse w-full">
//             <TableHeader>
//               <TableRow>
//                 {Object.keys(chartData.data[0]).map((key) => (
//                   <TableHead
//                     key={key}
//                     className="w-1/2  p-2 border-b font-medium text-foreground"
//                   >
//                     {key}
//                   </TableHead>
//                 ))}
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {chartData.data.map((row: any, i: number) => (
//                 <TableRow key={i}>
//                   {Object.values(row).map((val, j) => (
//                     <TableCell
//                       key={j}
//                       className="whitespace-nowrap w-1/2 p-2 border-b text-muted-foreground"
//                     >
//                       <p>{j}</p>
//                       {val === null
//                         ? '-'
//                         : typeof val === 'number'
//                         ? val.toLocaleString()
//                         : String(val)}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))}
//               {chartData.data.map(
//                 (
//                   row: { [x: string]: any },
//                   i: React.Key | null | undefined
//                 ) => (
//                   <TableRow key={i}>
//                     {Object.keys(row).map((key, j) => {
//                       const val = row[key];
//                       return (
//                         <TableCell
//                           key={j}
//                           className="whitespace-nowrap w-1/2 p-2 border-b text-muted-foreground"
//                         >
//                           {val === null
//                             ? '-'
//                             : key === 'ExistDate'
//                             ? formatToDateAndTime(val)
//                             : typeof val === 'number'
//                             ? val.toLocaleString()
//                             : String(val)}
//                         </TableCell>
//                       );
//                     })}
//                   </TableRow>
//                 )
//               )}
//             </TableBody>
//           </Table>
//         </div>
//       ) : (
//         <div className="flex items-center justify-center h-full">
//           <p className="text-muted-foreground text-center text-xs">
//             No valid data available
//           </p>
//         </div>
//       )}
//     </>
//   );
// };

// export default ResultTable;
