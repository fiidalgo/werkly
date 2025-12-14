import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Werkly",
  description: "AI workplace onboarding and retraining tool",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}