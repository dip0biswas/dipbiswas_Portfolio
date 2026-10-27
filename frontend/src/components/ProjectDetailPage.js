import React from 'react';
import { Link, useParams } from 'react-router-dom';

function Stat({ icon, label, value }) {
  return (
    <div className="project-stat">
      <span className="project-stat-icon" aria-hidden="true">{icon}</span>
      <strong>{value ?? 0}</strong>
      <span>{label}</span>
    </div>
  );
}

function GitHubMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.08c-3.1.67-3.76-1.32-3.76-1.32-.5-1.28-1.24-1.62-1.24-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 .1.44 2.1 3.77 1.5.1-.72.39-1.22.7-1.5-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.15a10.6 10.6 0 0 1 5.55 0c2.12-1.44 3.05-1.15 3.05-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.3-2.61 5.23-5.1 5.51.4.35.75 1.02.75 2.06v3.05c0 .3.2.64.77.53A11.1 11.1 0 0 0 12 .9Z" />
    </svg>
  );
}

function ProjectDetailPage({ data, personal }) {
  const { projectId } = useParams();

  if (!data || data.length === 0) return null;

  const currentIndex = Math.max(0, data.findIndex((project) => String(project.id) === String(projectId)));
  const project = data[currentIndex] || data[0];
  const previousProject = data[(currentIndex - 1 + data.length) % data.length];
  const nextProject = data[(currentIndex + 1) % data.length];
  const repositoryUrl = project.github_url || project.link;
  const repositoryName = (() => {
    if (!repositoryUrl) return project.title;
    try {
      return new URL(repositoryUrl).pathname.replace(/\/+$/, '').replace(/^\//, '');
    } catch {
      return project.title;
    }
  })();
  const technologies = [...new Set([project.language, ...(project.tags || [])].filter(Boolean))].slice(0, 4);
  const category = project.company?.split(',')[0] || project.category || 'Development';
  const goal = project.goal || project.description || 'A project built to explore ideas and deliver a useful digital experience.';
  const results = project.results || '';
  const hasCustomResults = results && !/^\s*⭐\s*\d+\s+stars\s*\|/i.test(results);
  const overview = project.overview || project.description || 'Explore the repository for project details, implementation, and development history.';

  return (
    <main className="project-detail-page">
      <div className="project-detail-shell">
        <section className="project-feature">
          <div className="project-feature-top">
            <div>
              <span className="project-kicker">Featured project</span>
              <h1>{project.title}</h1>
              <p>{project.description}</p>
            </div>
            {repositoryUrl && (
              <a
                className="project-github-icon"
                href={repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open GitHub repository"
              >
                <GitHubMark />
              </a>
            )}
          </div>
        </section>

        <section className="project-summary" aria-label="Project repository details">
          <div className="project-summary-stats">
            <Stat icon="★" label="Stars" value={project.stars} />
            <span className="project-stat-divider" aria-hidden="true" />
            <Stat icon="⑂" label="Forks" value={project.forks} />
            <div className="project-tags">
              {(technologies.length ? technologies : ['Development']).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
          <div className="project-summary-actions">
            {repositoryUrl && (
              <a className="project-action project-action-primary" href={repositoryUrl} target="_blank" rel="noopener noreferrer">
                Open GitHub Repo <span aria-hidden="true">↗</span>
              </a>
            )}
            {project.readme_url && (
              <a className="project-action project-action-secondary" href={project.readme_url} target="_blank" rel="noopener noreferrer">
                Read README
              </a>
            )}
          </div>
        </section>

        <section className="project-insight-grid">
          <article className="project-insight-card">
            <h2>Project Goals &amp; Vision</h2>
            <p>{goal}</p>
          </article>

          <article className="project-insight-card project-results-card">
            <h2>Key Results &amp; Achievements</h2>
            {hasCustomResults && <p>{results}</p>}
            <div className="project-result-stats">
              <Stat icon="★" label="Stars" value={project.stars} />
              <Stat icon="○" label="Open Issues" value={project.openIssues} />
              <Stat icon="⑂" label="Forks" value={project.forks} />
            </div>
          </article>

          <article className="project-insight-card">
            <h2>Project Overview &amp; Development</h2>
            <p>{overview}</p>
          </article>
        </section>

        <section className="repository-insights" aria-label="Repository insights">
          <h2>Repository Insights: <span>{repositoryName}</span></h2>
          <div className="repository-techs">
            {technologies.length ? technologies.map((technology) => (
              <span key={technology}>{technology}</span>
            )) : <span>{category}</span>}
          </div>
          <div className="repository-owner">
            <img src={personal?.avatar || '/profile.jpeg'} alt="" />
            <span>{personal?.name || 'Dip Biswas'}</span>
          </div>
        </section>

        <nav className="project-pagination" aria-label="Project navigation">
          <Link to={`/projects/${previousProject.id}`}><span aria-hidden="true">‹</span> Previous</Link>
          <Link to={`/projects/${nextProject.id}`}>Next <span aria-hidden="true">›</span></Link>
        </nav>
      </div>
    </main>
  );
}

export default ProjectDetailPage;
