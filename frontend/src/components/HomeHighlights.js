import React from 'react';
import { apiUrl } from '../api';

function HomeHighlights({ personal, education, toolbox, resume }) {
  const skills = (toolbox || []).slice(0, 7).map((tool) => tool.name).filter(Boolean);
  const degree = (education || []).find((item) => item.institution === 'Chandigarh University') || (education || [])[0];

  return (
    <>
      <section className="home-section resume-preview" id="resume-preview">
        <div className="resume-panel">
          <div className="resume-panel-heading">
            <div>
              <p className="eyebrow">CV &amp; Resume</p>
              <h2>Full Professional Resume</h2>
              <p>A complete overview of my background, technical expertise, education, and professional milestones.</p>
            </div>
            <a className="button button-primary" href={apiUrl(resume || '/resume.pdf')} download="Dip_Biswas_Resume.pdf">
              <span aria-hidden="true">↓</span> Download PDF
            </a>
          </div>
          <div className="resume-card">
            <div className="resume-card-top">
              <div><strong>{personal?.name || 'DIP BISWAS'}</strong><span>{personal?.location || 'Rajbari, Bangladesh'} · {degree?.institution || 'Chandigarh University'}</span></div>
              <span className="verified-badge"><i /> Verified CV</span>
            </div>
            <div className="resume-card-details">
              <div>
                <h3>Education</h3>
                <strong>{degree?.institution || 'Chandigarh University'}</strong>
                <span>{degree?.degree || 'Bachelor of Engineering in Information Technology'}{degree?.period ? ` (${degree.period})` : ''}</span>
              </div>
              <div>
                <h3>Core skills</h3>
                <span>{skills.length ? skills.join(', ') : 'Full Stack Development, UI/UX Design, React, Node.js, MongoDB'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomeHighlights;
