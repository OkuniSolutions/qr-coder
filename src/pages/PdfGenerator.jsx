import React, { useState, useRef, useCallback, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import './PdfGenerator.css';

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

const PdfFileIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
    <path d="M21 4H9a2 2 0 0 0-2 2v24a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V13z" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M21 4v9h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11 20h3a2 2 0 0 1 0 4h-2v3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 20v7M20 20h2a2 2 0 0 1 0 4h-2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
    <path d="M25 27v-7h3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M25 23h2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
  </svg>
);

const GenerateIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M18 3H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 3v4h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 12h4M10 16h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
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

const ChevronUpIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M18 15l-6-6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

const PAGE_SIZES = {
  A4:     [210, 297],
  A5:     [148, 210],
  Letter: [215.9, 279.4],
  Legal:  [215.9, 355.6],
};

async function generatePDF(images, options, onProgress) {
  const { pageSize, orientation, margin } = options;

  const loadImage = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve({
        dataUrl: e.target.result,
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const loaded = [];
  for (let i = 0; i < images.length; i++) {
    const data = await loadImage(images[i].file);
    loaded.push(data);
    onProgress(Math.round(((i + 1) / images.length) * 50));
  }

  let pdf = null;

  for (let i = 0; i < loaded.length; i++) {
    const { dataUrl, width, height } = loaded[i];
    const isLandscape = width > height;

    let pdfOrientation;
    if (orientation === 'auto') {
      pdfOrientation = isLandscape ? 'landscape' : 'portrait';
    } else {
      pdfOrientation = orientation;
    }

    let pageW, pageH;
    if (pageSize === 'fit') {
      pageW = width * 25.4 / 96;
      pageH = height * 25.4 / 96;
    } else {
      [pageW, pageH] = PAGE_SIZES[pageSize];
      if (pdfOrientation === 'landscape') [pageW, pageH] = [pageH, pageW];
    }

    if (i === 0) {
      pdf = new jsPDF({
        orientation: pdfOrientation,
        unit: 'mm',
        format: pageSize === 'fit' ? [pageW, pageH] : pageSize.toLowerCase(),
      });
    } else {
      pdf.addPage(
        pageSize === 'fit' ? [pageW, pageH] : pageSize.toLowerCase(),
        pdfOrientation
      );
    }

    const marginMm = { none: 0, small: 10, medium: 20 }[margin];
    const availW = pageW - marginMm * 2;
    const availH = pageH - marginMm * 2;

    const imgRatio = width / height;
    const pageRatio = availW / availH;
    let drawW, drawH;
    if (imgRatio > pageRatio) {
      drawW = availW;
      drawH = availW / imgRatio;
    } else {
      drawH = availH;
      drawW = availH * imgRatio;
    }

    const x = marginMm + (availW - drawW) / 2;
    const y = marginMm + (availH - drawH) / 2;

    const format = dataUrl.startsWith('data:image/png') ? 'PNG' : 'JPEG';
    pdf.addImage(dataUrl, format, x, y, drawW, drawH, undefined, 'FAST');

    onProgress(50 + Math.round(((i + 1) / loaded.length) * 50));
  }

  return pdf;
}

/* =============================================
   COMPONENT
   ============================================= */
export default function PdfGenerator() {
  useEffect(() => { document.title = 'Generador de PDF \u2014 OkuniSolutions Apps'; }, []);

  const [images, setImages] = useState([]);
  const [pageSize, setPageSize] = useState('A4');
  const [orientation, setOrientation] = useState('auto');
  const [margin, setMargin] = useState('small');
  const [quality, setQuality] = useState('high');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  /* Cleanup on unmount */
  useEffect(() => {
    return () => images.forEach(i => URL.revokeObjectURL(i.preview));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ---- File acceptance ---- */
  const acceptFiles = useCallback((rawFiles) => {
    const imageFiles = Array.from(rawFiles).filter(f => f.type.startsWith('image/'));
    if (imageFiles.length === 0) return;
    const incoming = imageFiles.map(file => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages(prev => [...prev, ...incoming]);
  }, []);

  /* ---- Drag & drop handlers ---- */
  const handleDragOver = useCallback((e) => { e.preventDefault(); setDragOver(true); }, []);
  const handleDragLeave = useCallback(() => setDragOver(false), []);
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    acceptFiles(e.dataTransfer.files);
  }, [acceptFiles]);
  const handleFileInput = useCallback((e) => {
    acceptFiles(e.target.files);
    e.target.value = '';
  }, [acceptFiles]);

  /* ---- Reordering ---- */
  const moveUp = useCallback((index) => {
    if (index === 0) return;
    setImages(prev => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  }, []);

  const moveDown = useCallback((index) => {
    setImages(prev => {
      if (index === prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  }, []);

  const removeImage = useCallback((id) => {
    setImages(prev => {
      const item = prev.find(i => i.id === id);
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter(i => i.id !== id);
    });
  }, []);

  /* ---- Generate & download ---- */
  const handleGenerate = async () => {
    if (images.length === 0) return;
    setIsGenerating(true);
    setProgress(0);
    try {
      const pdf = await generatePDF(
        images,
        { pageSize, orientation, margin, quality },
        setProgress
      );
      setProgress(100);
      const fileName = images.length === 1
        ? images[0].file.name.replace(/\.[^.]+$/, '') + '.pdf'
        : 'documento.pdf';
      pdf.save(fileName);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  /* ---- Clear all ---- */
  const handleClearAll = useCallback(() => {
    setImages(prev => {
      prev.forEach(i => URL.revokeObjectURL(i.preview));
      return [];
    });
    setProgress(0);
  }, []);

  const pageCountLabel = images.length === 1 ? '1 p\u00e1gina' : images.length + ' p\u00e1ginas';

  return (
    <div className="pdfpage">
      {/* Page header */}
      <div className="pdfpage__header">
        <div className="container">
          <nav className="pdfpage__breadcrumb" aria-label="Miga de pan">
            <span className="pdfpage__breadcrumb-item">Servicios</span>
            <span className="pdfpage__breadcrumb-sep" aria-hidden="true">/</span>
            <span className="pdfpage__breadcrumb-item pdfpage__breadcrumb-item--current">
              Generador de PDF
            </span>
          </nav>
          <h1 className="pdfpage__title">Generador de PDF</h1>
          <p className="pdfpage__subtitle">
            Combina multiples imagenes en un PDF descargable. Ordena las paginas,
            elige el tamano de hoja y genera el documento directamente en tu navegador.
          </p>
        </div>
      </div>

      {/* Main layout */}
      <div className="pdfpage__body container">
        <div className="pdf-layout">

          {/* ---- Controls panel ---- */}
          <section className="pdf-panel" aria-label="Configuracion del PDF">

            {/* Drop zone */}
            <div className="pdf-panel__section">
              <p className="pdf-panel__label">Agregar imagenes</p>
              <div
                className={'pdf-dropzone' + (dragOver ? ' pdf-dropzone--over' : '')}
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
                <span className="pdf-dropzone__icon">
                  <UploadIcon />
                </span>
                <p className="pdf-dropzone__text">
                  Arrastra imagenes o <strong>haz clic para seleccionar</strong>
                </p>
                <p className="pdf-dropzone__hint">
                  JPG, PNG, WebP, BMP. Multiples archivos permitidos.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileInput}
                  className="pdf-dropzone__file-input"
                  aria-hidden="true"
                  tabIndex={-1}
                />
              </div>
            </div>

            {/* Page size */}
            <div className="pdf-panel__section">
              <label htmlFor="pdf-page-size" className="pdf-panel__label">
                Tamano de pagina
              </label>
              <select
                id="pdf-page-size"
                className="pdf-select"
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value)}
              >
                <option value="A4">A4 (210 x 297 mm)</option>
                <option value="A5">A5 (148 x 210 mm)</option>
                <option value="Letter">Letter (215.9 x 279.4 mm)</option>
                <option value="Legal">Legal (215.9 x 355.6 mm)</option>
                <option value="fit">Ajustar a imagen</option>
              </select>
            </div>

            {/* Orientation */}
            <div className="pdf-panel__section">
              <p className="pdf-panel__label" id="pdf-orient-label">Orientacion</p>
              <div className="pdf-option-group" role="group" aria-labelledby="pdf-orient-label">
                {[
                  { value: 'auto',      label: 'Automatico' },
                  { value: 'portrait',  label: 'Vertical' },
                  { value: 'landscape', label: 'Horizontal' },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    className={'pdf-option-btn' + (orientation === value ? ' pdf-option-btn--active' : '')}
                    onClick={() => setOrientation(value)}
                    aria-pressed={orientation === value}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Margin */}
            <div className="pdf-panel__section">
              <p className="pdf-panel__label" id="pdf-margin-label">Margen</p>
              <div className="pdf-option-group" role="group" aria-labelledby="pdf-margin-label">
                {[
                  { value: 'none',   label: 'Ninguno' },
                  { value: 'small',  label: 'Pequeno' },
                  { value: 'medium', label: 'Medio' },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    className={'pdf-option-btn' + (margin === value ? ' pdf-option-btn--active' : '')}
                    onClick={() => setMargin(value)}
                    aria-pressed={margin === value}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Image quality */}
            <div className="pdf-panel__section">
              <p className="pdf-panel__label" id="pdf-quality-label">Calidad de imagen en PDF</p>
              <div className="pdf-option-group" role="group" aria-labelledby="pdf-quality-label">
                {[
                  { value: 'high',   label: 'Alta' },
                  { value: 'medium', label: 'Media' },
                  { value: 'low',    label: 'Baja' },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    className={'pdf-option-btn' + (quality === value ? ' pdf-option-btn--active' : '')}
                    onClick={() => setQuality(value)}
                    aria-pressed={quality === value}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pdf-panel__actions">
              <button
                className="btn btn--primary btn--md pdf-panel__btn-generate"
                onClick={handleGenerate}
                disabled={images.length === 0 || isGenerating}
                aria-disabled={images.length === 0 || isGenerating}
                aria-busy={isGenerating}
              >
                <GenerateIcon />
                {isGenerating
                  ? 'Generando...'
                  : images.length === 0
                    ? 'Generar PDF'
                    : 'Generar PDF (' + pageCountLabel + ')'}
              </button>

              {images.length > 0 && (
                <button
                  className="btn btn--secondary btn--md pdf-panel__btn-clear"
                  onClick={handleClearAll}
                  disabled={isGenerating}
                >
                  <ResetIcon />
                  Limpiar todo
                </button>
              )}
            </div>
          </section>

          {/* ---- Preview / list panel ---- */}
          <section className="pdf-preview" aria-label="Lista de imagenes para el PDF">

            <div className="pdf-preview__header">
              <h2 className="pdf-preview__title">
                {images.length > 0 ? 'Orden de paginas' : 'Vista previa'}
              </h2>
              {images.length > 0 && (
                <span className="pdf-preview__count" aria-live="polite">
                  {images.length} {images.length === 1 ? 'imagen' : 'imagenes'} &middot; orden de paginas
                </span>
              )}
            </div>

            {/* Empty state */}
            {images.length === 0 && (
              <div className="pdf-empty" role="region" aria-label="Sin imagenes cargadas">
                <div className="pdf-empty__icon">
                  <PdfFileIcon />
                </div>
                <h3 className="pdf-empty__title">Sin imagenes aun</h3>
                <p className="pdf-empty__text">
                  Arrastra tus imagenes al panel izquierdo o haz clic para seleccionarlas.
                  Cada imagen sera una pagina en el PDF generado.
                </p>
              </div>
            )}

            {/* Image list */}
            {images.length > 0 && (
              <ul className="pdf-image-list" role="list" aria-label="Imagenes en orden de paginas">
                {images.map((item, index) => (
                  <li key={item.id} className="pdf-image-item">
                    <span className="pdf-image-item__number" aria-label={'Pagina ' + (index + 1)}>
                      #{index + 1}
                    </span>
                    <img
                      src={item.preview}
                      alt={'Vista previa de ' + item.file.name}
                      className="pdf-image-item__thumb"
                      loading="lazy"
                    />
                    <div className="pdf-image-item__info">
                      <span className="pdf-image-item__name" title={item.file.name}>
                        {item.file.name}
                      </span>
                      <span className="pdf-image-item__size">
                        {formatBytes(item.file.size)}
                      </span>
                    </div>
                    <div className="pdf-image-item__actions">
                      <button
                        className="pdf-image-item__btn"
                        onClick={() => moveUp(index)}
                        disabled={index === 0 || isGenerating}
                        aria-label={'Mover ' + item.file.name + ' una posicion arriba'}
                        title="Mover arriba"
                      >
                        <ChevronUpIcon />
                      </button>
                      <button
                        className="pdf-image-item__btn"
                        onClick={() => moveDown(index)}
                        disabled={index === images.length - 1 || isGenerating}
                        aria-label={'Mover ' + item.file.name + ' una posicion abajo'}
                        title="Mover abajo"
                      >
                        <ChevronDownIcon />
                      </button>
                      <button
                        className="pdf-image-item__btn pdf-image-item__btn--remove"
                        onClick={() => removeImage(item.id)}
                        disabled={isGenerating}
                        aria-label={'Quitar ' + item.file.name + ' de la lista'}
                        title="Quitar imagen"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* Progress bar */}
            {isGenerating && (
              <div
                className="pdf-progress"
                role="status"
                aria-live="polite"
                aria-label={'Generando PDF, ' + progress + ' por ciento completado'}
              >
                <div className="pdf-progress__bar">
                  <div
                    className="pdf-progress__fill"
                    style={{ width: progress + '%' }}
                  />
                </div>
                <p className="pdf-progress__label">Generando PDF... {progress}%</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
