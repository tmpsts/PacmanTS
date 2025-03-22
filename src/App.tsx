import Buttons from "./game/Buttons";
import GameBoard from "./game/GameBoard";
import KeyboardControls from "./game/KeyboardControls";

export default function App() {
  return (
    <div className="text-center p-5 text-white/90 flex flex-col justify-between items-center h-screen">
      <h1 className="text-7xl font-bold tracking-tight">Pacman</h1>

      <GameBoard />
      <KeyboardControls />

      <div>
        <Buttons />
      </div>
    </div>
  );
}
