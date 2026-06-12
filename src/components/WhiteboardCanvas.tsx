import { useEffect, useRef } from "react";
import type { Tool } from "../components/WhiteboardPage.tsx";

type CanvasProps = {
  tool: Tool;
  color: string;
  size: number;

  sessionId: string;
  username: string;
  stompClient: any;

  undoRef: React.MutableRefObject<() => void>;
  redoRef: React.MutableRefObject<() => void>;
  clearRef: React.MutableRefObject<() => void>;
  downloadRef: React.MutableRefObject<() => void>;
  pdfRef: React.MutableRefObject<() => void>;
  
};

function WhiteboardCanvas({
  tool,
  color,
  size,
  sessionId,
  username,
  stompClient,
  undoRef,
  redoRef,
  clearRef,
  downloadRef,
  pdfRef,
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const history = useRef<ImageData[]>([]);
  const redoStack = useRef<ImageData[]>([]);

  const getCtx = () => {
    return canvasRef.current?.getContext("2d");
  };

  const saveHistory = () => {
    const canvas = canvasRef.current;
    const ctx = getCtx();

    if (!canvas || !ctx) return;

    history.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  };

  const getPosition = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const ctx = getCtx();

    if (!ctx) return;

    saveHistory();
    redoStack.current = [];

    const position = getPosition(e);

    startX.current = position.x;
    startY.current = position.y;

    if (tool === "text") {
      const text = prompt("Enter text");

      if (text) {
        ctx.fillStyle = color;
        ctx.font = `${size * 8}px Arial`;
        ctx.fillText(text, startX.current, startY.current);
      }

      return;
    }

    isDrawing.current = true;
    ctx.beginPath();
    ctx.moveTo(startX.current, startY.current);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
     
    const position = getPosition(e);

     // Send cursor position
  if (stompClient?.connected) {
    stompClient.publish({
      destination: "/app/cursor.move",
      body: JSON.stringify({
        sessionId,
        user: username,
        x: position.x,
        y: position.y,
      }),
    });
  }

    if (!isDrawing.current) return;

    const ctx = getCtx();

    if (!ctx) return;

    ctx.lineWidth = size;
    ctx.lineCap = "round";
    ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;

    if (tool === "pen" || tool === "eraser") {
      ctx.lineTo(position.x, position.y);
      ctx.stroke();
    }
  };

  const stopDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;

    const ctx = getCtx();

    if (!ctx) return;

    const position = getPosition(e);

    ctx.lineWidth = size;
    ctx.strokeStyle = color;

    if (tool === "rect") {
      ctx.strokeRect(
        startX.current,
        startY.current,
        position.x - startX.current,
        position.y - startY.current
      );
    }

    if (tool === "circle") {
      const radius = Math.sqrt(
        Math.pow(position.x - startX.current, 2) +
          Math.pow(position.y - startY.current, 2)
      );

      ctx.beginPath();
      ctx.arc(startX.current, startY.current, radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (tool === "line") {
      ctx.beginPath();
      ctx.moveTo(startX.current, startY.current);
      ctx.lineTo(position.x, position.y);
      ctx.stroke();
    }

    isDrawing.current = false;
  };

  useEffect(() => {
    undoRef.current = () => {
      const canvas = canvasRef.current;
      const ctx = getCtx();

      if (!canvas || !ctx || history.current.length === 0) return;

      redoStack.current.push(
        ctx.getImageData(0, 0, canvas.width, canvas.height)
      );

      const last = history.current.pop();

      if (last) {
        ctx.putImageData(last, 0, 0);
      }
    };

    redoRef.current = () => {
      const canvas = canvasRef.current;
      const ctx = getCtx();

      if (!canvas || !ctx || redoStack.current.length === 0) return;

      history.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));

      const next = redoStack.current.pop();

      if (next) {
        ctx.putImageData(next, 0, 0);
      }
    };

    clearRef.current = () => {
      const canvas = canvasRef.current;
      const ctx = getCtx();

      if (!canvas || !ctx) return;

      saveHistory();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    downloadRef.current = () => {
      const canvas = canvasRef.current;

      if (!canvas) return;

      const link = document.createElement("a");
      link.download = "whiteboard.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    pdfRef.current = () => {
      window.print();
    };
  }, [undoRef, redoRef, clearRef, downloadRef, pdfRef]);

  

  return (
    <div className="canvas-card">
      <canvas
        ref={canvasRef}
        width={1200}
        height={600}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
      ></canvas>
    </div>
  );
}

export default WhiteboardCanvas;