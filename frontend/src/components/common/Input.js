import React from 'react';
import './Input.css';

export const Input = ({
  type = 'text',
  label,
  error,
  helperText,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const classes = [
    'input-wrapper',
    fullWidth && 'input-wrapper--full-width',
    error && 'input-wrapper--error',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {label && (
        <label className="input__label">
          {label}
        </label>
      )}
      <input
        type={type}
        className="input"
        {...props}
      />
      {(error || helperText) && (
        <span className={`input__helper-text ${error ? 'input__helper-text--error' : ''}`}>
          {error || helperText}
        </span>
      )}
    </div>
  );
};
