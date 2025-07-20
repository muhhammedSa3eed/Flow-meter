'use client';
import { LogOut, Pencil } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { logout } from '@/actions/auth';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
// const clearSessionCookie = () => {
//   document.cookie =
//     'connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=; secure;';
// };

export default function AvatarWithLogout() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const handleLogout = async (): Promise<void> => {
    startTransition(async () => {
      const response = await logout();

      if (!response.success) {
        toast.error(response.message);
      } else {
        toast.success(response.message);
        router.push('/');
      }
    });
    // const token = Cookies.get('token') ?? '';
    // // const parsedValues = JSON.parse(token);
    // console.log({ token });
    // // console.log({ parsedValues });
    // try {
    //   const response = await fetch(
    //     `${process.env.NEXT_PUBLIC_API_BASE_URL}/Account/logout`,
    //     {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         Accept: 'application/json',
    //       },
    //       body: JSON.stringify(token),
    //     }
    //   );
    //   console.log({ response });
    //   if (!response.ok) {
    //     toast.error('Logout failed');
    //   } else {
    //     // Clear cookies
    //     Cookies.remove('token');
    //     // localStorage.clear();

    //     // Success toast
    //     toast.success('You have been logged out of your account.');

    //     window.location.href = '/';
    //   }
    // } catch (error) {
    //   if (error instanceof Error) {
    //     toast.error(`Error: ${error.message}. Please try again.`);
    //   } else {
    //     toast.error('An unknown error occurred. Please try again.');
    //   }
    // }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src="/assets/logo.webp" />
          <AvatarFallback>NeussHMI</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={'/Projects/editProfile'}>
          <DropdownMenuItem className="flex justify-between items-center text-blue-500">
            <span>Edit Profile</span>
            <Pencil />
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem
          className="flex justify-between items-center text-red-500"
          onClick={handleLogout}
        >
          Logout
          <LogOut className="ml-auto size-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
