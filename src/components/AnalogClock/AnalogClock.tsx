import React, { useState, useEffect } from 'react';
import './style.css';

export default function AnalogClock() {
  const [time, setTime] = useState(new Date());

  // 每秒更新一次时间
  useEffect(() => {
    const ticker = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(ticker);
  }, []);

  // 分别计算时针、分针、秒针旋转的角度
  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const secondAngle = seconds * 6; // 360°/60 = 6° 每秒
  const minuteAngle = minutes * 6 + seconds * 0.1; // 分针：6°/分钟 + 0.1°/秒
  const hourAngle = hours * 30 + minutes * 0.5;    // 时针：30°/小时 + 0.5°/分钟

  return (
    <div className="analog-clock">
      <div className="clock-face">
        {/* 表盘内侧白色圆 */}
        <div className="mark"></div>
        

        {/* 小时刻度 12 个 */}
        {Array.from({ length: 12 }).map((_, i) => {
          return (
            <div className={`markers hour-markers translate-${i}`} key={`h-${i}`}>
            </div>
          );
        })}
        {/* 分针刻度 60 个 */}
        {Array.from({ length: 60 }).map((_, i) => {
          return (
            <div className="markers minute-markers" key={`m-${i}`}>
            </div>
          );
        })}

        {/* 指针 */}
        <div
          className="hand hour-hand"
          style={{ transform: `translateX(-50%) rotate(${hourAngle}deg)` }}
        ></div>
        <div
          className="hand minute-hand"
          style={{ transform: `translateX(-50%) rotate(${minuteAngle}deg)` }}
        ></div>
        <div
          className="hand second-hand"
          style={{ transform: `translateX(-50%) rotate(${secondAngle}deg)` }}
        ></div>
      </div>
    </div>
  );
}