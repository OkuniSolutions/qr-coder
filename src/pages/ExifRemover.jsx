import React, { useState, useRef, useCallback, useReducer, useEffect } from 'react';
import JSZip from 'jszip';
import piexif from 'piexifjs';
import './ExifRemover.css';

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

const CleanAllIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 11l4 4M14 11l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
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

const ShieldIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
    <path d="M18 3L5 8v10c0 8.5 5.7 16.4 13 18 7.3-1.6 13-9.5 13-18V8L18 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13 18l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

function getFileExt(file) {
  const match = file.name.match(/\.([^.]+)$/);
  return match ? match[1].toLowerCase() : 'jpg';
}

function readExifTags(file) {
  return new Promise((resolve) => {
    if (!file.type.includes('jpeg')) { resolve([]); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const exifData = piexif.load(e.target.result);
        const tags = [];

        if (exifData['GPS'] && Object.keys(exifData['GPS']).length > 0) {
          tags.push({ key: 'GPS', label: 'Ubicacion GPS', risk: 'high' });
        }
        const dateTag = exifData['0th']?.[piexif.ImageIFD.DateTime];
        if (dateTag) tags.push({ key: 'DateTime', label: 'Fecha: ' + dateTag, risk: 'low' });
        const make = exifData['0th']?.[piexif.ImageIFD.Make];
        const model = exifData['0th']?.[piexif.ImageIFD.Model];
        if (make || model) {
          tags.push({ key: 'Camera', label: 'Camara: ' + [make, model].filter(Boolean).join(' '), risk: 'low' });
        }
        const software = exifData['0th']?.[piexif.ImageIFD.Software];
        if (software) tags.push({ key: 'Software', label: 'Software: ' + software, risk: 'low' });
        const author = exifData['0th']?.[piexif.ImageIFD.Artist];
        if (author) tags.push({ key: 'Author', label: 'Autor: ' + author, risk: 'medium' });

        resolve(tags);
      } catch { resolve([]); }
    };
    reader.onerror = () => resolve([]);
    reader.readAsDataURL(file);
  });
}

function removeMetadata(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (file.type === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('toBlob failed'));
        },
        file.type === 'image/png' ? 'image/png' : 'image/jpeg',
        0.95
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Load failed')); };
    img.src = url;
  });
}

/* =============================================
   REDUCER
   ============================================= */
function filesReducer(state, action) {
  switch (action.type) {
    case 'ADD_FILES': {
      const incoming = action.items.map(({ id, file }) => ({
        id,
        file,
        preview: URL.createObjectURL(file),
        status: 'pending',
        exifTags: [],
        exifLoaded: false,
        outputBlob: null,
        outputSize: null,
      }));
      return [...state, ...incoming];
    }
    case 'SET_EXIF':
      return state.map((item) =>
        item.id === action.id
          ? { ...item, exifTags: action.tags, exifLoaded: true }
          : item
      );
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
      const found = state.find((i) => i.id === action.id);
      if (found) URL.revokeObjectURL(found.preview);
      return state.filter((i) => i.id !== action.id);
    }
    case 'RESET':
      state.forEach((item) => URL.revokeObjectURL(item.preview));
      return [];
    default:
      return state;
  }
}

/* =============================================
   COMPONENT
   ============================================= */
export default function ExifRemover() {
  useEffect(() => { document.title = 'Eliminador de Metadata — OkuniSolutions Apps'; }, []);

  const [files, dispatch] = useReducer(filesReducer, []);
  const [isCleaning, setIsCleaning] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const pending  = files.filter((f) => f.status === 'pending').length;
  const done     = files.filter((f) => f.status === 'done').length;
  const withMeta = files.filter((f) => f.exifLoaded && f.exifTags.length > 0).length;
  const noMeta   = files.filter((f) => f.exifLoaded && f.exifTags.length === 0).length;
  const hasFiles = files.length > 0;
  const hasDone  = done > 0;
  const canClean = hasFiles && pending > 0 && !isCleaning;

  const handleDragOver  = useCallback((e) => { e.preventDefault(); setDragOver(true); }, []);
  const handleDragLeave = useCallback(() => setDragOver(false), []);

  const acceptFiles = useCallback((rawFiles) => {
    const images = Array.from(rawFiles).filter(
      (f) => f.type === 'image/jpeg' || f.type === 'image/png' || f.type === 'image/webp'
    );
    if (images.length === 0) return;

    const newItems = images.map((file) => ({ id: crypto.randomUUID(), file }));
    dispatch({ type: 'ADD_FILES', items: newItems });

    newItems.forEach(({ id, file }) => {
      readExifTags(file).then((tags) => {
        dispatch({ type: 'SET_EXIF', id, tags });
      });
    });
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

  const handleCleanAll = useCallback(async () => {
    const targets = files.filter((f) => f.status === 'pending');
    if (targets.length === 0) return;
    setIsCleaning(true);

    for (const item of targets) {
      dispatch({ type: 'SET_STATUS', id: item.id, status: 'cleaning' });
      try {
        const blob = await removeMetadata(item.file);
        dispatch({ type: 'SET_RESULT', id: item.id, blob });
      } catch {
        dispatch({ type: 'SET_ERROR', id: item.id });
      }
    }

    setIsCleaning(false);
  }, [files]);

  const handleDownloadOne = useCallback((item) => {
    if (!item.outputBlob) return;
    const ext = getFileExt(item.file);
    const baseName = item.file.name.replace(/\.[^.]+$/, '');
    const url = URL.createObjectURL(item.outputBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = baseName + '_clean.' + ext;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }, []);

  const handleDownloadZip = useCallback(async () => {
    const doneItems = files.filter((f) => f.status === 'done' && f.outputBlob);
    if (doneItems.length === 0) return;
    const zip = new JSZip();
    const folder = zip.folder('clean-images');
    doneItems.forEach((item) => {
      const ext = getFileExt(item.file);
      const baseName = item.file.name.replace(/\.[^.]+$/, '');
      folder.file(baseName + '_clean.' + ext, item.outputBlob);
    });
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clean-images.zip';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }, [files]);

  const handleRemoveOne = useCallback((id) => {
    dispatch({ type: 'REMOVE', id });
  }, []);

  const handleReset = useCallback(() => {
    dispatch({ type: 'RESET' });
    setIsCleaning(false);
  }, []);

  return (
    <div className="exifpage">
      <div className="exifpage__header">
        <div className="container">
          <nav className="exifpage__breadcrumb" aria-label="Miga de pan">
            <span className="exifpage__breadcrumb-item">Servicios</span>
            <span className="exifpage__breadcrumb-sep" aria-hidden="true">/</span>
            <span className="exifpage__breadcrumb-item exifpage__breadcrumb-item--current">
              Eliminador de Metadata
            </span>
          </nav>
          <h1 className="exifpage__title">Eliminador de Metadata</h1>
          <p className="exifpage__subtitle">
            Elimina datos EXIF, GPS y metadata privada de tus fotos antes de compartirlas.
            Todo se procesa localmente en tu navegador.
          </p>
        </div>
      </div>

      <div className="exifpage__body container">
        <div className="exif-layout">

          {/* Controls panel */}
          <section className="exif-panel" aria-label="Controles de limpieza de metadata">

            <div className="exif-panel__section">
              <p className="exif-panel__label">Agregar imagenes</p>
              <div
                className={'exif-dropzone' + (dragOver ? ' exif-dropzone--over' : '')}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                aria-label="Subir imagenes: haz clic o arrastra archivos JPG, PNG o WebP"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
                }}
              >
                <span className="exif-dropzone__icon">
                  <UploadIcon />
                </span>
                <p className="exif-dropzone__text">
                  Arrastra imagenes o <strong>haz clic para seleccionar</strong>
                </p>
                <p className="exif-dropzone__hint">
                  JPG, PNG, WebP. Multiples archivos permitidos.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleFileInput}
                  className="exif-dropzone__file-input"
                  aria-hidden="true"
                  tabIndex={-1}
                />
              </div>
            </div>

            <div className="exif-panel__actions">
              <button
                className="btn btn--primary btn--md exif-panel__btn-clean"
                onClick={handleCleanAll}
                disabled={!canClean}
                aria-disabled={!canClean}
              >
                <CleanAllIcon />
                {isCleaning
                  ? 'Limpiando...'
                  : pending > 0
                    ? 'Limpiar metadata de ' + pending + (pending === 1 ? ' imagen' : ' imagenes')
                    : 'Limpiar metadata de todo'}
              </button>

              <button
                className="btn btn--accent btn--md exif-panel__btn-zip"
                onClick={handleDownloadZip}
                disabled={!hasDone}
                aria-disabled={!hasDone}
              >
                <ZipIcon />
                {'Descargar ZIP' + (hasDone ? ' (' + done + ')' : '')}
              </button>

              {hasFiles && (
                <button
                  className="btn btn--secondary btn--md exif-panel__btn-reset"
                  onClick={handleReset}
                  disabled={isCleaning}
                >
                  <ResetIcon />
                  Limpiar todo
                </button>
              )}
            </div>

            <div className="exif-panel__note" role="note">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.25C16.5 22.15 20 17.25 20 12V6l-8-4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Los archivos se procesan localmente. Ningun dato sale de tu navegador.
            </div>
          </section>

          {/* Preview panel */}
          <section className="exif-preview" aria-label="Lista de archivos">

            {hasFiles && (
              <div className="exif-summary" role="status" aria-live="polite">
                <div className="exif-summary__stat">
                  <span className="exif-summary__value">{files.length}</span>
                  <span className="exif-summary__label">Total</span>
                </div>
                <div className="exif-summary__divider" aria-hidden="true" />
                <div className="exif-summary__stat">
                  <span className={'exif-summary__value' + (withMeta > 0 ? ' exif-summary__value--warn' : '')}>
                    {withMeta}
                  </span>
                  <span className="exif-summary__label">Con metadata</span>
                </div>
                <div className="exif-summary__divider" aria-hidden="true" />
                <div className="exif-summary__stat">
                  <span className="exif-summary__value">{noMeta}</span>
                  <span className="exif-summary__label">Sin metadata</span>
                </div>
                <div className="exif-summary__divider" aria-hidden="true" />
                <div className="exif-summary__stat">
                  <span className={'exif-summary__value' + (done > 0 ? ' exif-summary__value--accent' : '')}>
                    {done}
                  </span>
                  <span className="exif-summary__label">Limpios</span>
                </div>
              </div>
            )}

            <div className="exif-preview__header">
              <h2 className="exif-preview__title">
                {hasFiles ? 'Archivos cargados' : 'Vista previa'}
              </h2>
              {hasFiles && (
                <span className="exif-preview__count" aria-live="polite">
                  {files.length} {files.length === 1 ? 'archivo' : 'archivos'}
                </span>
              )}
            </div>

            {!hasFiles && (
              <div className="exif-empty" role="region" aria-label="Sin archivos cargados">
                <div className="exif-empty__icon">
                  <ShieldIcon />
                </div>
                <h3 className="exif-empty__title">Sin imagenes aun</h3>
                <p className="exif-empty__text">
                  Arrastra tus imagenes al panel izquierdo o haz clic para seleccionarlas.
                  Se mostraran los metadatos encontrados antes de limpiarlos.
                </p>
              </div>
            )}

            {hasFiles && (
              <ul className="exif-file-list" role="list" aria-label="Lista de imagenes">
                {files.map((item) => (
                  <li
                    key={item.id}
                    className={'exif-file-item exif-file-item--' + item.status}
                  >
                    <img
                      src={item.preview}
                      alt={'Vista previa de ' + item.file.name}
                      className="exif-file-item__thumb"
                      loading="lazy"
                    />

                    <div className="exif-file-item__info">
                      <span className="exif-file-item__name" title={item.file.name}>
                        {item.file.name}
                      </span>
                      <span className="exif-file-item__size">
                        {formatBytes(item.file.size)}
                        {item.outputSize != null && (
                          <span className="exif-file-item__size-clean">
                            {' \u2192 ' + formatBytes(item.outputSize)}
                          </span>
                        )}
                      </span>

                      <div className="exif-file-item__tags">
                        {!item.exifLoaded && (
                          <span className="exif-tag exif-tag--none">Leyendo metadata...</span>
                        )}
                        {item.exifLoaded && item.exifTags.length === 0 && (
                          <span className="exif-tag exif-tag--none">Sin metadata detectada</span>
                        )}
                        {item.exifLoaded && item.exifTags.map((tag) => (
                          <span
                            key={tag.key}
                            className={'exif-tag exif-tag--' + tag.risk}
                            title={tag.label}
                          >
                            {tag.label}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="exif-file-item__status">
                      {item.status === 'pending' && (
                        <div
                          className="exif-file-item__badge exif-file-item__badge--pending"
                          title="Pendiente"
                          aria-label="Pendiente de limpieza"
                        >
                          <ClockIcon />
                        </div>
                      )}

                      {item.status === 'cleaning' && (
                        <div
                          className="exif-spinner"
                          role="status"
                          aria-label={'Limpiando ' + item.file.name}
                        />
                      )}

                      {item.status === 'done' && (
                        <>
                          <div
                            className="exif-file-item__badge exif-file-item__badge--done"
                            title="Limpio"
                            aria-label="Metadata eliminada"
                          >
                            <CheckIcon />
                          </div>
                          <button
                            className="exif-file-item__download"
                            onClick={() => handleDownloadOne(item)}
                            aria-label={'Descargar ' + item.file.name + ' limpio'}
                          >
                            <DownloadIcon />
                            Descargar
                          </button>
                        </>
                      )}

                      {item.status === 'error' && (
                        <div
                          className="exif-file-item__badge exif-file-item__badge--error"
                          title="Error"
                          aria-label={'Error al limpiar ' + item.file.name}
                        >
                          <ErrorIcon />
                        </div>
                      )}

                      {item.status !== 'cleaning' && (
                        <button
                          className="exif-file-item__remove"
                          onClick={() => handleRemoveOne(item.id)}
                          aria-label={'Quitar ' + item.file.name + ' de la lista'}
                          title="Quitar archivo"
                        >
                          <TrashIcon />
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
