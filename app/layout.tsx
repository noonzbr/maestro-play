"use client"

import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <title>MaestroPlay — AI Education Gaming Platform</title>
        <meta name="description" content="Learn AI without coding. Gamified AI literacy for professionals. You don't need to code. You need to conduct." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  )
}
