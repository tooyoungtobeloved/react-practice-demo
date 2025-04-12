import { useState, useRef, useEffect } from "react";

export default function Stopwatch() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0); // 实际经过的毫秒数
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  useEffect(() => {
    if (running) {
      startTimeRef.current = Date.now() - elapsed;
      intervalRef.current = window.setInterval(() => {
        setElapsed(Date.now() - startTimeRef.current);
      }, 10);
    } else {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running]);
//   requestAnimationFrame(() => {})

  const seconds = Math.floor(elapsed / 1000);
  const milliseconds = elapsed % 1000;
  return (
    <div>
      <p>
        {seconds}s {Math.floor(milliseconds / 10)}ms
      </p>
      <div>
        <button onClick={() => setRunning((prev) => !prev)}>
          {running ? "Pause" : "Start"}
        </button>{" "}
        <button
          onClick={() => {
            setRunning(false);
            setElapsed(0);
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
