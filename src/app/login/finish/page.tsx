import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Berhasil Reset Password - SIMGN",
  }

  
export default function ResetPasswordFinish() {
  return (
    <div className="flex flex-col justify-center items-center px-6 h-screen bg-primary">
      <div className="mt-9 bg-white rounded-3xl px-8 py-10 w-full md:w-1/2 lg:w-1/3 text-center">
        <h2 className="text-primary text-2xl mb-4">Reset Password Telah Berhasil</h2>
        <p className="text-gray-700 mb-6">Password Anda Telah berhasil direset. Silahkan kembali login di aplikasi. Halaman Ini dapat ditutup</p>
      </div>
    </div>
  )
}