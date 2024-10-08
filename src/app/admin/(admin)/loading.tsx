import { Loader } from "lucide-react"

export default function Loading() {
  return (
    <div className="h-[calc(100vh-80px)] flex flex-col justify-center items-center">
      <Loader className="animate-spin" />
      <p className="text-sm font-medium">Memuat...</p>
    </div>
  )
}
