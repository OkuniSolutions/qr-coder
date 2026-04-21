import React, { useState, useRef, useCallback, useReducer, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
import './PdfCompressor.css';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

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

const PdfPlaceholderIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
    <path d="M21 4H9a2 2 0 0 0-2 2v24a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V13z" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M21 4v9h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11 20h3a2 2 0 0 1 0 4h-2v3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 20v7M20 20h2a2 2 0 0 1 0 4h-2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
    <path d="M25 27v-7h3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M25 23h2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
  </svg>
);

const PdfThumbIcon = () => (
  <svg width="28" height="28" viewBox="0 0 36 36" fill="none" aria-hidden="true">
    <path d="M21 4H9a2 2 0 0 0-2 2v24a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V13z" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M21 4v9h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
  if (pct < -1) return 'pdfcompressor-file-item__delta--positive';
  if (pct > 1)  return 'pdfcompressor-file-item__delta--negative';
  return 'pdfcompressor-file-item__delta--neutral';
}

function getDeltaLabel(pct) {
  if (Math.abs(pct) <= 1) return '~0%';
  const sign = pct < 0 ? '-' : '+';
  return sign + Math.abs(pct).toFixed(1) + '%';
}

const PRESETS = {
  alta:  { scale: 2.0, quality: 0.85, label: 'Alta calidad',       hint: 'Menor compresi\u00f3n' },
  media: { scale: 1.5, quality: 0.65, label: 'Calidad media',      hint: 'Buen balance' },
  baja:  { scale: 1.0, quality: 0.40, label: 'M\u00e1xima compresi\u00f3n', hint: 'Ideal para correo' },
};

/* =============================================
   COMPRESSION
   ============================================= */
async function compressPdf(file, preset, onProgress) {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdfDoc.numPages;

  let pdf = null;

  for (let i = 1; i <= numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale: preset.scale });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');

    await page.render({ canvasContext: ctx, viewport }).promise;

    const dataUrl = canvas.toDataURL('image/jpeg', preset.quality);

    const widthMm = (viewport.width / preset.scale) * 25.4 / 72;
    const heightMm = (viewport.height / preset.scale) * 25.4 / 72;
    const orientation = widthMm > heightMm ? 'landscape' : 'portrait';

    if (i === 1) {
      pdf = new jsPDF({
        orientation,
        unit: 'mm',
        format: [
          orientation === 'landscape' ? Math.max(widthMm, heightMm) : Math.min(widthMm, heightMm),
          orientation === 'landscape' ? Math.min(widthMm, heightMm) : Math.max(widthMm, heightMm),
        ],
      });
    } else {
      pdf.addPage(
        [
          orientation === 'landscape' ? Math.max(widthMm, heightMm) : Math.min(widthMm, heightMm),
          orientation === 'landscape' ? Math.min(widthMm, heightMm) : Math.max(widthMm, heightMm),
        ],
        orientation
      );
    }

    pdf.addImage(dataUrl, 'JPEG', 0, 0, widthMm, heightMm, undefined, 'FAST');

    // Free memory
    canvas.width = 0;
    canvas.height = 0;

    onProgress(i, numPages);
  }

  const blob = pdf.output('blob');
  return { blob, pageCount: numPages };
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
        status: 'pending',
        outputBlob: null,
        outputSize: null,
        pageCount: null,
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
          ? { ...item, status: 'done', outputBlob: action.blob, outputSize: action.blob.size, pageCount: action.pageCount }
          : item
      );
    case 'SET_ERROR':
      return state.map((item) =>
        item.id === action.id ? { ...item, status: 'error', errorMsg: action.msg || null } : item
      );
    case 'REMOVE':
      return state.filter((i) => i.id !== action.id);
    case 'RESET':
      return [];
    default:
      return state;
  }
}

/* =============================================
   COMPONENT
   ============================================= */
export default function PdfCompressor() {
  useEffect(() => { document.title = 'Compresor de PDF \u2014 OkuniSolutions Apps'; }, []);

  const [files, dispatch] = useReducer(filesReducer, []);
  const [qualityPreset, setQualityPreset] = useState('media');
  const [isCompressing, setIsCompressing] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(null);
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
    const accepted = Array.from(rawFiles).filter((f) => f.type === 'application/pdf');
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

    const preset = PRESETS[qualityPreset];

    for (const item of targets) {
      dispatch({ type: 'SET_STATUS', id: item.id, status: 'compressing' });
      setCurrentProgress({ fileId: item.id, page: 0, total: 0 });
      try {
        const { blob, pageCount } = await compressPdf(item.file, preset, (page, total) => {
          setCurrentProgress({ fileId: item.id, page, total });
        });
        dispatch({ type: 'SET_RESULT', id: item.id, blob, pageCount });
      } catch (err) {
        const isPasswordProtected = err?.message?.toLowerCase().includes('password');
        dispatch({
          type: 'SET_ERROR',
          id: item.id,
          msg: isPasswordProtected
            ? 'PDF protegido con contrase\u00f1a'
            : null,
        });
      }
    }

    setCurrentProgress(null);
    setIsCompressing(false);
  }, [files, qualityPreset]);

  const handleDownloadOne = useCallback((item) => {
    if (!item.outputBlob) return;
    const baseName = item.file.name.replace(/\.pdf$/i, '');
    const url = URL.createObjectURL(item.outputBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = baseName + '_comprimido.pdf';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }, []);

  const handleDownloadZip = useCallback(async () => {
    const doneItems = files.filter((f) => f.status === 'done' && f.outputBlob);
    if (doneItems.length === 0) return;
    const zip = new JSZip();
    const folder = zip.folder('pdfs-comprimidos');
    doneItems.forEach((item) => {
      const baseName = item.file.name.replace(/\.pdf$/i, '');
      folder.file(baseName + '_comprimido.pdf', item.outputBlob);
    });
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pdfs-comprimidos.zip';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }, [files]);

  const handleRemoveOne = useCallback((id) => {
    dispatch({ type: 'REMOVE', id });
  }, []);

  const handleReset = useCallback(() => {
    dispatch({ type: 'RESET' });
    setIsCompressing(false);
    setCurrentProgress(null);
  }, []);

  return (
    <div className="pdfcompressorpage">
      <div className="pdfcompressorpage__header">
        <div className="container">
          <nav className="pdfcompressorpage__breadcrumb" aria-label="Miga de pan">
            <span className="pdfcompressorpage__breadcrumb-item">Servicios</span>
            <span className="pdfcompressorpage__breadcrumb-sep" aria-hidden="true">/</span>
            <span className="pdfcompressorpage__breadcrumb-item pdfcompressorpage__breadcrumb-item--current">
              Compresor de PDF
            </span>
          </nav>
          <h1 className="pdfcompressorpage__title">Compresor de PDF</h1>
          <p className="pdfcompressorpage__subtitle">
            Reduce el tama&ntilde;o de tus archivos PDF directamente en tu navegador.
            Procesamiento 100% local, sin subidas a servidores.
          </p>
        </div>
      </div>

      <div className="pdfcompressorpage__body container">
        <div className="pdfcompressor-layout">

          <section className="pdfcompressor-panel" aria-label="Configuraci&oacute;n de compresi&oacute;n">

            <div className="pdfcompressor-panel__section">
              <p className="pdfcompressor-panel__label">Agregar archivos PDF</p>
              <div
                className={'pdfcompressor-dropzone' + (dragOver ? ' pdfcompressor-dropzone--over' : '')}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                aria-label="Subir PDFs: haz clic o arrastra archivos PDF"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
                }}
              >
                <span className="pdfcompressor-dropzone__icon">
                  <UploadIcon />
                </span>
                <p className="pdfcompressor-dropzone__text">
                  Arrastra archivos PDF o <strong>haz clic para seleccionar</strong>
                </p>
                <p className="pdfcompressor-dropzone__hint">
                  PDF. M&uacute;ltiples archivos permitidos.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  multiple
                  onChange={handleFileInput}
                  className="pdfcompressor-dropzone__file-input"
                  aria-hidden="true"
                  tabIndex={-1}
                />
              </div>
            </div>

            <div className="pdfcompressor-panel__section">
              <p className="pdfcompressor-panel__label" id="pdf-preset-label">Nivel de compresi&oacute;n</p>
              <div className="pdfcompressor-preset" role="group" aria-labelledby="pdf-preset-label">
                {Object.entries(PRESETS).map(([key, { label, hint }]) => (
                  <button
                    key={key}
                    className={'pdfcompressor-preset__option' + (qualityPreset === key ? ' pdfcompressor-preset__option--active' : '')}
                    onClick={() => setQualityPreset(key)}
                    aria-pressed={qualityPreset === key}
                  >
                    <span className="pdfcompressor-preset__label">{label}</span>
                    <span className="pdfcompressor-preset__hint">{hint}</span>
                  </button>
                ))}
              </div>
              <p className="pdfcompressor-warning">
                Nota: La compresi&oacute;n convierte las p&aacute;ginas a im&aacute;genes. El texto no ser&aacute; seleccionable en el PDF resultante.
              </p>
            </div>

            <div className="pdfcompressor-panel__actions">
              <button
                className="btn btn--primary btn--md pdfcompressor-panel__btn-compress"
                onClick={handleCompressAll}
                disabled={!canCompress}
                aria-disabled={!canCompress}
              >
                <CompressAllIcon />
                {isCompressing
                  ? 'Comprimiendo...'
                  : pending > 0
                    ? 'Comprimir ' + pending + (pending === 1 ? ' archivo' : ' archivos')
                    : 'Comprimir todo'}
              </button>

              <button
                className="btn btn--accent btn--md pdfcompressor-panel__btn-zip"
                onClick={handleDownloadZip}
                disabled={!hasDone}
                aria-disabled={!hasDone}
              >
                <ZipIcon />
                Descargar ZIP{hasDone ? ' (' + done + ')' : ''}
              </button>

              {hasFiles && (
                <button
                  className="btn btn--secondary btn--md pdfcompressor-panel__btn-reset"
                  onClick={handleReset}
                  disabled={isCompressing}
                >
                  <ResetIcon />
                  Limpiar todo
                </button>
              )}
            </div>
          </section>

          <section className="pdfcompressor-preview" aria-label="Lista de archivos">

            {hasFiles && (
              <div className="pdfcompressor-summary" role="status" aria-live="polite">
                <div className="pdfcompressor-summary__stat">
                  <span className="pdfcompressor-summary__value">{files.length}</span>
                  <span className="pdfcompressor-summary__label">Total</span>
                </div>
                <div className="pdfcompressor-summary__divider" aria-hidden="true" />
                <div className="pdfcompressor-summary__stat">
                  <span className="pdfcompressor-summary__value">{pending}</span>
                  <span className="pdfcompressor-summary__label">Pendientes</span>
                </div>
                <div className="pdfcompressor-summary__divider" aria-hidden="true" />
                <div className="pdfcompressor-summary__stat">
                  <span className={'pdfcompressor-summary__value' + (done > 0 ? ' pdfcompressor-summary__value--accent' : '')}>
                    {done}
                  </span>
                  <span className="pdfcompressor-summary__label">Comprimidos</span>
                </div>
                {errored > 0 && (
                  <>
                    <div className="pdfcompressor-summary__divider" aria-hidden="true" />
                    <div className="pdfcompressor-summary__stat">
                      <span className="pdfcompressor-summary__value pdfcompressor-summary__value--error">{errored}</span>
                      <span className="pdfcompressor-summary__label">Errores</span>
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="pdfcompressor-preview__header">
              <h2 className="pdfcompressor-preview__title">
                {hasFiles ? 'Archivos cargados' : 'Vista previa'}
              </h2>
              {hasFiles && (
                <span className="pdfcompressor-preview__count" aria-live="polite">
                  {files.length} {files.length === 1 ? 'archivo' : 'archivos'}
                </span>
              )}
            </div>

            {!hasFiles && (
              <div className="pdfcompressor-empty" role="region" aria-label="Sin archivos cargados">
                <div className="pdfcompressor-empty__icon">
                  <PdfPlaceholderIcon />
                </div>
                <h3 className="pdfcompressor-empty__title">Sin archivos a&uacute;n</h3>
                <p className="pdfcompressor-empty__text">
                  Arrastra tus archivos PDF al panel izquierdo o haz clic para seleccionarlos.
                  Puedes subir m&uacute;ltiples archivos a la vez.
                </p>
              </div>
            )}

            {hasFiles && (
              <ul className="pdfcompressor-file-list" role="list" aria-label="Lista de PDFs">
                {files.map((item) => {
                  const sizePct =
                    item.outputSize != null
                      ? ((item.outputSize - item.file.size) / item.file.size) * 100
                      : null;

                  const progressLabel =
                    currentProgress && currentProgress.fileId === item.id && item.status === 'compressing'
                      ? 'P\u00e1gina ' + currentProgress.page + ' de ' + currentProgress.total
                      : null;

                  return (
                    <li
                      key={item.id}
                      className={'pdfcompressor-file-item pdfcompressor-file-item--' + item.status}
                    >
                      <div className="pdfcompressor-file-item__thumb">
                        <PdfThumbIcon />
                      </div>

                      <div className="pdfcompressor-file-item__info">
                        <span className="pdfcompressor-file-item__name" title={item.file.name}>
                          {item.file.name}
                        </span>
                        <div className="pdfcompressor-file-item__sizes">
                          <span className="pdfcompressor-file-item__size-original">
                            {formatBytes(item.file.size)}
                            {item.pageCount != null && (' \u00b7 ' + item.pageCount + (item.pageCount === 1 ? ' p\u00e1gina' : ' p\u00e1ginas'))}
                          </span>
                          {item.outputSize != null && (
                            <>
                              <span className="pdfcompressor-file-item__size-arrow" aria-hidden="true">
                                &rarr;
                              </span>
                              <span className="pdfcompressor-file-item__size-new">
                                {formatBytes(item.outputSize)}
                              </span>
                              <span
                                className={'pdfcompressor-file-item__delta ' + getDeltaClass(sizePct)}
                                aria-label={getDeltaLabel(sizePct) + ' de cambio en tama\u00f1o'}
                              >
                                {getDeltaLabel(sizePct)}
                              </span>
                            </>
                          )}
                        </div>
                        {progressLabel && (
                          <span className="pdfcompressor-file-item__progress">{progressLabel}</span>
                        )}
                        {item.errorMsg && (
                          <span className="pdfcompressor-file-item__error-msg">{item.errorMsg}</span>
                        )}
                      </div>

                      <div className="pdfcompressor-file-item__status">
                        {item.status === 'pending' && (
                          <div
                            className="pdfcompressor-file-item__badge pdfcompressor-file-item__badge--pending"
                            title="Pendiente"
                            aria-label="Pendiente de compresi\u00f3n"
                          >
                            <ClockIcon />
                          </div>
                        )}

                        {item.status === 'compressing' && (
                          <div
                            className="pdfcompressor-spinner"
                            role="status"
                            aria-label={'Comprimiendo ' + item.file.name}
                          />
                        )}

                        {item.status === 'done' && (
                          <>
                            <div
                              className="pdfcompressor-file-item__badge pdfcompressor-file-item__badge--done"
                              title="Comprimido"
                              aria-label="Compresi\u00f3n completada"
                            >
                              <CheckIcon />
                            </div>
                            <button
                              className="pdfcompressor-file-item__download"
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
                            className="pdfcompressor-file-item__badge pdfcompressor-file-item__badge--error"
                            title="Error"
                            aria-label={'Error al comprimir ' + item.file.name}
                          >
                            <ErrorIcon />
                          </div>
                        )}

                        {item.status !== 'compressing' && (
                          <button
                            className="pdfcompressor-file-item__remove"
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
