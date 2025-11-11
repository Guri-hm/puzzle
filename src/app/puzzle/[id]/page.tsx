import PuzzleGame from '@/components/PuzzleGame'
import { Metadata } from 'next'

const BASE_PATH = process.env.NODE_ENV === 'production' ? '/puzzle' : ''

// 利用可能なパズルID一覧
const PUZZLE_IDS = ['0001']

export async function generateStaticParams() {
  return PUZZLE_IDS.map((id) => ({
    id: id,
  }))
}

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `パズル ${params.id} - 9マスパズル`,
    description: `画像を並べ替える9マスパズルゲーム - ID: ${params.id}`,
    openGraph: {
      title: `パズル ${params.id} - 9マスパズル`,
      description: `画像を並べ替える9マスパズルゲーム`,
      type: 'website',
    },
  }
}

export default function PuzzlePage({ params }: Props) {
  const { id } = params

  // 画像パスを生成
  const imagePaths = Array.from({ length: 9 }, (_, i) => {
    return `${BASE_PATH}/puzzles/${id}/tile_${i + 1}.png`
  })

  return (
    <div>
      <PuzzleGame puzzleId={id} imagePaths={imagePaths} />
    </div>
  )
}
