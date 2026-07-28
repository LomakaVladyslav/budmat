import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://budmat-kaharlyk.com.ua'),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '256x256' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
