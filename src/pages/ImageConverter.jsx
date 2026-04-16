import React, { useState, useRef, useCallback, useReducer } from 'react';
import JSZip from 'jszip';
import encodeAvif from '@jsquash/avif/encode';
import './ImageConverter.css';

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

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const ZipIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3 6l3-3h12l3 3v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 11v6M9 14l3 3 3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 3v3h4V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ConvertAllIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M17 1l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 11V9a4 4 0 0 1 4-4h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 23l-4-4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 13v2a4 4 0 0 1-4 4H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const ResetIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 3v5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ErrorIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const ImagesIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
    <rect x="3" y="7" width="24" height="20" rx="3" stroke="currentColor" strokeWidth="2"/>
    <rect x="9" y="3" width="24" height="20" rx="3" stroke="currentColor" strokeWidth="2" strokeDasharray="3 2"/>
    <path d="M7 23l4-5 3 4 4-6 5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="10" cy="15" r="2" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

/* =============================================
   HELPERS
   ============================================= */
const MIME_TO_EXT = {
  'image/jpeg': 'jpg',
  'image/png':  'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
};

const FORMAT_LABELS = [
  { mime: 'image/jpeg', label: 'JPG' },
  { mime: 'image/png',  label: 'PNG' },
  { mime: 'image/webp', label: 'WebP' },
  { mime: 'image/avif', label: 'AVIF' },
];

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function getDeltaClass(pct) {
  if (pct < -1) return 'converter-file-item__delta--positive';
  if (pct > 1)  return 'converter-file-item__delta--negative';
  return 'converter-file-item__delta--neutral';
}

function getDeltaLabel(pct) {
  if (Math.abs(pct) <= 1) return '~0%';
  const sign = pct < 0 ? '-' : '+';
  return sign + Math.abs(pct).toFixed(1) + '%';
}

function loadImageToCanvas(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      resolve({ canvas, ctx });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not load image'));
    };
    img.src = url;
  });
}

async function convertImage(file, outputFormat, quality) {
  const { canvas, ctx } = await loadImageToCanvas(file);

  if (outputFormat === 'image/avif') {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const buffer = await encodeAvif(imageData, { quality, effort: 4 });
    return new Blob([buffer], { type: 'image/avif' });
  }

  return new Promise((resolve, reject) => {
    if (outputFormat === 'image/jpeg') {
      ctx.globalCompositeOperation = 'destination-over';
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas toBlob returned null'));
      },
      outputFormat,
      quality / 100
    );
  });
}

/* =============================================
   REDUCER
   ============================================= */
function filesReducer(state, action) {
  switch (action.type) {
    case 'ADD_FILES': {
      const incoming = action.files.map((file) => ({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
        status: 'pending',
        outputBlob: null,
        outputSize: null,
      }));
      return [...state, ...incoming];
    }
    case 'SET_STATUS':
      return state.map((item) =>
        item.id === action.id ? { ...item, status: action.status } : item
      );
    case 'SET_RESULT':
      return state.map((item) =>
        item.id === action.id
          ? { ...item, status: 'done', outputBlob: action.blob, outputSize: action.blob.size }
          : item
      );
    case 'SET_ERROR':
      return state.map((item) =>
        item.id === action.id ? { ...item, status: 'error' } : item
      );
    case 'REMOVE': {
      const item = state.find((i) => i.id === action.id);
      if (item) {
        URL.revokeObjectURL(item.preview);
        if (item.outputBlob) URL.revokeObjectURL(item.outputBlob);
      }
      return state.filter((i) => i.id !== action.id);
    }
    case 'RESET':
      state.forEach((item) => {
        URL.revokeObjectURL(item.preview);
        if (item.outputBlob) URL.revokeObjectURL(item.outputBlob);
      });
      return [];
    default:
      return state;
  }
}

/* =============================================
   COMPONENT
   ============================================= */
export default function ImageConverter() {
  const [files, dispatch] = useReducer(filesReducer, []);
  const [outputFormat, setOutputFormat] = useState('image/webp');
  const [quality, setQuality] = useState(85);
  const [isConverting, setIsConverting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  /* -- derived counts -- */
  const pending   = files.filter((f) => f.status === 'pending').length;
  const done      = files.filter((f) => f.status === 'done').length;
  const errored   = files.filter((f) => f.status === 'error').length;
  const converting = files.filter((f) => f.status === 'converting').length;
  const hasFiles  = files.length > 0;
  const hasDone   = done > 0;
  const canConvert = hasFiles && (pending > 0) && !isConverting;
  const qualityActive = outputFormat !== 'image/png';

  /* -- drag & drop handlers -- */
  const handleDragOver = useCallback((e) => { e.preventDefault(); setDragOver(true); }, []);
  const handleDragLeave = useCallback(() => setDragOver(false), []);

  const acceptFiles = useCallback((rawFiles) => {
    const images = Array.from(rawFiles).filter((f) => f.type.startsWith('image/'));
    if (images.length === 0) return;
    dispatch({ type: 'ADD_FILES', files: images });
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    acceptFiles(e.dataTransfer.files);
  }, [acceptFiles]);

  const handleFileInput = useCallback((e) => {
    acceptFiles(e.target.files);
    e.target.value = '';
  }, [acceptFiles]);

  /* -- conversion -- */
  const handleConvertAll = useCallback(async () => {
    const targets = files.filter((f) => f.status === 'pending');
    if (targets.length === 0) return;
    setIsConverting(true);

    for (const item of targets) {
      dispatch({ type: 'SET_STATUS', id: item.id, status: 'converting' });
      try {
        const blob = await convertImage(item.file, outputFormat, quality);
        dispatch({ type: 'SET_RESULT', id: item.id, blob });
      } catch {
        dispatch({ type: 'SET_ERROR', id: item.id });
      }
    }

    setIsConverting(false);
  }, [files, outputFormat, quality]);

  /* -- individual download -- */
  const handleDownloadOne = useCallback((item) => {
    if (!item.outputBlob) return;
    const ext = MIME_TO_EXT[outputFormat] || 'img';
    const baseName = item.file.name.replace(/\.[^.]+$/, '');
    const url = URL.createObjectURL(item.outputBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = baseName + '_converted.' + ext;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }, [outputFormat]);

  /* -- download all as ZIP -- */
  const handleDownloadZip = useCallback(async () => {
    const doneItems = files.filter((f) => f.status === 'done' && f.outputBlob);
    if (doneItems.length === 0) return;
    const zip = new JSZip();
    const ext = MIME_TO_EXT[outputFormat] || 'img';
    const folder = zip.folder('converted-images');
    doneItems.forEach((item) => {
      const baseName = item.file.name.replace(/\.[^.]+$/, '');
      folder.file(baseName + '_converted.' + ext, item.outputBlob);
    });
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted-images.zip';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }, [files, outputFormat]);

  /* -- remove one -- */
  const handleRemoveOne = useCallback((id) => {
    dispatch({ type: 'REMOVE', id });
  }, []);

  /* -- reset all -- */
  const handleReset = useCallback(() => {
    dispatch({ type: 'RESET' });
    setIsConverting(false);
  }, []);

  return (
    <div className="converterpage">
      {/* Page header */}
      <div className="converterpage__header">
        <div className="container">
          <nav className="converterpage__breadcrumb" aria-label="Miga de pan">
            <span className="converterpage__breadcrumb-item">Servicios</span>
            <span className="converterpage__breadcrumb-sep" aria-hidden="true">/</span>
            <span className="converterpage__breadcrumb-item converterpage__breadcrumb-item--current">
              Convertidor de Imagenes
            </span>
          </nav>
          <h1 className="converterpage__title">Convertidor de Imagenes</h1>
          <p className="converterpage__subtitle">
            Convierte tus imagenes a JPG, PNG, WebP o AVIF directamente en tu navegador.
            Sin subidas a servidores, sin limite de archivos.
          </p>
        </div>
      </div>

      {/* Main layout */}
      <div className="converterpage__body container">
        <div className="converter-layout">

          {/* ---- Controls panel ---- */}
          <section className="converter-panel" aria-label="Configuracion de conversion">

            {/* Drop zone */}
            <div className="converter-panel__section">
              <p className="converter-panel__label">Agregar imagenes</p>
              <div
                className={'converter-dropzone' + (dragOver ? ' converter-dropzone--over' : '')}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                aria-label="Subir imagenes: haz clic o arrastra archivos de imagen"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
                }}
              >
                <span className="converter-dropzone__icon">
                  <UploadIcon />
                </span>
                <p className="converter-dropzone__text">
                  Arrastra imagenes o <strong>haz clic para seleccionar</strong>
                </p>
                <p className="converter-dropzone__hint">
                  JPG, PNG, WebP, BMP, GIF, AVIF. Multiples archivos permitidos.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileInput}
                  className="converter-dropzone__file-input"
                  aria-hidden="true"
                  tabIndex={-1}
                />
              </div>
            </div>

            {/* Output format */}
            <div className="converter-panel__section">
              <p className="converter-panel__label" id="format-label">
                Formato de salida
              </p>
              <div
                className="converter-format-group"
                role="group"
                aria-labelledby="format-label"
              >
                {FORMAT_LABELS.map(({ mime, label }) => (
                  <button
                    key={mime}
                    className={
                      'converter-format-btn' +
                      (outputFormat === mime ? ' converter-format-btn--active' : '')
                    }
                    onClick={() => setOutputFormat(mime)}
                    aria-pressed={outputFormat === mime}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quality */}
            <div className="converter-panel__section">
              <div className="converter-quality">
                <div className="converter-quality__header">
                  <label
                    htmlFor="quality-slider"
                    className="converter-panel__label"
                    style={{ margin: 0 }}
                  >
                    Calidad
                  </label>
                  {qualityActive ? (
                    <span className="converter-quality__value">{quality}%</span>
                  ) : (
                    <span className="converter-quality__disabled-note">Sin perdida (PNG)</span>
                  )}
                </div>
                <input
                  id="quality-slider"
                  type="range"
                  min={1}
                  max={100}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  disabled={!qualityActive}
                  className="converter-quality__slider"
                  aria-valuemin={1}
                  aria-valuemax={100}
                  aria-valuenow={quality}
                  aria-label={'Calidad de compresion: ' + quality + ' por ciento'}
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="converter-panel__actions">
              <button
                className="btn btn--primary btn--md converter-panel__btn-convert"
                onClick={handleConvertAll}
                disabled={!canConvert}
                aria-disabled={!canConvert}
              >
                <ConvertAllIcon />
                {isConverting
                  ? 'Convirtiendo...'
                  : pending > 0
                    ? 'Convertir ' + pending + (pending === 1 ? ' imagen' : ' imagenes')
                    : 'Convertir todo'}
              </button>

              <button
                className="btn btn--accent btn--md converter-panel__btn-zip"
                onClick={handleDownloadZip}
                disabled={!hasDone}
                aria-disabled={!hasDone}
              >
                <ZipIcon />
                Descargar ZIP{hasDone ? ' (' + done + ')' : ''}
              </button>

              {hasFiles && (
                <button
                  className="btn btn--secondary btn--md converter-panel__btn-reset"
                  onClick={handleReset}
                  disabled={isConverting}
                >
                  <ResetIcon />
                  Limpiar todo
                </button>
              )}
            </div>
          </section>

          {/* ---- Preview panel ---- */}
          <section className="converter-preview" aria-label="Lista de archivos">

            {/* Summary bar — only when files present */}
            {hasFiles && (
              <div className="converter-summary" role="status" aria-live="polite">
                <div className="converter-summary__stat">
                  <span className="converter-summary__value">{files.length}</span>
                  <span className="converter-summary__label">Total</span>
                </div>
                <div className="converter-summary__divider" aria-hidden="true" />
                <div className="converter-summary__stat">
                  <span className="converter-summary__value">{pending}</span>
                  <span className="converter-summary__label">Pendientes</span>
                </div>
                <div className="converter-summary__divider" aria-hidden="true" />
                <div className="converter-summary__stat">
                  <span className={'converter-summary__value' + (done > 0 ? ' converter-summary__value--accent' : '')}>
                    {done}
                  </span>
                  <span className="converter-summary__label">Convertidos</span>
                </div>
                {errored > 0 && (
                  <>
                    <div className="converter-summary__divider" aria-hidden="true" />
                    <div className="converter-summary__stat">
                      <span className="converter-summary__value converter-summary__value--error">{errored}</span>
                      <span className="converter-summary__label">Errores</span>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Header row */}
            <div className="converter-preview__header">
              <h2 className="converter-preview__title">
                {hasFiles ? 'Archivos cargados' : 'Vista previa'}
              </h2>
              {hasFiles && (
                <span className="converter-preview__count" aria-live="polite">
                  {files.length} {files.length === 1 ? 'archivo' : 'archivos'}
                </span>
              )}
            </div>

            {/* Empty state */}
            {!hasFiles && (
              <div className="converter-empty" role="region" aria-label="Sin archivos cargados">
                <div className="converter-empty__icon">
                  <ImagesIcon />
                </div>
                <h3 className="converter-empty__title">Sin imagenes aun</h3>
                <p className="converter-empty__text">
                  Arrastra tus imagenes al panel izquierdo o haz clic para seleccionarlas.
                  Puedes subir multiples archivos a la vez.
                </p>
              </div>
            )}

            {/* File list */}
            {hasFiles && (
              <ul className="converter-file-list" role="list" aria-label="Lista de imagenes">
                {files.map((item) => {
                  const sizePct =
                    item.outputSize != null
                      ? ((item.outputSize - item.file.size) / item.file.size) * 100
                      : null;

                  return (
                    <li
                      key={item.id}
                      className={
                        'converter-file-item converter-file-item--' + item.status
                      }
                    >
                      {/* Thumbnail */}
                      <img
                        src={item.preview}
                        alt={'Vista previa de ' + item.file.name}
                        className="converter-file-item__thumb"
                        loading="lazy"
                      />

                      {/* Info */}
                      <div className="converter-file-item__info">
                        <span
                          className="converter-file-item__name"
                          title={item.file.name}
                        >
                          {item.file.name}
                        </span>
                        <div className="converter-file-item__sizes">
                          <span className="converter-file-item__size-original">
                            {formatBytes(item.file.size)}
                          </span>
                          {item.outputSize != null && (
                            <>
                              <span className="converter-file-item__size-arrow" aria-hidden="true">
                                →
                              </span>
                              <span className="converter-file-item__size-new">
                                {formatBytes(item.outputSize)}
                              </span>
                              <span
                                className={
                                  'converter-file-item__delta ' + getDeltaClass(sizePct)
                                }
                                aria-label={getDeltaLabel(sizePct) + ' de cambio en tamano'}
                              >
                                {getDeltaLabel(sizePct)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Status + actions */}
                      <div className="converter-file-item__status">
                        {item.status === 'pending' && (
                          <div
                            className="converter-file-item__badge converter-file-item__badge--pending"
                            title="Pendiente"
                            aria-label="Pendiente de conversion"
                          >
                            <ClockIcon />
                          </div>
                        )}

                        {item.status === 'converting' && (
                          <div
                            className="converter-spinner"
                            role="status"
                            aria-label={'Convirtiendo ' + item.file.name}
                          />
                        )}

                        {item.status === 'done' && (
                          <>
                            <div
                              className="converter-file-item__badge converter-file-item__badge--done"
                              title="Convertido"
                              aria-label="Conversion completada"
                            >
                              <CheckIcon />
                            </div>
                            <button
                              className="converter-file-item__download"
                              onClick={() => handleDownloadOne(item)}
                              aria-label={'Descargar ' + item.file.name + ' convertido'}
                            >
                              <DownloadIcon />
                              Descargar
                            </button>
                          </>
                        )}

                        {item.status === 'error' && (
                          <div
                            className="converter-file-item__badge converter-file-item__badge--error"
                            title="Error"
                            aria-label={'Error al convertir ' + item.file.name}
                          >
                            <ErrorIcon />
                          </div>
                        )}

                        {item.status !== 'converting' && (
                          <button
                            className="converter-file-item__remove"
                            onClick={() => handleRemoveOne(item.id)}
                            aria-label={'Quitar ' + item.file.name + ' de la lista'}
                            title="Quitar archivo"
                          >
                            <TrashIcon />
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
