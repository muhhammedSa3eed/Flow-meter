'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';
import EmtyChart from '../motion/EmtyChart';
import { motion } from 'framer-motion';
import { palettes } from '@/lib/chart-assets';

const ChartDisplay = ({
  chartData,
  createdChartId,
}: {
  chartData: any;
  createdChartId?: number | null;
}) => {
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

  const selectedPaletteName = chartData.customizeOptions?.ColorScheme;
  const selectedPalette = palettes.find(p => p.name === selectedPaletteName);
  const colors = selectedPalette?.colors || ['#409EFF'];

  const pieChartData = chartData?.data?.map((item: any) => {
    const keys = Object.keys(item);
    return {
      value: item[keys[1]],
      name: String(item[keys[0]]),
    };
  });

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

  const xAxisData = chartData?.data?.map((item: any) => item?.[xKey] ?? 'N/A');
  const seriesData = chartData?.data?.map((item: any) => {
    if (!yKey) return 0;
    const val = item?.[yKey];
    return typeof val === 'number' ? val : Number(val) || 0;
  });

  if (!chartData?.data?.[0]) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <EmtyChart />
        <motion.div
          className="mt-10 text-center space-y-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-base text-muted-foreground font-medium">
            {createdChartId
              ? 'Loading updated chart...'
              : 'Welcome to Neuss 👋'}
          </p>
          <p className="text-sm text-muted-foreground">
            {createdChartId
              ? 'Your chart preview will appear here once updated.'
              : 'Your chart preview will appear here once created.'}
          </p>
        </motion.div>
      </div>
    );
  }

  if (isBigNumber) {
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
          {Object.values(chartData.data[0])[0]}
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
            text: chartData.name || 'Chart',
            subtext: chartData.visualizationType?.type || 'Pie',
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
    return (
      <ReactECharts
        option={{
          title: {
            text: chartData.name || 'Bar Chart',
            subtext: chartData.visualizationType?.type || 'Bar',
            bottom: 'left',
          },
          tooltip: { trigger: 'axis' },
          color: colors,
          xAxis: {
            type: 'category',
            data: xAxisData,
            axisLabel: { rotate: 45 },
          },
          yAxis: {
            type: 'value',
          },
          legend: {
            orient: chartData.customizeOptions?.Orientation || 'horizontal',
            left: 'center',
            top: chartData.customizeOptions?.Margin || 'top',
            selector: true,
            type: chartData.customizeOptions?.type,
          },
          series: [
            {
              name: yKey || 'Value',
              type: 'bar',
              data: seriesData,
              itemStyle: {
                borderRadius: 4,
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
            text: chartData.name || 'Line Chart',
            left: 'center',
          },
          tooltip: { trigger: 'axis' },
          color: colors,
          xAxis: {
            type: 'category',
            data: xAxisData,
            axisLabel: { rotate: 45 },
          },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              name: yKey || 'Value',
              type: 'line',
              data: seriesData,
              itemStyle: {
                borderRadius: 4,
              },
            },
          ],
        }}
        style={{ height: 400, width: '100%' }}
      />
    );
  }

  return (
    <div className="text-muted-foreground text-sm italic">
      No data available to display.
    </div>
  );
};

export default ChartDisplay;
