import { Metadata } from "next"
import { Suspense } from "react"

import LoginRedirectErrorBox from "@/components/ui/login-redirect-error-box"
import ResetPasswordForm from "@/components/admin/forget-pass/reset-pass-form"

export const metadata: Metadata = {
  title: "Reset Password - SIMGN",
}

export default function ResetPassPage() {
  return (
    <div className="flex flex-col justify-center items-center px-6 h-screen bg-primary">
    <Suspense fallback={null}>
      <LoginRedirectErrorBox />
      <h2 className="text-center text-white mt-9">Admin - Reset Password</h2>
      <div className="mt-9 bg-white rounded-3xl px-8 py-10 w-full md:w-1/2 lg:w-1/3">
          <ResetPasswordForm />
      </div>
    </Suspense>
    </div>
  )
}
