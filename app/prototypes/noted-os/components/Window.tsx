"use client";

import { useState, useRef, useEffect } from 'react';
import styles from '../styles.module.css';

interface WindowProps {
  id: number;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
  isActive: boolean;
  zIndex: number;
  children: React.ReactNode;
  onActivate: () => void;
  onClose: () => void;
  onUpdate: (updates: any) => void;
  snapToGrid: boolean;
}

export default function Window({
  id,
  title,
  position,
  size,
  isMinimized,
  isActive,
  zIndex,
  children,
  onActivate,
  onClose,
  onUpdate,
  snapToGrid
}: WindowProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      let newX = e.clientX - dragOffset.x;
      let newY = e.clientY - dragOffset.y;

      if (snapToGrid) {
        newX = Math.round(newX / 20) * 20;
        newY = Math.round(newY / 20) * 20;
      }

      onUpdate({ position: { x: newX, y: newY } });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, onUpdate, snapToGrid]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!windowRef.current) return;
    
    onActivate();
    const rect = windowRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
  };

  const handleMinimize = () => {
    onUpdate({ isMinimized: !isMinimized });
  };

  const handleMaximize = () => {
    if (!windowRef.current) return;
    
    const isMaximized = size.width === window.innerWidth && size.height === window.innerHeight;
    if (isMaximized) {
      onUpdate({ size: { width: 400, height: 300 } });
    } else {
      onUpdate({ size: { width: window.innerWidth, height: window.innerHeight } });
    }
  };

  if (isMinimized) {
    return null;
  }

  return (
    <div
      ref={windowRef}
      className={styles.window}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        width: size.width,
        height: size.height,
        zIndex,
        opacity: isDragging ? 0.8 : 1
      }}
      onClick={onActivate}
    >
      <div className={styles.windowHeader} onMouseDown={handleMouseDown}>
        <div className={styles.windowControls}>
          <button
            className={`${styles.windowControl} ${styles.closeButton}`}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          />
          <button
            className={`${styles.windowControl} ${styles.minimizeButton}`}
            onClick={(e) => {
              e.stopPropagation();
              handleMinimize();
            }}
          />
          <button
            className={`${styles.windowControl} ${styles.maximizeButton}`}
            onClick={(e) => {
              e.stopPropagation();
              handleMaximize();
            }}
          />
        </div>
        <div className={styles.windowTitle}>{title}</div>
      </div>
      <div className={styles.windowContent}>
        {children}
      </div>
    </div>
  );
} 