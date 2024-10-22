import React from 'react';
import './Card.css';

export const Card = ({ 
  children, 
  variant = 'default',
  elevation = 1,
  className = '',
  onClick
}) => {
  const classes = [
    'card',
    `card--${variant}`,
    `card--elevation-${elevation}`,
    className,
    onClick ? 'card--clickable' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
};
