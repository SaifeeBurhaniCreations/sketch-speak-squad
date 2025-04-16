
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Eraser, Square, Circle, PaintBucket, Undo, Undo2, Mic, X } from "lucide-react";
import { useSoundEffects } from "@/hooks/useSoundEffects";

interface DrawingCanvasProps {
  isDrawer: boolean;
  onDraw?: (data: any) => void;
  onExit?: () => void;
}

const COLORS = [
  "#000000", // Black
  "#FF0000", // Red
  "#4CAF50", // Green
  "#2196F3", // Blue
  "#FFEB3B", // Yellow
  "#00FFFF", // Cyan
  "#FF00FF", // Magenta
  "#FFFFFF", // White
  "#FF9800", // Orange
  "#9C27B0", // Purple
  "#795548", // Brown
  "#607D8B", // Blue Grey
];

const BRUSH_SIZES = [2, 5, 10, 15];

export function DrawingCanvas({ isDrawer = false, onDraw, onExit }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState<"brush" | "eraser" | "fill">("brush");
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMicActive, setIsMicActive] = useState(false);
  const { play } = useSoundEffects();

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    
    if (context) {
      context.fillStyle = "#FFFFFF";
      context.fillRect(0, 0, canvas.width, canvas.height);
      setCtx(context);
      
      // Save initial state
      const initialState = context.getImageData(0, 0, canvas.width, canvas.height);
      setHistory([initialState]);
      setHistoryIndex(0);
    }
  }, []);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current || !ctx) return;

      // Save current drawing
      const currentDrawing = ctx.getImageData(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      // Resize canvas
      const container = canvasRef.current.parentElement;
      if (container) {
        canvasRef.current.width = container.clientWidth;
        canvasRef.current.height = container.clientHeight;
      }

      // Restore drawing
      ctx.putImageData(currentDrawing, 0, 0);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [ctx]);

  // Set cursor style based on role and tool
  useEffect(() => {
    if (!canvasRef.current) return;
    
    if (isDrawer) {
      if (tool === "eraser") {
        canvasRef.current.style.cursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2" /></svg>') 12 12, auto`;
      } else {
        canvasRef.current.style.cursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2"><circle cx="12" cy="12" r="6" /></svg>') 12 12, crosshair`;
      }
    } else {
      canvasRef.current.style.cursor = "default";
    }
  }, [isDrawer, tool]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawer || !ctx || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    setDrawing(true);
    
    if (tool === "brush" || tool === "eraser") {
      ctx.strokeStyle = tool === "eraser" ? "#FFFFFF" : color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
    }
    
    // Play sound when starting to draw
    play('buttonClick');
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing || !isDrawer || !ctx || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (tool === "brush" || tool === "eraser") {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (!isDrawer || !ctx || !canvasRef.current) return;
    
    if (drawing) {
      ctx.closePath();
      setDrawing(false);
      
      // Save state to history
      const newState = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newState);
      
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  const handleUndo = () => {
    if (historyIndex <= 0 || !ctx || !canvasRef.current) return;
    
    const newIndex = historyIndex - 1;
    ctx.putImageData(history[newIndex], 0, 0);
    setHistoryIndex(newIndex);
    play('buttonClick');
  };

  const handleRedo = () => {
    if (historyIndex >= history.length - 1 || !ctx || !canvasRef.current) return;
    
    const newIndex = historyIndex + 1;
    ctx.putImageData(history[newIndex], 0, 0);
    setHistoryIndex(newIndex);
    play('buttonClick');
  };

  const handleClearCanvas = () => {
    if (!ctx || !canvasRef.current) return;
    
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Save cleared state to history
    const newState = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    play('buttonClick');
  };

  const toggleMic = () => {
    setIsMicActive(!isMicActive);
    play('buttonClick');
    // Here you would implement actual microphone functionality
  };

  return (
    <div className="flex flex-col bg-white rounded-xl overflow-hidden shadow-lg">
      <div className="relative border-b border-gray-200">
        {/* Top control buttons */}
        <div className="absolute top-2 right-2 flex space-x-2 z-10">
          {isDrawer && (
            <Button
              variant="outline"
              size="icon"
              className={`rounded-full bg-white ${isMicActive ? 'text-game-green' : 'text-gray-500'} hover:bg-gray-50`}
              onClick={toggleMic}
            >
              <Mic className="h-5 w-5" />
            </Button>
          )}
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-white text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={() => {
              if (onExit) {
                onExit();
                play('buttonClick');
              }
            }}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <canvas
          ref={canvasRef}
          width={1000}
          height={500}
          className={`bg-white ${isDrawer ? 'cursor-crosshair' : 'cursor-default'}`}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
      
      {isDrawer && (
        <div className="flex flex-col bg-game-blue rounded-b-xl p-2">
          <div className="flex justify-between mb-2">
            <div className="flex space-x-1">
              {COLORS.map((clr) => (
                <button
                  key={clr}
                  className={`w-8 h-8 rounded-full ${
                    color === clr ? "ring-2 ring-white" : ""
                  }`}
                  style={{ backgroundColor: clr }}
                  onClick={() => {
                    setColor(clr);
                    setTool("brush");
                    play('buttonClick');
                  }}
                />
              ))}
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                className={`bg-white ${tool === "eraser" ? "ring-2 ring-game-yellow" : ""}`}
                onClick={() => {
                  setTool("eraser");
                  play('buttonClick');
                }}
              >
                <Eraser className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="bg-white"
                onClick={handleUndo}
              >
                <Undo className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="bg-white"
                onClick={handleRedo}
              >
                <Undo2 className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                className="bg-game-orange text-white hover:bg-game-orange/90"
                onClick={handleClearCanvas}
              >
                Clear
              </Button>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {BRUSH_SIZES.map((size) => (
              <button
                key={size}
                className={`w-8 h-8 rounded-full bg-white flex items-center justify-center ${
                  brushSize === size ? "ring-2 ring-game-yellow" : ""
                }`}
                onClick={() => {
                  setBrushSize(size);
                  play('buttonClick');
                }}
              >
                <div
                  className="rounded-full bg-black"
                  style={{ width: size, height: size }}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
