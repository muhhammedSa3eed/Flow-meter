"use client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useFormContext } from "react-hook-form";

const Step1 = () => {
  const { control } = useFormContext();
  const languageOptions = [
    { id: 1, value: "English", label: "English" },
    { id: 2, value: "Russian", label: "Russian" },
    { id: 3, value: "Ukrainian", label: "Ukrainian" },
    { id: 4, value: "Chinese", label: "Chinese" },
    { id: 5, value: "Portuguese", label: "Portuguese" },
    { id: 6, value: "Turkish", label: "Turkish" },
    { id: 7, value: "Korean", label: "Korean" },
    { id: 8, value: "Spanish", label: "Spanish" },
    { id: 9, value: "French", label: "French" },
    { id: 10, value: "Arabic", label: "Arabic" },
  ];

  const authenticationTokenOptions = [
    {
      id: 1,
      value: "15 min",
      label: "Enabled with token expiration in 15 min",
    },
    {
      id: 2,
      value: "30 min",
      label: "Enabled with token expiration in 30 min",
    },
    {
      id: 3,
      value: "1 hour",
      label: "Enabled with token expiration in 1 hour",
    },
    { id: 4, value: "1 day ", label: "Enabled with token expiration in 1 day" },
    {
      id: 5,
      value: "1 month",
      label: "Enabled with token expiration in 1 month",
    },
    {
      id: 6,
      value: "1 year",
      label: "Enabled with token expiration in 1 year",
    },
  ];

  return (
    <Card className="p-3 sm:p-4 md:p-5 lg:p-6 w-full max-w-full">
      <CardHeader className="pl-0 pb-4 sm:pb-6">
        <CardTitle className="text-lg sm:text-xl md:text-2xl">
          {"System Configuration"}
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          {"Configure the system settings below."}
        </CardDescription>
      </CardHeader>

      {/* First row - Language and Authentication */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 my-4 sm:my-6 lg:my-7 relative top-3 ">
        <div className="w-full">
          {/* Language Selection */}
          <FormField
            control={control}
            name="System.language"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base font-medium">
                  {"Language"}
                </FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full h-10 sm:h-11">
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languageOptions.map((item) => (
                        <SelectItem key={item.id} value={item.value}>
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

        <div className="w-full">
          {/* Authentication with Token */}
          <FormField
            control={control}
            name="System.authenticationToken"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base font-medium">
                  {"Authentication with Token"}
                </FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full h-10 sm:h-11">
                      <SelectValue placeholder="Select authentication setting" />
                    </SelectTrigger>
                    <SelectContent>
                      {authenticationTokenOptions.map((item) => (
                        <SelectItem key={item.id} value={item.value}>
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
      </div>

      {/* Second row - Log Mode and Broadcast */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-4 sm:mb-6">
        <div className="w-full">
          {/* Log Full Mode */}
          <FormField
            control={control}
            name="System.logFullMode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base font-medium">
                  {"Log full mode"}
                </FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full h-10 sm:h-11">
                      <SelectValue placeholder="Select log mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="disabled">Disabled</SelectItem>
                      <SelectItem value="enabled">Enabled</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="w-full">
          {/* Broadcast to Client */}
          <FormField
            control={control}
            name="System.broadcastToClient"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base font-medium">
                  {"Broadcast to client (frontend)"}
                </FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full h-10 sm:h-11">
                      <SelectValue placeholder="Select broadcast setting" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="disabled">Disabled</SelectItem>
                      <SelectItem value="enabled">Enabled</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Third row - Server Port */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        <div className="w-full">
          {/* Server Port Display */}
          <FormItem>
            <FormLabel className="text-sm sm:text-base font-medium">
              {"Server is listening on port"}
            </FormLabel>
            <FormControl>
              <Input
                value="1881"
                readOnly
                className="w-full h-10 sm:h-11 bg-gray-50"
              />
            </FormControl>
            <FormDescription className="text-xs sm:text-sm text-gray-600">
              {"This value is read-only."}
            </FormDescription>
          </FormItem>
        </div>
      </div>
    </Card>
  );
};

export default Step1;
