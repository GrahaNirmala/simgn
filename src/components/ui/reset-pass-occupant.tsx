"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/button";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
  newPassword: z.string().min(8, "Password Minimal 8 character"),
  confirmPassword: z.string().min(8, "Password Minimal 8 character"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords tidak sama",
});

export default function ResetPasswordOccupantForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
        newPassword: "",
        confirmPassword: "",
      },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {

    if (values.newPassword !== values.confirmPassword) {
      form.setError("root", {
        type: "manual",
        message: "Password tidak sama",
      });
      return;
    }

    const response = await fetch('/api/v1/occupant/resetPass', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword: values.newPassword }),
    });

    if (response.ok) {
      // Handle success
      toast.success('Password reset successfully.');
      router.replace('/login/finish');
    } else {
      const errors = await response.json();
      if (errors.message === "Token Tidak Valid") {
        toast.error('Link Reset ini telah Kadaluarsa. Silahkan Lakukan Permintaan ulang.');
      } else {form.setError('newPassword', {
        type: 'server',
        message: errors.message,
      });
      }
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.formState.errors.root && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.root.message}
          </p>
        )}
        <div className="flex justify-center">
          <LoadingButton loading={form.formState.isSubmitting} type="submit">
            Reset Password
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
}
