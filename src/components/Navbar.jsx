import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const TOOLS = [
  { to: '/qr-generator',    label: 'Generador QR' },
  { to: '/image-converter', label: 'Convertidor de Imágenes' },
  { to: '/image-compressor',label: 'Compresor de Imágenes' },
  { to: '/image-cropper',   label: 'Recortador de Imágenes' },
  { to: '/exif-remover',    label: 'Eliminador de Metadata' },
  { to: '/favicon-generator',label: 'Generador de Favicon' },
  { to: '/ocr',             label: 'Imagen a Texto (OCR)' },
  { to: '/pdf-generator',   label: 'Generador de PDF' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen]       = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled]       = useState(false);
  const dropdownRef                   = useRef(null);
  const location                      = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  // Cerrar dropdown al cambiar de ruta
  useEffect(() => {
    setDropdownOpen(false);
    setMenuOpen(false);
  }, [location]);

  const closeMenu = () => { setMenuOpen(false); setDropdownOpen(false); };

  const isToolActive = TOOLS.some(t => location.pathname === t.to);

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
                className={({ isActive }) => 'navbar__link' + (isActive ? ' navbar__link--active' : '')}
                onClick={closeMenu}
              >
                Inicio
              </NavLink>
            </li>

            {/* Dropdown Herramientas */}
            <li className="navbar__dropdown-wrap" ref={dropdownRef}>
              <button
                className={`navbar__link navbar__dropdown-trigger${isToolActive || dropdownOpen ? ' navbar__link--active' : ''}`}
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
                onClick={() => setDropdownOpen(v => !v)}
              >
                Herramientas
                <svg className={`navbar__dropdown-caret${dropdownOpen ? ' navbar__dropdown-caret--open' : ''}`} width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {dropdownOpen && (
                <ul className="navbar__dropdown" role="list" aria-label="Lista de herramientas">
                  {TOOLS.map(({ to, label }) => (
                    <li key={to}>
                      <NavLink
                        to={to}
                        className={({ isActive }) => 'navbar__dropdown-item' + (isActive ? ' navbar__dropdown-item--active' : '')}
                        onClick={closeMenu}
                      >
                        {label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>

          <Link to="/" className="btn btn--primary btn--sm navbar__cta" onClick={closeMenu}>
            Explorar
          </Link>
        </nav>

        {/* Hamburger */}
        <button
          className={`navbar__toggle${menuOpen ? ' navbar__toggle--active' : ''}`}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          onClick={() => setMenuOpen(v => !v)}
        >
          <span className="navbar__toggle-bar" />
          <span className="navbar__toggle-bar" />
          <span className="navbar__toggle-bar" />
        </button>
      </div>

      {/* Overlay mobile */}
      {menuOpen && (
        <div className="navbar__overlay" aria-hidden="true" onClick={closeMenu} />
      )}
    </header>
  );
}
