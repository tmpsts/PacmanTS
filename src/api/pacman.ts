import { getDefaultStore } from "jotai";
import {
  gameStateAtom,
  playerLocationAtom,
  gameBoardAtom,
  badSquaresAtom,
  playerScoreAtom,
} from "../atoms/pacmanAtoms";

const store = getDefaultStore();

let currentDirecton = "right";
let loopNumber = 0;

const startGame = async () => {
  console.log("Game started");
  store.set(playerLocationAtom, { x: 0, y: 17 });
  store.set(gameStateAtom, "running");

  await new Promise((resolve) => setTimeout(resolve, 500));
  gameLoop(true);
};

function endGame() {
  console.log("Game ended");
  store.set(gameStateAtom, "idle");
}

async function gameLoop(skip = false) {
  const gameState = store.get(gameStateAtom);
  const player = store.get(playerLocationAtom);

  loopNumber++;
  console.log("Game loop running", loopNumber, gameState, player);

  if (gameState != "running" && !skip) {
    console.log("Game ended");
    loopNumber = 0;
    return "Game ended.";
  }

  if (isPlayerDead()) {
    console.log("Player is dead");
    store.set(gameStateAtom, "death");
    return "Player is dead";
  }

  if (isPlayerCoin()) {
    console.log("Player got a coin");
    store.set(gameBoardAtom, (prev) => {
      prev[player.y][player.x] = 0;
      return prev;
    });
    store.set(playerScoreAtom, (prev) => prev + 1);
  }

  if (!shouldMove(currentDirecton)) {
    console.log("Player can't move");
  } else {
    // Move the player
    switch (currentDirecton) {
      case "up":
        store.set(playerLocationAtom, { x: player.x, y: player.y - 1 });
        break;
      case "down":
        store.set(playerLocationAtom, { x: player.x, y: player.y + 1 });
        break;
      case "left":
        store.set(playerLocationAtom, { x: player.x - 1, y: player.y });
        break;
      case "right":
        store.set(playerLocationAtom, { x: player.x + 1, y: player.y });
        break;
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 250));
  gameLoop();
}

async function movePlayer(dir: "up" | "down" | "left" | "right") {
  const gameState = store.get(gameStateAtom);
  if (gameState !== "running") {
    console.log("Game is not running");
    return "Game is not running";
  }

  // Buffer so that the user gets a slightly longer time to react
  // Checks if you can move a certain direction in the next game loop

  const player = store.get(playerLocationAtom);

  if (shouldMove(dir)) {
    console.log("Direction change valid immediately:", dir);
    currentDirecton = dir;
    return `Changed direction to ${dir}`;
  }
  if (
    ((currentDirecton === "up" || currentDirecton === "down") &&
      (dir === "left" || dir === "right")) ||
    ((currentDirecton === "left" || currentDirecton === "right") &&
      (dir === "up" || dir === "down"))
  ) {
    let nextPos = { ...player };
    switch (currentDirecton) {
      case "up":
        nextPos.y -= 1;
        break;
      case "down":
        nextPos.y += 1;
        break;
      case "left":
        nextPos.x -= 1;
        break;
      case "right":
        nextPos.x += 1;
        break;
    }
    if (
      !isPlayerWall({
        x:
          dir === "left"
            ? nextPos.x - 1
            : dir === "right"
            ? nextPos.x + 1
            : nextPos.x,
        y:
          dir === "up"
            ? nextPos.y - 1
            : dir === "down"
            ? nextPos.y + 1
            : nextPos.y,
      })
    ) {
      console.log("Queuing direction for next frame:", dir);
      setTimeout(() => {
        if (store.get(gameStateAtom) === "running") {
          currentDirecton = dir;
          console.log("Direction changed:", dir);
        }
      }, 250);
      return `Queued ${dir} for next frame`;
    }
  }

  return "Cannot change direction to " + dir;
}

function isPlayerDead() {
  const player = store.get(playerLocationAtom);
  const badSquares = store.get(badSquaresAtom);
  return player.x === badSquares.x && player.y === badSquares.y;
}

function isPlayerEdge() {
  const player = store.get(playerLocationAtom);
  const edges = [0, 35, 0, 35];
  let isEdge = [0, 0, 0, 0];

  for (let i = 0; i < edges.length; i++) {
    if (player.y === edges[i] && i < 2) {
      isEdge[i] = 1;
    }
    if (player.x === edges[i] && i > 1) {
      isEdge[i] = 1;
    }
  }

  return isEdge;
}

function isPlayerWall(pos: { x: number; y: number }) {
  const wallSquares = store.get(gameBoardAtom);
  return wallSquares[pos.y][pos.x] > 0 && wallSquares[pos.y][pos.x] < 6;
}

function isPlayerCoin() {
  const player = store.get(playerLocationAtom);
  const coinSquares = store.get(gameBoardAtom);
  return (
    coinSquares[player.y][player.x] === 8 ||
    coinSquares[player.y][player.x] === 9
  );
}

function shouldMove(dir: string) {
  const player = store.get(playerLocationAtom);
  const isEdge = isPlayerEdge();

  switch (dir) {
    case "up":
      if (isEdge[0] || isPlayerWall({ x: player.x, y: player.y - 1 })) {
        return false;
      }
      break;
    case "down":
      if (isEdge[1] || isPlayerWall({ x: player.x, y: player.y + 1 })) {
        return false;
      }
      break;
    case "left":
      if (isEdge[2] || isPlayerWall({ x: player.x - 1, y: player.y })) {
        return false;
      }
      break;
    case "right":
      if (isEdge[3] || isPlayerWall({ x: player.x + 1, y: player.y })) {
        return false;
      }
      break;
  }

  return true;
}

export default {
  startGame,
  endGame,
  movePlayer,
  isPlayerDead,
};
