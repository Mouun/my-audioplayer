export const style = `
  *,
  ::after,
  ::before {
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #d2d6dc;
  }

  [type="checkbox"] {
    box-sizing: border-box;
    padding: 0;
  }

  .container {
    display: flex;
    flex-direction: column
  }

  .player-progress-container {
    display: flex;
    flex-direction: row;
  }

  .player-progress-number-container {
    margin-left: 1rem;
    display: flex;
    flex-direction: row;
  }

  .progress-number-separator {
    margin: 0 0.25rem;
  }

  .player-control-buttons-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }

  .volume-knob-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }

  .control-button {
    padding: 0.5rem 0.75rem;
    color: #fff;
    background-color: #5850ec;
    border-width: 1px;
    border-color: transparent;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    line-height: 1rem;
    font-weight: 500;
    cursor: pointer;
    margin: 0 0.25rem;
    transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
    transition-timing-function:cubic-bezier(.4, 0, .2, 1)
    transition-duration: 150ms;
  }

  .control-button:hover {
    background-color: #667eea;
  }

  .control-button:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
    border-color: #4c51bf;
    box-shadow: 0 0 0 3px rgba(180, 198, 252, .45);
  }

  .loop-checkbox-container {
    display: flex;
    align-items: center;
  }

  .loop-checkbox {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    -webkit-print-color-adjust: exact;
    display: inline-block;
    vertical-align: middle;
    background-origin: border-box;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    flex-shrink: 0;
    height: 1rem;
    width: 1rem;
    background-color: #fff;
    border-color: #d2d6dc;
    border-width: 1px;
    border-radius: 0.25rem;
    color: #5850ec;
    transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
    transition-timing-function: cubic-bezier(.4, 0, .2, 1);
    transition-duration: 150ms;
  }

  .loop-checkbox:checked {
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
    border-color: transparent;
    background-color: currentColor;
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
  }

  .loop-checkbox:focus {
    outline: 0;
    box-shadow: 0 0 0 3px rgba(180, 198, 252, .45);
    border-color: #7f9cf5;
  }

  .loop-checkbox:checked:focus {
    border-color: transparent;
  }

  .loop-checkbox-label {
    margin-left: 0.5rem;
    display: block;
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: #161e2e;
  }

  .panner-container {
    text-align: center
  }

  .equalizer-container {
    text-align: center
  }

  .equalizer-label {
    display: inline-block;
    width: 5rem;
    text-align: end
  }

  .mb-4 {
    margin-bottom: 1rem;
  }

  .w-full {
    width: 100%;
  }

  progress {
    border: 1px solid #5a67d8;
  }
  
  progress::-webkit-progress-value {
    background: lightblue;
  }
  
  progress::-webkit-progress-value {
    background: #5a67d8;
  }
  
  progress::-webkit-progress-bar {
    background: #edf2f7;
  }
`;
