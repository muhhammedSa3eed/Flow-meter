'use client';
import { ChartSchema } from '@/schemas';
import { VisualizationTypes } from '@/types';
import { useId } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import {
  formatLabel,
  pageLengthOptions,
  timeStampForamtOption,
} from '@/lib/chart-assets';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';

const CustomizeChartTable = ({
  form,
  VisualizationTypeData,
  activeCustomizeOptions,
}: {
  form: UseFormReturn<z.infer<typeof ChartSchema>>;
  VisualizationTypeData: VisualizationTypes[];
  activeCustomizeOptions: any;
}) => {
  const visualFormattingFields = ['ShowCellBar', 'Align', 'ColorsCellBars'];
  const id = useId();
  // console.log({ activeCustomizeOptions });
  const updateCustomizeOption = (key: string, value: any) => {
    const currentOptions = form.getValues('customizeOptions') || {};
    const updatedOptions = { ...currentOptions, [key]: value };
    form.setValue('customizeOptions', updatedOptions);
  };
  const renderField = (key: string) => {
    if (key === 'TimestampFormat') {
      return (
        <SelectField
          form={form}
          name="TimestampFormat"
          options={timeStampForamtOption}
          updateCustomizeOption={updateCustomizeOption}
        />
      );
    }
    if (key === 'PageLength') {
      return (
        <SelectField
          form={form}
          name="PageLength"
          options={pageLengthOptions}
          updateCustomizeOption={updateCustomizeOption}
        />
      );
    }

    if (
      [
        'SearchBox',
        'AllowColumnsRearranged',
        'RenderColumnsHTMLFormat',
        'ShowCellBar',
        'Align',
        'ColorsCellBars',
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
        defaultValue={['options', 'visual-formatting']}
      >
        {/* Main Chart Options */}
        <AccordionItem value="options">
          <AccordionTrigger className="text-md font-semibold pb-0">
            Options
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {Object.keys(activeCustomizeOptions)
                .filter(
                  (fieldKey) => !visualFormattingFields.includes(fieldKey)
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
        <AccordionItem value="visual-formatting">
          <AccordionTrigger className="text-md font-semibold mb-2">
            Visual formatting
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {visualFormattingFields.map((key) => (
                <div key={key}>{renderField(key)}</div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default CustomizeChartTable;
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
