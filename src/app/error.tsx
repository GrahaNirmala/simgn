"use client"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <h2>Terjadi masalah!</h2>
        <p>{error.message}</p>
        <button onClick={() => reset()}>Coba lagi</button>
      </body>
    </html>
  )
}
