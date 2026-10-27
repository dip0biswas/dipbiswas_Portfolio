import React from 'react';

function ExperienceIcon({ position = '' }) {
  const role = position.toLowerCase();

  if (role.includes('design')) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="m4 20 4.2-1 10.9-10.9a2.1 2.1 0 0 0-3-3L5.2 16 4 20Zm10.8-13 3 3M4 5l15 15M5 12l7 7" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="m8 5-6 7 6 7M16 5l6 7-6 7M14 3l-4 18" />
    </svg>
  );
}

function Experience({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <section id="experience" className="experience-section">
      <h2 className="experience-heading">Experience</h2>

      <div className="experience-timeline">
        {data.map((experience) => {
          const descriptions = Array.isArray(experience.description)
            ? experience.description
            : experience.description
              ? [experience.description]
              : [];

          return (
            <article className="experience-entry" key={experience.id || `${experience.company}-${experience.position}`}>
              <span className="experience-timeline-dot" aria-hidden="true" />
              <span className="experience-role-icon">
                <ExperienceIcon position={experience.position} />
              </span>
              <div className="experience-card">
                <h3>{experience.position}</h3>
                <p className="experience-company">{experience.company}</p>
                <p className="experience-period">{experience.period}</p>
                {descriptions.length > 0 && (
                  <ul>
                    {descriptions.map((description, index) => (
                      <li key={`${experience.id || experience.company}-${index}`}>{description}</li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default Experience;
