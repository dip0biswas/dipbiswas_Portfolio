import { Link } from 'react-router-dom';

const footerLinks = [
  { label: 'About', to: '/' },
  { label: 'Stack', to: '/#toolbox' },
  { label: 'Projects', to: '/projects' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Achievements', to: '/achievements' },
  { label: 'Contact', to: '/contact' }
];

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6.5 8.5H3.2V20h3.3V8.5ZM4.85 3a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8ZM20.8 13.4c0-3.46-1.85-5.07-4.32-5.07a3.72 3.72 0 0 0-3.35 1.85V8.5H9.85V20h3.28v-5.7c0-1.5.29-2.95 2.15-2.95 1.83 0 1.85 1.7 1.85 3.05V20h3.67v-6.6Z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm8 7.2L4 7v10h16V7l-8 5.2Zm0-2.4L19.2 7H4.8l7.2 2.8Z" />
    </svg>
  );
}

function Footer({ personal }) {
  const name = personal?.name || 'Dip Biswas';
  const email = personal?.email || '';
  const linkedin = personal?.linkedin || '';

  return (
    <footer className="site-footer">
      <section className="footer-cta" aria-labelledby="footer-cta-title">
        <p>Available for work</p>
        <h2 id="footer-cta-title">Have a project in mind?<br />Let&apos;s make it happen.</h2>
        <p className="footer-cta-copy">I build thoughtful digital experiences, modern websites, and practical products for ambitious teams.</p>
        <Link to="/contact" className="footer-cta-button">
          Send an inquiry <span aria-hidden="true">↗</span>
        </Link>
      </section>

      <div className="footer-content">
        <div className="footer-main">
          <div className="footer-brand">
            <Link className="footer-name" to="/">{name}</Link>
            <p>Thanks for stopping by. I hope you found something inspiring here. If you&apos;d like to work together, I&apos;d love to hear from you.</p>
          </div>
          <nav className="footer-links" aria-label="Footer navigation">
            {footerLinks.map((link) => (
              <Link key={link.label} to={link.to}>{link.label}</Link>
            ))}
          </nav>
          <a
            className="footer-back-to-top"
            href="#top"
            aria-label="Back to top"
            onClick={(event) => {
              event.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <span aria-hidden="true">↑</span>
          </a>
        </div>

        <div className="footer-lower">
          <Link className="footer-schedule" to="/contact">Schedule a conversation <span aria-hidden="true">↗</span></Link>
          <div className="footer-socials" aria-label="Social links">
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <LinkedInIcon />
              </a>
            )}
            {email && (
              <a href={`mailto:${email}`} aria-label="Email">
                <EmailIcon />
              </a>
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {name}</span>
          <span>Designed and built with care</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
