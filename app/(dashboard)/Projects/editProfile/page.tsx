"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Camera } from "lucide-react";
import { EditProfileSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import LoginButton from "@/components/motion/login";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function EditProfile() {
  const form = useForm<z.infer<typeof EditProfileSchema>>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      username: "",
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof EditProfileSchema>) {
    console.log(values);
  }

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setSelectedImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex justify-center">
      <Card className="overflow-hidden border-2 border-custom-green w-2/4">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold text-custom-green">
                    Update Profile
                  </h1>
                  <p className="text-balance text-muted-foreground">
                    Update your Neuss HMI account
                  </p>
                </div>

                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="ex@ex.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <LoginButton type="submit" className="w-full">
                  Update
                </LoginButton>
              </div>
            </form>
          </Form>

          <div className="w-full flex justify-center items-center ">
            <div className="w-full mx-auto">
              <div className="w-full rounded-sm bg-cover bg-center bg-no-repeat items-center">
                <div className="mx-auto flex justify-center w-[150px] h-[150px] relative">
                  <Avatar className="w-full h-full mt-5 ">
                    {selectedImage ? (
                      <AvatarImage src={selectedImage} alt="Profile Image" />
                    ) : (
                      <AvatarFallback className="bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                        <Camera className="text-black w-6 h-6" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="absolute bottom-1 right-1 bg-custom-green2 rounded-full w-6 h-6 text-center flex items-center justify-center">
                    <Input
                      type="file"
                      id="upload_profile"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <Label htmlFor="upload_profile" className="cursor-pointer">
                      <Camera className="text-black w-4 h-4" />
                    </Label>
                  </div>
                </div>
              </div>

              <h2 className="text-center mt-6 font-semibold dark:text-gray-300 ">
                Upload Profile Image
              </h2>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
