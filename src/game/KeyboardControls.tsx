import { useEffect } from "react";
import pacman from "../api/pacman";
import { useAtomValue } from "jotai";
import { gameStateAtom } from "../atoms/pacmanAtoms";

export default function KeyboardControls() {
  const gameState = useAtomValue(gameStateAtom);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameState !== "running") return;

      switch (event.key) {
        case "ArrowUp":
          pacman.movePlayer("up");
          break;
        case "ArrowDown":
          pacman.movePlayer("down");
          break;
        case "ArrowLeft":
          pacman.movePlayer("left");
          break;
        case "ArrowRight":
          pacman.movePlayer("right");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameState]);

  // This component doesn't render anything
  return null;
}
