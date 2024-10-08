import { Metadata } from "next"
import { Suspense } from "react"

import LoginRedirectErrorBox from "@/components/ui/login-redirect-error-box"
import ForgetPasswordForm from "@/components/admin/forget-pass/forget-pass-form"

export const metadata: Metadata = {
  title: "Forget Password - SIMGN",
}

export default function ForgetPassPage() {
  return (
    <div className="flex flex-col justify-center items-center px-6 h-screen bg-primary">
    <Suspense fallback={null}>
      <LoginRedirectErrorBox />
      <h2 className="text-center text-white mt-9">Admin - Forget Password</h2>
      <div className="mt-9 bg-white rounded-3xl px-8 py-10 w-full md:w-1/2 lg:w-1/3">
          <ForgetPasswordForm />
          <div className="text-center mt-9">
              <a href={`/admin/login`} className="text-sm">
                  <p>Login?</p>
              </a>
          </div>
      </div>
    </Suspense>
    </div>
  )
}
