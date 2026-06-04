import React from 'react';

export default function CowIcon({ size = 24, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`cow-icon-svg ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      {/* Shoxlar (Horns) */}
      <path d="M5 8C5 4 8 3 10 6" />
      <path d="M19 8C19 4 16 3 14 6" />
      
      {/* Quloqlar (Ears) */}
      <path d="M3 10C1.5 10 1.5 13 4 12" />
      <path d="M21 10C22.5 10 22.5 13 20 12" />
      
      {/* Bosh tuzilishi (Head Outline) */}
      <path d="M6 10C6 7 18 7 18 10C18 14 16 17 15 19C14 21 10 21 9 19C8 17 6 14 6 10Z" />
      
      {/* Burun qismi (Snout/Nose) */}
      <path d="M8 17C8 15.5 16 15.5 16 17C16 19 8 19 8 17Z" />
      
      {/* Burun teshiklari (Nostrils) */}
      <circle cx="10.5" cy="17.2" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="13.5" cy="17.2" r="0.8" fill="currentColor" stroke="none" />
      
      {/* Ko'zlar (Eyes) */}
      <circle cx="9.5" cy="11.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="11.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
