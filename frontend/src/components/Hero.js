import React from 'react';
import { Link } from 'react-router-dom';

function Hero({ data }) {
  if (!data) return null;

  return (
    <section id="hero" className="hero-section">
      <div className="hero-layout">
        <div className="hero-copy">
          <p className="availability"><span /> Available for opportunities</p>
          <h1>Hi, I'm {data.name || 'Dip Biswas'}</h1>
          <p className="hero-role">{data.role || 'Engineer & Full Stack Developer'}</p>
          <p className="hero-description">
            {data.about || data.title || 'I build thoughtful digital experiences with a focus on smart solutions, clean interfaces, and meaningful technology.'}
          </p>

          <div className="hero-actions">
            <Link to="/projects" className="button button-primary">View My Work <span aria-hidden="true">→</span></Link>
            <a href={data.resume || '/resume.pdf'} download className="button button-secondary">
              <span aria-hidden="true">↓</span> Download Resume
            </a>
          </div>

          <div className="hero-stats" aria-label="Professional highlights">
            <div><strong>4+</strong><span>Years Experience</span></div>
            <div><strong>15+</strong><span>Projects Built</span></div>
            <div><strong>7.35</strong><span>CGPA (IT)</span></div>
          </div>
        </div>

        <div className="hero-portrait">
          <img src="/profile.jpeg" alt={`${data.name || 'Dip Biswas'} portrait`} />
          <div className="portrait-caption">
            <div>
              <span>Based in</span>
              <strong>{data.location || 'Raipur, India'}</strong>
            </div>
            <span className="hire-status"><i /> Ready to hire</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
