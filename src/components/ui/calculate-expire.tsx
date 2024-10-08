import React from 'react';
import { useEffect, useState } from 'react';

interface CountdownTimerProps {
    expiryTime: number;
  }

const calculateTimeRemaining = (expiryTime: number): number => {
  const now = Date.now();
  const timeRemaining = expiryTime - now;
  return timeRemaining > 0 ? timeRemaining : 0;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ expiryTime }) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(calculateTimeRemaining(expiryTime));

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = calculateTimeRemaining(expiryTime);
      if (remaining <= 0) {
        clearInterval(interval);
      }
      setTimeRemaining(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiryTime]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  return (
    <div className="countdown">
      Time remaining: {formatTime(timeRemaining)}
    </div>
  );
}

export default CountdownTimer;
