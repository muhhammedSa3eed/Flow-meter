'use client';
import React, { useState } from 'react';
import AddProjectButton from '@/components/motion/AddProject';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AddProjectSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { createProject } from '@/actions/ProjectApi';
import { Textarea } from '../../ui/textarea';
import { cn } from '@/lib/utils';

export default function AddProject() {
  const form = useForm<z.infer<typeof AddProjectSchema>>({
    resolver: zodResolver(AddProjectSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const onSubmit = async (values: z.infer<typeof AddProjectSchema>) => {
    try {
      const response = await fetch(
        // `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/register`,
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/Projects`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },

          // credentials: 'include',
          body: JSON.stringify(values),
        }
      );
      const data = await response.json();
      console.log({ data });
      // await createProject(values);
      toast.success('Project created successfully!');
      form.reset();
      setIsDialogOpen(false);
      router.refresh();
    } catch (err) {
      if (err instanceof Error) {
        toast.error(`Failed to create project: ${err.message}`);
      } else {
        toast.error('Failed to create project due to an unknown error.');
      }
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger
        asChild
        className="h-10 flex-1 rounded-xl md:min-h-min flex items-center justify-center"
        onClick={() => setIsDialogOpen(true)}
      >
        <div className="flex flex-1 flex-col ">
          <div className="w-full h-7 flex items-center ">
            <Plus />
            <span className="text-sm ml-1">Add New Project</span>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>Add new project</DialogTitle>
        <DialogDescription className={cn('mb-0 p-0')}></DialogDescription>
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
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant={'destructive'}
                  size={'custom'}
                  className="mr-auto"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                variant={'Accepted'}
                size={'custom'}
                className="ml-auto"
              >
                Add
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
