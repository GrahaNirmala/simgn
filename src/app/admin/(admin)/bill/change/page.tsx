import { BillingConfigForm } from "@/components/admin/bill/admin-bill-form"
import { getBillConfig } from "@/lib/api"
import { notFound } from "next/navigation"

export default async function EditBillingConfig() {
  const [billingConfig] = await getBillConfig("1")

  if (!billingConfig) {
    notFound()
  }
    return (
      <div className="m-6">
        <BillingConfigForm billingConfig={billingConfig} />
      </div>
    )
}
