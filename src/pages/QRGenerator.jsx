import React, { useState, useRef, useCallback, useEffect } from 'react';
import QRCode from 'qrcode.react';
import './QRGenerator.css';

const QR_SIZE = 512;
const LOGO_RATIO = 0.22;
const logoSize = Math.round(QR_SIZE * LOGO_RATIO);

const UploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export default function QRGenerator() {
  useEffect(() => { document.title = 'Generador QR — OkuniSolutions Apps'; }, []);
  const [inputValue, setInputValue] = useState('');
  const [logoSrc, setLogoSrc] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [logoFileName, setLogoFileName] = useState('');
  const fileInputRef = useRef(null);
  const qrWrapperRef = useRef(null);

  const processFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setLogoFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setLogoSrc(ev.target.result);
    reader.readAsDataURL(file);
  }, []);

  const handleLogoUpload = (e) => {
    processFile(e.target.files[0]);
  };

  const handleRemoveLogo = () => {
    setLogoSrc(null);
    setLogoFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processFile(e.dataTransfer.files[0]);
  };

  const handleDownload = () => {
    if (!inputValue || !qrWrapperRef.current) return;
    const canvas = qrWrapperRef.current.querySelector('canvas');
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qr-code.png';
    a.click();
  };

  const charCount = inputValue.length;
  const isReady = inputValue.trim().length > 0;

  return (
    <div className="qrpage">
      {/* Page header */}
      <div className="qrpage__header">
        <div className="container">
          <div className="qrpage__breadcrumb" aria-label="Miga de pan">
            <span className="qrpage__breadcrumb-item">Servicios</span>
            <span className="qrpage__breadcrumb-sep" aria-hidden="true">/</span>
            <span className="qrpage__breadcrumb-item qrpage__breadcrumb-item--current">
              Generador QR
            </span>
          </div>
          <h1 className="qrpage__title">Generador de Codigo QR</h1>
          <p className="qrpage__subtitle">
            Crea codigos QR de alta calidad con logo personalizado. Todo el procesamiento
            ocurre en tu navegador.
          </p>
        </div>
      </div>

      {/* Main layout */}
      <div className="qrpage__body container">
        {/* Controls panel */}
        <section className="qr-panel" aria-label="Configuracion del codigo QR">
          <div className="qr-panel__section">
            <label htmlFor="qr-input" className="qr-panel__label">
              Contenido del QR
              <span className="qr-panel__required" aria-hidden="true">*</span>
            </label>
            <div className="qr-input-wrap">
              <textarea
                id="qr-input"
                className="qr-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ingresa una URL, texto, numero de telefono..."
                rows={4}
                aria-describedby="qr-input-hint"
                maxLength={2000}
                spellCheck="false"
              />
            </div>
            <div className="qr-panel__meta" id="qr-input-hint">
              <span className="qr-panel__hint">URL, texto plano, tel:+1234567890, mailto:, etc.</span>
              <span
                className={'qr-panel__counter' + (charCount > 1800 ? ' qr-panel__counter--warn' : '')}
                aria-live="polite"
                aria-label={charCount + ' caracteres'}
              >
                {charCount} / 2000
              </span>
            </div>
          </div>

          {/* Logo upload */}
          <div className="qr-panel__section">
            <p className="qr-panel__label">
              Logo central <span className="qr-panel__optional">(opcional)</span>
            </p>

            {!logoSrc ? (
              <div
                className={'qr-dropzone' + (dragOver ? ' qr-dropzone--over' : '')}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                aria-label="Subir logo: haz clic o arrastra una imagen"
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
              >
                <span className="qr-dropzone__icon">
                  <UploadIcon />
                </span>
                <p className="qr-dropzone__text">
                  Arrastra una imagen o <strong>haz clic para seleccionar</strong>
                </p>
                <p className="qr-dropzone__hint">PNG, JPG, SVG, WEBP. Recomendado: fondo transparente</p>
                <input
                  ref={fileInputRef}
                  id="logo-input"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="qr-dropzone__file-input"
                  aria-hidden="true"
                  tabIndex={-1}
                />
              </div>
            ) : (
              <div className="qr-logo-preview">
                <img src={logoSrc} alt="Vista previa del logo" className="qr-logo-preview__img" />
                <div className="qr-logo-preview__info">
                  <p className="qr-logo-preview__name" title={logoFileName}>{logoFileName}</p>
                  <p className="qr-logo-preview__size">Posicion: centro del QR</p>
                </div>
                <button
                  className="qr-logo-preview__remove"
                  onClick={handleRemoveLogo}
                  aria-label="Quitar logo"
                  title="Quitar logo"
                >
                  <TrashIcon />
                </button>
              </div>
            )}
          </div>

          {/* Info pills */}
          <div className="qr-panel__section qr-panel__section--info">
            <ul className="qr-info-pills" role="list" aria-label="Especificaciones">
              <li className="qr-info-pill">
                <span className="qr-info-pill__label">Resolucion</span>
                <span className="qr-info-pill__value">512 x 512 px</span>
              </li>
              <li className="qr-info-pill">
                <span className="qr-info-pill__label">Correccion</span>
                <span className="qr-info-pill__value">Nivel H (30%)</span>
              </li>
              <li className="qr-info-pill">
                <span className="qr-info-pill__label">Formato</span>
                <span className="qr-info-pill__value">PNG</span>
              </li>
            </ul>
          </div>

          {/* Download */}
          <button
            className="btn btn--primary btn--md qr-panel__download"
            onClick={handleDownload}
            disabled={!isReady}
            aria-disabled={!isReady}
          >
            <DownloadIcon />
            Descargar PNG
          </button>
        </section>

        {/* Preview panel */}
        <section className="qr-preview" aria-label="Vista previa del codigo QR">
          <div className="qr-preview__card">
            <div className="qr-preview__card-header">
              <span className="qr-preview__status-dot" aria-hidden="true" />
              <span className="qr-preview__status-text">
                {isReady ? 'QR generado' : 'Esperando contenido'}
              </span>
            </div>

            <div
              ref={qrWrapperRef}
              className={'qr-preview__canvas-wrap' + (isReady ? ' qr-preview__canvas-wrap--ready' : '')}
              aria-live="polite"
              aria-label={isReady ? 'Codigo QR generado para: ' + inputValue : 'El codigo QR aparecera aqui'}
            >
              {isReady ? (
                <QRCode
                  value={inputValue}
                  size={QR_SIZE}
                  level="H"
                  renderAs="canvas"
                  includeMargin={true}
                  {...(logoSrc && {
                    imageSettings: {
                      src: logoSrc,
                      width: logoSize,
                      height: logoSize,
                      excavate: true,
                    },
                  })}
                />
              ) : (
                <div className="qr-preview__empty" aria-hidden="true">
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <rect x="8" y="8" width="26" height="26" rx="4" stroke="var(--color-border)" strokeWidth="3"/>
                    <rect x="46" y="8" width="26" height="26" rx="4" stroke="var(--color-border)" strokeWidth="3"/>
                    <rect x="8" y="46" width="26" height="26" rx="4" stroke="var(--color-border)" strokeWidth="3"/>
                    <rect x="14" y="14" width="14" height="14" rx="2" fill="var(--color-border)"/>
                    <rect x="52" y="14" width="14" height="14" rx="2" fill="var(--color-border)"/>
                    <rect x="14" y="52" width="14" height="14" rx="2" fill="var(--color-border)"/>
                    <rect x="46" y="46" width="6" height="6" rx="1" fill="var(--color-border)" opacity="0.5"/>
                    <rect x="54" y="46" width="6" height="6" rx="1" fill="var(--color-border)" opacity="0.5"/>
                    <rect x="62" y="54" width="6" height="6" rx="1" fill="var(--color-border)" opacity="0.5"/>
                    <rect x="54" y="62" width="6" height="6" rx="1" fill="var(--color-border)" opacity="0.5"/>
                    <rect x="46" y="62" width="6" height="6" rx="1" fill="var(--color-border)" opacity="0.5"/>
                  </svg>
                  <p className="qr-preview__empty-text">Tu QR aparecera aqui</p>
                </div>
              )}
            </div>

            {isReady && (
              <div className="qr-preview__card-footer">
                <button
                  className="btn btn--accent btn--sm qr-preview__download-btn"
                  onClick={handleDownload}
                  aria-label="Descargar codigo QR como PNG"
                >
                  <DownloadIcon />
                  Descargar PNG
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
