import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '8パズル - ギャラリー',
  description: '画像を並べ替えるスライドパズルゲーム。3×3から5×5まで様々な難易度に挑戦しよう！',
  icons: {
    icon: '/favicon.svg',
    apple: '/logo.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
      </head>
      <body>{children}</body>
    </html>
  )
}
