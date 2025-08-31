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
  const isTableChart = chartType.includes('table');
  const tableData = transformChartDataToTable(chartData?.data?.[0]);
  // const headers =
  //   tableData &&
  //   Array.from(new Set(tableData.flatMap((obj: {}) => Object.keys(obj))));
  const firstColumn = chartData?.data?.[0]?.xAxis?.name;
  // console.log({ firstColumn });
  let headers: string[] = [];
  if (tableData && tableData.length > 0) {
    headers = Array.from(
      new Set(tableData.flatMap((obj: {}) => Object.keys(obj)))
    );

    headers = [firstColumn, ...headers.filter((h) => h !== firstColumn)];
  }
  console.log('chartData.data', JSON.stringify(chartData?.data?.[0]));
  console.log('Json', JSON.stringify(tableData));
  const y = [
    {
      series: [
        {
          name: '0',
          type: 'bar',
          data: [3, 2, 2, 1.6666666666666667, 3, 12.5, 3, 11.5],
        },
        { name: '7', type: 'bar', data: [0, 2, 0, 0, 0, 0, 0, 0] },
        { name: '7.2', type: 'bar', data: [0, 0, 0, 0, 0, 0, 0, 0] },
        { name: '9.211694', type: 'bar', data: [0, 0, 48, 0, 0, 0, 0, 0] },
        { name: '10.2', type: 'bar', data: [0, 0, 0, 0, 3, 22, 44, 12.5] },
        { name: '20.2', type: 'bar', data: [0, 0, 0, 0, 0, 3, 0, 0] },
        { name: '100.2', type: 'bar', data: [0, 0, 0, 4, 0, 0, 0, 0] },
      ],
      xAxis: {
        name: 'StationBayId',
        categories: ['1', '2', '3', '4', '5', '6', '7', '8'],
      },
    },
  ];
  const x = [
    {
      '0': 3,
      '7': 0,
      StationBayId: '1',
      '7.2': 0,
      '9.211694': 0,
      '10.2': 0,
      '20.2': 0,
      '100.2': 0,
    },
    {
      '0': 2,
      '7': 2,
      StationBayId: '2',
      '7.2': 0,
      '9.211694': 0,
      '10.2': 0,
      '20.2': 0,
      '100.2': 0,
    },
    {
      '0': 2,
      '7': 0,
      StationBayId: '3',
      '7.2': 0,
      '9.211694': 48,
      '10.2': 0,
      '20.2': 0,
      '100.2': 0,
    },
    {
      '0': 1.6666666666666667,
      '7': 0,
      StationBayId: '4',
      '7.2': 0,
      '9.211694': 0,
      '10.2': 0,
      '20.2': 0,
      '100.2': 4,
    },
    {
      '0': 3,
      '7': 0,
      StationBayId: '5',
      '7.2': 0,
      '9.211694': 0,
      '10.2': 3,
      '20.2': 0,
      '100.2': 0,
    },
    {
      '0': 12.5,
      '7': 0,
      StationBayId: '6',
      '7.2': 0,
      '9.211694': 0,
      '10.2': 22,
      '20.2': 3,
      '100.2': 0,
    },
    {
      '0': 3,
      '7': 0,
      StationBayId: '7',
      '7.2': 0,
      '9.211694': 0,
      '10.2': 44,
      '20.2': 0,
      '100.2': 0,
    },
    {
      '0': 11.5,
      '7': 0,
      StationBayId: '8',
      '7.2': 0,
      '9.211694': 0,
      '10.2': 12.5,
      '20.2': 0,
      '100.2': 0,
    },
  ];
  const renderTableChart = () => {
    const { columns, rows } = chartData?.data?.[0] || {};

    return columns && rows && rows.length > 0 ? (
      <div className="overflow-x-auto">
        <Table className="text-sm border-collapse w-full">
          <TableHeader>
            <TableRow>
              {columns.map((col: string, i: number) => (
                <TableHead
                  key={i}
                  className="whitespace-nowrap p-2 border-b font-medium text-foreground"
                >
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(
              (
                row: (string | number | null | undefined)[],
                rowIndex: number
              ) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <TableCell
                      key={cellIndex}
                      className="whitespace-nowrap p-2 border-b text-muted-foreground"
                    >
                      {cell !== null && cell !== undefined && cell !== ''
                        ? typeof cell === 'number'
                          ? cell.toLocaleString()
                          : String(cell)
                        : '-'}
                    </TableCell>
                  ))}
                </TableRow>
              )
            )}
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
  };
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
            {chartData.data.map((row: any, i: any) => (
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
      {(isBigNumber || isPieChart) && renderRawTable()}
      {(isLineChart || isBarChart) && renderFormattedTable()}
      {isTableChart && renderTableChart()}
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
