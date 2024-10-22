import React from 'react';
import './Loading.css';

export const Loading = ({ size = 'medium', color = 'primary', fullScreen = false }) => {
  const classes = [
    'loading',
    `loading--${size}`,
    `loading--${color}`,
    fullScreen && 'loading--fullscreen'
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <div className="loading__spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};
