'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { ChevronDownIcon, Clock, CaseUpper, Braces, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormMessage, FormControl } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Dataset } from '@/types';
import { useId } from 'react';
import { Control } from 'react-hook-form';

type DatasetSelectorProps = {
  databases: Dataset[];
  openDataset: boolean;
  setOpenDataset: (val: boolean) => void;
  selectedDataset: number | null;
  setSelectedDataset: (val: number | null) => void;
  fieldsAndTypes: Record<string, string> | null;
  control: Control<any>;
};

export default function DatasetSelector({
  databases,
  openDataset,
  setOpenDataset,
  selectedDataset,
  setSelectedDataset,
  fieldsAndTypes,
  control,
}: DatasetSelectorProps) {
  const id = useId();

  const getIconForType = (type: string) => {
    if (type.includes('integer') || type.includes('real') || type.includes('id')) {
      return <Hash size={16} className="text-muted-foreground" />;
    } else if (type.includes('character varying') || type.includes('string')) {
      return <CaseUpper size={16} className="text-muted-foreground" />;
    } else if (type.includes('timestamp')) {
      return <Clock size={16} className="text-muted-foreground" />;
    } else if (type.includes('json')) {
      return <Braces size={16} className="text-muted-foreground" />;
    }
    return null;
  };

  return (
    <div className="p-6">
      <span className="font-semibold">
        <FormField
          control={control}
          name="datasetId"
          render={({ field }) => (
            <FormItem className="group relative mb-5">
              <div className="*:not-first:mt-2">
                <Label htmlFor={id}>Dataset</Label>
                <Popover open={openDataset} onOpenChange={setOpenDataset}>
                  <PopoverTrigger asChild>
                    <Button
                      id={id}
                      variant="outline"
                      role="combobox"
                      aria-expanded={openDataset}
                      className="bg-background hover:bg-background border-input w-full justify-between px-3 font-normal"
                    >
                      {field.value ? (
                        <span className="flex min-w-0 items-center gap-2">
                          <span className="truncate">
                            {databases.find((item) => item.id === field.value)?.name}
                          </span>
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Select dataset</span>
                      )}
                      <ChevronDownIcon
                        size={16}
                        className="text-muted-foreground/80 shrink-0"
                        aria-hidden="true"
                      />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search databases..." />
                      <CommandList>
                        <CommandEmpty>No dataset found.</CommandEmpty>
                        <CommandGroup>
                          {databases.map((item) => (
                            <CommandItem
                              key={item.id}
                              value={item.id.toString()}
                              onSelect={(currentValue: string) => {
                                const selectedId = Number(currentValue);
                                setSelectedDataset(selectedId);
                                field.onChange(selectedId);
                                setOpenDataset(false);
                              }}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center gap-2">{item.name}</div>
                              <span className="text-muted-foreground text-xs">
                                {item.id.toLocaleString()}
                              </span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Accordion type="single" collapsible className="w-full px-3" defaultValue="item-2">
          <AccordionItem value="item-2">
            <AccordionTrigger>Columns</AccordionTrigger>
            <AccordionContent>
              {fieldsAndTypes ? (
                <div className="space-y-2">
                  {Object.entries(fieldsAndTypes).map(([field, type]) => (
                    <div key={field} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tooltip>
                          <TooltipTrigger>{getIconForType(type)}</TooltipTrigger>
                          <TooltipContent>
                            <p>Type: {type}</p>
                          </TooltipContent>
                        </Tooltip>
                        <span>{field}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-muted-foreground">No columns selected.</span>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </span>
    </div>
  );
}
