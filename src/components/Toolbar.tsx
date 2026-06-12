import {
  FaPen,
  FaEraser,
  FaRegSquare,
  FaRegCircle,
  FaUndo,
  FaRedo,
  FaTrash,
  FaDownload,
} from "react-icons/fa";
import type { Tool } from "../components/WhiteboardPage.tsx";

type ToolbarProps = {
  tool: Tool;
  setTool: (tool: Tool) => void;
  color: string;
  setColor: (color: string) => void;
  size: number;
  setSize: (size: number) => void;
  undo: () => void;
  redo: () => void;
  clear: () => void;
  download: () => void;
  pdf: () => void;
};

function Toolbar({
  tool,
  setTool,
  color,
  setColor,
  size,
  setSize,
  undo,
  redo,
  clear,
  download,
  pdf,
}: ToolbarProps) {
  return (
    <div className="toolbar-card">
      <button
        className={`tool-btn ${tool === "pen" ? "active" : ""}`}
        onClick={() => setTool("pen")}
      >
        <FaPen />
      </button>

      <button
        className={`tool-btn ${tool === "eraser" ? "active" : ""}`}
        onClick={() => setTool("eraser")}
      >
        <FaEraser />
      </button>

      <span className="divider"></span>

      <button
        className={`tool-btn ${tool === "rect" ? "active" : ""}`}
        onClick={() => setTool("rect")}
      >
        <FaRegSquare />
      </button>

      <button
        className={`tool-btn ${tool === "circle" ? "active" : ""}`}
        onClick={() => setTool("circle")}
      >
        <FaRegCircle />
      </button>

      <button
        className={`tool-btn ${tool === "line" ? "active" : ""}`}
        onClick={() => setTool("line")}
      >
        −
      </button>

      <button
        className={`tool-btn ${tool === "text" ? "active" : ""}`}
        onClick={() => setTool("text")}
      >
        T
      </button>

      <span className="divider"></span>

      <b>Color:</b>
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />

      <b>Size:</b>
      <input
        type="range"
        min="1"
        max="20"
        value={size}
        onChange={(e) => setSize(Number(e.target.value))}
      />

      <span>{size}px</span>

      <span className="divider"></span>

      <button className="tool-btn" onClick={undo}>
        <FaUndo />
      </button>

      <button className="tool-btn" onClick={redo}>
        <FaRedo />
      </button>

      <button className="tool-btn" onClick={clear}>
        <FaTrash />
      </button>

      <button className="tool-btn" onClick={download}>
        <FaDownload />
      </button>

      <button className="tool-btn" onClick={pdf}>
        PDF
      </button>
    </div>
  );
}

export default Toolbar;