"use client";

// Template for creating a new prototype
// To use this template:
// 1. Create a new folder in app/prototypes with your prototype name
// 2. Copy this file and styles.module.css into your new folder
// 3. Create an 'images' folder for your prototype's images
// 4. Rename and customize the component and styles as needed

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import styles from './styles.module.css';

// Piano key mapping to frequencies and colors
const NOTES: Record<string, { frequency: number; color: string }> = {
  'a': { frequency: 261.63, color: '#ff0000' }, // C4 - Red
  'w': { frequency: 277.18, color: '#ff4500' }, // C#4 - Orange-Red
  's': { frequency: 293.66, color: '#ff8000' }, // D4 - Orange
  'e': { frequency: 311.13, color: '#ffd700' }, // D#4 - Gold
  'd': { frequency: 329.63, color: '#ffff00' }, // E4 - Yellow
  'f': { frequency: 349.23, color: '#00ff00' }, // F4 - Green
  't': { frequency: 369.99, color: '#00ffff' }, // F#4 - Cyan
  'g': { frequency: 392.00, color: '#0000ff' }, // G4 - Blue
  'y': { frequency: 415.30, color: '#4b0082' }, // G#4 - Indigo
  'h': { frequency: 440.00, color: '#8000ff' }, // A4 - Purple
  'u': { frequency: 466.16, color: '#ff00ff' }, // A#4 - Magenta
  'j': { frequency: 493.88, color: '#ff0080' }, // B4 - Pink
  'k': { frequency: 523.25, color: '#ff69b4' }, // C5 - Hot Pink
};

export default function RainbowPiano() {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [oscillators, setOscillators] = useState<Record<string, OscillatorNode>>({});
  const [volume, setVolume] = useState(0.5);
  const [waveform, setWaveform] = useState<OscillatorType>('sine');
  const [activeKeys, setActiveKeys] = useState<string[]>([]);

  useEffect(() => {
    setAudioContext(new AudioContext());
    
    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, []);

  const playNote = useCallback((key: string) => {
    if (!audioContext || !NOTES[key]) return null;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = waveform;
    oscillator.frequency.setValueAtTime(NOTES[key].frequency, audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    return { oscillator, gainNode };
  }, [audioContext, volume, waveform]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    if (NOTES[key] && !oscillators[key]) {
      const result = playNote(key);
      if (result) {
        setOscillators(prev => ({ ...prev, [key]: result.oscillator }));
        setActiveKeys(prev => [...prev, key]);
      }
    }
  }, [oscillators, playNote]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    if (oscillators[key]) {
      oscillators[key].stop();
      setOscillators(prev => {
        const newOscillators = { ...prev };
        delete newOscillators[key];
        return newOscillators;
      });
      setActiveKeys(prev => prev.filter(k => k !== key));
    }
  }, [oscillators]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const renderPianoKeys = () => {
    const whiteKeys = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k'];
    const blackKeys = ['w', 'e', 't', 'y', 'u'];
    const blackKeyPositions = [35, 95, 215, 275, 335]; // pixels from left

    return (
      <div className={styles.piano}>
        {whiteKeys.map((key) => (
          <div
            key={key}
            className={styles.whiteKey}
            style={{
              background: activeKeys.includes(key) 
                ? `linear-gradient(180deg, ${NOTES[key].color}80 0%, #fff 100%)`
                : undefined
            }}
            onMouseDown={() => {
              if (!oscillators[key]) {
                const result = playNote(key);
                if (result) {
                  setOscillators(prev => ({ ...prev, [key]: result.oscillator }));
                  setActiveKeys(prev => [...prev, key]);
                }
              }
            }}
            onMouseUp={() => {
              if (oscillators[key]) {
                oscillators[key].stop();
                setOscillators(prev => {
                  const newOscillators = { ...prev };
                  delete newOscillators[key];
                  return newOscillators;
                });
                setActiveKeys(prev => prev.filter(k => k !== key));
              }
            }}
            onMouseLeave={() => {
              if (oscillators[key]) {
                oscillators[key].stop();
                setOscillators(prev => {
                  const newOscillators = { ...prev };
                  delete newOscillators[key];
                  return newOscillators;
                });
                setActiveKeys(prev => prev.filter(k => k !== key));
              }
            }}
          />
        ))}
        {blackKeys.map((key, index) => (
          <div
            key={key}
            className={styles.blackKey}
            style={{
              left: blackKeyPositions[index],
              background: activeKeys.includes(key)
                ? `linear-gradient(180deg, ${NOTES[key].color} 0%, #000 100%)`
                : undefined
            }}
            onMouseDown={() => {
              if (!oscillators[key]) {
                const result = playNote(key);
                if (result) {
                  setOscillators(prev => ({ ...prev, [key]: result.oscillator }));
                  setActiveKeys(prev => [...prev, key]);
                }
              }
            }}
            onMouseUp={() => {
              if (oscillators[key]) {
                oscillators[key].stop();
                setOscillators(prev => {
                  const newOscillators = { ...prev };
                  delete newOscillators[key];
                  return newOscillators;
                });
                setActiveKeys(prev => prev.filter(k => k !== key));
              }
            }}
            onMouseLeave={() => {
              if (oscillators[key]) {
                oscillators[key].stop();
                setOscillators(prev => {
                  const newOscillators = { ...prev };
                  delete newOscillators[key];
                  return newOscillators;
                });
                setActiveKeys(prev => prev.filter(k => k !== key));
              }
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={`${styles.title} ${styles.rainbowText}`}>Rainbow Piano</h1>
      <div className={styles.controls}>
        <div className={styles.volumeControl}>
          <label htmlFor="volume">Volume:</label>
          <input
            type="range"
            id="volume"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="waveform" style={{ color: 'white', marginRight: '0.5rem' }}>
            Waveform:
          </label>
          <select
            id="waveform"
            value={waveform}
            onChange={(e) => setWaveform(e.target.value as OscillatorType)}
            className={styles.button}
          >
            <option value="sine">Sine</option>
            <option value="square">Square</option>
            <option value="sawtooth">Sawtooth</option>
            <option value="triangle">Triangle</option>
          </select>
        </div>
      </div>
      {renderPianoKeys()}
      <p style={{ 
        textAlign: 'center', 
        marginTop: '1rem',
        color: 'white',
        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)'
      }}>
        Play with your keyboard (A-K and W,E,T,Y,U) or click the keys!
      </p>
    </div>
  );
} 