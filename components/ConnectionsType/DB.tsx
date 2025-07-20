// components/Database.tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import React, { useId } from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Label } from '@radix-ui/react-dropdown-menu';
import PostgrSqlForm from '../DataBaseType/postgrSql';
import MySqlForm from '../DataBaseType/mySql';
import SqlServerForm from '../DataBaseType/sqlServer';
import SqliteForm from '../DataBaseType/sqlite';
import { z } from 'zod';
import { ConnectionSchema } from '@/schemas';
import { UseFormReturn } from 'react-hook-form';

const databaseOptions = [
  { id: 1, value: 'sqlite', label: 'SQLite' },
  { id: 2, value: 'mysql', label: 'MySql' },
  { id: 3, value: 'sqlServer', label: 'SqlServer' },
  { id: 4, value: 'postgresql', label: 'PostgreSql' },
];
type ConnectionFormValues = z.infer<typeof ConnectionSchema>;
interface DbProps {
  form: UseFormReturn<ConnectionFormValues>;
}

export default function DbForm({ form }: DbProps) {
  const id = useId();
  const selectedType = form.watch('dbType');

  return (
    <>
      <Label>Configure Database </Label>
      <div className="group relative w-full">
        <FormLabel
          htmlFor={id}
          className="absolute start-1 top-0 z-10 block -translate-y-1/2 bg-background px-2 text-xs font-medium text-foreground group-has-[select:disabled]:opacity-50"
        >
          Database Type
        </FormLabel>{' '}
        <FormField
          control={form.control}
          name="dbType"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select database type" />
                  </SelectTrigger>
                  <SelectContent>
                    {databaseOptions.map((item) => (
                      <SelectItem key={item.id} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      {selectedType === 'postgresql' && <PostgrSqlForm form={form} />}
      {selectedType === 'mysql' && <MySqlForm form={form} />}
      {selectedType === 'sqlServer' && <SqlServerForm form={form} />}
      {selectedType === 'sqlite' && <SqliteForm form={form} />}
    </>
  );
}
