"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthRegister } from "@/hooks/api/auth/useAuthRegister";
import { useToast } from "@/hooks/use-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const registerValidation = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
  passwordConfirm: yup.string().required().oneOf([yup.ref("password")], "Passwords must match"),
  name: yup.string().required(),
});

export default function RegisterPage() {
  const { mutateAsync, isPending } = useAuthRegister();
  const { toast } = useToast();
  const router = useRouter();
  const methods = useForm({
    resolver: yupResolver(registerValidation),
    reValidateMode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
      name: "",
    }
  });

  const { handleSubmit, formState: { isValid } } = methods;

  const onSubmit = async (data: yup.InferType<typeof registerValidation>) => {
    try {
      await mutateAsync(data); 
      router.push("/login");
    } catch (error) {
      toast({ title: "Error", description: (error as unknown as Error).message });
    }
  };

  const [acceptTerms, setAcceptTerms] = useState(false);

  return (
    <div className="h-screen w-screen items-center flex justify-center p-6">
      <Card className="max-w-[380px] w-full">
        <CardHeader>
          <CardTitle>Create new Account</CardTitle>
        </CardHeader>
        <Form {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent>
              <div className="flex flex-col gap-4 w-full">
                <FormField
                  control={methods.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="name">Name</FormLabel>
                      <FormControl>
                        <Input {...field} id="name" name="name" placeholder="Please enter your name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}>
                </FormField>

                <FormField
                  control={methods.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input {...field} id="email" name="email" placeholder="Please enter your email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}>
                </FormField>

                <FormField
                  control={methods.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <FormControl>
                        <Input {...field} id="password" name="password" type="password" placeholder="Please enter your password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}>
                </FormField>

                <FormField
                  control={methods.control}
                  name="passwordConfirm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="password-confirm">Confirm Password</FormLabel>
                      <FormControl>
                        <Input {...field} id="password-confirm" name="passwordConfirm" type="password" placeholder="Please confirm your password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}>
                </FormField>

                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" checked={acceptTerms} onCheckedChange={e => setAcceptTerms(!!e)} />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Accept terms and conditions
                  </label>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex flex-col gap-4 items-center w-full">
                <Button type="submit" disabled={!isValid || isPending || !acceptTerms} className="w-full">Create Account</Button>
                <div className="w-full flex flex-row items-center justify-center gap-2">
                  <Link href="/login" className="text-sm text-neutral-900">Already have an account?</Link>
                </div>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}
