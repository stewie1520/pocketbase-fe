"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRequestPasswordReset } from "@/hooks/api/auth/useRequestPasswordReset";
import { useToast } from "@/hooks/use-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";

const forgotValidation = yup.object().shape({
  email: yup.string().email().required(),
});

export default function ForgotPage() {
  const { mutateAsync, isPending } = useRequestPasswordReset();
  const { toast } = useToast();
  const [requested, setRequested] = useState(false);
  const methods = useForm({
    resolver: yupResolver(forgotValidation),
    defaultValues: {
      email: "",
    }
  });

  const { register, handleSubmit, formState: { isValid } } = methods;

  const onSubmit = async (data: yup.InferType<typeof forgotValidation>) => {
    try {
      const ok = await mutateAsync(data);
      if (ok) {
        setRequested(true);
      }
    } catch (error) {
      toast({ title: "Error", description: (error as unknown as Error).message });
    }
  };

  return (
    <div className="h-screen w-screen items-center flex justify-center p-6">
      <Card className="max-w-[380px] w-full">
        <CardHeader>
          <CardTitle>{requested ? 'Reset Email Sent' : 'Forgot Password'}</CardTitle>
          <CardDescription>{requested ? 'Please check your email for instructions on how to reset your password' : 'Enter your email to request a password reset'}</CardDescription>
        </CardHeader>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className={requested ? "hidden" : ""}>
            <CardContent>
              <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input {...register("email")} id="email" name="email" placeholder="Please enter your email" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex flex-col gap-4 items-center w-full">
                <Button type="submit" disabled={!isValid || isPending} className="w-full">Request Password Reset</Button>
              </div>
            </CardFooter>
          </form>
        </FormProvider>
      </Card>
    </div>
  )
}
