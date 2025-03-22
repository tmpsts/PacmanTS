import { useAtomValue } from "jotai";
import { twMerge } from "tailwind-merge";
import pacman from "../api/pacman";

import {
  badSquaresAtom,
  gameStateAtom,
  playerLocationAtom,
  gameBoardAtom,
  playerScoreAtom,
} from "../atoms/pacmanAtoms";

export default function GameBoard() {
  const score = useAtomValue(playerScoreAtom);
  const gameState = useAtomValue(gameStateAtom);
  const player = useAtomValue(playerLocationAtom);
  const wallSquares = useAtomValue(gameBoardAtom);
  const badSquare = useAtomValue(badSquaresAtom);

  return (
    <div className="relative rounded-xl overflow-clip border-4 border-neutral-900 shadow-xl">
      <div
        className={twMerge(
          "absolute inset-0 bg-neutral-950/20 flex justify-center items-center",
          gameState != "idle" && "hidden",
        )}
      >
        <button
          className={twMerge(
            "bg-green-500/80 px-16 py-5 rounded-xl text-5xl font-bold border-4 border-green-700/80 hover:bg-green-400 duration-100 hover:border-green-500",
            gameState != "idle" && "hidden",
          )}
          onClick={() => {
            pacman.startGame();
          }}
        >
          Play
        </button>
      </div>

      <div
        className={twMerge(
          "absolute top-2 right-3 text-2xl font-bold shadow-md bg-neutral-950/50 px-3 py-1 rounded-xl",
          gameState === "idle" && "hidden",
        )}
      >
        Score: {score}
      </div>

      {Array.from({ length: 36 }).map((_, i) => (
        <div key={i} className="flex">
          {Array.from({ length: 28 }).map((_, j) => (
            <div
              key={j}
              className={twMerge(
                "w-5 h-5 border border-neutral-700/20 flex items-center justify-center",
                player.x === j && player.y === i && "bg-yellow-400",
                badSquare.x === j && badSquare.y === i && "bg-red-400",
                wallSquares[i][j] <= 5 &&
                  wallSquares[i][j] > 0 &&
                  "bg-blue-700/70",
                wallSquares[i][j] === 2 && "rounded-tl-xl",
                wallSquares[i][j] === 3 && "rounded-tr-xl",
                wallSquares[i][j] === 4 && "rounded-br-xl",
                wallSquares[i][j] === 5 && "rounded-bl-xl",
              )}
            >
              <div
                className={twMerge(
                  "size-1.5 bg-yellow-500/60 hidden -z-10",
                  wallSquares[i][j] === 8 && "block",
                  wallSquares[i][j] === 9 &&
                    "block size-2.5 m-1 bg-yellow-500/80",
                )}
              ></div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
