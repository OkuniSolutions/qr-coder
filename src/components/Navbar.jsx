import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}
      role="banner"
    >
      <div className="navbar__inner container">
        {/* Brand */}
        <Link to="/" className="navbar__brand" onClick={closeMenu} aria-label="ToolKit Pro — Ir a inicio">
          <span className="navbar__brand-icon" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="28" height="28" rx="7" fill="var(--color-primary)" />
              <path d="M7 14.5L11.5 19L21 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="navbar__brand-name">
            ToolKit<span className="navbar__brand-pro">Pro</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          id="main-nav"
          className={`navbar__nav${menuOpen ? ' navbar__nav--open' : ''}`}
          aria-label="Navegación principal"
        >
          <ul className="navbar__nav-list" role="list">
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  'navbar__link' + (isActive ? ' navbar__link--active' : '')
                }
                onClick={closeMenu}
              >
                Inicio
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/qr-generator"
                className={({ isActive }) =>
                  'navbar__link' + (isActive ? ' navbar__link--active' : '')
                }
                onClick={closeMenu}
              >
                Generador QR
              </NavLink>
            </li>
          </ul>

          <Link
            to="/qr-generator"
            className="btn btn--primary btn--sm navbar__cta"
            onClick={closeMenu}
          >
            Comenzar gratis
          </Link>
        </nav>

        {/* Hamburger */}
        <button
          className={`navbar__toggle${menuOpen ? ' navbar__toggle--active' : ''}`}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="navbar__toggle-bar" />
          <span className="navbar__toggle-bar" />
          <span className="navbar__toggle-bar" />
        </button>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="navbar__overlay"
          aria-hidden="true"
          onClick={closeMenu}
        />
      )}
    </header>
  );
}
