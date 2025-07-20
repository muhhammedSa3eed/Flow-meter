'use client';
import React, { useId } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddProjectSchema } from '@/schemas';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Projects } from '@/types';
import { Textarea } from '../../../components/ui/textarea';

export default function EditProject({
  project,
  onClose,
}: {
  project: Projects;
  onClose: () => void;
}) {
  const id = useId();
  const router = useRouter();
  const form = useForm<z.infer<typeof AddProjectSchema>>({
    resolver: zodResolver(AddProjectSchema),
    defaultValues: {
      name: project.name || '',
      description: project.description || '',
    },
  });

  async function onSubmit(values: z.infer<typeof AddProjectSchema>) {
    try {
      const body = {
        data: values,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/Projects/${project.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          // credentials: "include",
          body: JSON.stringify({
            ...values,
            id: project.id,
          }),
        }
      );
      // console.log({ response });
      if (!response.ok) {
        throw new Error('Failed to update Project');
      }
      toast.success('Project updated successfully!');
      onClose();
      // window.location.reload();
      router.refresh();
    } catch (err) {
      if (err instanceof Error) {
        toast.error(`Failed to update project: ${err.message}`);
      } else {
        toast.error('Failed to update project due to an unknown error.');
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="group relative">
                  <FormLabel className="origin-start absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-sm text-muted-foreground/70 transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium has-[+input:not(:placeholder-shown)]:text-foreground">
                    <span className="inline-flex bg-background px-2">Name</span>
                  </FormLabel>

                  <Input type="name" placeholder="" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="group relative">
                  <FormLabel
                    // htmlFor={id}
                    className="origin-start absolute top-0 block translate-y-2 cursor-text px-1 text-sm text-muted-foreground/70 transition-all group-focus-within:pointer-events-none group-focus-within:-translate-y-1/2 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-foreground has-[+textarea:not(:placeholder-shown)]:pointer-events-none has-[+textarea:not(:placeholder-shown)]:-translate-y-1/2 has-[+textarea:not(:placeholder-shown)]:cursor-default has-[+textarea:not(:placeholder-shown)]:text-xs has-[+textarea:not(:placeholder-shown)]:font-medium has-[+textarea:not(:placeholder-shown)]:text-foreground"
                  >
                    <span className="inline-flex bg-background px-2">
                      Description
                    </span>
                  </FormLabel>
                  <Textarea
                    // id={id}
                    {...field}
                    placeholder=""
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button size={'custom'} className="mr-auto" variant="destructive">
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="m-auto"
            size={'custom'}
            variant="edit"
            type="submit"
          >
            Save
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
