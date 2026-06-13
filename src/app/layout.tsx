import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ScholarSync - AI-Powered Scholarship Management',
  description: 'Connect with scholarships using intelligent matching',
  charset: 'utf-8',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/favicon.ico" />
      </head>
      <body className="bg-white dark:bg-slate-950 text-gray-900 dark:text-white">
        {children}
      </body>
    </html>
  )
}
