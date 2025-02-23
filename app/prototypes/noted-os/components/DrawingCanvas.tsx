"use client";

import { useEffect, useRef, useState } from 'react';
import styles from '../styles.module.css';

interface DrawingCanvasProps {
  content: string;
  onChange: (content: string) => void;
}

interface Point {
  x: number;
  y: number;
}

export default function DrawingCanvas({ content, onChange }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pencil' | 'eraser'>('pencil');
  const [color, setColor] = useState('#000000');
  const [size, setSize] = useState(2);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match container
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight - 40; // Account for toolbar height
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Load saved content if any
    if (content) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = content;
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [content]);

  const saveCanvas = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL();
    onChange(dataUrl);
    setUndoStack([...undoStack, dataUrl]);
    setRedoStack([]);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = size;
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    saveCanvas();
  };

  const undo = () => {
    if (undoStack.length === 0) return;
    const previousState = undoStack[undoStack.length - 2];
    const currentState = undoStack[undoStack.length - 1];
    
    if (previousState) {
      const img = new Image();
      img.onload = () => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = previousState;
      onChange(previousState);
      setUndoStack(undoStack.slice(0, -1));
      setRedoStack([...redoStack, currentState]);
    }
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const nextState = redoStack[redoStack.length - 1];
    
    const img = new Image();
    img.onload = () => {
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = nextState;
    onChange(nextState);
    setRedoStack(redoStack.slice(0, -1));
    setUndoStack([...undoStack, nextState]);
  };

  return (
    <div className={styles.drawingCanvas}>
      <div className={styles.toolbar}>
        <button
          className={`${styles.toolButton} ${tool === 'pencil' ? styles.active : ''}`}
          onClick={() => setTool('pencil')}
          title="Pencil"
        >
          ✏️
        </button>
        <button
          className={`${styles.toolButton} ${tool === 'eraser' ? styles.active : ''}`}
          onClick={() => setTool('eraser')}
          title="Eraser"
        >
          🧹
        </button>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          title="Color"
        />
        <input
          type="range"
          min="1"
          max="20"
          value={size}
          onChange={(e) => setSize(parseInt(e.target.value))}
          title="Size"
        />
        <button
          onClick={undo}
          disabled={undoStack.length <= 1}
          title="Undo"
        >
          ↩️
        </button>
        <button
          onClick={redo}
          disabled={redoStack.length === 0}
          title="Redo"
        >
          ↪️
        </button>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        className={styles.canvas}
      />
    </div>
  );
} 