import React from 'react';
import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Label } from '@radix-ui/react-dropdown-menu';
import { z } from 'zod';
import { ConnectionSchema } from '@/schemas';
import { UseFormReturn } from 'react-hook-form';

type ConnectionFormValues = z.infer<typeof ConnectionSchema>;

interface S7Props {
  form: UseFormReturn<ConnectionFormValues>;
}

export default function S7Form({ form }: S7Props) {
  return (
    <>
      <Label>Configure S7 </Label>

      <div className="col-span-4">
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="port"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Port</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter S7 Port"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ip"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>IP Address</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter IP Address"
                    {...field}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4 mt-2">
          <FormField
            control={form.control}
            name="slot"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Slot</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Slot"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rack"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Rack</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Rack"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </>
  );
}
