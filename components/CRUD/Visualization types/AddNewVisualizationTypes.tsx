'use client';
import React, { useId } from 'react';
import MultipleSelector, { Option } from '@/components/ui/multiselect';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SheetClose, SheetFooter } from '@/components/ui/sheet';
import { VisualizationTypesSchema } from '@/schemas';
import {
  AreaChart,
  BarChart,
  FolderCheck,
  LineChart,
  PieChart,
  SquareAsterisk,
  Table,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import {
  CustomizationOptions,
  DisplayOptions,
  IconOptions,
} from '@/lib/chart-assets';

export default function AddNewVisualizationTypes() {
  const id = useId();
  const router = useRouter();
  const form = useForm<z.infer<typeof VisualizationTypesSchema>>({
    resolver: zodResolver(VisualizationTypesSchema),
    defaultValues: {
      id: 0,
      name: '',
      type: '',
      iconId: 0,
      displayFields: [],
      optionsFields: [],
    },
  });

  const arrayToOptions = (values: string[], optionsList: Option[]) =>
    values.map(
      (key) =>
        optionsList.find((opt) => opt.value === key) || {
          value: key,
          label: key,
        }
    );

  const optionsToArray = (options: Option[]) => options.map((opt) => opt.value);

  async function onSubmit(values: z.infer<typeof VisualizationTypesSchema>) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/VisualizationTypes`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || 'An error occurred.');
        return;
      }
      toast.success('Visualization type has been successfully added.');
      form.reset();
      router.refresh();
      // window.location.reload();
    } catch (err) {
      if (err instanceof Error) {
        toast.error(`Failed to add visualization type: ${err.message}`);
      } else {
        toast.error(
          'Failed to add visualization type due to an unknown error.'
        );
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold mb-2 ">
              Basic Info
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 my-1">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <div className="group relative">
                        <FormLabel htmlFor={id}>Name</FormLabel>
                        <Input id={id} type="text" placeholder="" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="iconId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mt-3 text-lg font-semibold mb-2">
                    Choose Type
                  </FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-2 gap-2">
                      {IconOptions.map((option) => (
                        <Button
                          key={option.id}
                          type="button"
                          variant={
                            field.value === option.id ? 'custom' : 'outline'
                          }
                          onClick={() => {
                            field.onChange(option.id);
                            form.setValue('type', option.value);
                          }}
                          className="flex items-center gap-2 justify-start"
                        >
                          {option.icon}
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold mb-5">
              Visibility Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="displayFields"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 mt-3">
                    Display Fields
                    <FolderCheck />
                  </FormLabel>
                  <FormControl>
                    <MultipleSelector
                      value={arrayToOptions(field.value, DisplayOptions)}
                      onChange={(options) =>
                        field.onChange(optionsToArray(options))
                      }
                      creatable
                      options={DisplayOptions}
                      placeholder="Select fields to display"
                      emptyIndicator={
                        <p className="text-center text-sm">
                          No available options
                        </p>
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold mb-5">
              Customization Options
            </CardTitle>
          </CardHeader>
          <CardContent className="mt-3">
            <FormField
              control={form.control}
              name="optionsFields"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mt-3">Customization Options</FormLabel>
                  <FormControl>
                    <MultipleSelector
                      value={arrayToOptions(field.value, CustomizationOptions)}
                      onChange={(options) =>
                        field.onChange(optionsToArray(options))
                      }
                      creatable
                      options={CustomizationOptions}
                      placeholder="Select customization options"
                      emptyIndicator={
                        <p className="text-center text-sm">No results found</p>
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <SheetFooter>
          <SheetClose asChild>
            <Button
              type="button"
              variant="destructive"
              size="custom"
              className="mr-auto"
            >
              Cancel
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button
              type="submit"
              variant={'Accepted'}
              size="custom"
              className="ml-auto"
            >
              Save
            </Button>
          </SheetClose>
        </SheetFooter>
      </form>
    </Form>
  );
}
