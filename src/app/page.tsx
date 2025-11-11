import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '9マスパズル | Puzzle Gallery',
  description: '様々な画像を使った9マスパズルで遊ぼう！',
  openGraph: {
    title: '9マスパズル | Puzzle Gallery',
    description: '様々な画像を使った9マスパズルで遊ぼう！',
    type: 'website',
  },
}

// 利用可能なパズルセット（手動で追加したIDをここに列挙）
const PUZZLE_SETS = [
  { id: '0001', name: 'サンプルパズル', description: 'デモ用の9マスパズル' },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
          🧩 9マスパズル
        </h1>
        <p className="text-center text-gray-600 mb-12">
          画像を正しい順番に並べ替えるスライドパズルです
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PUZZLE_SETS.map((puzzle) => (
            <Link
              key={puzzle.id}
              href={`/puzzle/${puzzle.id}`}
              className="block bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 hover:scale-105 transform transition-transform"
            >
              <div className="aspect-square bg-gradient-to-br from-indigo-200 to-purple-200 rounded-md mb-4 flex items-center justify-center">
                <span className="text-6xl">🖼️</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {puzzle.name}
              </h2>
              <p className="text-gray-600 text-sm">{puzzle.description}</p>
              <div className="mt-4 text-indigo-600 font-medium">
                プレイ →
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">遊び方</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>上記のパズルから好きなものを選んでください</li>
            <li>「開始」ボタンを押してゲームスタート</li>
            <li>タイルをクリックして空いているマスに移動させます</li>
            <li>見本と同じ並びになればクリア！</li>
            <li>ヒントボタンで次の一手がわかります</li>
          </ol>
        </div>
      </div>
    </main>
  )
}
