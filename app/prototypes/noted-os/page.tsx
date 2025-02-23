"use client";

import { useState, useEffect } from 'react';
import styles from './styles.module.css';
import Window from './components/Window';
import TextEditor from './components/TextEditor';
import DrawingCanvas from './components/DrawingCanvas';
import Toolbar from './components/Toolbar';

interface WindowData {
  id: number;
  type: 'text' | 'drawing';
  title: string;
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
  zIndex: number;
}

export default function NotedOS() {
  const [windows, setWindows] = useState<WindowData[]>([]);
  const [activeWindow, setActiveWindow] = useState<number | null>(null);
  const [snapToGrid, setSnapToGrid] = useState(false);

  useEffect(() => {
    // Load saved windows from localStorage
    const savedWindows = localStorage.getItem('notedos-windows');
    if (savedWindows) {
      setWindows(JSON.parse(savedWindows));
    }
  }, []);

  useEffect(() => {
    // Save windows to localStorage whenever they change
    if (windows.length > 0) {
      localStorage.setItem('notedos-windows', JSON.stringify(windows));
    }
  }, [windows]);

  const createNewWindow = (type: 'text' | 'drawing' = 'text') => {
    const newWindow: WindowData = {
      id: Date.now(),
      type,
      title: type === 'text' ? 'New Note' : 'New Drawing',
      content: '',
      position: { x: 50 + (windows.length * 30), y: 50 + (windows.length * 30) },
      size: { width: 400, height: 300 },
      isMinimized: false,
      zIndex: windows.length + 1
    };
    setWindows([...windows, newWindow]);
    setActiveWindow(newWindow.id);
  };

  const updateWindow = (id: number, updates: Partial<WindowData>) => {
    setWindows(windows.map(window => 
      window.id === id ? { ...window, ...updates } : window
    ));
  };

  const closeWindow = (id: number) => {
    setWindows(windows.filter(window => window.id !== id));
    if (activeWindow === id) {
      setActiveWindow(null);
    }
  };

  return (
    <div className={styles.container}>
      <Toolbar 
        onNewText={() => createNewWindow('text')}
        onNewDrawing={() => createNewWindow('drawing')}
        snapToGrid={snapToGrid}
        onToggleSnapToGrid={() => setSnapToGrid(!snapToGrid)}
      />
      
      <main className={styles.desktop}>
        {windows.map((window) => (
          <Window
            key={window.id}
            {...window}
            isActive={activeWindow === window.id}
            onActivate={() => setActiveWindow(window.id)}
            onClose={() => closeWindow(window.id)}
            onUpdate={(updates: Partial<WindowData>) => updateWindow(window.id, updates)}
            snapToGrid={snapToGrid}
          >
            {window.type === 'text' ? (
              <TextEditor
                content={window.content}
                onChange={(content: string) => updateWindow(window.id, { content })}
              />
            ) : (
              <DrawingCanvas
                content={window.content}
                onChange={(content: string) => updateWindow(window.id, { content })}
              />
            )}
          </Window>
        ))}
      </main>
    </div>
  );
} 