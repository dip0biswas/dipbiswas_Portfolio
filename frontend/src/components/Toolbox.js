import React from 'react';

const skillGroups = [
  {
    title: 'Frontend Development',
    description: 'Interfaces & user experiences',
    icon: 'code',
    skills: ['React.js', 'Next.js', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'React Native', 'Expo', 'Tailwind CSS', 'Responsive Web Design', 'UI Development', 'REST API Integration']
  },
  {
    title: 'Backend & Databases',
    description: 'Server-side development & data',
    icon: 'server',
    skills: ['Node.js', 'Express.js', 'Java Servlets', 'JSP', 'Spring Boot', 'RESTful APIs', 'Authentication', 'Backend Integration', 'MongoDB', 'MongoDB Atlas', 'MySQL', 'PostgreSQL', 'Firebase', 'JDBC', 'Database Design', 'CRUD Operations']
  },
  {
    title: 'Programming Languages',
    description: 'Languages for building and problem-solving',
    icon: 'terminal',
    skills: ['Java', 'Python', 'C++', 'SQL', 'R', 'MATLAB']
  },
  {
    title: 'UI/UX & Creative Design',
    description: 'Design, visuals & creative work',
    icon: 'design',
    skills: ['UI/UX Design', 'User-Centered Design', 'Wireframing', 'Prototyping', 'Responsive Interface Design', 'Website Layout Design', 'Graphic Design', 'Adobe Photoshop', 'Adobe Illustrator', 'Poster Design', 'Brand Identity Design', 'Social Media Creatives', 'Photography', 'Video Editing']
  }
];

function CategoryIcon({ type }) {
  if (type === 'server') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="4" width="16" height="6" rx="1.5" />
        <rect x="4" y="14" width="16" height="6" rx="1.5" />
        <path d="M8 7h.01M8 17h.01M11 7h6M11 17h6" />
      </svg>
    );
  }

  if (type === 'terminal') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m8 7-5 5 5 5M13 17l3-10M19 8h2v8h-2" />
      </svg>
    );
  }

  if (type === 'design') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m14 4 6 6-9.5 9.5L4 21l1.5-6.5L14 4Z" />
        <path d="m12 6 6 6M4 21l5.5-1.5M15 3l2-2 6 6-2 2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m8 6-6 6 6 6M16 6l6 6-6 6M14 4l-4 16" />
    </svg>
  );
}

function SkillIcon({ index }) {
  const icons = [
    <><path d="M8 5 3 12l5 7M16 5l5 7-5 7" /></>,
    <><path d="M5 5h14v14H5zM9 9h6M9 12h6M9 15h3" /></>,
    <><circle cx="12" cy="12" r="8" /><path d="M8 12h8M12 8v8" /></>,
    <><path d="M4 7h16v10H4zM8 11h8M8 14h5" /></>
  ];

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {icons[index % icons.length]}
    </svg>
  );
}

function Toolbox() {
  return (
    <section id="toolbox" className="skills-section">
      <div className="skills-shell">
        <header className="skills-heading">
          <h2>Skills &amp; Technologies</h2>
          <p>The tools and technologies I use to turn ideas into digital experiences.</p>
        </header>

        <div className="skills-groups">
          {skillGroups.map((group) => (
            <section className="skills-category" key={group.title}>
              <div className="skills-category-heading">
                <span className="skills-category-icon"><CategoryIcon type={group.icon} /></span>
                <div>
                  <h3>{group.title}</h3>
                  <p>{group.description}</p>
                </div>
              </div>
              <ul className="skills-grid">
                {group.skills.map((skill, index) => (
                  <li className="skill-tile" key={skill}>
                    <SkillIcon index={index} />
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Toolbox;
