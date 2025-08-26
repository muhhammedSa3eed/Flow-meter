'use client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import React, { useId } from 'react';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { UserEditSchema } from '@/schemas';
import { toast } from 'react-hot-toast';
import { User } from '@/types';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  SheetClose,
  SheetDescription,
  SheetFooter,
  SheetTitle,
} from '@/components/ui/sheet';
import { useRouter } from 'next/navigation';

interface EditUserProps {
  users: User;
}
const Role = [
  { Id: 1, Value: 'Admin', label: 'Admin' },
  { Id: 2, Value: 'Operator', label: 'Operator' },
];
export default function EditUser({ users }: EditUserProps) {
  const id = useId();
  const router = useRouter();
  console.log({ users });
  const form = useForm<z.infer<typeof UserEditSchema>>({
    resolver: zodResolver(UserEditSchema),
    defaultValues: {
      name: users.name,
      email: users.email,
      phoneNumber: users.phoneNumber,
      emailConfirmed:users.emailConfirmed
      // role:users.role
    },
  });

  async function onSubmit(values: z.infer<typeof UserEditSchema>) {
    try {
      const requestBody = {
        ...values,
        userIds: users.id,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/Account/update-user`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      toast.success('User has been edited successfully.');
      router.refresh();
      // window.location.reload();
    } catch (err) {
      if (err instanceof Error) {
        toast.error(`Failed to edited user: ${err.message}`);
      } else {
        toast.error('Failed to edited user due to an unknown error.');
      }
    }
  }

  return (
    <>
      <SheetTitle className="mb-2">Update User</SheetTitle>
      <SheetDescription className="mb-2">
        Change the details to Update a user.
      </SheetDescription>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Username and Name on the same line */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <div className="group relative">
                    <FormLabel
                      htmlFor={id}
                      className="origin-start absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-sm text-muted-foreground/70 transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium has-[+input:not(:placeholder-shown)]:text-foreground"
                    >
                      <span className="inline-flex bg-background px-2">
                        Name
                      </span>
                    </FormLabel>

                    <Input id={id} type="name" placeholder="" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <div className="group relative">
                    <FormLabel
                      htmlFor={id}
                      className="origin-start absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-sm text-muted-foreground/70 transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium has-[+input:not(:placeholder-shown)]:text-foreground"
                    >
                      <span className="inline-flex bg-background px-2">
                        Email
                      </span>
                    </FormLabel>

                    <Input id={id} type="email" placeholder="" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* emailConfirmed Field */}
          <FormField
            control={form.control}
            name="emailConfirmed"
            render={({ field }) => {
              const checkboxId = `${id}-truncateMetric`;
              return (
                <FormItem>
                  <div className="flex items-start gap-2">
                    <FormControl>
                      <Checkbox
                        id={checkboxId}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="grid grow gap-1">
                      <Label htmlFor={checkboxId}>
                        Email Confirmed
                        <span className="text-muted-foreground text-xs leading-[inherit] font-normal">
                          (Display)
                        </span>
                      </Label>
                      <p
                        id={`${checkboxId}-description`}
                        className="text-muted-foreground text-xs"
                      >
                        Shorten long metric names for better display.
                      </p>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          {/* phoneNumber Field */}
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="group relative">
                    <FormLabel
                      htmlFor={id}
                      className="origin-start absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-sm text-muted-foreground/70 transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium has-[+input:not(:placeholder-shown)]:text-foreground"
                    >
                      <span className="inline-flex bg-background px-2">
                        Phone number
                      </span>
                    </FormLabel>
                    <Input
                      id={id}
                      type="phoneNumber"
                      placeholder=""
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="group relative flex-1">
            {/* Overlapping Label */}
            <FormLabel
              htmlFor={id}
              className="absolute start-1 top-0 z-10 block -translate-y-1/2 bg-background px-2 text-xs font-medium text-foreground group-has-[select:disabled]:opacity-50"
            >
              Role
            </FormLabel>

            {/* Select Field */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a group" />
                      </SelectTrigger>
                      <SelectContent>
                        {Role.map((item) => (
                          <SelectItem key={item.Id} value={item.Value}>
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

          <SheetFooter>
            <SheetClose asChild>
              <Button size="custom" variant="destructive" className="mr-auto">
                Cancel
              </Button>
            </SheetClose>
            <Button
              type="submit"
              size="custom"
              variant={'Accepted'}
              className="ml-auto"
            >
              Save
            </Button>
          </SheetFooter>
        </form>
      </Form>
    </>
  );
}
