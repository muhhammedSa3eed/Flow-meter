import React, { useEffect, useId, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Switch } from '@/components/ui/switch';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ConnectionSchema } from '@/schemas';
import { useForm } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DeviceDB, Devices, SelectPolling, SelectType } from '@/types';

import { toast } from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import WebAPIForm from '@/components/ConnectionsType/WebAPI';
import S7Form from '@/components/ConnectionsType/S7';
import DbForm from '@/components/ConnectionsType/DB';
import { Label } from '@radix-ui/react-dropdown-menu';
import { SheetClose, SheetFooter } from '@/components/ui/sheet';
import { Router } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface EditConnectionsProps {
  selectType: SelectType[];
  // selectPolling: SelectPolling[];
  device: DeviceDB;
  ProjectId: number;
  onClose: () => void;
  // fetchDevices: () => Promise<void>;
}

export default function EditConnections({
  selectType,
  device,
  ProjectId,
  onClose,
}: 
EditConnectionsProps) {
console.log("Devices :",device)
  const router = useRouter();
  const [isTestConnectionSuccessful, setIsTestConnectionSuccessful] = useState(false);
  
  const form = useForm<z.infer<typeof ConnectionSchema>>({
    resolver: zodResolver(ConnectionSchema),
    defaultValues: {
      name: device.name,
      dataAccess:device.dataAccess,
      databaseName: device.databaseName,
      description: device.description??"",
      lastConnected: '',
      polling: 0,
      isActive: device.isActive, 
      method: '',
      format: '',
      address: '',
      ip: '',
      dbType: device.dbType,
      port: device.port,
      host: device.host,
      username: device.username,
      password: device.password,
      slot: 0,
      rack: 0,
    },
  });

  const isActive = form.watch('isActive');
  const selectedType = form.watch('dataAccess');


  async function onSubmit(values: z.infer<typeof ConnectionSchema>) {
    const payload = {
      ...values,
      id: device.id,
      projectId: ProjectId,
      // property: values.property,
    };
    console.log({ payload });
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/DB/${device.id}`,

        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          // credentials: 'include',
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.log({ errorData });
        toast.error(errorData.message || 'An error occurred.');
      } else {
        toast.success('Device has been successfully Updated.');
        form.reset();
        onClose();
        router.refresh();
        // window.location.reload();
      }

      // fetchDevices();
    } catch (err) {
      if (err instanceof Error) {
        toast.error(`Failed to update Device: ${err.message}`);
      } else {
        toast.error('Failed to update Device due to an unknown error.');
      }
    }
  }

  async function testConnection(values: z.infer<typeof ConnectionSchema>) {
    if (!isActive) {
      toast.error('Please enable the connection before testing');
      return;
    }
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/DB/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          projectId: ProjectId,
          ...values,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || 'Connection test failed.');
        setIsTestConnectionSuccessful(false);
        return;
      }

      const result = await response.json();
      toast.success('Connection test successful!');
      setIsTestConnectionSuccessful(true);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(`Connection test failed: ${err.message}`);
      } else {
        toast.error('Connection test failed due to an unknown error.');
      }
      setIsTestConnectionSuccessful(false);
    }
  }

  const id = useId();
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex gap-4 my-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <div className="group relative">
                    <FormLabel className="origin-start absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-sm text-muted-foreground/70 transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium has-[+input:not(:placeholder-shown)]:text-foreground">
                      <span className="inline-flex bg-background px-2">
                        Name
                      </span>
                    </FormLabel>
                    <Input type="name" placeholder="" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col items-center gap-4 ml-auto">
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <div>
                  <div className="relative inline-grid h-10 grid-cols-[1fr_1fr] items-center text-sm font-medium">
                    <Switch
                      id="isActive-switch"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="peer absolute inset-0 h-[inherit] w-auto rounded-lg data-[state=unchecked]:bg-gray-500 data-[state=checked]:bg-[rgba(72,195,137,1)] [&_span]:z-10 [&_span]:h-full [&_span]:w-1/2 [&_span]:rounded-md [&_span]:transition-transform [&_span]:duration-300 [&_span]:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] data-[state=checked]:[&_span]:translate-x-full rtl:data-[state=checked]:[&_span]:-translate-x-full"
                    />
                    <span className="min-w-78flex pointer-events-none relative ms-0.5 items-center justify-center px-2 text-center transition-transform duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:invisible peer-data-[state=unchecked]:translate-x-full rtl:peer-data-[state=unchecked]:-translate-x-full">
                      <span className="text-[10px] font-medium uppercase text-white">
                        Disabled
                      </span>
                    </span>
                    <span className="min-w-78flex pointer-events-none relative me-0.5 items-center justify-center px-2 text-center transition-transform duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] peer-data-[state=unchecked]:invisible peer-data-[state=checked]:-translate-x-full peer-data-[state=checked]:text-background rtl:peer-data-[state=checked]:translate-x-full">
                      <span className="text-[10px] font-medium uppercase">
                        Enabled
                      </span>
                    </span>
                  </div>
                  <Label className="sr-only">Enabled</Label>
                </div>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="group relative">
                  <FormLabel className="origin-start absolute top-0 block translate-y-2 cursor-text px-1 text-sm text-muted-foreground/70 transition-all group-focus-within:pointer-events-none group-focus-within:-translate-y-1/2 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-foreground has-[+textarea:not(:placeholder-shown)]:pointer-events-none has-[+textarea:not(:placeholder-shown)]:-translate-y-1/2 has-[+textarea:not(:placeholder-shown)]:cursor-default has-[+textarea:not(:placeholder-shown)]:text-xs has-[+textarea:not(:placeholder-shown)]:font-medium has-[+textarea:not(:placeholder-shown)]:text-foreground">
                    <span className="inline-flex bg-background px-2">
                      Description
                    </span>
                  </FormLabel>
                  <Textarea {...field} placeholder="" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        
          <>
            <div className="group relative w-full mt-2">
              <FormLabel className="absolute start-1 top-0 z-10 block -translate-y-1/2 bg-background px-2 text-xs font-medium text-foreground group-has-[select:disabled]:opacity-50">
                Data Access
              </FormLabel>
              <FormField
                control={form.control}
                name="dataAccess"
                render={({ field }) => (
                  <FormItem className="mb-2 flex-1">
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectType.map((item) => (
                            <SelectItem key={item.id} value={item.value}>
                              {item.title}
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

            {/* {selectedType === 'WebAPI' && <WebAPIForm form={form} />} */}
            {selectedType === 'Database' && <DbForm form={form} />}
          </>
        

        <SheetFooter>
          <SheetClose asChild>
            <Button
              type="button"
              variant="edit"
              className="w-[100%]"
              onClick={form.handleSubmit(testConnection)}
              disabled={!isActive}
            >
              Test Connections
            </Button>
          </SheetClose>
        </SheetFooter>

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
          <Button
            type="submit"
            variant="Accepted"
            size="custom"
            className="ml-auto"
            disabled={isActive && !isTestConnectionSuccessful}
          >
            Save
          </Button>
        </SheetFooter>
      </form>
    </Form>
  );
}
