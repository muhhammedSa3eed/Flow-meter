/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { JSX, useEffect, useState } from 'react';
import { Sun, Moon, SunMedium } from 'lucide-react';
import Cookies from 'js-cookie';

const WelcomeMessage = () => {
  const [username, setUserName] = useState<string | null>(null);
  const [greeting, setGreeting] = useState<string>('');
  const [icon, setIcon] = useState<JSX.Element | null>(null);

  const getGreetingMessage = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return {
        message: 'Good Morning',
        icon: <Sun className="text-yellow-400" />,
      };
    } else if (currentHour < 18) {
      return {
        message: 'Good Afternoon',
        icon: <SunMedium className="text-orange-600" />,
      };
    } else {
      return {
        message: 'Good Evening',
        icon: <Moon className="text-blue-500" />,
      };
    }
  };

  // useEffect(() => {
  //   const userCookie = Cookies.get('user');

  //   if (userCookie) {
  //     try {
  //       const parsedData = JSON.parse(userCookie);

  //       if (parsedData && parsedData.user.username) {
  //         setUserName(parsedData.user.username);
  //       } else {
  //         console.log('Username not found in the cookie');
  //       }
  //     } catch (error) {
  //       console.error('Error parsing user cookie:', error);
  //     }
  //   } else {
  //     console.log('No user data found in cookies');
  //   }

  //   const { message, icon } = getGreetingMessage();
  //   setGreeting(message);
  //   setIcon(icon);
  // }, []);

  return (
    <h1 className="flex items-center space-x-3 font-mono [transition-timing-function:cubic-bezier(0,0,1,1)]">
      {icon} <span className="ml-1">{greeting}</span>
      <strong className="ml-2">{'Admin'}</strong>
    </h1>
  );
};

export default WelcomeMessage;
