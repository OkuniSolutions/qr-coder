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
        <Link to="/" className="navbar__brand" onClick={closeMenu} aria-label="Okuni — Ir a inicio">
          <img src="/logo-okuni.png" alt="Okuni" className="navbar__brand-logo" />
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
            Explorar
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
