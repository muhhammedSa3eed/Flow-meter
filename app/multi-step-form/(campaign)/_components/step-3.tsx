"use client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormContext } from "react-hook-form";

const Step3 = () => {
  const { control, watch } = useFormContext();

  const ARPOptions = [
    { id: 1, value: "Disabled", label: "Disabled" },
    { id: 2, value: "7 days", label: "7 days" },
    { id: 3, value: "30 days", label: "30 days" },
    { id: 4, value: "90 days", label: "90 days" },
    { id: 5, value: "1 year", label: "1 year" },
    { id: 6, value: "3 years", label: "3 years" },
    { id: 7, value: "5 years", label: "5 years" },
  ];

  const ROptions = [
    { id: 1, value: "Disabled", label: "Disabled" },
    { id: 2, value: "1 day", label: "1 day" },
    { id: 3, value: "2 days", label: "2 days" },
    { id: 4, value: "3 days", label: "3 days" },
    { id: 5, value: "7 days", label: "7 days" },
    { id: 6, value: "14 days", label: "14 days" },
    { id: 7, value: "30 days", label: "30 days" },
    { id: 8, value: "90 days", label: "90 days" },
    { id: 9, value: "1 year", label: "1 year" },
    { id: 10, value: "3 years", label: "3 years" },
    { id: 11, value: "5 years", label: "5 years" },
  ];



  const defaultValues = watch("DQAStorageAndAlarms");

  return (
    <Card className="p-5 w-full">
      <CardHeader className="pl-0">
        <CardTitle>{"DQA Storage & Alarms Configuration"}</CardTitle>
        <CardDescription>
          {"Configure the DQA Storage & Alarms settings below."}
        </CardDescription>
      </CardHeader>

      <div className="flex flex-nowrap justify-between gap-8 my-7">
    

        {/* Retention */}
        <div className="w-[48%]">
          <FormField
            control={control}
            name="daqstoreAndAlarms.retentionDAQ"
            defaultValue={defaultValues?.retentionDAQ} 
            render={({ field }) => (
              <FormItem>
                <FormLabel>{"Retention"}</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select retention period" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROptions.map((item) => (
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
           {/* Retention Period */}
      <div className="w-[48%]">
        <FormField
          control={control}
          name="daqstoreAndAlarms.alarmsRetention"
          defaultValue={defaultValues?.Alarmsretention} 
          render={({ field }) => (
            <FormItem>
              <FormLabel>{"Retention Period"}</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select retention period" />
                  </SelectTrigger>
                  <SelectContent>
                    {ARPOptions.map((item) => (
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

   
    </Card>
  );
};

export default Step3;