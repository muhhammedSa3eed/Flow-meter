import { Option } from '@/components/ui/multiselect';
import {
  AreaChart,
  BarChart,
  FolderCheck,
  LineChart,
  PieChart,
  SquareAsterisk,
  Table,
  ChartBarStacked,
  ChartPie,
  ChevronDownIcon,
  LineChartIcon,
  Plus,
  Radius,
} from 'lucide-react';

export const formatLabel = (label: string) =>
  label.replace(/([a-z])([A-Z])/g, '$1 $2');

export const fontStyleTypes = ['normalize', 'italic', 'oblique'];
export const fontWeightTypes = ['normal', 'bold', 'bolder', 'lighter'];
export const LinePalettes = [
  '#5470c6',
  '#91cc75',
  '#fac858',
  '#ee6666',
  '#73c0de',
  '#3ba272',
  '#fc8452',
  '#9a60b4',
  '#ea7ccc',
];

export const DisplayOptions: Option[] = [
  { value: 'Dimensions', label: 'Dimensions' },
  { value: 'ForceCategorical', label: 'Force categorical' },
  { value: 'Filters', label: 'Filters' },
  { value: 'RowLimit', label: 'Row limit' },
  { value: 'SortBy', label: 'Sort by' },
  { value: 'Subheader', label: 'Subheader' },
  { value: 'X-axis', label: 'X-axis' },
  { value: 'X-AxisSortBy', label: 'X-Axis Sort By' },
  { value: 'ContributionMode', label: 'Contribution Mode' },
  { value: 'Series limit', label: 'Series limit' },
  { value: 'SortQueryBy', label: 'Sort query by' },
  { value: 'TruncateMetric', label: 'Truncate Metric' },
  { value: 'ShowEmptyColumns', label: 'Show empty columns' },
];
export const CustomizationOptions: Option[] = [
  { value: 'textStyle', label: 'Text Style' },
  { value: 'aria', label: 'Aria' },
  { value: 'colorPlatte', label: 'Color Platte' },
  { value: 'gradientColor', label: 'Gradient Color' },
  { value: 'stateAnimation', label: 'State Animation' },
  { value: 'animation', label: 'Animation' },
  { value: 'animationDuration', label: 'Animation Duration' },
  { value: 'animationDurationUpdate', label: 'Animation Duration Update' },
  { value: 'animationEasing', label: 'Animation Easing' },
  { value: 'animationEasingUpdate', label: 'Animation Easing Update:' },
  { value: 'animationThreshold', label: 'Animation Threshold' },
  { value: 'progressiveThreshold', label: 'Progressive Threshold' },
  { value: 'progressive', label: 'Progressive' },
  { value: 'hoverLayerThreshold', label: 'hover Layer Threshold' },
  { value: 'useUTC', label: 'Use UTC' },
  { value: 'title', label: 'Title' },
  { value: 'axisPointer', label: 'Axis Pointer' },
  { value: 'tooltip', label: 'Tooltipr' },
  { value: 'legend', label: 'Legend' },
  { value: 'yAxis', label: 'Y Axis' },
  { value: 'xAxis', label: ' X Axis' },
  { value: 'grid', label: 'Grid' },
  { value: "BigNumberFontSize", label: "Big Number Font Size" },
  { value: "SubheaderFontSize", label: "Subheader Font Size" },
  { value: "NumberFormat", label: "Number format" },
  { value: "CurrencyFormat", label: "Currency format" },
  { value: "Currency", label: "Currency" },
  { value: "DateFormat", label: "Date format" },
  { value: "ForceDateFormat", label: "Force date format" },
  { value: "ColorScheme", label: "Color Scheme" },
  { value: "PercentageThreshold", label: "Percentage threshold" },
  { value: "RoseType", label: "Rose Type" },
  { value: "Legend", label: "Legend" },
  { value: "Type", label: "Type" },
  { value: "Orientation", label: "Orientation" },
  { value: "Margin", label: "Margin" },
  { value: "LabelType", label: "Label Type" },
  { value: "ShowLabels", label: "Show Labels" },
  { value: "PutLabelsOutside", label: "Put labels outside" },
  { value: "LabelLine", label: "Label Line" },
  { value: "ShowTotal", label: "Show Total" },
  { value: "OuterRadius", label: "Outer Radius" },
  { value: "Donut", label: "Donut" },
  { value: "Subtitle", label: "Subtitle" },
  { value: "BarOrientation", label: "Bar orientation" },
  { value: "AxisTitle", label: "Axis Title" },
  { value: "AXISTITLEMARGIN", label: "AXIS TITLE MARGIN" },
  { value: "AXISTITLEPOSITION", label: "AXIS TITLE POSITION" },
  { value: "SortSeriesBy", label: "Sort Series By" },
  { value: "SortSeriesAscending", label: "Sort Series Ascending" },
  { value: "ShowValue", label: "Show Value" },
  { value: "StackedStyle", label: "Stacked Style" },
  { value: "Minorticks", label: "Minor ticks" },
  { value: "DataZoom", label: "Data Zoom" },
  { value: "ShowLegend", label: "Show legend" },
  { value: "TimeFormat", label: "Time format" },
  { value: "RotateXaxisLabel", label: "Rotate x axis label" },
  { value: "TruncateXAxis", label: "Truncate X Axis" },
  { value: "RichTooltip", label: "Rich tooltip" },
  { value: "ShowPercentage", label: "Show percentage" },
  { value: "TooltipSortByMetric", label: "Tooltip sort by metric" },
  { value: "TooltipTimeFormat", label: "Tooltip time format" },
  { value: "AxisFormat", label: "Axis Format" },
  { value: "LogarithmicAxis", label: "Logarithmic axis" },
  { value: "MinorSplitLine", label: "Minor Split Line" },
  { value: "TruncateAxis", label: "Truncate Axis" },
  { value: "XAxisLabelInterval", label: "X Axis Label Interval" },
  { value: "XAxisBounds", label: "X Axis Bounds" },
];
export const IconOptions = [
  { id: 1, value: 'bar', label: 'Bar Chart', icon: <BarChart size={20} /> },
  { id: 2, value: 'pie', label: 'Pie Chart', icon: <PieChart size={20} /> },
  { id: 3, value: 'line', label: 'Line Chart', icon: <LineChart size={20} /> },
  { id: 4, value: 'area', label: 'Area Chart', icon: <AreaChart size={20} /> },
  { id: 5, value: 'table', label: 'Table', icon: <Table size={20} /> },
  {
    id: 6,
    value: 'bignumber',
    label: 'Big number',
    icon: <SquareAsterisk size={20} />,
  },
];
export const aggregate: Option[] = [
  { value: 'AVG', label: 'AVG' },
  { value: 'COUNT', label: 'COUNT' },
  { value: 'COUNT_DISTINCT', label: 'COUNT_DISTINCT', disable: true },
  { value: 'MAX', label: 'MAX' },
  { value: 'MIN', label: 'MIN' },
  { value: 'SUM', label: 'SUM' },
];

export const RowLimit = [
  { value: 'none', label: 'none' },
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 50, label: '50' },
  { value: 100, label: '100' },
  { value: 250, label: '250' },
  { value: 500, label: '500' },
  { value: 1000, label: '1000' },
  { value: 5000, label: '5000' },
  { value: 10000, label: '10000' },
];

export const operators: Option[] = [
  { value: 'Equals', label: 'Equals to (=)' },
  { value: 'NotEquals', label: 'Not Equals to (≠)' },
  { value: 'GreaterThan', label: 'Greater Than (>)' },
  { value: 'LessThan', label: 'Less Than (<)' },
  { value: 'GreaterThanOrEqual', label: 'Greater  or Equal (>=)' },
  { value: 'LessThanOrEqual', label: 'Less  or Equal (<=)' },
  { value: 'NotNull', label: 'Not null' },
  { value: 'In', label: 'In' },
  { value: 'NotIn', label: 'Not in' },
];

export const ChartItems = [
  {
    value: 'table',
    label: 'Table',
    icon: Table,
  },
  {
    value: 'line chart',
    label: 'Line chart',
    icon: LineChartIcon,
  },
  {
    value: 'piechart',
    label: 'Pie chart',
    icon: ChartPie,
  },
  {
    value: 'bar chart',
    label: 'Bar chart',
    icon: ChartBarStacked,
  },
  {
    value: 'bignumber',
    label: 'Big number',
    icon: Radius,
  },
];

// export const marginXAxisTitle = [
//   { value: 'none', label: 'none' },
//   { value: 15, label: '15' },
//   { value: 30, label: '30' },
//   { value: 50, label: '50' },
//   { value: 75, label: '75' },
//   { value: 100, label: '100' },
//   { value: 125, label: '125' },
//   { value: 150, label: '150' },
//   { value: 175, label: '175' },
//   { value: 200, label: '200' },
// ];
export const marginAxisTitle = [
  'none',
  '15',
  '30',
  '50',
  '75',
  '100',
  '125',
  '150',
  '175',
  '200',
];

export const axisTitlePositionOption = ['Left', 'Top'];
// export const DisplayAndHideOptions: Option[] = [
//   { value: 'Metrics', label: 'Metrics' },
//   { value: 'Dimensions', label: 'Dimensions' },
//   { value: 'Filters', label: 'Filters' },
//   { value: 'RowLimit', label: 'Row limit' },
//   { value: 'SortBy', label: 'Sort by' },
//   { value: 'Subheader', label: 'Subheader' },
//   { value: 'X-axis', label: 'X-axis' },
//   { value: 'X-AxisSortBy', label: 'X-Axis Sort By' },
//   { value: 'ContributionMode', label: 'Contribution Mode' },
//   { value: 'Series limit', label: 'Series limit' },
//   { value: 'SortQueryBy', label: 'Sort query by' },
//   { value: 'TruncateMetric', label: 'Truncate Metric' },
//   { value: 'ShowEmptyColumns', label: 'Show empty columns' },
// ];
export const sortSeriesOptions = [
  "Total value",
  "Category name",
  "Minimum value",
  "Maximum value",
  "Average value",
];

export const stackedStyleOptions = ["None", "stack", "stream"];


export const RotateXaxisLabelOptions = [0, 45, 90];
export const palettes = [
  {
    name: 'Superset Colors',
    colors: [
      '#1f77b4',
      '#2ca02c',
      '#ff7f0e',
      '#d62728',
      '#9467bd',
      '#8c564b',
      '#e377c2',
      '#7f7f7f',
      '#bcbd22',
      '#17becf',
    ],
  },
  {
    name: 'Waves of blue',
    colors: ['#001f3f', '#0056b3', '#0074d9', '#7fdbff', '#cceeff'],
  },
  {
    name: 'Airbnb Colors',
    colors: ['#00a699', '#ff5a5f', '#484848', '#767676', '#b0b0b0'],
  },
  {
    name: 'D3 Category 10',
    colors: [
      '#1f77b4',
      '#ff7f0e',
      '#2ca02c',
      '#d62728',
      '#9467bd',
      '#8c564b',
      '#e377c2',
      '#7f7f7f',
      '#bcbd22',
      '#17becf',
    ],
  },
  {
    name: 'Blue to Green',
    colors: [
      '#003f5c',
      '#2f4b7c',
      '#665191',
      '#a05195',
      '#d45087',
      '#f95d6a',
      '#ff7c43',
      '#ffa600',
    ],
  },
  {
    name: 'Colors of Rainbow',
    colors: [
      '#ff0000',
      '#ff7f00',
      '#ffff00',
      '#00ff00',
      '#0000ff',
      '#4b0082',
      '#9400d3',
    ],
  },
  {
    name: 'Modern Sunset',
    colors: ['#f6d365', '#fda085', '#fbc2eb', '#a6c1ee', '#84fab0', '#8fd3f4'],
  },
];


export const roseTypes = ['area', 'radius', 'none'];
export const orientations = ['Left', 'Right', 'Top', 'Bottom'];
export const chartTypes = ['scroll', 'plain'];
export const CurrencyFormat = ['Prefix', 'Suffix'];
export const Currency = [
  { label: '$ (USD)', value: '$' },
  { label: '€ (EUR)', value: '€' },
  { label: '£ (GBP)', value: '£' },
  { label: '₹ (INR)', value: '₹' },
  { label: '¥ (JPY)', value: '¥' },
  { label: 'MX$ (MXN)', value: 'MX$' },
  { label: 'CN¥ (CNY)', value: 'CN¥' },
];

export const lableType = [
  'Value',
  'Category Name',
  'Percentage',
  'Category & Value',
  'Category & Percentage',
  'Category ,Value & Percentage',
  'Value & Percentage',
  'Template',
];

export const AxisMarginOptions = ["15", "30", "50", "75", "100", "125", "150", "200"];
export const yAxisPositionOptions = ["Left", "Top"];

export const transformChartDataToTable = (chartData:any) => {
  const { xAxis, series } = chartData;

  const categories = xAxis.categories; // ["1", "2", ...]
  const tableRows = categories.map((stationId: any, index:number) => {
    const row: Record<string, string | number> = {
      StationBayId: stationId,
    };

    series.forEach((s: { name: string | number; data: number[]; }) => {
      row[s.name] = s.data[index] ?? 0;
    });

    return row;
  });

  return tableRows;
};

