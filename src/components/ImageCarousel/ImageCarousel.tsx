import "./style.css";
import { useState } from "react";

export default function ImageCarousel({
  images,
}: {
  images: { src: string; alt: string }[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return <div className="container">No images available</div>;
  }

  function goToPrevious() {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : images.length - 1
    );
  }

  function goToNext() {
    setCurrentIndex((prevIndex) =>
      prevIndex < images.length - 1 ? prevIndex + 1 : 0
    );
  }

  return (
    <div className="container">
      <span
        className="left"
        onClick={goToPrevious}
        role="button"
        aria-label="Previous image"
        tabIndex={0}
      >
        {"<"}
      </span>
      <span
        className="right"
        onClick={goToNext}
        role="button"
        aria-label="Next image"
        tabIndex={0}
      >
        {">"}
      </span>
      <img
        src={images[currentIndex].src}
        alt={images[currentIndex].alt}
        className="carousel-image"
      />
      <div className="dot">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dotItem ${currentIndex === index ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
            role="button"
            aria-label={`Go to image ${index + 1}`}
            tabIndex={0}
          />
        ))}
      </div>
    </div>
  );
}
