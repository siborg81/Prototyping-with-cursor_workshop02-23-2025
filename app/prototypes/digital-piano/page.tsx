"use client";

// Template for creating a new prototype
// To use this template:
// 1. Create a new folder in app/prototypes with your prototype name
// 2. Copy this file and styles.module.css into your new folder
// 3. Create an 'images' folder for your prototype's images
// 4. Rename and customize the component and styles as needed

import Link from 'next/link';
import styles from './styles.module.css';
import { useEffect, useState, useCallback } from 'react';

// Piano key mapping to frequencies
const NOTES: Record<string, number> = {
  'a': 261.63, // C4
  'w': 277.18, // C#4
  's': 293.66, // D4
  'e': 311.13, // D#4
  'd': 329.63, // E4
  'f': 349.23, // F4
  't': 369.99, // F#4
  'g': 392.00, // G4
  'y': 415.30, // G#4
  'h': 440.00, // A4
  'u': 466.16, // A#4
  'j': 493.88, // B4
  'k': 523.25, // C5
};

export default function DigitalPiano() {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [oscillators, setOscillators] = useState<Record<string, OscillatorNode>>({});
  const [volume, setVolume] = useState(0.5);
  const [waveform, setWaveform] = useState<OscillatorType>('sine');

  useEffect(() => {
    setAudioContext(new AudioContext());
    
    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, []);

  const playNote = useCallback((frequency: number) => {
    if (!audioContext) return null;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = waveform;
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    return { oscillator, gainNode };
  }, [audioContext, volume, waveform]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    if (NOTES[key] && !oscillators[key]) {
      const result = playNote(NOTES[key]);
      if (result) {
        setOscillators(prev => ({ ...prev, [key]: result.oscillator }));
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
    const blackKeyPositions = [25, 75, 175, 225, 275]; // pixels from left

    return (
      <div className={styles.piano}>
        {whiteKeys.map((key) => (
          <div
            key={key}
            className={styles.whiteKey}
            onMouseDown={() => {
              if (!oscillators[key]) {
                const result = playNote(NOTES[key]);
                if (result) {
                  setOscillators(prev => ({ ...prev, [key]: result.oscillator }));
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
              }
            }}
          />
        ))}
        {blackKeys.map((key, index) => (
          <div
            key={key}
            className={styles.blackKey}
            style={{ left: blackKeyPositions[index] }}
            onMouseDown={() => {
              if (!oscillators[key]) {
                const result = playNote(NOTES[key]);
                if (result) {
                  setOscillators(prev => ({ ...prev, [key]: result.oscillator }));
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
              }
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Digital Piano</h1>
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
          <label htmlFor="waveform">Waveform:</label>
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
      <p style={{ textAlign: 'center', marginTop: '1rem', color: '#ff6666' }}>
        Use your keyboard (A-K and W,E,T,Y,U) to play notes!
      </p>
    </div>
  );
} 