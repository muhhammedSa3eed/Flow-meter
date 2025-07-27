/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema } from '@/schemas';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import LoginButton from '@/components/motion/login';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import { useId, useMemo, useState, useTransition } from 'react';
import Cookie from 'js-cookie';
import Link from 'next/link';
import { DEFAULT_LOGIN_REDIRECT_USER } from '@/routes';
import { login } from '@/actions/auth';

export function LoginForm() {
  const id = useId();
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: 'At least 8 characters' },
      { regex: /[0-9]/, text: 'At least 1 number' },
      { regex: /[a-z]/, text: 'At least 1 lowercase letter' },
      { regex: /[A-Z]/, text: 'At least 1 uppercase letter' },
    ];

    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }));
  };

  const strength = checkStrength(password);

  const strengthScore = useMemo(() => {
    return strength.filter((req) => req.met).length;
  }, [password]);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    // console.log({ values });
    startTransition(async () => {
      const response = await login(values);
      console.log({ response });
      if (!response.success) {
        toast.error(response.message);
      } else {
        toast.success(response.message);
        const redirectUrl = response.redirectUrl || '/';
        router.push(redirectUrl);
      }
    });
    // try {
    //   const res = await fetch(
    //     // `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/login`,
    //     `${process.env.NEXT_PUBLIC_API_BASE_URL}/Account/Login`,
    //     {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         Accept: 'application/json',
    //       },
    //       body: JSON.stringify({
    //         email: values.email,
    //         password: values.password,
    //       }),
    //       // credentials: "include",
    //     }
    //   );

    //   if (!res.ok) {
    //     toast.error('Invalid username or password.');
    //     return;
    //   } else {
    //     const data = await res.json();
    //     console.log('data', data);
    //     Cookie.set('token', JSON.stringify(data.token));

    //     console.log(data.roles[0]);
    //     if (data.roles[0] == 'User') {
    //       router.push(DEFAULT_LOGIN_REDIRECT_USER);
    //     } else if (data.roles[0] == 'Admin' || data.roles[0] == 'SuperAdmin') {
    //       router.push(DEFAULT_LOGIN_REDIRECT_USER);
    //     }

    //     toast.success('You have successfully logged in.');
    //   }
    // } catch (error) {
    //   console.error('Network error:', error);
    //   toast.error('Network error. Please try again.');
    // }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden border-2 border-custom-green">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold text-custom-green">
                    Welcome back
                  </h1>
                  <p className="text-balance text-muted-foreground">
                    Login to your Neuss HMI account
                  </p>
                </div>

                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            className="border-custom-green"
                            placeholder="Enter your email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div>
                            <div className="space-y-2">
                              <div className="relative">
                                <Input
                                  {...field}
                                  id={id}
                                  className="pe-9"
                                  placeholder="Password"
                                  type={isVisible ? 'text' : 'password'}
                                  value={password}
                                  onChange={(e) => {
                                    setPassword(e.target.value);
                                    field.onChange(e);
                                  }}
                                  aria-invalid={strengthScore < 4}
                                  aria-describedby={`${id}-description`}
                                />
                                <button
                                  className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                  type="button"
                                  onClick={toggleVisibility}
                                  aria-label={
                                    isVisible
                                      ? 'Hide password'
                                      : 'Show password'
                                  }
                                  aria-pressed={isVisible}
                                  aria-controls="password"
                                >
                                  {isVisible ? (
                                    <EyeOff size={16} />
                                  ) : (
                                    <Eye size={16} />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <LoginButton type="submit" className="w-full">
                  Login
                </LoginButton>
              </div>
            </form>
          </Form>

          <div className="relative hidden bg-muted md:flex flex-col items-center justify-center w-30 h-30 px-20 gap-4">
            <img
              src="/assets/logo.webp"
              alt="Image"
              className="max-w-full max-h-full object-contain"
            />
            <div className="text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
