'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';
import EmtyChart from '../motion/EmtyChart';
import { motion } from 'framer-motion';
import { palettes } from '@/lib/chart-assets';
import ChartDataTable from './ChartDataTable';

const ChartDisplay = ({
  chartData,
  createdChartId,
  isDashboard,
}: {
  chartData: any;
  createdChartId?: number | null;
  isDashboard?: boolean;
}) => {
  console.log('from chart display', { chartData });
  const isBigNumber = chartData?.visualizationType?.type
    ?.toLowerCase()
    .includes('bignumber');
  const isPieChart = chartData?.visualizationType?.type
    ?.toLowerCase()
    .includes('pie');
  const isBarChart = chartData?.visualizationType?.type
    ?.toLowerCase()
    .includes('bar');
  const isLineChart = chartData?.visualizationType?.type
    ?.toLowerCase()
    .includes('line');
  const isTableChart = chartData?.visualizationType?.type
    ?.toLowerCase()
    .includes('table');

  const selectedPaletteName = chartData?.customizeOptions?.ColorScheme;
  const selectedPalette = palettes.find((p) => p.name === selectedPaletteName);
  const colors = selectedPalette?.colors || ['#409EFF'];

  const pieChartData = chartData?.data?.map((item: any) => {
    const keys = Object.keys(item);
    return {
      value: item[keys[1]],
      name: String(item[keys[0]]),
    };
  });
  const tableData = chartData?.data;
  console.log(JSON.stringify(tableData));
  console.log({ pieChartData });
  console.log({ isPieChart });
  const dataKeys = chartData?.data?.[0] ? Object.keys(chartData.data[0]) : [];

  const xKey =
    chartData?.dimensions?.[0] && dataKeys.includes(chartData.dimensions[0])
      ? chartData.dimensions[0]
      : dataKeys[0];

  const yKey =
    chartData?.metrics?.[0]?.columnName &&
    dataKeys.includes(chartData.metrics[0].columnName)
      ? chartData.metrics[0].columnName
      : dataKeys.find((k) => k !== xKey);
  const xAxisData = chartData?.data[0]?.xAxis?.categories?.map(
    (item: string) => item ?? 'N/A'
  );

  const seriesData = chartData?.data[0]?.series;
  const barSeriesData = seriesData?.map((item: { data: any }) =>
    Math.max(...item.data)
  );
  // console.log({ xAxisData });
  const legandTitle = chartData?.data[0]?.series?.map((item: any) => item.name);
  // console.log({ legandTitle });
  // console.log('chartData?.data', chartData?.data);
  // console.log({ xAxisData });
  // console.log({ seriesData });
  // console.log('JSON.stringify(seriesData)', JSON.stringify(seriesData));
  // console.log({ barSeriesData });
  console.log('!chartData?.data?.[0]', chartData?.data?.[0]);
  // if (!chartData?.data?.[0]) {
  //   return (
  //     <div className="flex flex-col items-center justify-center h-full">
  //       <EmtyChart />
  //       <motion.div
  //         className="mt-10 text-center space-y-1"
  //         initial={{ opacity: 0, y: 20 }}
  //         animate={{ opacity: 1, y: 0 }}
  //         transition={{ duration: 0.6, delay: 0.2 }}
  //       >
  //         <p className="text-base text-muted-foreground font-medium">
  //           {createdChartId
  //             ? 'Loading updated chart...'
  //             : 'Welcome to Neuss 👋'}
  //         </p>
  //         <p className="text-sm text-muted-foreground">
  //           {createdChartId
  //             ? 'Your chart preview will appear here once updated.'
  //             : 'Your chart preview will appear here once created.'}
  //         </p>
  //       </motion.div>
  //     </div>
  //   );
  // }

  if (isBigNumber) {
    const getBigNumberValue = () => {
      const source = chartData?.pieChartData?.[0] ?? chartData?.data?.[0];
      if (!source || typeof source !== 'object') return '—';
      const vals = Object.values(source);
      return vals.length > 0 ? vals[0] : '—';
    };
    return (
      <div className="text-center space-y-2">
        <div
          className={`font-bold ${
            chartData.customizeOptions?.BigNumberFontSize || 'text-8xl'
          }`}
        >
          {chartData.customizeOptions?.CurrencyFormat === 'Prefix'
            ? chartData.customizeOptions?.Currency || ''
            : ''}
          {getBigNumberValue()}
          {/* {Object.values(chartData.data[0])[0]} */}
          {chartData.customizeOptions?.CurrencyFormat === 'Suffix'
            ? chartData.customizeOptions?.Currency || ''
            : ''}
        </div>
        {chartData.customizeOptions?.Subtitle && (
          <div className="text-muted-foreground text-sm">
            {chartData.customizeOptions.Subtitle}
          </div>
        )}
      </div>
    );
  }

  if (isPieChart && pieChartData) {
    return (
      <ReactECharts
        option={{
          title: {
            text: isDashboard ? '' : chartData.name || 'Chart',
            subtext: isDashboard
              ? ''
              : chartData.visualizationType?.type || 'Pie',
            bottom: 'left',
          },
          tooltip: { trigger: 'item' },
          color: colors,
          legend: {
            orient: chartData.customizeOptions?.Orientation || 'horizontal',
            left: 'center',
            top: chartData.customizeOptions?.Margin || 'top',
            selector: true,
            type: chartData.customizeOptions?.type,
          },
          series: [
            {
              name: chartData.metrics?.[0]?.columnName || 'Value',
              type: 'pie',
              radius: chartData.customizeOptions?.Donut
                ? ['40%', '70%']
                : '50%',
              roseType: chartData.customizeOptions?.RoseType || false,
              data: pieChartData,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
              },
            },
          ],
        }}
        style={{ height: 400, width: '100%' }}
      />
    );
  }

  if (
    isBarChart &&
    xAxisData?.length > 0 &&
    seriesData?.some((v: any) => v !== undefined)
  ) {
    const selectedPaletteName =
      chartData.customizeOptions?.ColorScheme || 'Superset Colors';
    const selectedPalette =
      palettes.find((p) => p.name === selectedPaletteName)?.colors ||
      palettes[0].colors;

    return (
      <ReactECharts
        option={{
          title: {
            text: isDashboard ? '' : chartData.name || 'Bar Chart',
            subtext: isDashboard
              ? ''
              : chartData.visualizationType?.type || 'Bar',
            // bottom: 'left',
          },
          tooltip: { trigger: 'axis' },
          xAxis: {
            type: 'category',
            data: xAxisData,
            axisLabel: {
              rotate: chartData.customizeOptions?.RotateXaxisLabel ?? 0,
            },
          },
          toolbox: {
            feature: {
              saveAsImage: {},
            },
          },
          legend: {
            data: legandTitle,
          },

          yAxis: {
            type: 'value',
          },
          series: [
            {
              data: barSeriesData,
              type: 'bar',
              itemStyle: {
                borderRadius: 4,
                color: function (params: any) {
                  return selectedPalette[
                    params.dataIndex % selectedPalette.length
                  ];
                },
              },
            },
          ],
        }}
        style={{ height: 400, width: '100%' }}
      />
    );
  }

  if (
    isLineChart &&
    xAxisData?.length > 0 &&
    seriesData?.some((v: any) => v !== undefined)
  ) {
    return (
      <ReactECharts
        option={{
          title: {
            text: isDashboard ? '' : chartData.name || 'Line Chart',
          },
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            data: legandTitle,
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
          },
          toolbox: {
            feature: {
              saveAsImage: {},
            },
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xAxisData,
          },
          yAxis: {
            type: 'value',
          },
          series: seriesData,
        }}
        style={{ height: 400, width: '100%' }}
      />
    );
  }

  if (isTableChart) {
    return (
      <>
        <ChartDataTable dataTable={tableData} options={chartData.customizeOptions} />
      </>
    );
  }
  return (
    <div className="text-muted-foreground text-sm italic">
      No data available to display.
    </div>
  );
};

export default ChartDisplay;
