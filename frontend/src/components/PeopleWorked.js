import React, { useState } from 'react';

function QuoteMark() {
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true">
      <path d="M15 8h-4.5A5.5 5.5 0 0 0 5 13.5v4A4.5 4.5 0 0 0 9.5 22H16V13a5 5 0 0 0-5-5Zm14 0h-4.5a5.5 5.5 0 0 0-5.5 5.5v4a4.5 4.5 0 0 0 4.5 4.5H30V13a5 5 0 0 0-5-5Z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="m10 1.5 2.6 5.3 5.9.9-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.9L10 1.5Z" />
    </svg>
  );
}

function PeopleWorked({ data }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!data?.length) return null;

  const currentPerson = data[currentIndex % data.length];
  const move = (direction) => {
    setCurrentIndex((index) => (index + direction + data.length) % data.length);
  };
  return (
    <section id="people-worked" className="people-worked-section">
      <div className="people-worked-shell">
        <div className="testimonial-carousel">
          {data.length > 1 && (
            <button
              className="testimonial-arrow testimonial-arrow-prev"
              type="button"
              onClick={() => move(-1)}
              aria-label="Previous testimonial"
            >
              <span aria-hidden="true">←</span>
            </button>
          )}

          <article className="testimonial-feature">
            <QuoteMark />
            <div className="testimonial-stars" aria-label="5 out of 5 stars">
              {Array.from({ length: 5 }, (_, index) => <StarIcon key={index} />)}
            </div>
            <blockquote>&ldquo;{currentPerson.testimonial}&rdquo;</blockquote>
            <h2>{currentPerson.name}</h2>
            <p className="testimonial-role">{currentPerson.role}</p>
            <p className="testimonial-count" aria-live="polite">
              {String((currentIndex % data.length) + 1).padStart(2, '0')}
              <span>/</span>
              {String(data.length).padStart(2, '0')}
            </p>
          </article>

          {data.length > 1 && (
            <button
              className="testimonial-arrow testimonial-arrow-next"
              type="button"
              onClick={() => move(1)}
              aria-label="Next testimonial"
            >
              <span aria-hidden="true">→</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default PeopleWorked;
