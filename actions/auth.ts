'use server';

import { cookies } from 'next/headers';

export async function login(values: { email: string; password: string }) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Account/Login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(values),
      }
    );

    const data = await res.json();
 console.log({ data });
    // تحقق من وجود رسالة خطأ
    if (!res.ok || data.message) {
      return {
        success: false,
        message: data.message || 'Invalid username or password.',
      };
    }
   
    // حفظ التوكن في الكوكيز
    // (await cookies()).set('token', data.token, {
    //   expires: data.expiresOn,
    //   httpOnly: true,
    // });
    const expiresDate = data.expiresOn ? new Date(data.expiresOn) : undefined;

    (await cookies()).set('token', data.token, {
      expires: expiresDate, // ✅ الآن القيم صحيحة
      httpOnly: true,
    });

    // تحديد وجهة التوجيه بناءً على الدور
    const redirectUrl = data.roles.includes('User')
      ? process.env.DEFAULT_LOGIN_REDIRECT_USER
      : process.env.DEFAULT_LOGIN_REDIRECT_ADMIN;

    return {
      success: true,
      message: 'You have successfully logged in.',
      redirectUrl,
    };
  } catch (error) {
    return { success: false, message: 'Network error. Please try again.' };
  }
}

export async function logout() {
  try {
    const token = (await cookies()).get('token')?.value;

    if (!token) {
      return {
        success: false,
        message: 'No token found. You are already logged out.',
      };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Account/logout`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(token),
      }
    );
    console.log({ token });
    if (!response.ok) {
      return { success: false, message: 'Logout failed. Please try again.' };
    }
    const data = await response.json();
    // console.log({ token });
    console.log({ data });

    // مسح الكوكيز بعد تسجيل الخروج
    //    cookies().delete('token');
    (await cookies()).set('token', '');

    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: 'An error occurred. Please try again.' };
  }
}

interface TokenProps {
  token: string;
}

export async function getUserByToken({ token }: TokenProps) {
  try {
    // const token = (await cookies()).get('token')?.value;
    if (!token) return null;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Account/verify-token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(token),
      }
    );

    if (!response.ok) {
      return { message: 'Token verification failed.' };
    } else {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    return { message: 'An error occurred while verifying the token.' };
  }
}
