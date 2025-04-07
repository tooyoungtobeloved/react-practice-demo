import { useState } from 'react';
import './style.css';

export default function StarRating({
  maxStars = 5,
  initialFilled = 0,
  onChange
}) {
  const [filledStars, setFilledStars] = useState(initialFilled);
  const [hoverStars, setHoverStars] = useState(0);

  const handleClick = (index) => {
    setFilledStars(index + 1);
    onChange?.(index + 1);
  };

  const handleMouseEnter = (index) => {
    setHoverStars(index + 1);
  };

  const handleMouseLeave = () => {
    setHoverStars(0);
  };

  const getActiveState = (index) => {
    if (hoverStars > 0) return index < hoverStars;
    return index < filledStars;
  };

  return (
    <div 
      className="star-rating-container"
      onMouseLeave={handleMouseLeave}
    >
      {Array.from({ length: maxStars }).map((_, index) => (
        <span
          key={index}
          className="star-wrapper"
          onClick={() => handleClick(index)}
          onMouseEnter={() => handleMouseEnter(index)}
        >
          <Star className={getActiveState(index) ? 'star-icon-filled' : ''} />
        </span>
      ))}
    </div>
  );
}

function Star({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`star-icon ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </svg>
  );
}