import React, { useState, useRef, useCallback, useEffect } from 'react';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import './ImageCropper.css';

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

const CropIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M6 3v14a1 1 0 0 0 1 1h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M3 6h14a1 1 0 0 1 1 1v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const RotateCCWIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 3v5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const RotateCWIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 3v5h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FlipHIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 3v18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 3"/>
    <path d="M4 8l-3 4 3 4V8z" fill="currentColor"/>
    <path d="M20 8l3 4-3 4V8z" fill="currentColor"/>
  </svg>
);

const FlipVIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 3"/>
    <path d="M8 4l4-3 4 3H8z" fill="currentColor"/>
    <path d="M8 20l4 3 4-3H8z" fill="currentColor"/>
  </svg>
);

const NewImageIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 3v5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CropEmptyIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
    <path d="M9 4v20a1 1 0 0 0 1 1h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M4 9h20a1 1 0 0 1 1 1v20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <rect x="12" y="12" width="13" height="13" rx="1" stroke="currentColor" strokeWidth="2" strokeDasharray="3 2"/>
  </svg>
);

/* =============================================
   CONSTANTS
   ============================================= */
const RATIOS = [
  { label: 'Libre', value: NaN },
  { label: '1:1',   value: 1 },
  { label: '4:3',   value: 4 / 3 },
  { label: '16:9',  value: 16 / 9 },
  { label: '3:4',   value: 3 / 4 },
  { label: '9:16',  value: 9 / 16 },
];

const FORMAT_LABELS = [
  { mime: 'image/jpeg', label: 'JPG' },
  { mime: 'image/png',  label: 'PNG' },
  { mime: 'image/webp', label: 'WebP' },
];

/* =============================================
   COMPONENT
   ============================================= */
export default function ImageCropper() {
  useEffect(() => { document.title = 'Recortador de Imagenes — OkuniSolutions Apps'; }, []);

  const [imageSrc, setImageSrc]         = useState(null);
  const [fileName, setFileName]         = useState('');
  const [aspectRatio, setAspectRatio]   = useState(NaN);
  const [outputWidth, setOutputWidth]   = useState('');
  const [outputHeight, setOutputHeight] = useState('');
  const [outputFormat, setOutputFormat] = useState('image/jpeg');
  const [quality, setQuality]           = useState(90);
  const [dragOver, setDragOver]         = useState(false);

  const imageRef    = useRef(null);
  const cropperRef  = useRef(null);
  const fileInputRef = useRef(null);

  /* ---- Init / destroy cropper when image changes ---- */
  useEffect(() => {
    if (!imageSrc || !imageRef.current) return;

    if (cropperRef.current) {
      cropperRef.current.destroy();
      cropperRef.current = null;
    }

    cropperRef.current = new Cropper(imageRef.current, {
      aspectRatio: aspectRatio,
      viewMode: 1,
      dragMode: 'move',
      autoCropArea: 0.8,
      responsive: true,
      restore: false,
      guides: true,
      center: true,
      highlight: false,
      cropBoxMovable: true,
      cropBoxResizable: true,
      toggleDragModeOnDblclick: false,
    });

    return () => {
      cropperRef.current?.destroy();
      cropperRef.current = null;
    };
  }, [imageSrc]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ---- Update aspect ratio without reloading ---- */
  useEffect(() => {
    cropperRef.current?.setAspectRatio(aspectRatio);
  }, [aspectRatio]);

  /* ---- File loading ---- */
  const loadFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target.result);
      setFileName(file.name);
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

  /* ---- Crop & download ---- */
  const handleCrop = useCallback(() => {
    if (!cropperRef.current) return;

    const options = {};
    const w = parseInt(outputWidth, 10);
    const h = parseInt(outputHeight, 10);
    if (w > 0) options.width = w;
    if (h > 0) options.height = h;
    if (outputFormat !== 'image/png') options.imageSmoothingQuality = 'high';

    const canvas = cropperRef.current.getCroppedCanvas(options);
    if (!canvas) return;

    const extMap = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
    const ext = extMap[outputFormat];
    const baseName = fileName.replace(/\.[^.]+$/, '');

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = baseName + '_cropped.' + ext;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    }, outputFormat, quality / 100);
  }, [outputFormat, quality, outputWidth, outputHeight, fileName]);

  /* ---- Rotate ---- */
  const handleRotate = useCallback((deg) => {
    cropperRef.current?.rotate(deg);
  }, []);

  /* ---- Flip ---- */
  const handleFlip = useCallback((axis) => {
    const data = cropperRef.current?.getData();
    if (!data) return;
    if (axis === 'h') cropperRef.current?.scaleX(data.scaleX === -1 ? 1 : -1);
    if (axis === 'v') cropperRef.current?.scaleY(data.scaleY === -1 ? 1 : -1);
  }, []);

  /* ---- Reset / new image ---- */
  const handleNewImage = useCallback(() => {
    if (cropperRef.current) {
      cropperRef.current.destroy();
      cropperRef.current = null;
    }
    setImageSrc(null);
    setFileName('');
    setOutputWidth('');
    setOutputHeight('');
  }, []);

  const qualityActive = outputFormat !== 'image/png';

  const isRatioActive = (value) => {
    if (Number.isNaN(value) && Number.isNaN(aspectRatio)) return true;
    return value === aspectRatio;
  };

  return (
    <div className="cropperpage">
      {/* Page header */}
      <div className="cropperpage__header">
        <div className="container">
          <nav className="cropperpage__breadcrumb" aria-label="Miga de pan">
            <span className="cropperpage__breadcrumb-item">Servicios</span>
            <span className="cropperpage__breadcrumb-sep" aria-hidden="true">/</span>
            <span className="cropperpage__breadcrumb-item cropperpage__breadcrumb-item--current">
              Recortador de Imagenes
            </span>
          </nav>
          <h1 className="cropperpage__title">Recortador de Imagenes</h1>
          <p className="cropperpage__subtitle">
            Recorta, redimensiona y rota tus imagenes con precision visual. Exporta exactamente
            el area que necesitas, sin subir nada a ningun servidor.
          </p>
        </div>
      </div>

      {/* Main layout */}
      <div className="cropperpage__body container">
        <div className="cropper-layout">

          {/* ---- Controls panel ---- */}
          <section className="cropper-panel" aria-label="Configuracion de recorte">

            {/* Drop zone */}
            <div className="cropper-panel__section">
              <p className="cropper-panel__label">
                {imageSrc ? 'Cambiar imagen' : 'Cargar imagen'}
              </p>
              <div
                className={'cropper-dropzone' + (dragOver ? ' cropper-dropzone--over' : '')}
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
                <span className="cropper-dropzone__icon">
                  <UploadIcon />
                </span>
                {imageSrc ? (
                  <p className="cropper-dropzone__text"><strong>{fileName}</strong></p>
                ) : (
                  <p className="cropper-dropzone__text">
                    Arrastra una imagen o <strong>haz clic para seleccionar</strong>
                  </p>
                )}
                <p className="cropper-dropzone__hint">
                  JPG, PNG, WebP, BMP, GIF. Una imagen a la vez.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="cropper-dropzone__file-input"
                  aria-hidden="true"
                  tabIndex={-1}
                />
              </div>
            </div>

            {/* Aspect ratio */}
            {imageSrc && (
              <div className="cropper-panel__section">
                <p className="cropper-panel__label" id="ratio-label">Relacion de aspecto</p>
                <div className="cropper-format-group" role="group" aria-labelledby="ratio-label">
                  {RATIOS.map(({ label, value }) => (
                    <button
                      key={label}
                      className={
                        'cropper-format-btn' +
                        (isRatioActive(value) ? ' cropper-format-btn--active' : '')
                      }
                      onClick={() => setAspectRatio(value)}
                      aria-pressed={isRatioActive(value)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Output dimensions */}
            {imageSrc && (
              <div className="cropper-panel__section">
                <p className="cropper-panel__label">Dimensiones de salida (px, opcional)</p>
                <div className="cropper-dimensions">
                  <div className="cropper-dimensions__field">
                    <label htmlFor="output-width" className="cropper-dimensions__label">Ancho</label>
                    <input
                      id="output-width"
                      type="number"
                      min="1"
                      placeholder="Auto"
                      value={outputWidth}
                      onChange={(e) => setOutputWidth(e.target.value)}
                      className="cropper-dimensions__input"
                    />
                  </div>
                  <span className="cropper-dimensions__sep" aria-hidden="true">x</span>
                  <div className="cropper-dimensions__field">
                    <label htmlFor="output-height" className="cropper-dimensions__label">Alto</label>
                    <input
                      id="output-height"
                      type="number"
                      min="1"
                      placeholder="Auto"
                      value={outputHeight}
                      onChange={(e) => setOutputHeight(e.target.value)}
                      className="cropper-dimensions__input"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Output format */}
            {imageSrc && (
              <div className="cropper-panel__section">
                <p className="cropper-panel__label" id="format-label">Formato de salida</p>
                <div className="cropper-format-group" role="group" aria-labelledby="format-label">
                  {FORMAT_LABELS.map(({ mime, label }) => (
                    <button
                      key={mime}
                      className={
                        'cropper-format-btn' +
                        (outputFormat === mime ? ' cropper-format-btn--active' : '')
                      }
                      onClick={() => setOutputFormat(mime)}
                      aria-pressed={outputFormat === mime}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quality */}
            {imageSrc && (
              <div className="cropper-panel__section">
                <div className="cropper-quality">
                  <div className="cropper-quality__header">
                    <label
                      htmlFor="quality-slider"
                      className="cropper-panel__label"
                      style={{ margin: 0 }}
                    >
                      Calidad
                    </label>
                    {qualityActive ? (
                      <span className="cropper-quality__value">{quality}%</span>
                    ) : (
                      <span className="cropper-quality__disabled-note">Sin perdida (PNG)</span>
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
                    className="cropper-quality__slider"
                    aria-valuemin={1}
                    aria-valuemax={100}
                    aria-valuenow={quality}
                    aria-valuetext={quality + ' de 100'}
                    aria-label={'Calidad de salida: ' + quality + ' por ciento'}
                  />
                </div>
              </div>
            )}

            {/* Quick actions */}
            {imageSrc && (
              <div className="cropper-panel__section">
                <p className="cropper-panel__label">Acciones rapidas</p>
                <div className="cropper-actions-group">
                  <button
                    className="cropper-action-btn"
                    onClick={() => handleRotate(-90)}
                    aria-label="Rotar 90 grados a la izquierda"
                    title="Rotar -90 grados"
                  >
                    <RotateCCWIcon />
                    <span>-90</span>
                  </button>
                  <button
                    className="cropper-action-btn"
                    onClick={() => handleRotate(90)}
                    aria-label="Rotar 90 grados a la derecha"
                    title="Rotar +90 grados"
                  >
                    <RotateCWIcon />
                    <span>+90</span>
                  </button>
                  <button
                    className="cropper-action-btn"
                    onClick={() => handleFlip('h')}
                    aria-label="Voltear horizontalmente"
                    title="Voltear horizontal"
                  >
                    <FlipHIcon />
                    <span>Voltear H</span>
                  </button>
                  <button
                    className="cropper-action-btn"
                    onClick={() => handleFlip('v')}
                    aria-label="Voltear verticalmente"
                    title="Voltear vertical"
                  >
                    <FlipVIcon />
                    <span>Voltear V</span>
                  </button>
                </div>
              </div>
            )}

            {/* Panel actions */}
            <div className="cropper-panel__actions">
              {imageSrc && (
                <button
                  className="btn btn--primary btn--md cropper-panel__btn-crop"
                  onClick={handleCrop}
                >
                  <CropIcon />
                  Recortar y Descargar
                </button>
              )}
              {imageSrc && (
                <button
                  className="btn btn--secondary btn--md cropper-panel__btn-new"
                  onClick={handleNewImage}
                >
                  <NewImageIcon />
                  Nueva imagen
                </button>
              )}
            </div>
          </section>

          {/* ---- Preview panel ---- */}
          <section className="cropper-preview" aria-label="Vista previa del recorte">
            <div className="cropper-preview__header">
              <h2 className="cropper-preview__title">
                {imageSrc ? 'Editor de recorte' : 'Vista previa'}
              </h2>
              {imageSrc && (
                <span className="cropper-preview__filename" title={fileName}>
                  {fileName}
                </span>
              )}
            </div>

            {!imageSrc && (
              <div className="cropper-empty" role="region" aria-label="Sin imagen cargada">
                <div className="cropper-empty__icon">
                  <CropEmptyIcon />
                </div>
                <h3 className="cropper-empty__title">Sin imagen aun</h3>
                <p className="cropper-empty__text">
                  Carga una imagen desde el panel izquierdo para comenzar a recortar.
                  Podras ajustar el area de recorte, rotar y voltear la imagen.
                </p>
              </div>
            )}

            {imageSrc && (
              <div className="cropper-image-wrap">
                <img
                  ref={imageRef}
                  src={imageSrc}
                  alt="Imagen para recortar"
                  className="cropper-source-img"
                  style={{ maxWidth: '100%' }}
                />
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
