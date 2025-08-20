'use client';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartSchema } from '@/schemas';
import { UseFormReturn, useWatch } from 'react-hook-form';
import { z } from 'zod';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { useId, useEffect } from 'react';
import { Chart, VisualizationTypes } from '@/types';
import { Input } from '../ui/input';
import {
  Currency,
  CurrencyFormat,
  formatLabel,
  palettes,
  sortSeriesOptions,
  stackedStyleOptions,
  AxisMarginOptions,
  yAxisPositionOptions,
  orientations,
  chartTypes,
  RotateXaxisLabelOptions,
} from '@/lib/chart-assets';
const tooltipFields = [
  'RichTooltip',
  'ShowTotal',
  'ShowPercentage',
  'TooltipSortByMetric',
];
export default function CustomizeChartBar({
  form,
  VisualizationTypeData,
  activeCustomizeOptions,
}: {
  form: UseFormReturn<z.infer<typeof ChartSchema>>;
  VisualizationTypeData: VisualizationTypes[];
  activeCustomizeOptions: any;
}) {
  const id = useId();
  const showLegendValue = useWatch({
    control: form.control,
    name: 'customizeOptions.ShowLegend',
  });
  const ShowLabelsValue = useWatch({
    control: form.control,
    name: 'customizeOptions.ShowLabels',
  });
  const updateCustomizeOption = (key: string, value: any) => {
    const currentOptions = form.getValues('customizeOptions') || {};
    const updatedOptions = { ...currentOptions, [key]: value };
    form.setValue('customizeOptions', updatedOptions);
  };

  if (ShowLabelsValue) {
    activeCustomizeOptions['PutLabelsOutside'] = true;
    activeCustomizeOptions['LabelLine'] = true;
  } else {
    delete activeCustomizeOptions['PutLabelsOutside'];
    delete activeCustomizeOptions['LabelLine'];
  }
  useEffect(() => {
    if (showLegendValue) {
      const current = form.getValues('customizeOptions') || {};
      if (!current.Type) updateCustomizeOption('Type', 'plain');
      if (!current.Orientation) updateCustomizeOption('Orientation', 'Top');
      if (!('Margin' in current)) updateCustomizeOption('Margin', '');
    } else {
      const updated = { ...form.getValues('customizeOptions') };
      delete updated.Type;
      delete updated.Orientation;
      delete updated.Margin;
      form.setValue('customizeOptions', updated);
    }
  }, [showLegendValue]);
  const legendFields = ['Type', 'Orientation', 'Margin'];

  const renderField = (key: string) => {
    if (key === 'BarOrientation') {
      return (
        <FormField
          key={key}
          control={form.control}
          name={`customizeOptions.${key}`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bar orientation</FormLabel>
              <Tabs
                value={field.value ?? 'vertical'}
                onValueChange={(value) => {
                  field.onChange(value);
                  updateCustomizeOption(key, value);
                }}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="vertical">Vertical</TabsTrigger>
                  <TabsTrigger value="horizontal">Horizontal</TabsTrigger>
                </TabsList>
              </Tabs>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    // Axis Groups
    if (key === 'xAxis') {
      return (
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue="x-axis"
        >
          <AccordionItem value="x-axis">
            <AccordionTrigger className="text-md font-semibold mb-2">
              X Axis
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {/* <div className="space-y-1">
                  <Label htmlFor="y-axis-title">X Axis Title</Label>
                  <Input
                    id="x-axis-title"
                    value={activeCustomizeOptions?.['XAXISTITL'] || ''}
                    onChange={(e) =>
                      updateCustomizeOption('XAXISTITL', e.target.value)
                    }
                    type="text"
                  />
                </div> */}
                <FormField
                  control={form.control}
                  name={`customizeOptions.X-AxisTitle`}
                  render={({ field }) => (
                    <div className="space-y-1">
                      <Label htmlFor="x-axis-title">X Axis Title</Label>
                      <Input
                        id="x-axis-title"
                        type="text"
                        placeholder="Enter X Axis Title"
                        value={field.value ?? ''}
                        onChange={(e) => {
                          field.onChange(e);
                          updateCustomizeOption('X-AxisTitle', e.target.value);
                        }}
                      />
                    </div>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`customizeOptions.X-AxisTitleMargin`}
                  render={({ field }) => (
                    <div className="space-y-1">
                      <Label htmlFor="x-axis-emargin">
                        X Axis Title margin
                      </Label>
                      <Select
                        value={field.value}
                        onValueChange={(val) =>
                          updateCustomizeOption('X-AxisTitleMargin', val)
                        }
                      >
                        <SelectTrigger id="x-axis-emargin">
                          <SelectValue placeholder="Select margin" />
                        </SelectTrigger>
                        <SelectContent>
                          {AxisMarginOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`customizeOptions.X-AxisTitlePosition`}
                  render={({ field }) => (
                    <div className="space-y-1">
                      <Label htmlFor="x-axis-position">
                        X Axis Title Position
                      </Label>

                      <Select
                        value={field.value}
                        onValueChange={(val) =>
                          updateCustomizeOption('X-AxisTitlePosition', val)
                        }
                      >
                        <SelectTrigger id="x-axis-position">
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                          {yAxisPositionOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      );
    }

    if (key === 'yAxis') {
      return (
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue="y-axis"
        >
          <AccordionItem value="y-axis">
            <AccordionTrigger className="text-md font-semibold mb-2">
              Y Axis
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {/* Y AXIS TITL */}
                <FormField
                  control={form.control}
                  name={`customizeOptions.Y-AxisTitle`}
                  render={({ field }) => (
                    <div className="space-y-1">
                      <Label htmlFor="y-axis-title">Y Axis Title</Label>
                      <Input
                        id="y-axis-title"
                        type="text"
                        placeholder="Enter Y Axis Title"
                        value={field.value ?? ''}
                        onChange={(e) => {
                          field.onChange(e);
                          updateCustomizeOption('Y-AxisTitle', e.target.value);
                        }}
                      />
                    </div>
                  )}
                />
                {/* Y AXIS TITL EMARGIN */}
                <FormField
                  control={form.control}
                  name={`customizeOptions.Y-AxisTitleMargin`}
                  render={({ field }) => (
                    <div className="space-y-1">
                      <Label htmlFor="y-axis-emargin">
                        Y Axis Title margin
                      </Label>

                      <Select
                        value={field.value}
                        onValueChange={(val) =>
                          updateCustomizeOption('Y-AxisTitleMargin', val)
                        }
                      >
                        <SelectTrigger id="y-axis-emargin">
                          <SelectValue placeholder="Select margin" />
                        </SelectTrigger>
                        <SelectContent>
                          {AxisMarginOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
                {/* Y AXIS TITLE POSITION */}
                <FormField
                  control={form.control}
                  name={`customizeOptions.Y-AxisTitlePosition`}
                  render={({ field }) => (
                    <div className="space-y-1">
                      <Label htmlFor="y-axis-title">
                        Y Axis Title position
                      </Label>

                      <Select
                        value={field.value}
                        onValueChange={(val) =>
                          updateCustomizeOption('Y-AxisTitlePosition', val)
                        }
                      >
                        <SelectTrigger id="y-axis-position">
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                          {yAxisPositionOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      );
    }

    {
      /* Sort Series By */
    }

    if (key === 'SortSeriesBy') {
      return (
        <SelectField
          form={form}
          name="SortSeriesBy"
          options={sortSeriesOptions}
          updateCustomizeOption={updateCustomizeOption}
        />
      );
    }
    {
      /* Sort Series Ascending */
    }

    if (key === 'SortSeriesAscending') {
      return (
        <FormField
          control={form.control}
          name={`customizeOptions.SortSeriesAscending`}
          render={({ field }: any) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <Checkbox
                  id={id}
                  checked={field.value === true}
                  // onCheckedChange={field.onChange}
                  onCheckedChange={(value) => {
                    field.onChange(value);
                    updateCustomizeOption(key, value);
                  }}
                />
                <Label htmlFor={id}>Sort Series Ascending</Label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    {
      /* Stacked Style */
    }
    if (key === 'StackedStyle') {
      return (
        <SelectField
          form={form}
          name="StackedStyle"
          options={stackedStyleOptions}
          updateCustomizeOption={updateCustomizeOption}
        />
      );
    }

    if (key === 'RotateXaxisLabel') {
      return (
        <FormField
          control={form.control}
          name={`customizeOptions.${key}`}
          render={({ field }: any) => (
            <FormItem>
              <FormLabel>Rotate X Axis Label</FormLabel>
              <Select
                onValueChange={(value) => {
                  const numericValue = Number(value);
                  field.onChange(numericValue);
                  updateCustomizeOption(key, numericValue);
                }}
                value={String(field.value)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue>
                      {field.value === 0
                        ? '0'
                        : field.value || 'Select rotation'}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {RotateXaxisLabelOptions.map((opt: number) => (
                    <SelectItem key={opt} value={String(opt)}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }
    if (key === 'RotateYaxisLabel') {
      return (
        <FormField
          control={form.control}
          name={`customizeOptions.${key}`}
          render={({ field }: any) => (
            <FormItem>
              <FormLabel>Rotate Y Axis Label</FormLabel>
              <Select
                onValueChange={(value) => {
                  const numericValue = Number(value);
                  field.onChange(numericValue);
                  updateCustomizeOption(key, numericValue);
                }}
                value={String(field.value)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue>
                      {field.value === 0
                        ? '0'
                        : field.value || 'Select rotation'}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {RotateXaxisLabelOptions.map((opt: number) => (
                    <SelectItem key={opt} value={String(opt)}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }
    if (key === 'ColorScheme') {
      return (
        <FormField
          key={key}
          control={form.control}
          name={`customizeOptions.${key}`}
          render={({ field }: any) => (
            <FormItem>
              <FormLabel>{formatLabel(key)}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Color Scheme">
                      <div className="flex justify-between items-center w-full gap-4">
                        <span className="truncate">{field.value}</span>
                        <div className="flex gap-1">
                          {(
                            palettes.find((p) => p.name === field.value)
                              ?.colors || []
                          )
                            .slice(0, 5)
                            .map((color, i) => (
                              <span
                                key={i}
                                className="w-3 h-3 rounded"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                        </div>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {palettes.map((palette) => (
                    <SelectItem key={palette.name} value={palette.name}>
                      <div className="flex justify-between items-center w-full min-w-[200px] gap-4">
                        <span className="truncate">{palette.name}</span>
                        <div className="flex gap-1">
                          {palette.colors.map((color, i) => (
                            <span
                              key={i}
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }
    if (key === 'ShowValue') {
      return (
        <FormField
          control={form.control}
          name={`customizeOptions.ShowValue`}
          render={({ field }: any) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <Checkbox
                  id={id}
                  checked={field.value === true}
                  // onCheckedChange={field.onChange}
                  onCheckedChange={(value) => {
                    field.onChange(value);
                    updateCustomizeOption(key, value);
                  }}
                />
                <Label htmlFor={id}>Show Value</Label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }
    if (key === 'CurrencyFormat') {
      return (
        <div
          key="currency-group"
          className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full"
        >
          <div className="min-w-0 w-full">
            <SelectField
              form={form}
              name="CurrencyFormat"
              options={CurrencyFormat}
              updateCustomizeOption={updateCustomizeOption}
            />
          </div>
          <div className="min-w-0 w-full">
            <CurrencySelectField
              form={form}
              name="Currency"
              options={Currency}
              updateCustomizeOption={updateCustomizeOption}
            />
          </div>
        </div>
      );
    }

    if (key === 'ShowLegend') {
      return (
        <>
          <FormField
            control={form.control}
            name={`customizeOptions.ShowLegend`}
            render={({ field }: any) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={id}
                    checked={field.value === true}
                    onCheckedChange={(value) => {
                      field.onChange(value);
                      updateCustomizeOption(key, value);
                    }}
                  />
                  <Label htmlFor={id}>Show Legend</Label>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {showLegendValue && (
            <Accordion type="single" collapsible className="w-full mt-2">
              <AccordionItem value="legend">
                <AccordionTrigger className="text-md font-semibold mb-2">
                  Legend
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  {renderField('Type')}
                  {renderField('Orientation')}
                  {renderField('Margin')}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </>
      );
    }

    if (key === 'Orientation') {
      return (
        <SelectField
          form={form}
          name="Orientation"
          options={orientations}
          updateCustomizeOption={updateCustomizeOption}
        />
      );
    }

    if (key === 'Type') {
      return (
        <SelectField
          form={form}
          name="Type"
          options={chartTypes}
          updateCustomizeOption={updateCustomizeOption}
        />
      );
    }

    if (key === 'Margin') {
      return (
        <FormField
          control={form.control}
          name={`customizeOptions.Margin`}
          render={({ field }: any) => (
            <FormItem>
              <FormLabel>Legend Margin</FormLabel>
              <Input
                type="text"
                value={field.value || ''}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  updateCustomizeOption('Margin', e.target.value);
                }}
              />
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    if (
      [
        'SortSeriesAscending',
        'Minorticks',
        'DataZoom',
        'ShowValue',
        'RichTooltip',
        'ShowTotal',
        'ShowPercentage',
        'TooltipSortByMetric',
        'LogarithmicAxis',
        'MinorSplitLine',
        'TruncateAxis',
      ].includes(key)
    ) {
      return (
        <CheckboxField
          form={form}
          name={key}
          updateCustomizeOption={updateCustomizeOption}
        />
      );
    }
  };

  return (
    <div className="space-y-6">
      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={['chart-options', 'legend-options', 'tooltip-options']}
      >
        {/* Main Chart Options */}
        <AccordionItem value="chart-options">
          <AccordionTrigger className="text-md font-semibold pb-0">
            Chart Options
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {Object.keys(activeCustomizeOptions)
                .filter(
                  (fieldKey) =>
                    !legendFields.includes(fieldKey) &&
                    !tooltipFields.includes(fieldKey)
                )
                .map((fieldKey) =>
                  activeCustomizeOptions[fieldKey] ? (
                    <div key={fieldKey}>{renderField(fieldKey)}</div>
                  ) : null
                )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Tooltip Section */}
        <AccordionItem value="tooltip-options">
          <AccordionTrigger className="text-md font-semibold mb-2">
            Tooltip
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {tooltipFields.map((key) => (
                <div key={key}>{renderField(key)}</div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
const CheckboxField = ({
  form,
  name,
  updateCustomizeOption,
}: {
  form: any;
  name: string;
  updateCustomizeOption: (key: string, value: any) => void;
}) => {
  const id = useId();
  return (
    <FormField
      control={form.control}
      name={`customizeOptions.${name}`}
      render={({ field }: any) => (
        <FormItem>
          <div className="flex items-center gap-2">
            <Checkbox
              id={id}
              checked={field.value === true}
              onCheckedChange={(value) => {
                field.onChange(value);
                updateCustomizeOption(name, value);
              }}
            />
            <Label htmlFor={id}>{formatLabel(name)}</Label>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const SelectField = ({ form, name, options, updateCustomizeOption }: any) => (
  <FormField
    control={form.control}
    name={`customizeOptions.${name}`}
    render={({ field }: any) => (
      <FormItem>
        <FormLabel>{formatLabel(name)}</FormLabel>
        <Select
          onValueChange={(value) => {
            field.onChange(value);
            updateCustomizeOption(name, value);
          }}
          value={field.value}
        >
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${formatLabel(name)}`} />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {options.map((opt: any) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
);

const CurrencySelectField = ({
  form,
  name,
  options,
  updateCustomizeOption,
}: any) => (
  <FormField
    control={form.control}
    name={`customizeOptions.${name}`}
    render={({ field }: any) => (
      <FormItem>
        <FormLabel>{formatLabel(name)}</FormLabel>
        <Select
          onValueChange={(value: any) => {
            field.onChange(value);
            updateCustomizeOption(name, value);
          }}
          value={field.value}
        >
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${formatLabel(name)}`}>
                {options.find((opt: any) => opt.value === field.value)?.label ||
                  'Select Currency'}
              </SelectValue>
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {options.map((opt: any) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
);
