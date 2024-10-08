"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";

import { LoadingButton } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { CashflowResponse } from "@/server/models/responses/cashflow";
import { toast } from "sonner";
import { useState } from "react";
import { postCashflow, putCashflow } from "@/lib/api";

function formatNumber(value: string) {
  return new Intl.NumberFormat("id-ID").format(Number(value.replace(/\D/g, "")));
}

const formSchema = z.object({
  title: z.string().nonempty("Judul harus diisi"),
  description: z
    .string()
    .optional()
    .transform((value) => (value ? (value.length > 0 ? value : undefined) : undefined))
    .pipe(z.string().min(1).optional()),
  movement: z.string().nonempty("Tipe harus diisi"),
  amount: z.coerce.number().nonnegative(),
  receipt: z.any().optional(),
});

const flowTypes = [
  {
    key: "outcome",
    name: "Pengeluaran",
  },
  {
    key: "income",
    name: "Pemasukan",
  },
];

export function TransactionForm({ cashflow }: { cashflow?: CashflowResponse }) {
  const router = useRouter();
  const [formattedAmount, setFormattedAmount] = useState<string>(cashflow?.amount.toString() ?? "0");
  const defaultValues = {
    title: cashflow?.title ?? "",
    description: cashflow?.description ?? "",
    movement: cashflow?.movement ?? "",
    amount: cashflow?.amount ?? 0,
    receipt: null,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append("title", values.title);
    if (values.description) {
      formData.append("description", values.description);
    }
    formData.append("movement", values.movement);
    formData.append("amount", values.amount.toString().replace(/\D/g, ""));

    if (values.receipt?.length) {
      formData.append("file", values.receipt[0]);
    }

    let response
    let errors

    if (cashflow) {
      [response, errors] = await putCashflow(cashflow.id.toString(), formData)
    } else {
      [response, errors] = await postCashflow(formData)
    }

    if (errors) {
      errors.forEach((error) => {
        if (error.field) {
          form.setError(error.field as any, {
            type: "server",
            message: error.message,
          })
        }
      })
      return
    }
    toast.success("Transaksi berhasil diproses");
    router.replace("/admin/transaction");
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Judul</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="movement"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipe</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={cashflow?.movement}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {flowTypes.map((type, idx) => (
                    <SelectItem key={idx} value={type.key}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jumlah</FormLabel>
              <FormControl>
              <Input
                  type="text"
                  value={formattedAmount}
                  onChange={(e) => {
                    const formattedValue = formatNumber(e.target.value);
                    setFormattedAmount(formattedValue);
                    field.onChange(e.target.value.replace(/\D/g, "")); // Tetap simpan nilai angka mentah tanpa format
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.watch("movement") === "outcome" && (
          <FormField
            control={form.control}
            name="receipt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload Bukti Nota (Opsional)</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".png,.jpeg,.jpg"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const files = e.target.files;
                      if (files) {
                        field.onChange(files);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <LoadingButton loading={form.formState.isSubmitting} type="submit">
          {cashflow ? "Edit" : "Tambah"}
        </LoadingButton>
      </form>
    </Form>
  );
}
