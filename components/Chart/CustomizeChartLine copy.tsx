'use client';

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
import { useId, useEffect, useState } from 'react';
import { VisualizationTypes } from '@/types';
import { Input } from '../ui/input';
import {
  fontStyleTypes,
  fontWeightTypes,
  formatLabel,
  LinePalettes,
} from '@/lib/chart-assets';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';

const CustomizeChartLine = ({
  form,
  VisualizationTypeData,
  activeCustomizeOptions,
}: {
  form: UseFormReturn<z.infer<typeof ChartSchema>>;
  VisualizationTypeData: VisualizationTypes[];

  activeCustomizeOptions: any;
}) => {
  const [xValues, setXValues] = useState<string[]>([]);
  const [yValues, setYValues] = useState<string[]>([]);
  const addX = () => setXValues([...xValues, '']);
  const addY = () => setYValues([...yValues, '']);

  const updateX = (index: number, value: string) => {
    const updated = [...xValues];
    updated[index] = value;
    setXValues(updated);
    updateCustomizeOption('xAxis', updated);
  };

  const updateY = (index: number, value: string) => {
    const updated = [...yValues];
    updated[index] = value;
    setYValues(updated);
    updateCustomizeOption('yAxis', updated);
  };

  const removeX = (index: number) => {
    const updated = [...xValues];
    updated.splice(index, 1);
    setXValues(updated);
    updateCustomizeOption('xAxis', updated);
  };

  const removeY = (index: number) => {
    const updated = [...yValues];
    updated.splice(index, 1);
    setYValues(updated);
    updateCustomizeOption('yAxis', updated);
  };

  const isDataValid = xValues.length === yValues.length && xValues.length > 0;
  const updateCustomizeOption = (key: string, value: any) => {
    const currentOptions = form.getValues('customizeOptions') || {};
    const updatedOptions = { ...currentOptions, [key]: value };
    form.setValue('customizeOptions', updatedOptions);
  };
  console.log(
    'form.getValues(customizeOptions)',
    form.getValues('customizeOptions')
  );

  const showLegendValue = useWatch({
    control: form.control,
    name: 'customizeOptions.Legend',
  });
  const showTextStyleValue = useWatch({
    control: form.control,
    name: 'customizeOptions.textStyle',
  });
  console.log('showTextStyleValue', showTextStyleValue);
  if (activeCustomizeOptions['textStyle']) {
    activeCustomizeOptions['color'] = true;
    activeCustomizeOptions['fontFamily'] = true;
    activeCustomizeOptions['fontSize'] = true;
    activeCustomizeOptions['fontStyle'] = true;
    activeCustomizeOptions['fontWeight'] = true;
  } else {
    delete activeCustomizeOptions['color'];
    delete activeCustomizeOptions['fontFamily'];
    delete activeCustomizeOptions['fontSize'];
    delete activeCustomizeOptions['fontStyle'];
    delete activeCustomizeOptions['fontWeight'];
  }
  console.log({ activeCustomizeOptions });
  const inputFields: Record<string, 'text' | 'number' | 'color'> = {
    color: 'color',
    fontFamily: 'text',
    fontSize: 'number',
  };
  const renderField = (key: string) => {
    if (inputFields[key]) {
      return (
        <InputField
          key={key}
          form={form}
          name={key}
          type={inputFields[key]}
          updateCustomizeOption={updateCustomizeOption}
        />
      );
    }
    if (key === 'fontStyle') {
      return (
        <SelectField
          key={key}
          form={form}
          name={key}
          options={fontStyleTypes}
          updateCustomizeOption={updateCustomizeOption}
        />
      );
    }
    if (key === 'fontWeight') {
      return (
        <SelectField
          key={key}
          form={form}
          name={key}
          options={fontWeightTypes}
          updateCustomizeOption={updateCustomizeOption}
        />
      );
    }
    if (key === 'colorPlatte') {
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
                    <SelectValue placeholder="Select Color Platte">
                      <div className="flex justify-between items-center w-full gap-4">
                        <span className="truncate">{field.value}</span>
                        <div className="flex gap-1">
                          {LinePalettes.map((color, i) => (
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
                  {LinePalettes.map((palette, i) => (
                    <SelectItem key={i} value={palette}>
                      <div className="flex justify-between items-center w-full min-w-[200px] gap-4">
                        <span className="truncate">{palette}</span>
                        <div className="flex gap-1">
                          <span
                            key={i}
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: palette }}
                          />
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
    if (key === 'xAxis') {
      return (
        <div key={key}>
          <Label className="mb-1 block">{formatLabel(key)} Labels</Label>
          {xValues.map((x, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <Input
                value={x}
                onChange={(e) => updateX(index, e.target.value)}
                placeholder={`Label ${index + 1}`}
                className="w-[200px]"
              />
              <Button
                type="button"
                className=" text-destructive bg-transparent shadow-none py-1 px-1.5 hover:bg-gray-200"
                onClick={() => removeX(index)}
              >
                <Trash2 className="w-1 h-1" />
              </Button>
            </div>
          ))}
          <Button type="button" onClick={addX}>
            + Add X
          </Button>
        </div>
      );
    }

    if (key === 'yAxis') {
      return (
        <div key={key}>
          <Label className="mb-1 block">{formatLabel(key)} Values</Label>
          {yValues.map((y, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <Input
                value={y}
                onChange={(e) => updateY(index, e.target.value)}
                placeholder={`Value ${index + 1}`}
                className="w-[200px]"
              />
              <Button
                type="button"
                className=" text-destructive bg-transparent shadow-none py-1 px-1.5 hover:bg-gray-200"
                onClick={() => removeY(index)}
              >
                <Trash2 className="w-1 h-1" />
              </Button>
            </div>
          ))}
          <Button type="button" onClick={addY}>
            + Add Y
          </Button>
        </div>
      );
    }
  };
  return (
    <div className="space-y-6">
      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={['chart-options']}
      >
        <AccordionItem value="chart-options">
          <AccordionTrigger className="text-md font-semibold mb-2">
            Chart Options
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {activeCustomizeOptions &&
                Object.keys(activeCustomizeOptions).map((fieldKey) =>
                  activeCustomizeOptions[fieldKey]
                    ? renderField(fieldKey)
                    : null
                )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default CustomizeChartLine;

const InputField = ({
  form,
  name,
  type,
  updateCustomizeOption,
}: {
  form: any;
  name: string;
  type: 'text' | 'number' | 'color';
  updateCustomizeOption: any;
}) => {
  const id = useId();
  return (
    <FormField
      control={form.control}
      name={`customizeOptions.${name}`}
      render={({ field }: any) => (
        <FormItem>
          <FormLabel htmlFor={id}>{formatLabel(name)}</FormLabel>
          <FormControl>
            <Input
              id={id}
              type={type}
              value={field.value ?? (type === 'number' ? 0 : '')}
              onChange={(e) => {
                const value =
                  type === 'number' ? Number(e.target.value) : e.target.value;
                field.onChange(value);
                updateCustomizeOption(name, value);
              }}
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </FormControl>
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
