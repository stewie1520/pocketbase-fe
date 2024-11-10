"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import * as yup from "yup"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAuthChangePassword } from "@/hooks/api/auth/useAuthChangePassword"
import { useToast } from "@/hooks/use-toast"
import { useQueryCurrentUser } from "@/hooks/api/user/useQueryCurrentUser"
import { Skeleton } from "@/components/ui/skeleton"

const passwordFormSchema = yup.object().shape({
  oldPassword: yup.string().required("Please enter your current password."),
  password: yup.string().required("Please enter a new password."),
  passwordConfirm: yup.string().required("Please confirm your new password.").oneOf([yup.ref("password")], "Passwords must match."),
});

type PasswordFormValues = yup.InferType<typeof passwordFormSchema>;

export function SecurityForm() {
  const { toast } = useToast();
  const { data: user } = useQueryCurrentUser();
  const { mutateAsync: changePasswordAsync } = useAuthChangePassword()
  const form = useForm<PasswordFormValues>({
    resolver: yupResolver(passwordFormSchema),
    defaultValues: {
      oldPassword: "",
      password: "",
      passwordConfirm: "",
    },
  });

  async function onSubmit(data: PasswordFormValues) {
    try {
      if (!user) return

      await changePasswordAsync({
        ...data,
        email: user.email,
      });

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: (error as unknown as Error).message,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="oldPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Your current password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Please enter new password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="passwordConfirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm new password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Confirm your new password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update password</Button>
      </form>
    </Form>
  )
}

export function SecurityFormSkeleton() {
  return (
    <div>
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <Skeleton className="w-24 h-6" />
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-96 h-6" />
      </div>

      <div className="flex flex-col gap-1">
        <Skeleton className="w-24 h-6" />
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-96 h-6" />
      </div>

      <div className="flex flex-col gap-1">
        <Skeleton className="w-24 h-6" />
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-96 h-6" />
      </div>

      <Skeleton className="w-24 h-12" />
    </div>
  </div>
  )
}