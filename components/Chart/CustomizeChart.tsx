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
import { Chart, VisualizationTypes } from '@/types';
import { Input } from '../ui/input';
import { chartTypes, Currency, CurrencyFormat, formatLabel, lableType, orientations, palettes, roseTypes } from '@/lib/chart-assets';




// const formatLabel = (label: string) =>
//   label.replace(/([a-z])([A-Z])/g, '$1 $2');

export default function CustomizeChart({
  form,
  VisualizationTypeData,

  activeCustomizeOptions,
}: {
  form: UseFormReturn<z.infer<typeof ChartSchema>>;
  VisualizationTypeData: VisualizationTypes[];
  activeCustomizeOptions: any;
}) {
  // const selectedTypeId = useWatch({
  //   control: form.control,
  //   name: 'visualizationTypeId',
  // });

  // const selectedTypeData = VisualizationTypeData.find(
  //   (type) => type.id === selectedTypeId
  // );
  // console.log({ VisualizationTypeData });
  // console.log({ selectedTypeData });
  // const activeCustomizeOptions: Record<string, boolean> =
  //   selectedTypeData?.optionsFields?.reduce(
  //     (acc, key) => ({ ...acc, [key]: true }),
  //     {}
  //   ) || {};
  console.log({ activeCustomizeOptions });
  const showLegendValue = useWatch({
    control: form.control,
    name: 'customizeOptions.Legend',
  });
  const DonutValue = useWatch({
    control: form.control,
    name: 'customizeOptions.Donut',
  });

  if (DonutValue) {
    activeCustomizeOptions['InnerRadius'] = true;
  } else {
    delete activeCustomizeOptions['InnerRadius'];
  }
  if (showLegendValue) {
    activeCustomizeOptions['Orientation'] = true;
    activeCustomizeOptions['Left'] = true;
    activeCustomizeOptions['z'] = true;
    activeCustomizeOptions['top'] = true;
    activeCustomizeOptions['align'] = true;
    activeCustomizeOptions['Show'] = true;
    activeCustomizeOptions['backgroundColor'] = true;
    activeCustomizeOptions['borderColor'] = true;
    activeCustomizeOptions['borderRadius'] = true;
    activeCustomizeOptions['borderWidth'] = true;
    activeCustomizeOptions['padding'] = true;
    activeCustomizeOptions['itemGap'] = true;
    activeCustomizeOptions['itemWidth'] = true;
    activeCustomizeOptions['itemHeight'] = true;
    activeCustomizeOptions['symbolRotate'] = true;
    activeCustomizeOptions['symbolKeepAspect'] = true;
    activeCustomizeOptions['inactiveColor'] = true;
    activeCustomizeOptions['inactiveBorderColor'] = true;
    activeCustomizeOptions['inactiveBorderWidth'] = true;
  } else {
    delete activeCustomizeOptions['Orientation'];
    delete activeCustomizeOptions['Left'];
    delete activeCustomizeOptions['z'];
    delete activeCustomizeOptions['top'];
    delete activeCustomizeOptions['align'];
    delete activeCustomizeOptions['Show'];
    delete activeCustomizeOptions['backgroundColor'];
    delete activeCustomizeOptions['borderColor'];
    delete activeCustomizeOptions['borderRadius'];
    delete activeCustomizeOptions['borderWidth'];
    delete activeCustomizeOptions['padding'];
    delete activeCustomizeOptions['itemGap'];
    delete activeCustomizeOptions['itemWidth'];
    delete activeCustomizeOptions['itemHeight'];
    delete activeCustomizeOptions['symbolRotate'];
    delete activeCustomizeOptions['symbolKeepAspect'];
    delete activeCustomizeOptions['inactiveColor'];
    delete activeCustomizeOptions['inactiveBorderColor'];
    delete activeCustomizeOptions['inactiveBorderWidth'];
  }

  const ShowLabelsValue = useWatch({
    control: form.control,
    name: 'customizeOptions.ShowLabels',
  });
  const updateCustomizeOption = (key: string, value: any) => {
    const currentOptions = form.getValues('customizeOptions') || {};
    const updatedOptions = { ...currentOptions, [key]: value };
    form.setValue('customizeOptions', updatedOptions);
  };

  console.log('form===>', form.getValues('customizeOptions'));

  if (ShowLabelsValue) {
    activeCustomizeOptions['PutLabelsOutside'] = true;
    activeCustomizeOptions['LabelLine'] = true;
  } else {
    delete activeCustomizeOptions['PutLabelsOutside'];
    delete activeCustomizeOptions['LabelLine'];
  }

  const inputFields: Record<string, 'text' | 'number'> = {
    PercentageThreshold: 'number',
    Left: 'text',
    z: 'number',
    top: 'number',
    align: 'text',
    backgroundColor: 'text',
    borderColor: 'text',
    borderRadius: 'number',
    borderWidth: 'number',
    padding: 'number',
    itemGap: 'number',
    itemWidth: 'number',
    itemHeight: 'number',
    symbolRotate: 'text',
    inactiveColor: 'text',
    inactiveBorderColor: 'text',
    inactiveBorderWidth: 'text',
    Margin: 'number',
    Subtitle: 'text',
    AxisTitle: 'text',
    AXISTITLEMARGIN: 'number',
    AXISTITLEPOSITION: 'text',
    SortSeriesBy: 'text',
    TimeFormat: 'text',
    TooltipTimeFormat: 'text',
    AxisFormat: 'text',
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
    // if (key === 'DateFormat') {
    //   return (
    //     <SelectField
    //       key={key}
    //       form={form}
    //       name={key}
    //       options={dateFormats}
    //       updateCustomizeOption={updateCustomizeOption}
    //     />
    //   );
    // }
    if (key === "ColorScheme") {
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
    if (key === 'RoseType') {
      return (
        <SelectField
          key={key}
          form={form}
          name={key}
          options={roseTypes}
          updateCustomizeOption={updateCustomizeOption}
        />
      );
    }
    if (key === 'Orientation') {
      return (
        <SelectField
          key={key}
          form={form}
          name={key}
          options={orientations}
          updateCustomizeOption={updateCustomizeOption}
        />
      );
    }
    if (key === 'Type') {
      return (
        <SelectField
          key={key}
          form={form}
          name={key}
          options={chartTypes}
          updateCustomizeOption={updateCustomizeOption}
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
    if (key === 'OuterRadius') {
      return (
        <SliderField
          key={key}
          form={form}
          name={key}
          updateCustomizeOption={updateCustomizeOption}
        />
      );
    }
    if (key === 'InnerRadius') {
      return (
        <SliderField
          key={key}
          form={form}
          name={key}
          updateCustomizeOption={updateCustomizeOption}
        />
      );
    }
    // if (key === 'Currency') return null;
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

// const SliderField = ({ form, name, updateCustomizeOption }: any) => {
//   const id = useId();
//   return (
//     <FormField
//       control={form.control}
//       name={`customizeOptions.${name}`}
//       render={({ field }: any) => (
//         <FormItem>
//           <div className="flex items-center justify-between gap-2">
//             <FormLabel htmlFor={id}>{formatLabel(name)}</FormLabel>
//             <output className="text-sm font-medium tabular-nums">
//               {typeof field.value === 'number' ? field.value : 0}
//             </output>
//           </div>
//           <Slider
//             id={id}
//             value={[typeof field.value === 'number' ? field.value : 0]}
//             onValueChange={(value) => {
//               field.onChange(value[0]);
//               updateCustomizeOption(name, value);
//             }}
//             aria-label="Slider with output"
//             min={0}
//             max={100}
//           />
//           <FormMessage />
//         </FormItem>
//       )}
//     />
//   );
// };

// const CheckboxField = ({ form, name, updateCustomizeOption }: any) => {
//   const id = useId();
//   return (
//     <FormField
//       control={form.control}
//       name={`customizeOptions.${name}`}
//       render={({ field }: any) => (
//         <FormItem>
//           <div className="flex items-center gap-2">
//             <Checkbox
//               id={id}
//               checked={field.value === true}
//               // onCheckedChange={field.onChange}
//               onCheckedChange={(value) => {
//                 field.onChange(value);
//                 updateCustomizeOption(name, value);
//               }}
//             />
//             <Label htmlFor={id}>{formatLabel(name)}</Label>
//           </div>
//           <FormMessage />
//         </FormItem>
//       )}
//     />
//   );
// };
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

// const InputField = ({
//   form,
//   name,
//   type,
//   updateCustomizeOption,
// }: {
//   form: any;
//   name: string;
//   type: 'text' | 'number';
//   updateCustomizeOption: any;
// }) => {
//   const id = useId();
//   return (
//     <FormField
//       control={form.control}
//       name={`customizeOptions.${name}`}
//       render={({ field }: any) => (
//         <FormItem>
//           <FormLabel htmlFor={id}>{formatLabel(name)}</FormLabel>
//           <FormControl>
//             <Input
//               id={id}
//               type={type}
//               {...field}
//               value={field.value ?? (type === 'number' ? 0 : '')}
//               onValueChange={(value: any) => {
//                 field.onChange(value);
//                 updateCustomizeOption(name, value);
//               }}
//               className="w-full rounded-md border px-3 py-2 text-sm"
//             />
//           </FormControl>
//           <FormMessage />
//         </FormItem>
//       )}
//     />
//   );
// };
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
