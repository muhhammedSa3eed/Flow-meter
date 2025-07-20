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
    <Card className="p-5 w-full">
      <CardHeader className="pl-0">
        <CardTitle>{"System Configuration"}</CardTitle>
        <CardDescription>
          {"Configure the system settings below."}
        </CardDescription>
      </CardHeader>

      <div className="flex flex-nowrap justify-between gap-8 my-7 ">
        <div className="w-[48%]">
          {" "}
          {/* Language Selection */}
          <FormField
            control={control}
            name="System.language"
            // name = {`${System.language}`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{"Language"}</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
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
        <div className="w-[48%]">
          {/* Authentication with Token */}
          <FormField
            control={control}
            name="System.authenticationToken"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{"Authentication with Token"}</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
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
      <div className="flex flex-nowrap justify-between gap-8 mb-5">
        <div className="w-[48%]">
          {" "}
          {/* Log Full Mode */}
          <FormField
            control={control}
            name="System.logFullMode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{"Log full mode"}</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
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
        <div className="w-[48%]">
          {/* Broadcast to Client */}
          <FormField
            control={control}
            name="System.broadcastToClient"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{"Broadcast to client (frontend) "}</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
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

      <div className="flex flex-nowrap gap-6 mb-4 ">
        <div className="w-[48%]">
          {/* Server Port Display */}
          <FormItem>
            <FormLabel>{"Server is listening on port"}</FormLabel>
            <FormControl>
              <Input value="1881" readOnly />
            </FormControl>
            <FormDescription>{"This value is read-only."}</FormDescription>
          </FormItem>
        </div>
      </div>
    </Card>
  );
};

export default Step1;
