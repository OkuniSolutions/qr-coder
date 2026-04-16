import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const CURRENT_YEAR = new Date().getFullYear();

const TOOLS = [
  { to: '/qr-generator',     label: 'Generador QR' },
  { to: '/image-converter',  label: 'Convertidor de Imágenes' },
  { to: '/image-compressor', label: 'Compresor de Imágenes' },
  { to: '/image-cropper',    label: 'Recortador de Imágenes' },
  { to: '/exif-remover',     label: 'Eliminador de Metadata' },
  { to: '/favicon-generator',label: 'Generador de Favicon' },
  { to: '/ocr',              label: 'Imagen a Texto (OCR)' },
  { to: '/pdf-generator',    label: 'Generador de PDF' },
];

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner container">

        {/* Top: brand + columns */}
        <div className="footer__top">

          {/* Brand column */}
          <div className="footer__brand-col">
            <Link to="/" className="footer__brand" aria-label="Okuni — Inicio">
              <img src="/logo-okuni-white.webp" alt="Okuni" className="footer__brand-logo" />
            </Link>
            <p className="footer__tagline">
              Herramientas digitales profesionales, directamente en tu navegador. Sin servidores, sin límites.
            </p>
          </div>

          {/* Links columns */}
          <nav className="footer__nav" aria-label="Navegación del pie de página">

            <div className="footer__nav-group">
              <h3 className="footer__nav-heading">Herramientas</h3>
              <ul role="list">
                {TOOLS.slice(0, 4).map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className="footer__link">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer__nav-group">
              <h3 className="footer__nav-heading">&nbsp;</h3>
              <ul role="list">
                {TOOLS.slice(4).map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className="footer__link">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer__nav-group">
              <h3 className="footer__nav-heading">Plataforma</h3>
              <ul role="list">
                <li><Link to="/" className="footer__link">Inicio</Link></li>
              </ul>
            </div>

          </nav>
        </div>

        {/* Bottom bar */}
        <div className="footer__bottom">
          <p className="footer__copy">
            &copy; {CURRENT_YEAR} Okuni. Todos los derechos reservados.
          </p>
          <p className="footer__made">
            Hecho con precisión y cuidado.
          </p>
        </div>

      </div>
    </footer>
  );
}
