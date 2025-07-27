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
import { useId, useEffect } from 'react';
import {  VisualizationTypes } from '@/types';
import { Input } from '../ui/input';
import { formatLabel } from '@/lib/chart-assets';

const fontSizes = ['text-sm', 'text-base', 'text-lg', 'text-xl'];
const numberFormats = ['none', 'comma', 'dot', 'space'];
const dateFormats = ['YYYY-MM-DD', 'DD/MM/YYYY', 'MM/DD/YYYY', 'DD MMM YYYY'];
const lableType = [
  'Value',
  'Category Name',
  'Percentage',
  'Category & Value',
  'Category & Percentage',
  'Category ,Value & Percentage',
  'Value & Percentage',
  'Template',
];

// const formatLabel = (label: string) =>
//   label.replace(/([a-z])([A-Z])/g, '$1 $2');

export default function CustomizeChartBigNumber({
  form,
  VisualizationTypeData, 
  activeCustomizeOptions
}: {
  form: UseFormReturn<z.infer<typeof ChartSchema>>;
  VisualizationTypeData: VisualizationTypes[];
  activeCustomizeOptions:any
}) {
  // const selectedTypeId = useWatch({
  //   control: form.control,
  //   name: 'visualizationTypeId',
  // });

  // const selectedTypeData = VisualizationTypeData.find(
  //   (type) => type.id === selectedTypeId
  // );
  // console.log('12345', { selectedTypeId });
  // console.log({ VisualizationTypeData });
  // console.log({ selectedTypeData });
  // const activeCustomizeOptions: Record<string, boolean> =
  //   selectedTypeData?.optionsFields?.reduce(
  //     (acc, key) => ({ ...acc, [key]: true }),
  //     {}
  //   ) || {};
  // console.log({ activeCustomizeOptions });

  const updateCustomizeOption = (key: string, value: any) => {
    const currentOptions = form.getValues('customizeOptions') || {};
    const updatedOptions = { ...currentOptions, [key]: value };
    form.setValue('customizeOptions', updatedOptions);
  };

  // console.log('form===>', form.getValues('customizeOptions'));
  const inputFields: Record<string, 'text' | 'number'> = {
    Subtitle: 'text',
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
    if (['BigNumberFontSize', 'SubheaderFontSize'].includes(key)) {
      return (
        <SelectField
          key={key}
          form={form}
          name={key}
          options={fontSizes}
          updateCustomizeOption={updateCustomizeOption}
        />
      );
    }
    if (key === 'NumberFormat') {
      return (
        <SelectField
          key={key}
          form={form}
          name={key}
          options={numberFormats}
          updateCustomizeOption={updateCustomizeOption}
        />
      );
    }
    if (key === 'LabelType') {
      return (
        <SelectField
          key={key}
          form={form}
          name={key}
          options={lableType}
          updateCustomizeOption={updateCustomizeOption}
        />
      );
    }
    if (key === 'DateFormat') {
      return (
        <SelectField
          key={key}
          form={form}
          name={key}
          options={dateFormats}
          updateCustomizeOption={updateCustomizeOption}
        />
      );
    }
    if (key === 'Currency') return null;
    return (
      <CheckboxField
        key={key}
        form={form}
        name={key}
        updateCustomizeOption={updateCustomizeOption}
      />
    );
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
}

// --- Components ---

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
const SliderField = ({ form, name, updateCustomizeOption }: any) => {
  const id = useId();
  return (
    <FormField
      control={form.control}
      name={`customizeOptions.${name}`}
      render={({ field }: any) => (
        <FormItem>
          <div className="flex items-center justify-between gap-2">
            <FormLabel htmlFor={id}>{formatLabel(name)}</FormLabel>
            <output className="text-sm font-medium tabular-nums">
              {typeof field.value === 'number' ? field.value : 0}
            </output>
          </div>
          <Slider
            id={id}
            value={[typeof field.value === 'number' ? field.value : 0]}
            onValueChange={(value) => {
              field.onChange(value[0]);
              updateCustomizeOption(name, value[0]);
            }}
            aria-label="Slider with output"
            min={0}
            max={100}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};


const CheckboxField = ({ form, name, updateCustomizeOption }: any) => {
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

const InputField = ({
  form,
  name,
  type,
  updateCustomizeOption,
}: {
  form: any;
  name: string;
  type: 'text' | 'number';
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
