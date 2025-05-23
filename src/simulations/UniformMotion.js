import React, { useState, useEffect, useRef } from 'react';

// Basic styling for the component, can be moved to a CSS file later
const styles = {
  container: {
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    marginTop: '20px',
  },
  controls: {
    marginBottom: '20px',
  },
  inputGroup: {
    marginRight: '10px',
    marginBottom: '10px',
  },
  canvas: {
    border: '1px solid black',
    marginTop: '10px',
    width: '100%', // Make canvas responsive
    height: '100px', // Fixed height for now
  },
  button: {
    margin: '5px',
    padding: '8px 15px',
    cursor: 'pointer',
  },
  numericDisplay: {
    marginTop: '10px',
  }
};

const UniformMotion = ({ messages }) => {
  const [initialPosition, setInitialPosition] = useState(0);
  const [velocity, setVelocity] = useState(5);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);

  const canvasRef = useRef(null);
  const requestRef = useRef();
  const prevTimeRef = useRef();

  // Simulation loop
  useEffect(() => {
    if (isRunning) {
      const animate = (currentTime) => {
        if (prevTimeRef.current != null) {
          const deltaTime = (currentTime - prevTimeRef.current) / 1000; // time in seconds
          setTime(prevTime => prevTime + deltaTime);
        }
        prevTimeRef.current = currentTime;
        requestRef.current = requestAnimationFrame(animate);
      };
      prevTimeRef.current = performance.now(); // Reset prevTime on start
      requestRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(requestRef.current);
      prevTimeRef.current = null; // Clear prevTime when paused or reset
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isRunning]);

  // Update currentPosition whenever initialPosition, velocity, or time changes
  useEffect(() => {
    setCurrentPosition(parseFloat(initialPosition) + parseFloat(velocity) * time);
  }, [initialPosition, velocity, time]);

  // Drawing on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw horizontal line
    ctx.beginPath();
    ctx.moveTo(0, canvasHeight / 2);
    ctx.lineTo(canvasWidth, canvasHeight / 2);
    ctx.stroke();

    // Draw object (simple square)
    // Scale position: assuming canvas represents a range, e.g., -50 to +150
    const displayRangeMin = -50;
    const displayRangeMax = 150;
    const normalizedPosition = (currentPosition - displayRangeMin) / (displayRangeMax - displayRangeMin);
    const objectX = normalizedPosition * canvasWidth;
    const objectSize = 10;

    ctx.fillStyle = 'blue';
    ctx.fillRect(objectX - objectSize / 2, canvasHeight / 2 - objectSize / 2, objectSize, objectSize);

  }, [currentPosition, initialPosition]); // Redraw when currentPosition or initialPosition changes for scale reference

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    // setCurrentPosition will be updated by the useEffect due to time and initialPosition change
    // No need to set prevTimeRef.current here, it's handled by the isRunning effect
  };
  
  // Debounce for input changes
  const debounce = (func, delay) => {
    let timeout;
    return function(...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), delay);
    };
  };

  const handleInitialPositionChange = debounce((value) => setInitialPosition(Number(value)), 300);
  const handleVelocityChange = debounce((value) => setVelocity(Number(value)), 300);


  return (
    <div style={styles.container}>
      <h2>{messages.uniformMotionTitle}</h2>
      <div style={styles.controls}>
        <span style={styles.inputGroup}>
          <label>{messages.initialPosition} (x₀): </label>
          <input
            type="number"
            defaultValue={initialPosition}
            onChange={(e) => handleInitialPositionChange(e.target.value)}
          />
        </span>
        <span style={styles.inputGroup}>
          <label>{messages.velocity} (V): </label>
          <input
            type="number"
            defaultValue={velocity}
            onChange={(e) => handleVelocityChange(e.target.value)}
          />
        </span>
      </div>
      <div>
        <button onClick={handleStart} style={styles.button} disabled={isRunning}>{messages.start}</button>
        <button onClick={handlePause} style={styles.button} disabled={!isRunning}>{messages.pause}</button>
        <button onClick={handleReset} style={styles.button}>{messages.reset}</button>
      </div>
      <canvas ref={canvasRef} style={styles.canvas} width="600" height="100"></canvas>
      <div style={styles.numericDisplay}>
        <p>Time (t): {time.toFixed(2)} s</p>
        <p>Current Position (X): {currentPosition.toFixed(2)} m</p>
      </div>
      {/* Placeholder for graphs */}
      <div style={{marginTop: '20px', border: '1px dashed #999', padding: '10px'}}>
        Graph Placeholder: Position vs. Time and Velocity vs. Time
      </div>
    </div>
  );
};

export default UniformMotion;
