"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { useAuthWithPassword } from "../../hooks/api/auth/useAuthWithPassword";
import { useToast } from "../../hooks/use-toast";
import Link from "next/link";
import { DotIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const loginValidation = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

export default function LoginPage() {
  const { mutateAsync, isPending } = useAuthWithPassword();
  const { toast } = useToast();
  const router = useRouter();
  const methods = useForm({
    resolver: yupResolver(loginValidation),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const { register, handleSubmit, formState: { isValid } } = methods;

  const onSubmit = async (data: yup.InferType<typeof loginValidation>) => {
    try {
      await mutateAsync(data); 
      router.push("/my-projects");
    } catch (error) {
      toast({ title: "Error", description: (error as unknown as Error).message });
    }
  };

  return (
    <div className="h-screen w-screen items-center flex justify-center p-6">
      <Card className="max-w-[380px] w-full">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent>
              <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input {...register("email")} id="email" name="email" placeholder="Please enter your email" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input {...register("password")} id="password" name="password" type="password" placeholder="Your password" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex flex-col gap-4 items-center w-full">
                <Button type="submit" disabled={!isValid || isPending} className="w-full">Continue</Button>
                <div className="w-full flex flex-row items-center justify-center gap-2">
                  <Link href="/register" className="text-sm text-neutral-900">Create an account</Link>
                  <DotIcon size={16} />
                  <Link href="/forgot" className="text-sm text-neutral-900">Forgot password?</Link>
                </div>
              </div>
            </CardFooter>
          </form>
        </FormProvider>
      </Card>
    </div>
  )
}
