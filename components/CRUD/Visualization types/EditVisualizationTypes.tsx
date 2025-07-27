import React, { useEffect, useId } from 'react';
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
import { VisualizationTypes } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { CustomizationOptions, DisplayOptions, IconOptions } from '@/lib/chart-assets';

export default function EditVisualizationTypes({
  VisualizationTypes: initial,
}: {
  VisualizationTypes: VisualizationTypes;
}) {
  const id = useId();
  const router = useRouter();
  const form = useForm<z.infer<typeof VisualizationTypesSchema>>({
    resolver: zodResolver(VisualizationTypesSchema),
    defaultValues: {
      id: initial.id,
      name: initial.name,
      type: initial.type,
      iconId: initial.iconId,
      displayFields: initial.displayFields || [],
      optionsFields: initial.optionsFields || [],
    },
  });

  const optionsToArray = (options: Option[]) => options.map((opt) => opt.value);
  const arrayToOptions = (values: string[], list: Option[]) =>
    values.map(
      (v) => list.find((o) => o.value === v) || { value: v, label: v }
    );

  async function onSubmit(values: z.infer<typeof VisualizationTypesSchema>) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/VisualizationTypes/${values.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || 'An error occurred.');
        return;
      }

      toast.success('Visualization type updated successfully.');
      // window.location.reload();
      router.refresh();
    } catch (err: any) {
      toast.error('Failed to update visualization type');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <Card>
          <CardHeader>
            <CardTitle>Basic Info</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="iconId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mt-3 text-lg font-semibold mb-2">
                    Choose Icon
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
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visibility Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="displayFields"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Fields</FormLabel>
                  <FormControl>
                    <MultipleSelector
                      value={arrayToOptions(field.value, DisplayOptions)}
                      onChange={(options) =>
                        field.onChange(optionsToArray(options))
                      }
                      creatable
                      options={DisplayOptions}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customization Options</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="optionsFields"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customization Options</FormLabel>
                  <FormControl>
                    <MultipleSelector
                      value={arrayToOptions(field.value, CustomizationOptions)}
                      onChange={(options) =>
                        field.onChange(optionsToArray(options))
                      }
                      creatable
                      options={CustomizationOptions}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <SheetFooter>
          <SheetClose asChild>
            <Button type="button" variant="destructive" className="mr-auto">
              Cancel
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button type="submit" variant="edit">
              Update
            </Button>
          </SheetClose>
        </SheetFooter>
      </form>
    </Form>
  );
}
