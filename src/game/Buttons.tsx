import pacman from "../api/pacman";

export default function Buttons() {
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        className="btn bg-red-400/80"
        onClick={() => pacman.movePlayer("up")}
      >
        Up
      </button>
      <div className="flex gap-2">
        <button
          className="btn bg-green-400/80"
          onClick={() => pacman.movePlayer("left")}
        >
          Left
        </button>
        <button
          className="btn bg-blue-400/80"
          onClick={() => pacman.movePlayer("right")}
        >
          Right
        </button>
      </div>
      <button
        className="btn bg-yellow-400/80"
        onClick={() => pacman.movePlayer("down")}
      >
        Down
      </button>
    </div>
  );
}
