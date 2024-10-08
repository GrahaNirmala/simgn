import Link from "next/link"

export default function NotFound() {
  return (
    <div>
      <h2>Halaman Tidak ditemukan</h2>
      <p>Tidak dapat menemukan sumber daya yang diminta</p>
      <Link href="/">Kembali ke halaman utama</Link>
    </div>
  )
}
