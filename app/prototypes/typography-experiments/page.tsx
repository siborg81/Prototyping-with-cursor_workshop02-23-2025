"use client";

import { useState } from 'react';
import { Nabla, Pixelify_Sans } from 'next/font/google';
import styles from './styles.module.css';

const nabla = Nabla({ 
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

const pixelify = Pixelify_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

export default function TypographyExperiments() {
  const [text, setText] = useState("Type something amazing...");

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <input 
          type="text" 
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={styles.input}
          placeholder="Type something..."
        />
        
        <div className={styles.typographyContainer}>
          {/* Polymode Variable Font Demo */}
          <div className={styles.polymodeText}>
            {text}
          </div>

          {/* Polymode Blend Effect */}
          <div className={styles.polymodeBlend} data-text={text}>
            {text}
          </div>

          {/* 3D Skewed Text */}
          <div className={styles.skewedText}>
            {text}
          </div>

          {/* Circular Text */}
          <div className={styles.circularText}>
            <div className={styles.circleWrapper}>
              {text.split('').map((char, i) => (
                <span
                  key={i}
                  style={{
                    transform: `rotate(${i * (360 / text.length)}deg)`
                  }}
                >
                  {char}
                </span>
              ))}
            </div>
          </div>

          {/* Wavy Text */}
          <div className={styles.wavyText}>
            {text.split('').map((char, i) => (
              <span key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                {char}
              </span>
            ))}
          </div>

          {/* Variable Font Demo */}
          <div className={styles.variableText}>
            {text}
          </div>

          {/* Nabla Font - Color Font */}
          <div className={`${styles.nablaText} ${nabla.className}`}>
            {text}
          </div>

          {/* Pixelated Text */}
          <div className={`${styles.pixelText} ${pixelify.className}`}>
            {text}
          </div>

          {/* Gradient Text */}
          <div className={styles.gradientText}>
            {text}
          </div>
        </div>
      </main>
    </div>
  );
} 