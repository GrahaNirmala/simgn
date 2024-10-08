"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"

import { LoadingButton } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { putBillingConfig } from "@/lib/api"
import { useRouter } from "next/navigation"
import { BillingConfigResponse } from "@/server/models/responses/billing-config"

const formSchema = z.object({
    amountBill: z.coerce.number().nonnegative(),
    extraChargeBill: z.coerce.number().nonnegative(),
})


export function BillingConfigForm({ billingConfig }: { billingConfig: BillingConfigResponse }) {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        amountBill: billingConfig.amount_bill ?? 0,
        extraChargeBill: billingConfig.extra_charge_bill ?? 0,
      },
    })
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const [_, errors] = await putBillingConfig(billingConfig.id.toString(), values);

    if (errors) {
      errors.forEach((error) => {
        if (error.field) {
          form.setError(error.field as any, {
            type: "server",
            message: error.message,
          });
        }
      });
      return;
    }

    router.replace("/admin/bill");
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="amountBill"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jumlah Tagihan Bulanan</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  onBlur={(e) => {
                    field.onChange(parseFloat(e.target.value));
                    field.onBlur();
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="extraChargeBill"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Denda Tagihan Bulanan</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  onBlur={(e) => {
                    field.onChange(parseFloat(e.target.value));
                    field.onBlur();
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton loading={form.formState.isSubmitting} type="submit">
          Edit
        </LoadingButton>
      </form>
    </Form>
  )
}
