'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
interface TokenProps {
  token: string;
}

// export async function login(values: { email: string; password: string }) {
//   try {
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_API_BASE_URL}/Account/Login`,
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Accept: 'application/json',
//         },
//         body: JSON.stringify(values),
//       }
//     );

//     const data = await res.json();
//  console.log({ data });
//     // تحقق من وجود رسالة خطأ
//     if (!res.ok || data.message) {
//       return {
//         success: false,
//         message: data.message || 'Invalid username or password.',
//       };
//     }

//     // حفظ التوكن في الكوكيز
//     // (await cookies()).set('token', data.token, {
//     //   expires: data.expiresOn,
//     //   httpOnly: true,
//     // });
//     const expiresDate = data.expiresOn ? new Date(data.expiresOn) : undefined;

//     (await cookies()).set('token', data.token, {
//       expires: expiresDate, // ✅ الآن القيم صحيحة
//       httpOnly: true,
//     });

//     // تحديد وجهة التوجيه بناءً على الدور
//     const redirectUrl = data.roles.includes('User')
//       ? process.env.DEFAULT_LOGIN_REDIRECT_USER
//       : process.env.DEFAULT_LOGIN_REDIRECT_ADMIN;

//     return {
//       success: true,
//       message: 'You have successfully logged in.',
//       redirectUrl,
//     };
//   } catch (error) {
//     return { success: false, message: 'Network error. Please try again.' };
//   }
// }

export async function login(values: { email: string; password: string }) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Account/login`,
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

    if (!res.ok || data.message) {
      return {
        success: false,
        message: data.message || 'Invalid username or password.',
      };
    }

    const cookieStore = await cookies();
    const expiresDate = data.expiresOn ? new Date(data.expiresOn) : undefined;
    const refreshExpiresDate = data.refreshTokenExpiration
      ? new Date(data.refreshTokenExpiration)
      : undefined;

    // Set access token
    cookieStore.set('access_token', data.token, {
      expires: expiresDate,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    // Set refresh token
    if (data.refreshToken) {
      cookieStore.set('refresh_token', data.refreshToken, {
        expires: refreshExpiresDate,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
    }

    // Backward compatibility
    cookieStore.set('token', data.token, {
      expires: expiresDate,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    const redirectUrl = data.roles.includes('User')
      ? process.env.DEFAULT_LOGIN_REDIRECT_USER
      : process.env.DEFAULT_LOGIN_REDIRECT_ADMIN;

    return {
      success: true,
      message: 'You have successfully logged in.',
      redirectUrl,
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Network error. Please try again.' };
  }
}

// export async function logout() {
//   try {
//     const token = (await cookies()).get('token')?.value;

//     if (!token) {
//       return {
//         success: false,
//         message: 'No token found. You are already logged out.',
//       };
//     }

//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_API_BASE_URL}/Account/logout`,
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Accept: 'application/json',
//         },
//         body: JSON.stringify(token),
//       }
//     );
//     console.log({ token });
//     if (!response.ok) {
//       return { success: false, message: 'Logout failed. Please try again.' };
//     }
//     const data = await response.json();
//     // console.log({ token });
//     console.log({ data });

//     // مسح الكوكيز بعد تسجيل الخروج
//     //    cookies().delete('token');
//     (await cookies()).set('token', '');

//     return { success: true, message: data.message };
//   } catch (error) {
//     return { success: false, message: 'An error occurred. Please try again.' };
//   }
// }

export async function logout() {
  try {
    const cookieStore = await cookies();
    const accessToken =
      cookieStore.get('access_token')?.value || cookieStore.get('token')?.value;
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (!accessToken) {
      return {
        success: false,
        message: 'No token found. You are already logged out.',
      };
    }

    // Call logout endpoint
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Account/logout`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Clear cookies regardless of API response
    cookieStore.set('access_token', '', {
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    cookieStore.set('refresh_token', '', {
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    // Backward compatibility
    cookieStore.set('token', '', {
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, message: data.message || 'Logout successful' };
    } else {
      return { success: true, message: 'Logout completed (cookies cleared)' };
    }
  } catch (error) {
    console.error('Logout error:', error);

    // Clear cookies even if API call fails
    const cookieStore = await cookies();
    cookieStore.set('access_token', '', { expires: new Date(0) });
    cookieStore.set('refresh_token', '', { expires: new Date(0) });
    cookieStore.set('token', '', { expires: new Date(0) });

    return { success: true, message: 'Logout completed (cookies cleared)' };
  }
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

export async function refreshToken() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (!refreshToken) {
      return { success: false, message: 'No refresh token found' };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Account/refresh-token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ token: refreshToken }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.isAuthenticated) {
      // Clear invalid cookies
      cookieStore.set('access_token', '', { expires: new Date(0) });
      cookieStore.set('refresh_token', '', { expires: new Date(0) });
      cookieStore.set('token', '', { expires: new Date(0) });

      return {
        success: false,
        message: data.message || 'Token refresh failed',
      };
    }

    // Update cookies with new tokens
    const expiresDate = data.expiresOn ? new Date(data.expiresOn) : undefined;
    const refreshExpiresDate = data.refreshTokenExpiration
      ? new Date(data.refreshTokenExpiration)
      : undefined;

    cookieStore.set('access_token', data.token, {
      expires: expiresDate,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    if (data.refreshToken) {
      cookieStore.set('refresh_token', data.refreshToken, {
        expires: refreshExpiresDate,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
    }

    // Backward compatibility
    cookieStore.set('token', data.token, {
      expires: expiresDate,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return {
      success: true,
      message: 'Token refreshed successfully',
      token: data.token,
      expiresOn: data.expiresOn,
    };
  } catch (error) {
    console.error('Token refresh error:', error);
    return { success: false, message: 'Network error during token refresh' };
  }
}
