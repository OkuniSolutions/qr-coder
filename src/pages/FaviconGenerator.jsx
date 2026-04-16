import React, { useState, useRef, useCallback, useEffect } from 'react';
import JSZip from 'jszip';
import './FaviconGenerator.css';

/* =============================================
   ICONS
   ============================================= */
const UploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
  </svg>
);

const GenerateIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="3" width="26" height="26" rx="5" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const ZipIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3 6l3-3h12l3 3v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 11v6M9 14l3 3 3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 3v3h4V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const NewImageIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 3v5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FaviconEmptyIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <rect x="4" y="4" width="32" height="32" rx="6" stroke="currentColor" strokeWidth="2" fill="none"/>
    <rect x="10" y="10" width="20" height="20" rx="3" stroke="currentColor" strokeWidth="1.75" fill="none" strokeDasharray="3 2"/>
    <circle cx="20" cy="20" r="4" stroke="currentColor" strokeWidth="1.75"/>
  </svg>
);

const SpinnerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="favicon-spinner">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25"/>
    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

/* =============================================
   CONSTANTS
   ============================================= */
const FAVICON_SIZES = [
  { size: 16,  name: 'favicon-16x16.png',      label: '16×16',   desc: 'Browser tab' },
  { size: 32,  name: 'favicon-32x32.png',      label: '32×32',   desc: 'Browser tab HD' },
  { size: 48,  name: 'favicon-48x48.png',      label: '48×48',   desc: 'Windows site' },
  { size: 64,  name: 'favicon-64x64.png',      label: '64×64',   desc: 'Shortcut' },
  { size: 96,  name: 'favicon-96x96.png',      label: '96×96',   desc: 'Android' },
  { size: 128, name: 'favicon-128x128.png',    label: '128×128', desc: 'Chrome Web Store' },
  { size: 180, name: 'apple-touch-icon.png',   label: '180×180', desc: 'Apple Touch Icon' },
  { size: 192, name: 'android-chrome-192.png', label: '192×192', desc: 'Android Chrome' },
  { size: 512, name: 'android-chrome-512.png', label: '512×512', desc: 'Android Chrome HD' },
];

/* =============================================
   CANVAS HELPERS
   ============================================= */
function generateFaviconBlob(imgElement, size, background) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (background === 'white') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);
    } else if (background === 'transparent') {
      // no fill — PNG supports transparency
    } else if (background.startsWith('#')) {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, size, size);
    }

    // Draw image centered and square (crop to center if not square)
    const srcW = imgElement.naturalWidth;
    const srcH = imgElement.naturalHeight;
    const srcSize = Math.min(srcW, srcH);
    const srcX = (srcW - srcSize) / 2;
    const srcY = (srcH - srcSize) / 2;
    ctx.drawImage(imgElement, srcX, srcY, srcSize, srcSize, 0, 0, size, size);

    canvas.toBlob((blob) => resolve(blob), 'image/png');
  });
}

async function generateAllFavicons(imgElement, background) {
  const results = [];
  for (const { size, name, label, desc } of FAVICON_SIZES) {
    const blob = await generateFaviconBlob(imgElement, size, background);
    results.push({ size, name, label, desc, blob, url: URL.createObjectURL(blob) });
  }
  return results;
}

/* =============================================
   COMPONENT
   ============================================= */
export default function FaviconGenerator() {
  useEffect(() => { document.title = 'Generador de Favicon — OkuniSolutions Apps'; }, []);

  const [imageSrc, setImageSrc]       = useState(null);
  const [fileName, setFileName]       = useState('');
  const [background, setBackground]   = useState('transparent');
  const [customColor, setCustomColor] = useState('#ffffff');
  const [favicons, setFavicons]       = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dragOver, setDragOver]       = useState(false);

  const imgRef      = useRef(null);
  const fileInputRef = useRef(null);

  /* ---- Cleanup object URLs on unmount or when favicons change ---- */
  useEffect(() => {
    return () => { favicons.forEach(f => URL.revokeObjectURL(f.url)); };
  }, [favicons]);

  /* ---- File loading ---- */
  const loadFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target.result);
      setFileName(file.name);
      setFavicons([]);
    };
    reader.readAsDataURL(file);
  }, []);

  /* ---- Drag & drop ---- */
  const handleDragOver  = useCallback((e) => { e.preventDefault(); setDragOver(true); }, []);
  const handleDragLeave = useCallback(() => setDragOver(false), []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) loadFile(file);
  }, [loadFile]);

  const handleFileInput = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) loadFile(file);
    e.target.value = '';
  }, [loadFile]);

  /* ---- Generate ---- */
  const handleGenerate = useCallback(async () => {
    if (!imgRef.current) return;
    setIsGenerating(true);
    favicons.forEach(f => URL.revokeObjectURL(f.url));
    const bg = background === 'custom' ? customColor : background;
    const results = await generateAllFavicons(imgRef.current, bg);
    setFavicons(results);
    setIsGenerating(false);
  }, [background, customColor, favicons]);

  /* ---- Download ZIP ---- */
  const handleDownloadZip = useCallback(async () => {
    if (favicons.length === 0) return;
    const zip = new JSZip();
    const folder = zip.folder('favicons');
    favicons.forEach(({ name, blob }) => folder.file(name, blob));

    const htmlSnippet = `<!-- Agrega esto en el <head> de tu HTML -->
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">`;
    folder.file('README.html', htmlSnippet);

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'favicons.zip';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
  }, [favicons]);

  /* ---- Reset ---- */
  const handleNewImage = useCallback(() => {
    favicons.forEach(f => URL.revokeObjectURL(f.url));
    setFavicons([]);
    setImageSrc(null);
    setFileName('');
    setBackground('transparent');
    setCustomColor('#ffffff');
  }, [favicons]);

  return (
    <div className="faviconpage">
      {/* Page header */}
      <div className="faviconpage__header">
        <div className="container">
          <nav className="faviconpage__breadcrumb" aria-label="Miga de pan">
            <span className="faviconpage__breadcrumb-item">Servicios</span>
            <span className="faviconpage__breadcrumb-sep" aria-hidden="true">/</span>
            <span className="faviconpage__breadcrumb-item faviconpage__breadcrumb-item--current">
              Generador de Favicon
            </span>
          </nav>
          <h1 className="faviconpage__title">Generador de Favicon</h1>
          <p className="faviconpage__subtitle">
            Convierte cualquier imagen a todos los tamaños de favicon necesarios para produccion.
            Descarga un ZIP listo para usar en tu sitio web.
          </p>
        </div>
      </div>

      {/* Main layout */}
      <div className="faviconpage__body container">
        <div className="favicon-layout">

          {/* ---- Controls panel ---- */}
          <section className="favicon-panel" aria-label="Configuracion del favicon">

            {/* Drop zone / image preview */}
            <div className="favicon-panel__section">
              <p className="favicon-panel__label">
                {imageSrc ? 'Cambiar imagen' : 'Cargar imagen'}
              </p>

              {!imageSrc ? (
                <div
                  className={'favicon-dropzone' + (dragOver ? ' favicon-dropzone--over' : '')}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  aria-label="Subir imagen: haz clic o arrastra un archivo de imagen"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
                  }}
                >
                  <span className="favicon-dropzone__icon">
                    <UploadIcon />
                  </span>
                  <p className="favicon-dropzone__text">
                    Arrastra una imagen o <strong>haz clic para seleccionar</strong>
                  </p>
                  <p className="favicon-dropzone__hint">
                    PNG, JPG, WebP, SVG. Imagen cuadrada recomendada.
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="favicon-dropzone__file-input"
                    aria-hidden="true"
                    tabIndex={-1}
                  />
                </div>
              ) : (
                <div className="favicon-image-preview">
                  <div className="favicon-image-preview__thumb-wrap">
                    <img
                      src={imageSrc}
                      alt="Vista previa de la imagen original"
                      className="favicon-image-preview__thumb"
                    />
                  </div>
                  <div className="favicon-image-preview__info">
                    <span className="favicon-image-preview__name" title={fileName}>{fileName}</span>
                    <button
                      className="favicon-image-preview__change"
                      onClick={() => fileInputRef.current?.click()}
                      aria-label="Cambiar imagen"
                    >
                      Cambiar imagen
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileInput}
                      className="favicon-dropzone__file-input"
                      aria-hidden="true"
                      tabIndex={-1}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Background options */}
            {imageSrc && (
              <div className="favicon-panel__section">
                <p className="favicon-panel__label" id="bg-label">Fondo</p>
                <div className="favicon-bg-options" role="group" aria-labelledby="bg-label">
                  {[
                    { value: 'transparent', label: 'Transparente' },
                    { value: 'white',       label: 'Blanco' },
                    { value: 'custom',      label: 'Color personalizado' },
                  ].map(({ value, label }) => (
                    <label key={value} className="favicon-bg-option">
                      <input
                        type="radio"
                        name="background"
                        value={value}
                        checked={background === value}
                        onChange={() => setBackground(value)}
                        className="favicon-bg-option__radio"
                      />
                      <span className="favicon-bg-option__indicator" aria-hidden="true" />
                      <span className="favicon-bg-option__label">{label}</span>
                      {value === 'transparent' && (
                        <span className="favicon-bg-option__swatch favicon-bg-option__swatch--transparent" aria-hidden="true" />
                      )}
                      {value === 'white' && (
                        <span className="favicon-bg-option__swatch" style={{ background: '#ffffff', border: '1px solid var(--color-border)' }} aria-hidden="true" />
                      )}
                    </label>
                  ))}

                  {background === 'custom' && (
                    <div className="favicon-bg-custom">
                      <label htmlFor="custom-color" className="favicon-panel__label" style={{ margin: 0, fontWeight: 'var(--weight-medium)' }}>
                        Color
                      </label>
                      <input
                        id="custom-color"
                        type="color"
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        className="favicon-bg-custom__input"
                        aria-label="Seleccionar color de fondo personalizado"
                      />
                      <span className="favicon-bg-custom__value">{customColor}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="favicon-panel__actions">
              <button
                className="btn btn--primary btn--md favicon-panel__btn"
                onClick={handleGenerate}
                disabled={!imageSrc || isGenerating}
                aria-busy={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <SpinnerIcon />
                    Generando...
                  </>
                ) : (
                  <>
                    <GenerateIcon />
                    Generar favicons
                  </>
                )}
              </button>

              <button
                className="btn btn--accent btn--md favicon-panel__btn"
                onClick={handleDownloadZip}
                disabled={favicons.length === 0}
              >
                <ZipIcon />
                Descargar ZIP
              </button>

              {imageSrc && (
                <button
                  className="btn btn--secondary btn--md favicon-panel__btn"
                  onClick={handleNewImage}
                >
                  <NewImageIcon />
                  Nueva imagen
                </button>
              )}
            </div>
          </section>

          {/* ---- Preview panel ---- */}
          <section className="favicon-preview" aria-label="Previsualizaciones de favicon">
            <div className="favicon-preview__header">
              <h2 className="favicon-preview__title">
                {favicons.length > 0 ? 'Favicons generados' : 'Vista previa'}
              </h2>
              {favicons.length > 0 && (
                <span className="favicon-preview__count">{favicons.length} archivos</span>
              )}
            </div>

            {/* Empty: no image loaded */}
            {!imageSrc && (
              <div className="favicon-empty" role="region" aria-label="Sin imagen cargada">
                <div className="favicon-empty__icon">
                  <FaviconEmptyIcon />
                </div>
                <h3 className="favicon-empty__title">Sin imagen aun</h3>
                <p className="favicon-empty__text">
                  Carga una imagen desde el panel izquierdo y haz clic en
                  "Generar favicons" para ver todos los tamaños generados aqui.
                </p>
              </div>
            )}

            {/* Image loaded but not generated yet */}
            {imageSrc && favicons.length === 0 && !isGenerating && (
              <div className="favicon-empty" role="region" aria-label="Listo para generar">
                <div className="favicon-empty__icon">
                  <FaviconEmptyIcon />
                </div>
                <h3 className="favicon-empty__title">Listo para generar</h3>
                <p className="favicon-empty__text">
                  Haz clic en "Generar favicons" para crear todos los tamaños
                  necesarios para tu sitio web.
                </p>
              </div>
            )}

            {/* Generating in progress */}
            {isGenerating && (
              <div className="favicon-empty" role="status" aria-live="polite">
                <div className="favicon-empty__icon favicon-empty__icon--spinning">
                  <SpinnerIcon />
                </div>
                <h3 className="favicon-empty__title">Generando favicons...</h3>
                <p className="favicon-empty__text">Procesando {FAVICON_SIZES.length} tamaños.</p>
              </div>
            )}

            {/* Grid of generated favicons */}
            {!isGenerating && favicons.length > 0 && (
              <div className="favicon-grid" role="list" aria-label="Favicons generados">
                {favicons.map((f) => (
                  <article
                    key={f.name}
                    className="favicon-card"
                    role="listitem"
                    aria-label={`${f.label} — ${f.desc}`}
                  >
                    <div className="favicon-card__img-wrap">
                      <img
                        src={f.url}
                        alt={`Favicon ${f.label}`}
                        style={{ width: f.size > 64 ? 64 : f.size, height: f.size > 64 ? 64 : f.size, imageRendering: f.size < 32 ? 'pixelated' : 'auto' }}
                      />
                    </div>
                    <span className="favicon-card__label">{f.label}</span>
                    <span className="favicon-card__desc">{f.desc}</span>
                    <span className="favicon-card__name">{f.name}</span>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Hidden image element for canvas drawing */}
      {imageSrc && (
        <img
          ref={imgRef}
          src={imageSrc}
          alt=""
          aria-hidden="true"
          style={{ display: 'none' }}
        />
      )}
    </div>
  );
}
