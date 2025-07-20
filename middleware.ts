import {
  DEFAULT_LOGIN_REDIRECT_ADMIN,
  DEFAULT_LOGIN_REDIRECT_USER,
  authRoutes,
  adminRoutes,
  protectedRoutes,
  DEFAULT_NO_PERMISSION,
} from '@/routes';
import { NextResponse, type NextRequest } from 'next/server';
// import { getUserByToken } from './lib/assests';
import { cookies } from 'next/headers';
import { getUserByToken } from './actions/auth';
// import { NextResponse } from 'next/server';

// const protectedPage = [
//   '/led-screen',
//   '/barriers',
//   '/station-bays',
//   '/stations',
//   '/trips-logs',
//   '/users',
//   '/vehicles',
//   '/accounts',
//   '/account-registeration',
//   '/messages',
// ];

export default async function middlware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  // let token = req.cookies.get('token')?.value ?? '';
  const token = (await cookies()).get('token')?.value;
  if (!token && protectedRoutes.includes(pathname)) {
    const absoluteUrl = new URL(`/`, req.nextUrl.origin);
    return NextResponse.redirect(absoluteUrl.toString());
  }
  // if (!token && authRoutes.includes(pathname)) {
  //   // console.log({ refreshToken });
  //   // const absoluteUrl = new URL(`/`, req.nextUrl.origin);
  //   // return NextResponse.redirect(absoluteUrl.toString());
  // }
  if (token) {
    // console.log({ token });
    const user = await getUserByToken({ token });
    if (!user.isValid) {
      const absoluteUrl = new URL(`/`, req.nextUrl.origin);
      return NextResponse.redirect(absoluteUrl.toString());
    }
    // console.log("user123",user)
    // console.log({ user });
    if (user && authRoutes.includes(pathname)) {
      if (user?.roles[0] == 'SuperAdmin' || user.roles[0] == 'Admin') {
        return Response.redirect(
          new URL(`${DEFAULT_LOGIN_REDIRECT_ADMIN}`, req.nextUrl.origin)
        );
      } else {
        return Response.redirect(
          new URL(`${DEFAULT_LOGIN_REDIRECT_USER}`, req.nextUrl.origin)
        );
      }
    }
    if (user && user?.roles[0] == 'User' && adminRoutes.includes(pathname)) {
      return Response.redirect(
        new URL(`${DEFAULT_NO_PERMISSION}`, req.nextUrl.origin)
      );
    }
  }
  // console.log({ pathLocale });
  // console.log({ locales });
  // console.log('currentUser', user);
  //   if (!user && protectedPage.includes(pathname)) {
  //     const absoluteUrl = new URL(`/`, req.nextUrl.origin);
  //     // console.log('absoluteUrl', absoluteUrl.toString());
  //     return NextResponse.redirect(absoluteUrl.toString());
  //   }
  //   if (user && authRoutes.includes(pathname)) {
  //     if (user.role == 'ADMIN') {
  //       return Response.redirect(
  //         new URL(`/${DEFAULT_LOGIN_REDIRECT_ADMIN}`, req.nextUrl.origin)
  //       );
  //     } else {
  //       return Response.redirect(
  //         new URL(`/${DEFAULT_LOGIN_REDIRECT_USER}`, req.nextUrl.origin)
  //       );
  //     }
  //   }
  //   if (user && user.role == 'USER' && adminRoutes.includes(pathname)) {
  //     return Response.redirect(
  //       new URL(`/${DEFAULT_NO_PERMISSION}`, req.nextUrl.origin)
  //     );
  //   }
}

export const config = {
  //  matcher: [
  //    '/((?!.+\\.[\\w]+$|_next).*)',
  //    '/',
  //    '/(api|trpc)(.*)',
  //    '/((?!api|_next/static|_next/image|img/).*)',
  //  ],
  matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico).*)'],
};
