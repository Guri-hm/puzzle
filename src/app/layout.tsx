import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '9マスパズル',
  description: '画像を並べ替える9マスパズルゲーム',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
