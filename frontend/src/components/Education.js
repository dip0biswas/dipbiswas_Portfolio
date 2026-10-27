import React from 'react';

function GraduationCap() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m2 9 10-5 10 5-10 5L2 9Z" />
      <path d="M6 11v5c3.5 2.7 8.5 2.7 12 0v-5M22 9v6" />
    </svg>
  );
}

function Education({ data }) {
  if (!data?.length) return null;

  return (
    <section id="education" className="education-section">
      <div className="education-shell">
        <h2 className="education-heading">Formation</h2>
        <div className="education-timeline">
          {data.map((edu) => {
            const image = edu.image || (
              edu.institution === 'Chandigarh University'
                ? '/chandigarh-university.png'
                : edu.institution === 'Kumarkhatri Govt. College, Kushia'
                  ? '/images.png'
                  : null
            );

            return (
              <article className="education-entry" key={edu.id || edu.institution}>
                <span className="education-timeline-dot" aria-hidden="true" />
                <div className="education-logo">
                  {image ? (
                    <img src={image} alt={`${edu.institution} logo`} />
                  ) : edu.icon ? (
                    <span aria-hidden="true">{edu.icon}</span>
                  ) : (
                    <GraduationCap />
                  )}
                </div>
                <div className="education-card">
                  <h3>{edu.degree || edu.institution}</h3>
                  {edu.degree && <p className="education-institution">{edu.institution}</p>}
                  <p className="education-period">
                    <GraduationCap />
                    <span>{[edu.period, edu.details].filter(Boolean).join(' · ')}</span>
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Education;
