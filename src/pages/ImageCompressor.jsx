import React, { useState, useRef, useCallback, useReducer, useEffect } from 'react';
import JSZip from 'jszip';
import imageCompression from 'browser-image-compression';
import './ImageCompressor.css';

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

const CompressAllIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
    <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M5 5l3 3M16 16l3 3M19 5l-3 3M5 19l3-3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
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
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function getDeltaClass(pct) {
  if (pct < -1) return 'compressor-file-item__delta--positive';
  if (pct > 1)  return 'compressor-file-item__delta--negative';
  return 'compressor-file-item__delta--neutral';
}

function getDeltaLabel(pct) {
  if (Math.abs(pct) <= 1) return '~0%';
  const sign = pct < 0 ? '-' : '+';
  return sign + Math.abs(pct).toFixed(1) + '%';
}

function getFileExt(filename) {
  const match = filename.match(/\.([^.]+)$/);
  return match ? match[1].toLowerCase() : 'jpg';
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
export default function ImageCompressor() {
  useEffect(() => { document.title = 'Compresor de Im\u00e1genes \u2014 OkuniSolutions Apps'; }, []);

  const [files, dispatch] = useReducer(filesReducer, []);
  const [maxSizeMB, setMaxSizeMB] = useState(1);
  const [initialQuality, setInitialQuality] = useState(0.8);
  const [maxWidthOrHeight, setMaxWidthOrHeight] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const pending     = files.filter((f) => f.status === 'pending').length;
  const done        = files.filter((f) => f.status === 'done').length;
  const errored     = files.filter((f) => f.status === 'error').length;
  const hasFiles    = files.length > 0;
  const hasDone     = done > 0;
  const canCompress = hasFiles && pending > 0 && !isCompressing;

  const handleDragOver  = useCallback((e) => { e.preventDefault(); setDragOver(true); }, []);
  const handleDragLeave = useCallback(() => setDragOver(false), []);

  const acceptFiles = useCallback((rawFiles) => {
    const accepted = Array.from(rawFiles).filter((f) =>
      ['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(f.type)
    );
    if (accepted.length === 0) return;
    dispatch({ type: 'ADD_FILES', files: accepted });
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

  const handleCompressAll = useCallback(async () => {
    const targets = files.filter((f) => f.status === 'pending');
    if (targets.length === 0) return;
    setIsCompressing(true);

    const parsedMax = parseFloat(maxWidthOrHeight);
    const options = {
      maxSizeMB: maxSizeMB,
      initialQuality: initialQuality,
      useWebWorker: true,
      preserveExif: false,
      ...(parsedMax > 0 && { maxWidthOrHeight: parsedMax }),
    };

    for (const item of targets) {
      dispatch({ type: 'SET_STATUS', id: item.id, status: 'compressing' });
      try {
        const compressed = await imageCompression(item.file, options);
        dispatch({ type: 'SET_RESULT', id: item.id, blob: compressed });
      } catch {
        dispatch({ type: 'SET_ERROR', id: item.id });
      }
    }

    setIsCompressing(false);
  }, [files, maxSizeMB, initialQuality, maxWidthOrHeight]);

  const handleDownloadOne = useCallback((item) => {
    if (!item.outputBlob) return;
    const ext = getFileExt(item.file.name);
    const baseName = item.file.name.replace(/\.[^.]+$/, '');
    const url = URL.createObjectURL(item.outputBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = baseName + '_compressed.' + ext;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }, []);

  const handleDownloadZip = useCallback(async () => {
    const doneItems = files.filter((f) => f.status === 'done' && f.outputBlob);
    if (doneItems.length === 0) return;
    const zip = new JSZip();
    const folder = zip.folder('compressed-images');
    doneItems.forEach((item) => {
      const ext = getFileExt(item.file.name);
      const baseName = item.file.name.replace(/\.[^.]+$/, '');
      folder.file(baseName + '_compressed.' + ext, item.outputBlob);
    });
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'compressed-images.zip';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }, [files]);

  const handleRemoveOne = useCallback((id) => {
    dispatch({ type: 'REMOVE', id });
  }, []);

  const handleReset = useCallback(() => {
    dispatch({ type: 'RESET' });
    setIsCompressing(false);
  }, []);

  return (
    <div className="compressorpage">
      <div className="compressorpage__header">
        <div className="container">
          <nav className="compressorpage__breadcrumb" aria-label="Miga de pan">
            <span className="compressorpage__breadcrumb-item">Servicios</span>
            <span className="compressorpage__breadcrumb-sep" aria-hidden="true">/</span>
            <span className="compressorpage__breadcrumb-item compressorpage__breadcrumb-item--current">
              Compresor de Im\u00e1genes
            </span>
          </nav>
          <h1 className="compressorpage__title">Compresor de Im\u00e1genes</h1>
          <p className="compressorpage__subtitle">
            Reduce el peso de tus im\u00e1genes sin perder calidad visible.
            Procesamiento 100% local, sin subidas a servidores.
          </p>
        </div>
      </div>

      <div className="compressorpage__body container">
        <div className="compressor-layout">

          <section className="compressor-panel" aria-label="Configuraci\u00f3n de compresi\u00f3n">

            <div className="compressor-panel__section">
              <p className="compressor-panel__label">Agregar im\u00e1genes</p>
              <div
                className={'compressor-dropzone' + (dragOver ? ' compressor-dropzone--over' : '')}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                aria-label="Subir im\u00e1genes: haz clic o arrastra archivos de imagen"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
                }}
              >
                <span className="compressor-dropzone__icon">
                  <UploadIcon />
                </span>
                <p className="compressor-dropzone__text">
                  Arrastra im\u00e1genes o <strong>haz clic para seleccionar</strong>
                </p>
                <p className="compressor-dropzone__hint">
                  JPG, PNG, WebP, AVIF. M\u00faltiples archivos permitidos.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  multiple
                  onChange={handleFileInput}
                  className="compressor-dropzone__file-input"
                  aria-hidden="true"
                  tabIndex={-1}
                />
              </div>
            </div>

            <div className="compressor-panel__section">
              <div className="compressor-quality">
                <div className="compressor-quality__header">
                  <label htmlFor="maxsize-slider" className="compressor-panel__label" style={{ margin: 0 }}>
                    Calidad
                  </label>
                  <span className="compressor-quality__value">M\u00e1x. {maxSizeMB} MB</span>
                </div>
                <input
                  id="maxsize-slider"
                  type="range"
                  min={0.1}
                  max={10}
                  step={0.1}
                  value={maxSizeMB}
                  onChange={(e) => setMaxSizeMB(Number(e.target.value))}
                  className="compressor-quality__slider"
                  aria-valuemin={0.1}
                  aria-valuemax={10}
                  aria-valuenow={maxSizeMB}
                  aria-valuetext={'M\u00e1ximo ' + maxSizeMB + ' MB'}
                  aria-label={'Tama\u00f1o m\u00e1ximo de salida: ' + maxSizeMB + ' MB'}
                />
              </div>
            </div>

            <div className="compressor-panel__section">
              <div className="compressor-quality">
                <div className="compressor-quality__header">
                  <label htmlFor="quality-slider" className="compressor-panel__label" style={{ margin: 0 }}>
                    Calidad visual
                  </label>
                  <span className="compressor-quality__value">
                    {Math.round(initialQuality * 100)}%
                  </span>
                </div>
                <input
                  id="quality-slider"
                  type="range"
                  min={0.1}
                  max={1.0}
                  step={0.05}
                  value={initialQuality}
                  onChange={(e) => setInitialQuality(Number(e.target.value))}
                  className="compressor-quality__slider"
                  aria-valuemin={10}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(initialQuality * 100)}
                  aria-valuetext={Math.round(initialQuality * 100) + ' por ciento'}
                  aria-label={'Calidad visual: ' + Math.round(initialQuality * 100) + ' por ciento'}
                />
              </div>
            </div>

            <div className="compressor-panel__section">
              <label htmlFor="maxres-input" className="compressor-panel__label">
                M\u00e1x. resoluci\u00f3n (px)
              </label>
              <input
                id="maxres-input"
                type="number"
                min={1}
                value={maxWidthOrHeight}
                onChange={(e) => setMaxWidthOrHeight(e.target.value)}
                placeholder="Sin l\u00edmite"
                className="compressor-res-input"
                aria-label="Resoluci\u00f3n m\u00e1xima en p\u00edxeles (ancho o alto)"
              />
            </div>

            <div className="compressor-panel__actions">
              <button
                className="btn btn--primary btn--md compressor-panel__btn-compress"
                onClick={handleCompressAll}
                disabled={!canCompress}
                aria-disabled={!canCompress}
              >
                <CompressAllIcon />
                {isCompressing
                  ? 'Comprimiendo...'
                  : pending > 0
                    ? 'Comprimir ' + pending + (pending === 1 ? ' imagen' : ' im\u00e1genes')
                    : 'Comprimir todo'}
              </button>

              <button
                className="btn btn--accent btn--md compressor-panel__btn-zip"
                onClick={handleDownloadZip}
                disabled={!hasDone}
                aria-disabled={!hasDone}
              >
                <ZipIcon />
                Descargar ZIP{hasDone ? ' (' + done + ')' : ''}
              </button>

              {hasFiles && (
                <button
                  className="btn btn--secondary btn--md compressor-panel__btn-reset"
                  onClick={handleReset}
                  disabled={isCompressing}
                >
                  <ResetIcon />
                  Limpiar todo
                </button>
              )}
            </div>
          </section>

          <section className="compressor-preview" aria-label="Lista de archivos">

            {hasFiles && (
              <div className="compressor-summary" role="status" aria-live="polite">
                <div className="compressor-summary__stat">
                  <span className="compressor-summary__value">{files.length}</span>
                  <span className="compressor-summary__label">Total</span>
                </div>
                <div className="compressor-summary__divider" aria-hidden="true" />
                <div className="compressor-summary__stat">
                  <span className="compressor-summary__value">{pending}</span>
                  <span className="compressor-summary__label">Pendientes</span>
                </div>
                <div className="compressor-summary__divider" aria-hidden="true" />
                <div className="compressor-summary__stat">
                  <span className={'compressor-summary__value' + (done > 0 ? ' compressor-summary__value--accent' : '')}>
                    {done}
                  </span>
                  <span className="compressor-summary__label">Comprimidos</span>
                </div>
                {errored > 0 && (
                  <>
                    <div className="compressor-summary__divider" aria-hidden="true" />
                    <div className="compressor-summary__stat">
                      <span className="compressor-summary__value compressor-summary__value--error">{errored}</span>
                      <span className="compressor-summary__label">Errores</span>
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="compressor-preview__header">
              <h2 className="compressor-preview__title">
                {hasFiles ? 'Archivos cargados' : 'Vista previa'}
              </h2>
              {hasFiles && (
                <span className="compressor-preview__count" aria-live="polite">
                  {files.length} {files.length === 1 ? 'archivo' : 'archivos'}
                </span>
              )}
            </div>

            {!hasFiles && (
              <div className="compressor-empty" role="region" aria-label="Sin archivos cargados">
                <div className="compressor-empty__icon">
                  <ImagesIcon />
                </div>
                <h3 className="compressor-empty__title">Sin im\u00e1genes a\u00fan</h3>
                <p className="compressor-empty__text">
                  Arrastra tus im\u00e1genes al panel izquierdo o haz clic para seleccionarlas.
                  Puedes subir m\u00faltiples archivos a la vez.
                </p>
              </div>
            )}

            {hasFiles && (
              <ul className="compressor-file-list" role="list" aria-label="Lista de im\u00e1genes">
                {files.map((item) => {
                  const sizePct =
                    item.outputSize != null
                      ? ((item.outputSize - item.file.size) / item.file.size) * 100
                      : null;

                  return (
                    <li
                      key={item.id}
                      className={'compressor-file-item compressor-file-item--' + item.status}
                    >
                      <img
                        src={item.preview}
                        alt={'Vista previa de ' + item.file.name}
                        className="compressor-file-item__thumb"
                        loading="lazy"
                      />

                      <div className="compressor-file-item__info">
                        <span className="compressor-file-item__name" title={item.file.name}>
                          {item.file.name}
                        </span>
                        <div className="compressor-file-item__sizes">
                          <span className="compressor-file-item__size-original">
                            {formatBytes(item.file.size)}
                          </span>
                          {item.outputSize != null && (
                            <>
                              <span className="compressor-file-item__size-arrow" aria-hidden="true">
                                &rarr;
                              </span>
                              <span className="compressor-file-item__size-new">
                                {formatBytes(item.outputSize)}
                              </span>
                              <span
                                className={'compressor-file-item__delta ' + getDeltaClass(sizePct)}
                                aria-label={getDeltaLabel(sizePct) + ' de cambio en tama\u00f1o'}
                              >
                                {getDeltaLabel(sizePct)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="compressor-file-item__status">
                        {item.status === 'pending' && (
                          <div
                            className="compressor-file-item__badge compressor-file-item__badge--pending"
                            title="Pendiente"
                            aria-label="Pendiente de compresi\u00f3n"
                          >
                            <ClockIcon />
                          </div>
                        )}

                        {item.status === 'compressing' && (
                          <div
                            className="compressor-spinner"
                            role="status"
                            aria-label={'Comprimiendo ' + item.file.name}
                          />
                        )}

                        {item.status === 'done' && (
                          <>
                            <div
                              className="compressor-file-item__badge compressor-file-item__badge--done"
                              title="Comprimido"
                              aria-label="Compresi\u00f3n completada"
                            >
                              <CheckIcon />
                            </div>
                            <button
                              className="compressor-file-item__download"
                              onClick={() => handleDownloadOne(item)}
                              aria-label={'Descargar ' + item.file.name + ' comprimido'}
                            >
                              <DownloadIcon />
                              Descargar
                            </button>
                          </>
                        )}

                        {item.status === 'error' && (
                          <div
                            className="compressor-file-item__badge compressor-file-item__badge--error"
                            title="Error"
                            aria-label={'Error al comprimir ' + item.file.name}
                          >
                            <ErrorIcon />
                          </div>
                        )}

                        {item.status !== 'compressing' && (
                          <button
                            className="compressor-file-item__remove"
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
