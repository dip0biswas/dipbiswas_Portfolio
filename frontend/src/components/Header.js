import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const links = [
    { label: 'Work', to: '/projects' },
    { label: 'Gallery', to: '/gallery' },
    { label: 'Achievements', to: '/achievements' },
    { label: 'Resume', to: '/resume' },
    { label: 'Contact', to: '/contact' }
  ];

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Main navigation">
        <Link to="/" className="site-logo" onClick={closeMenu}>
          Dip<span>.</span>
        </Link>

        <div className="site-nav-links">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={location.pathname === link.to ? 'is-active' : ''}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link className="nav-cta" to="/contact" onClick={closeMenu}>Let's Talk</Link>

        <button
          className="menu-toggle"
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
        >
          <span />
          <span />
        </button>
      </nav>

      {isMenuOpen && (
        <div className="mobile-nav">
          {links.map((link) => (
            <Link key={link.label} to={link.to} onClick={closeMenu}>{link.label}</Link>
          ))}
          <Link to="/contact" onClick={closeMenu}>Let's Talk</Link>
        </div>
      )}
    </header>
  );
}

export default Header;
