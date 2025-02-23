"use client";

import styles from '../styles.module.css';

interface ToolbarProps {
  onNewText: () => void;
  onNewDrawing: () => void;
  snapToGrid: boolean;
  onToggleSnapToGrid: () => void;
}

export default function Toolbar({
  onNewText,
  onNewDrawing,
  snapToGrid,
  onToggleSnapToGrid
}: ToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <button
        className={styles.toolbarButton}
        onClick={onNewText}
      >
        New Note
      </button>
      <button
        className={styles.toolbarButton}
        onClick={onNewDrawing}
      >
        New Drawing
      </button>
      <button
        className={`${styles.toolbarButton} ${snapToGrid ? styles.active : ''}`}
        onClick={onToggleSnapToGrid}
      >
        {snapToGrid ? 'Grid: On' : 'Grid: Off'}
      </button>
    </div>
  );
} 