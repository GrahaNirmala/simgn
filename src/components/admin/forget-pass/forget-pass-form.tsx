"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().min(1, "Email harus diisi"),
});

export default function ForgetPasswordForm() {
  const [emailSent, setEmailSent] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
        email: "",
      },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await fetch('/api/v1/auth/forgetPass', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });

    if (response.ok) {
      setEmailSent(true);
      toast.success('Silahkan Periksa Email Anda');
    } else {
      form.setError('email', {
        type: 'server',
        message: 'Email Tidak Ditemukan',
      });
    }
  }
  function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (emailSent) {
      setEmailSent(false);
    }
    form.setValue('email', event.target.value);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {emailSent && (
          <div className="mt-4 text-center">
            <p className="text-sm text-red-600">Jika Email Tidak Muncul, Periksa Spam</p>
          </div>
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  onChange={handleEmailChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-center">
          <LoadingButton loading={form.formState.isSubmitting} type="submit">
            Reset Password
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
}
