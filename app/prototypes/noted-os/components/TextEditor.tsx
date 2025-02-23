"use client";

import { useEffect, useRef, useCallback } from 'react';
import styles from '../styles.module.css';

interface TextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function TextEditor({ content, onChange }: TextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  // Handle initial content and updates from parent
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (editorRef.current && content) {
        editorRef.current.innerHTML = content;
      }
    }
  }, [content]);

  // Maintain cursor position when applying formatting
  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection?.rangeCount) {
      return selection.getRangeAt(0);
    }
    return null;
  };

  const restoreSelection = (range: Range | null) => {
    if (range) {
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  };

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      onChange(newContent);
    }
  }, [onChange]);

  const execCommand = useCallback((command: string, value: string | undefined = undefined) => {
    const range = saveSelection();
    document.execCommand(command, false, value || '');
    restoreSelection(range);
    handleInput();
  }, [handleInput]);

  // Prevent unwanted formatting on paste
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  }, []);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertText', false, '    ');
    }
  }, []);

  return (
    <div className={styles.textEditor}>
      <div className={styles.toolbar}>
        <button onClick={() => execCommand('bold')} title="Bold">
          <strong>B</strong>
        </button>
        <button onClick={() => execCommand('italic')} title="Italic">
          <em>I</em>
        </button>
        <button onClick={() => execCommand('underline')} title="Underline">
          <u>U</u>
        </button>
        <button onClick={() => execCommand('strikeThrough')} title="Strike">
          <s>S</s>
        </button>
        <span className={styles.separator} />
        <button onClick={() => execCommand('insertUnorderedList')} title="Bullet List">
          • List
        </button>
        <button onClick={() => execCommand('insertOrderedList')} title="Numbered List">
          1. List
        </button>
        <span className={styles.separator} />
        <select 
          onChange={(e) => execCommand('formatBlock', e.target.value)}
          title="Text Style"
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>
      </div>
      <div
        ref={editorRef}
        className={styles.editorContent}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        suppressContentEditableWarning
        spellCheck
      />
    </div>
  );
} 