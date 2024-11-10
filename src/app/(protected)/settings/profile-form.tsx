"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import { useForm, useFormContext } from "react-hook-form"
import * as yup from "yup"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { useQueryCurrentUser } from "@/hooks/api/user/useQueryCurrentUser"
import { useUpdateProfile } from "@/hooks/api/user/useUpdateProfile"
import { useToast } from "@/hooks/use-toast"
import { Verified } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useAuthRequestVerifyEmail } from "@/hooks/api/auth/useAuthRequestVerifyEmail"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


const profileFormSchema = yup.object().shape({
  avatarGroup: yup.object().shape({
    avatar: yup.string().nullable().optional(),
    avatarFile: yup.mixed<File>().nullable().optional(),
  }),
  name: 
    yup.string()
    .required("Please enter a name."),
  email: yup.string().required("Please enter your email.")
    .email(),
  bio: yup.string().max(160).min(4),
})

type ProfileFormValues = yup.InferType<typeof profileFormSchema>

export function ProfileForm() {
  const { toast } = useToast();
  const { data: user } = useQueryCurrentUser();
  const { mutateAsync: updateProfile } = useUpdateProfile();

  const form = useForm<ProfileFormValues>({
    resolver: yupResolver(profileFormSchema),
    defaultValues: {
      avatarGroup: {
        avatar: "",
        avatarFile: null,
      },
      name: "",
      email: "",
      bio: "",
    },
    mode: "onChange",
  })

  useEffect(() => {
    if (user) {
      form.reset({
        avatarGroup: {
          avatar: user.avatar,
          avatarFile: null,
        },
        name: user.name,
        email: user.email,
        bio: user.bio,
      });
    }
  }, [form, user])

  async function onSubmit(data: ProfileFormValues) {
    try {
      await updateProfile({
        avatar: data.avatarGroup.avatarFile ?? undefined,
        name: data.name,
        bio: data.bio,
      });
  
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "An error occurred",
        description: (error as unknown as Error).message,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <AvatarField name={user?.name}/>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <EmailField verified={user?.verified} />
       
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update profile</Button>
      </form>
    </Form>
  )
}

function AvatarField({ name }: { name?: string }) {
  const { control } = useFormContext<{ avatarGroup: { avatar?: string | null, avatarFile?: File | null } }>();

  const handleAvatarChange = async (file: File | null, callback: (avatarFile: File, avatar: string) => void) => {
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      callback(file, reader.result as string);
    }

    reader.readAsDataURL(file);
  }

  return (
    <FormField
      control={control}
      name="avatarGroup"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Avatar</FormLabel>
          <FormControl>
            <div className="flex flex-row items-center gap-2">
              <Avatar>
                <AvatarImage src={field.value?.avatar ?? ""} alt="Avatar" />
                <AvatarFallback>{name?.[0]}</AvatarFallback>
              </Avatar>
              <Input
                type="file"
                className="w-fit"
                onChange={e => handleAvatarChange(e.target.files?.[0] ?? null, (file, url) => {
                  field.onChange({
                    avatar: url,
                    avatarFile: file,
                  });
                })}
              />
            </div>
          </FormControl>
          <FormDescription>
            Upload a new avatar to change your profile picture.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function EmailField({ verified }: { verified?: boolean }) {
  const { control } = useFormContext<{ email: string }>();
  const { mutateAsync: requestVerifyEmail } = useAuthRequestVerifyEmail();
  const { toast } = useToast();
  const [requestResendSeconds, setRequestResendSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  async function handleSendEmailVerification() {
    if (requestResendSeconds > 0) {
      return;
    }

    try {
      await requestVerifyEmail();
      setRequestResendSeconds(120);

      intervalRef.current = setInterval(() => {
        setRequestResendSeconds((prev) => {
          if (prev <= 0) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return 0;
          }

          return prev - 1;
        });
      }, 1000);

      toast({
        title: "Verification email sent",
        description: "A verification email has been sent to your email address.",
      });
    } catch (error) {
      toast({
        title: "An error occurred",
        description: (error as unknown as Error).message,
      });
    }
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);


  return (
    <FormField
      control={control}
      name="email"
      render={({ field,  }) => (
        <FormItem>
          <FormLabel className="gap-2 flex items-center">
            Email
            {verified ? (
              <Badge className="gap-1"><Verified className="size-3"/> Verified</Badge>
            ) : (
              <Badge role="button" variant="outline">Unverified</Badge>
            )}
          </FormLabel>
          <FormControl>
            <Input {...field} readOnly/>
          </FormControl>
          
          {!verified && (
            <a onClick={handleSendEmailVerification} className={
              cn("text-xs cursor-pointer hover:text-blue-500 transition focus:text-blue-600", {
                "text-gray-400 cursor-not-allowed hover:text-gray-400 focus:text-blue-600": requestResendSeconds > 0,
              })
            }>Send verification email{requestResendSeconds > 0 ? ` (${requestResendSeconds}s)` : ''}</a>
          )}
        </FormItem>
      )}
    />
  )
}

export function ProfileFormSkeleton() {
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
        <Skeleton className="w-full h-40" />
        <Skeleton className="w-96 h-6" />
      </div>

      <Skeleton className="w-24 h-12" />
    </div>
  </div>
  )
}