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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeOff, Eye } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useId, useMemo, useState, useEffect } from "react"; 

const Step2 = () => {
  const id = useId();
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const { control, watch } = useFormContext(); 

  const apiPassword = watch("SMTP.password");

  useEffect(() => {
    if (apiPassword) {
      setPassword(apiPassword);
    }
  }, [apiPassword]);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: "At least 8 characters" },
      { regex: /[0-9]/, text: "At least 1 number" },
      { regex: /[a-z]/, text: "At least 1 lowercase letter" },
      { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
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

  const getStrengthColor = (score: number) => {
    if (score === 0) return "bg-border";
    if (score <= 1) return "bg-red-500";
    if (score <= 2) return "bg-orange-500";
    if (score === 3) return "bg-amber-500";
    return "bg-emerald-500";
  };

  return (
    <Card className="p-5 w-full">
      <CardHeader className="pl-0">
        <CardTitle>{"SMTP Configuration"}</CardTitle>
        <CardDescription>
          {"Configure the SMTP settings below."}
        </CardDescription>
      </CardHeader>

      <div className="flex flex-nowrap justify-between gap-8 my-7">
        {/* Host */}
        <div className="w-2/4">
          <FormField
            control={control}
            name="SMTP.host"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{"Host"}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="NeussHMI.example.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Port */}
        <div className="w-2/4">
          <FormField
            control={control}
            name="SMTP.port"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{"Port"}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="587" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="flex flex-nowrap justify-between gap-8 mb-5">
        {/* Mail Sender */}
        <div className="w-2/4">
          <FormField
            control={control}
            name="SMTP.mailSender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{"Mail Sender"}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="NeussHMI@example.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* User/ApiKey */}
        <div className="w-2/4">
          <FormField
            control={control}
            name="SMTP.userApiKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{"User/ApiKey"}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="NeussHMI@example.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="flex flex-nowrap justify-between gap-8 mb-5">
        {/* Password */}
        <div className="w-2/4">
          <FormField
            control={control}
            name="SMTP.password"
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
                          type={isVisible ? "text" : "password"}
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
                            isVisible ? "Hide password" : "Show password"
                          }
                          aria-pressed={isVisible}
                          aria-controls="password"
                        >
                          {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div
                      className="mb-4 mt-3 h-1 w-full overflow-hidden rounded-full bg-border"
                      role="progressbar"
                      aria-valuenow={strengthScore}
                      aria-valuemin={0}
                      aria-valuemax={4}
                      aria-label="Password strength"
                    >
                      <div
                        className={`h-full ${getStrengthColor(
                          strengthScore
                        )} transition-all duration-500 ease-out`}
                        style={{
                          width: `${(strengthScore / 4) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Email to send a test message */}
        <div className="w-2/4">
          <FormField
            control={control}
            name="SMTP.emailTest"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{"Email to send test message"}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="test@example.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Test Button */}
      <div className="mt-4">
        <Button onClick={() => console.log("Send test email")}>Test</Button>
      </div>
    </Card>
  );
};

export default Step2;