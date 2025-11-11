'use client'

import { useState, useEffect, useCallback } from 'react'

const EMPTY = 9
const SIZE = 3

// 隣接マップ
const neighbors: { [key: number]: number[] } = {
  1: [2, 4],
  2: [1, 3, 5],
  3: [2, 6],
  4: [1, 5, 7],
  5: [2, 4, 6, 8],
  6: [3, 5, 9],
  7: [4, 8],
  8: [5, 7, 9],
  9: [6, 8],
}

interface PuzzleGameProps {
  puzzleId: string
  imagePaths: string[]
}

interface LeaderboardEntry {
  time: number
  moves: number
  hints: number
  date: string
}

export default function PuzzleGame({ puzzleId, imagePaths }: PuzzleGameProps) {
  const [state, setState] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, EMPTY])
  const [initialState, setInitialState] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, EMPTY])
  const [emptyPos, setEmptyPos] = useState(EMPTY)
  const [moves, setMoves] = useState(0)
  const [hints, setHints] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isBlurred, setIsBlurred] = useState(true)
  const [isStarted, setIsStarted] = useState(false)
  const [hintArrow, setHintArrow] = useState<{ pos: number; direction: string } | null>(null)
  const [isWon, setIsWon] = useState(false)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])

  // タイマー更新
  useEffect(() => {
    if (!startTime || isWon || !isStarted) return
    const timer = setInterval(() => {
      setElapsedTime(Date.now() - startTime)
    }, 100)
    return () => clearInterval(timer)
  }, [startTime, isWon, isStarted])

  // リーダーボード読み込み
  useEffect(() => {
    const saved = localStorage.getItem(`puzzle-${puzzleId}-leaderboard`)
    if (saved) {
      setLeaderboard(JSON.parse(saved))
    }
  }, [puzzleId])

  // 勝利判定
  useEffect(() => {
    const isWinning = state.every((val, idx) => val === idx + 1)
    if (isWinning && moves > 0 && !isWon) {
      setIsWon(true)
      const entry: LeaderboardEntry = {
        time: elapsedTime,
        moves,
        hints,
        date: new Date().toISOString(),
      }
      const newLeaderboard = [...leaderboard, entry]
        .sort((a, b) => a.time - b.time)
        .slice(0, 10)
      setLeaderboard(newLeaderboard)
      localStorage.setItem(`puzzle-${puzzleId}-leaderboard`, JSON.stringify(newLeaderboard))
      showCongratulations()
    }
  }, [state, moves, isWon, elapsedTime, hints, leaderboard, puzzleId])

  const showCongratulations = () => {
    // 紙吹雪アニメーション
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div')
        confetti.className = 'confetti'
        confetti.style.left = Math.random() * 100 + '%'
        confetti.style.background = ['#ff0', '#f0f', '#0ff', '#f00', '#0f0', '#00f'][
          Math.floor(Math.random() * 6)
        ]
        document.body.appendChild(confetti)
        setTimeout(() => confetti.remove(), 3000)
      }, i * 50)
    }
  }

  // シャッフル
  const shuffle = useCallback(() => {
    let current = [1, 2, 3, 4, 5, 6, 7, 8, EMPTY]
    let empty = EMPTY

    for (let i = 0; i < 200; i++) {
      const moveOptions = neighbors[empty].filter((pos) => {
        const idx = current.indexOf(pos)
        return idx !== -1
      })
      const randomPos = moveOptions[Math.floor(Math.random() * moveOptions.length)]
      const idx = current.indexOf(randomPos)
      current[current.indexOf(empty)] = randomPos
      current[idx] = empty
      empty = randomPos
    }

    setState(current)
    setInitialState([...current])
    setEmptyPos(empty)
    setMoves(0)
    setHints(0)
    setStartTime(null)
    setElapsedTime(0)
    setIsBlurred(true)
    setIsStarted(false)
    setHintArrow(null)
    setIsWon(false)
  }, [])

  // 開始ボタン
  const handleStart = () => {
    setIsBlurred(false)
    setIsStarted(true)
    setStartTime(Date.now())
  }

  // やり直しボタン
  const handleRestart = () => {
    setState([...initialState])
    setEmptyPos(initialState.indexOf(EMPTY))
    setHintArrow(null)
  }

  // タイルクリック（空のマスをクリックして隣接タイルを移動）
  const handleTileClick = (posIdx: number) => {
    if (isWon || !isStarted) return

    const tileNum = state[posIdx]
    if (tileNum !== EMPTY) return // 空マス以外はクリック不可

    // 空マスの隣接位置を取得
    const emptyIdx = posIdx
    const emptyRow = Math.floor(emptyIdx / SIZE)
    const emptyCol = emptyIdx % SIZE

    // 上下左右の隣接タイルを探す
    const adjacentPositions = [
      { row: emptyRow - 1, col: emptyCol }, // 上
      { row: emptyRow + 1, col: emptyCol }, // 下
      { row: emptyRow, col: emptyCol - 1 }, // 左
      { row: emptyRow, col: emptyCol + 1 }, // 右
    ]

    const movableTiles: { idx: number; tileNum: number }[] = []
    for (const pos of adjacentPositions) {
      if (pos.row >= 0 && pos.row < SIZE && pos.col >= 0 && pos.col < SIZE) {
        const idx = pos.row * SIZE + pos.col
        const tile = state[idx]
        if (tile !== EMPTY) {
          movableTiles.push({ idx, tileNum: tile })
        }
      }
    }

    // クリック可能なタイルがあれば、最初の1つを移動（実際のUIでは選択UIが必要だが、今回は自動選択）
    // より良いUX: タイルをクリックした方が直感的
  }

  // タイルクリック（タイル自体をクリックして空マスに移動）
  const handleTileClickDirect = (tileNum: number) => {
    if (isWon || tileNum === EMPTY || !isStarted) return

    // タイルの位置を取得
    const tileIdx = state.indexOf(tileNum)
    const emptyIdx = state.indexOf(EMPTY)

    const tileRow = Math.floor(tileIdx / SIZE)
    const tileCol = tileIdx % SIZE
    const emptyRow = Math.floor(emptyIdx / SIZE)
    const emptyCol = emptyIdx % SIZE

    // 隣接チェック（上下左右のみ）
    const isAdjacent =
      (Math.abs(tileRow - emptyRow) === 1 && tileCol === emptyCol) ||
      (Math.abs(tileCol - emptyCol) === 1 && tileRow === emptyRow)

    if (!isAdjacent) return

    const newState = [...state]
    newState[tileIdx] = EMPTY
    newState[emptyIdx] = tileNum

    setState(newState)
    setEmptyPos(tileNum)
    setMoves(moves + 1)
    setHintArrow(null)
  }

  // ヒント計算（A*アルゴリズム）
  const getHint = () => {
    const target = [1, 2, 3, 4, 5, 6, 7, 8, EMPTY]
    
    const manhattan = (s: number[]): number => {
      let dist = 0
      for (let i = 0; i < 9; i++) {
        if (s[i] === EMPTY) continue
        const targetIdx = target.indexOf(s[i])
        const currentRow = Math.floor(i / SIZE)
        const currentCol = i % SIZE
        const targetRow = Math.floor(targetIdx / SIZE)
        const targetCol = targetIdx % SIZE
        dist += Math.abs(currentRow - targetRow) + Math.abs(currentCol - targetCol)
      }
      return dist
    }

    interface Node {
      state: number[]
      empty: number
      cost: number
      heuristic: number
      path: number[]
    }

    const queue: Node[] = [
      { state: [...state], empty: emptyPos, cost: 0, heuristic: manhattan(state), path: [] },
    ]
    const visited = new Set<string>()

    while (queue.length > 0) {
      queue.sort((a, b) => a.cost + a.heuristic - (b.cost + b.heuristic))
      const current = queue.shift()!

      const key = current.state.join(',')
      if (visited.has(key)) continue
      visited.add(key)

      if (current.heuristic === 0) {
        if (current.path.length > 0) {
          showHintArrow(current.path[0])
          return
        }
      }

      for (const nextTile of neighbors[current.empty]) {
        const tileIdx = current.state.indexOf(nextTile)
        const emptyIdx = current.state.indexOf(current.empty)
        const newState = [...current.state]
        newState[tileIdx] = current.empty
        newState[emptyIdx] = nextTile

        queue.push({
          state: newState,
          empty: nextTile,
          cost: current.cost + 1,
          heuristic: manhattan(newState),
          path: [...current.path, nextTile],
        })
      }
    }
  }

  const showHintArrow = (tileNum: number) => {
    const tileIdx = state.indexOf(tileNum)
    const emptyIdx = state.indexOf(emptyPos)
    const tileRow = Math.floor(tileIdx / SIZE)
    const tileCol = tileIdx % SIZE
    const emptyRow = Math.floor(emptyIdx / SIZE)
    const emptyCol = emptyIdx % SIZE

    let direction = '→'
    if (emptyRow < tileRow) direction = '↑'
    else if (emptyRow > tileRow) direction = '↓'
    else if (emptyCol < tileCol) direction = '←'

    setHintArrow({ pos: tileNum, direction })
    setHints(hints + 1)
    setTimeout(() => setHintArrow(null), 2000)
  }

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    const millis = Math.floor((ms % 1000) / 10)
    return `${minutes}:${secs.toString().padStart(2, '0')}.${millis.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">9マスパズル</h1>
          <div className="flex justify-center gap-8 text-lg mb-4">
            <div>⏱️ {formatTime(elapsedTime)}</div>
            <div>🚶 {moves} 手</div>
            <div>💡 {hints} ヒント</div>
          </div>
          <div className="flex justify-center gap-4 flex-wrap">
            <button
              onClick={shuffle}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-bold transition"
            >
              シャッフル
            </button>
            <button
              onClick={handleStart}
              disabled={isStarted}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              開始
            </button>
            <button
              onClick={handleRestart}
              disabled={!isStarted || isWon}
              className="bg-orange-600 hover:bg-orange-700 px-6 py-2 rounded-lg font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              やり直し
            </button>
            <button
              onClick={getHint}
              disabled={isWon || !isStarted}
              className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ヒント
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* 見本ボード */}
          <div className="flex-shrink-0">
            <h2 className="text-xl font-bold mb-4 text-center">見本</h2>
            <div className="puzzle-grid mx-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8, EMPTY].map((tileNum, idx) => (
                <div
                  key={idx}
                  className={`puzzle-tile ${tileNum === EMPTY ? 'empty' : ''}`}
                >
                  {tileNum !== EMPTY && (
                    <>
                      <img src={imagePaths[tileNum - 1]} alt={`Tile ${tileNum}`} />
                      <div className="absolute top-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1.5 py-0.5 rounded font-bold">
                        {tileNum}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ゲームボード */}
          <div className="flex-shrink-0">
            <h2 className="text-xl font-bold mb-4 text-center">プレイ</h2>
            <div className="puzzle-grid mx-auto">
              {state.map((tileNum, idx) => (
                <div
                  key={idx}
                  className={`puzzle-tile ${tileNum === EMPTY ? 'empty' : ''} ${
                    isBlurred && tileNum !== EMPTY ? 'blurred' : ''
                  }`}
                  onClick={() => handleTileClickDirect(tileNum)}
                >
                  {tileNum !== EMPTY && (
                    <>
                      <img src={imagePaths[tileNum - 1]} alt={`Tile ${tileNum}`} />
                      <div className="absolute top-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1.5 py-0.5 rounded font-bold">
                        {tileNum}
                      </div>
                    </>
                  )}
                  {hintArrow && hintArrow.pos === tileNum && (
                    <div className="hint-arrow">{hintArrow.direction}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* リーダーボード */}
          <div className="flex-1 max-w-md">
            <h2 className="text-2xl font-bold mb-4">🏆 リーダーボード</h2>
            {leaderboard.length === 0 ? (
              <p className="text-gray-400">まだ記録がありません</p>
            ) : (
              <div className="space-y-2">
                {leaderboard.map((entry, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-800 p-3 rounded-lg flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-yellow-400">#{idx + 1}</span>
                      <div>
                        <div className="font-bold">{formatTime(entry.time)}</div>
                        <div className="text-sm text-gray-400">
                          {entry.moves}手 / {entry.hints}ヒント
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(entry.date).toLocaleDateString('ja-JP')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 勝利モーダル */}
      {isWon && (
        <div className="congratulations">
          <h2 className="text-3xl font-bold mb-4">🎉 おめでとうございます！</h2>
          <p className="text-xl mb-2">タイム: {formatTime(elapsedTime)}</p>
          <p className="text-lg mb-2">手数: {moves}</p>
          <p className="text-lg mb-4">ヒント: {hints}</p>
          <button
            onClick={shuffle}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-bold transition"
          >
            もう一度プレイ
          </button>
        </div>
      )}
    </div>
  )
}
