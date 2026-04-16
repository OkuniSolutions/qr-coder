import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createWorker } from 'tesseract.js';
import './OcrTool.css';

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

const ScanIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const CopyIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const RefreshIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 3v5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const NewImageIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 8l-5-5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const OcrEmptyIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
    <rect x="4" y="6" width="20" height="24" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M8 12h12M8 17h12M8 22h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="27" cy="27" r="5" stroke="currentColor" strokeWidth="2"/>
    <path d="M31 31l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const ErrorIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="16" r="1" fill="currentColor"/>
  </svg>
);

/* =============================================
   CONSTANTS
   ============================================= */
const LANGUAGES = [
  { code: 'spa', label: 'Español' },
  { code: 'eng', label: 'Inglés' },
  { code: 'fra', label: 'Francés' },
  { code: 'deu', label: 'Alemán' },
  { code: 'por', label: 'Portugués' },
  { code: 'ita', label: 'Italiano' },
  { code: 'chi_sim', label: 'Chino Simplificado' },
  { code: 'jpn', label: 'Japonés' },
  { code: 'rus', label: 'Ruso' },
  { code: 'ara', label: 'Árabe' },
];

/* =============================================
   COMPONENT
   ============================================= */
export default function OcrTool() {
  useEffect(() => { document.title = 'Imagen a Texto (OCR) — OkuniSolutions Apps'; }, []);

  const [imageSrc, setImageSrc]         = useState(null);
  const [fileName, setFileName]         = useState('');
  const [language, setLanguage]         = useState('spa');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress]         = useState(0);
  const [text, setText]                 = useState('');
  const [error, setError]               = useState('');
  const [copied, setCopied]             = useState(false);
  const [dragOver, setDragOver]         = useState(false);

  const fileInputRef = useRef(null);

  /* ---- File loading ---- */
  const loadFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target.result);
      setFileName(file.name);
      setText('');
      setError('');
      setProgress(0);
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

  /* ---- OCR extraction ---- */
  const handleExtract = async () => {
    if (!imageSrc) return;
    setIsProcessing(true);
    setProgress(0);
    setText('');
    setError('');

    const worker = await createWorker(language, 1, {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          setProgress(Math.round(m.progress * 100));
        }
      },
    });

    try {
      const { data: { text: extracted } } = await worker.recognize(imageSrc);
      setText(extracted.trim());
    } catch (err) {
      setError('No se pudo procesar la imagen. Intenta con una imagen más clara.');
    } finally {
      await worker.terminate();
      setIsProcessing(false);
      setProgress(100);
    }
  };

  /* ---- Copy to clipboard ---- */
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ---- Download as .txt ---- */
  const handleDownloadTxt = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.replace(/\.[^.]+$/, '') + '_texto.txt';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  /* ---- Reset ---- */
  const handleNewImage = useCallback(() => {
    setImageSrc(null);
    setFileName('');
    setText('');
    setError('');
    setProgress(0);
  }, []);

  const handleReExtract = () => {
    setText('');
    setError('');
    setProgress(0);
    handleExtract();
  };

  return (
    <div className="ocrpage">
      {/* Page header */}
      <div className="ocrpage__header">
        <div className="container">
          <nav className="ocrpage__breadcrumb" aria-label="Miga de pan">
            <span className="ocrpage__breadcrumb-item">Servicios</span>
            <span className="ocrpage__breadcrumb-sep" aria-hidden="true">/</span>
            <span className="ocrpage__breadcrumb-item ocrpage__breadcrumb-item--current">
              Imagen a Texto (OCR)
            </span>
          </nav>
          <h1 className="ocrpage__title">Imagen a Texto (OCR)</h1>
          <p className="ocrpage__subtitle">
            Extrae texto de imagenes, capturas de pantalla y documentos escaneados.
            Procesado completamente en tu navegador, sin enviar datos a ningun servidor.
          </p>
        </div>
      </div>

      {/* Main layout */}
      <div className="ocrpage__body container">
        <div className="ocr-layout">

          {/* Controls panel left */}
          <section className="ocr-panel" aria-label="Configuracion de OCR">

            <div className="ocr-panel__section">
              <p className="ocr-panel__label">
                {imageSrc ? 'Imagen cargada' : 'Cargar imagen'}
              </p>

              {!imageSrc ? (
                <div
                  className={'ocr-dropzone' + (dragOver ? ' ocr-dropzone--over' : '')}
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
                  <span className="ocr-dropzone__icon">
                    <UploadIcon />
                  </span>
                  <p className="ocr-dropzone__text">
                    Arrastra una imagen o <strong>haz clic para seleccionar</strong>
                  </p>
                  <p className="ocr-dropzone__hint">JPG, PNG, WebP, BMP, TIFF. Una imagen a la vez.</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="ocr-dropzone__file-input"
                    aria-hidden="true"
                    tabIndex={-1}
                  />
                </div>
              ) : (
                <div className="ocr-thumb-row">
                  <img
                    src={imageSrc}
                    alt="Vista previa de la imagen cargada"
                    className="ocr-thumb"
                  />
                  <div className="ocr-thumb-info">
                    <span className="ocr-thumb-name" title={fileName}>{fileName}</span>
                    <button
                      className="ocr-thumb-change"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Cambiar imagen
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileInput}
                      className="ocr-dropzone__file-input"
                      aria-hidden="true"
                      tabIndex={-1}
                    />
                  </div>
                </div>
              )}
            </div>

            {imageSrc && (
              <div className="ocr-panel__section">
                <label htmlFor="ocr-language" className="ocr-panel__label">
                  Idioma de reconocimiento
                </label>
                <select
                  id="ocr-language"
                  className="ocr-select"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  disabled={isProcessing}
                >
                  {LANGUAGES.map(({ code, label }) => (
                    <option key={code} value={code}>{label}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="ocr-panel__actions">
              <button
                className="btn btn--primary btn--md ocr-panel__btn-extract"
                onClick={handleExtract}
                disabled={!imageSrc || isProcessing}
                aria-busy={isProcessing}
              >
                <ScanIcon />
                {isProcessing ? 'Procesando...' : 'Extraer texto'}
              </button>
              {imageSrc && (
                <button
                  className="btn btn--secondary btn--md ocr-panel__btn-new"
                  onClick={handleNewImage}
                  disabled={isProcessing}
                >
                  <NewImageIcon />
                  Nueva imagen
                </button>
              )}
            </div>

            <p className="ocr-panel__note">
              El procesamiento puede tardar unos segundos segun el tamano de la imagen.
              Los idiomas se descargan bajo demanda la primera vez.
            </p>
          </section>

          {/* Result panel right */}
          <section className="ocr-result" aria-label="Resultado de extraccion de texto">

            <div className="ocr-result__header">
              <h2 className="ocr-result__title">
                {text ? 'Texto extraido' : 'Resultado'}
              </h2>
              {fileName && !isProcessing && (
                <span className="ocr-result__filename" title={fileName}>{fileName}</span>
              )}
            </div>

            {!imageSrc && (
              <div className="ocr-empty" role="region" aria-label="Sin imagen cargada">
                <div className="ocr-empty__icon">
                  <OcrEmptyIcon />
                </div>
                <h3 className="ocr-empty__title">Sin imagen aun</h3>
                <p className="ocr-empty__text">
                  Carga una imagen desde el panel izquierdo para comenzar la extraccion de texto.
                  Funciona con fotos, capturas de pantalla y documentos escaneados.
                </p>
              </div>
            )}

            {imageSrc && !isProcessing && !text && !error && (
              <div className="ocr-result__preview-wrap">
                <img
                  src={imageSrc}
                  alt="Imagen lista para analizar"
                  className="ocr-result-image"
                />
                <p className="ocr-result__hint">
                  Selecciona un idioma y haz clic en <strong>Extraer texto</strong> para analizar la imagen.
                </p>
              </div>
            )}

            {isProcessing && (
              <div className="ocr-result__processing">
                <img
                  src={imageSrc}
                  alt="Imagen siendo analizada"
                  className="ocr-result-image ocr-result-image--processing"
                />
                <div className="ocr-progress">
                  <div className="ocr-progress__bar">
                    <div
                      className="ocr-progress__fill"
                      style={{ width: progress + '%' }}
                      role="progressbar"
                      aria-valuenow={progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                  <span className="ocr-progress__label">{progress}% — Analizando imagen...</span>
                </div>
              </div>
            )}

            {error && !isProcessing && (
              <div className="ocr-error" role="alert">
                <span className="ocr-error__icon"><ErrorIcon /></span>
                <p className="ocr-error__text">{error}</p>
              </div>
            )}

            {text && !isProcessing && (
              <div className="ocr-result__content">
                <div className="ocr-result__thumb-row">
                  <img
                    src={imageSrc}
                    alt="Imagen analizada"
                    className="ocr-result__thumb"
                  />
                  <span className="ocr-result__chars">{text.length} caracteres extraidos</span>
                </div>
                <textarea
                  className="ocr-textarea"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  aria-label="Texto extraido de la imagen"
                  spellCheck={false}
                />
                <div className="ocr-result-actions">
                  <button
                    className={'btn btn--primary btn--md' + (copied ? ' ocr-btn--copied' : '')}
                    onClick={handleCopy}
                    aria-live="polite"
                  >
                    <CopyIcon />
                    {copied ? '¡Copiado!' : 'Copiar'}
                  </button>
                  <button
                    className="btn btn--secondary btn--md"
                    onClick={handleDownloadTxt}
                  >
                    <DownloadIcon />
                    Descargar .txt
                  </button>
                  <button
                    className="btn btn--secondary btn--md"
                    onClick={handleReExtract}
                  >
                    <RefreshIcon />
                    Volver a extraer
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
