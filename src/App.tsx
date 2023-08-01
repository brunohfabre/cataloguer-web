import { useEffect, useState } from 'react'

import { Asterisk, X } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './components/ui/tooltip'

type StrategyType = {
  asset: string
  strategy: string
  results: {
    at: string
    result: string
  }[]
  counts: {
    doji: number
    loss: number
    mg1: number
    mg2: number
    total: number
    win: number
  }
}

export function App() {
  const [strategies, setStrategies] = useState<StrategyType[]>([])

  useEffect(() => {
    async function loadStrategies() {
      const response = await fetch('http://localhost:3333').then((result) =>
        result.json(),
      )

      setStrategies(
        response
          .reduce(
            (acc: StrategyType[], item: StrategyType[]) => [...acc, ...item],
            [],
          )
          .sort((a: StrategyType, b: StrategyType) => {
            if (a.counts.loss < b.counts.loss) {
              return -1
            }

            if (a.counts.loss > b.counts.loss) {
              return 1
            }

            return 0
          }),
      )
    }

    loadStrategies()
  }, [])

  return (
    <div className="h-screen">
      <div className="max-w-7xl px-4 mx-auto py-8 flex flex-col gap-6">
        <header className="flex">
          <span className="font-medium text-xl">
            Strategies ({strategies.length})
          </span>
        </header>

        <div className="grid grid-cols-3 gap-4">
          {strategies.map((strategy) => (
            <Card key={`${strategy.asset}-${strategy.strategy}`}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {strategy.asset} - {strategy.strategy}
                </CardTitle>
              </CardHeader>

              <CardContent className="grid grid-cols-12 gap-1">
                {strategy.results.map((result) => (
                  <TooltipProvider key={result.at}>
                    <Tooltip>
                      <TooltipTrigger>
                        <div
                          className={twMerge(
                            'flex items-center justify-center h-5 rounded bg-green-500',
                            result.result === 'loss' && 'bg-red-500',
                            result.result === 'doji' && 'bg-zinc-500',
                          )}
                        >
                          {(result.result === 'mg1' ||
                            result.result === 'mg2') && (
                            <Asterisk className="h-3 w-3 text-green-700" />
                          )}
                          {result.result === 'mg2' && (
                            <Asterisk className="h-3 w-3 text-green-700" />
                          )}
                          {result.result === 'loss' && (
                            <X className="h-3 w-3 text-red-700" />
                          )}
                        </div>
                      </TooltipTrigger>

                      <TooltipContent>{result.at}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </CardContent>

              <CardFooter className="grid grid-cols-5">
                <p className="text-sm">
                  win: <span className="font-bold">{strategy.counts.win}</span>
                </p>
                <p className="text-sm">
                  mg1: <span className="font-bold">{strategy.counts.mg1}</span>
                </p>
                <p className="text-sm">
                  mg2: <span className="font-bold">{strategy.counts.mg2}</span>
                </p>
                <p className="text-sm">
                  doji:{' '}
                  <span className="font-bold">{strategy.counts.doji}</span>
                </p>
                <p className="text-sm">
                  loss:{' '}
                  <span className="font-bold">{strategy.counts.loss}</span>
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
