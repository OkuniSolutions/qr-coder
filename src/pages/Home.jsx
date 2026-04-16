import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const QRIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="3" y="3" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
    <rect x="18" y="3" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
    <rect x="3" y="18" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
    <rect x="6" y="6" width="5" height="5" rx="1" fill="currentColor"/>
    <rect x="21" y="6" width="5" height="5" rx="1" fill="currentColor"/>
    <rect x="6" y="21" width="5" height="5" rx="1" fill="currentColor"/>
    <rect x="18" y="18" width="5" height="5" fill="currentColor"/>
    <rect x="23" y="23" width="5" height="5" fill="currentColor"/>
    <rect x="18" y="23" width="4" height="5" fill="currentColor" opacity="0.5"/>
    <rect x="23" y="18" width="5" height="4" fill="currentColor"/>
  </svg>
);

const ImageConverterIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="2" y="7" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M6 19l4-5 3 4 3-4 4 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="9" cy="13" r="1.5" fill="currentColor"/>
    <path d="M25 11l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M29 15h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const CompressorIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <rect x="3" y="3" width="26" height="26" rx="3" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M10 16h12M16 10v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M7 7l4 4M21 21l4 4M25 7l-4 4M7 25l4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
  </svg>
);

const CropperIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <path d="M8 3v18a1 1 0 0 0 1 1h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M3 8h18a1 1 0 0 1 1 1v18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <rect x="10" y="10" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="2" strokeDasharray="3 2"/>
  </svg>
);

const ExifIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <rect x="4" y="6" width="24" height="20" rx="3" stroke="currentColor" strokeWidth="2" fill="none"/>
    <circle cx="12" cy="14" r="3" stroke="currentColor" strokeWidth="2"/>
    <path d="M19 12h5M19 16h5M8 22h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M24 4l2 2-2 2M28 6H20" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FaviconIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <rect x="3" y="3" width="26" height="26" rx="5" stroke="currentColor" strokeWidth="2" fill="none"/>
    <rect x="8" y="8" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.75" fill="none"/>
    <path d="M12 16c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
    <circle cx="16" cy="16" r="1.5" fill="currentColor"/>
  </svg>
);

const OcrIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <rect x="3" y="5" width="18" height="22" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M7 11h10M7 15h10M7 19h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M24 18l5 5-2 2-5-5v-1l1-1z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="22" cy="14" r="4" stroke="currentColor" strokeWidth="1.75"/>
  </svg>
);

const PdfIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <path d="M18 3H8a2 2 0 0 0-2 2v22a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V11z" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M18 3v8h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 17h3a2 2 0 0 1 0 4h-2v3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18 17v7M18 17h2a2 2 0 0 1 0 4h-2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
    <path d="M22 24v-7h3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 20h2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <circle cx="7" cy="7" r="6" fill="var(--color-primary-light)"/>
    <path d="M4.5 7L6.5 9L9.5 5" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SERVICES = [
  {
    id: 'qr-generator',
    Icon: QRIcon,
    label: 'Disponible',
    labelType: 'available',
    title: 'Generador QR',
    description: 'Crea códigos QR personalizados para URLs, texto, contactos y más. Añade tu logo al centro con soporte de alta corrección de errores.',
    features: ['Logo personalizado', 'Alta resolución (512px)', 'Corrección de errores nivel H'],
    href: '/qr-generator',
    cta: 'Abrir herramienta',
  },
  {
    id: 'image-converter',
    Icon: ImageConverterIcon,
    label: 'Disponible',
    labelType: 'available',
    title: 'Convertidor de Imágenes',
    description: 'Convierte tus imágenes a JPG, PNG, WebP o AVIF directamente en tu navegador. Sin subidas a servidores.',
    features: ['Sin límite de archivos', 'Control de calidad', 'Descarga en ZIP'],
    href: '/image-converter',
    cta: 'Abrir herramienta',
  },
  {
    id: 'image-compressor',
    Icon: CompressorIcon,
    label: 'Disponible',
    labelType: 'available',
    title: 'Compresor de Imágenes',
    description: 'Reduce el peso de tus imágenes sin perder calidad visible. Ideal para web, redes sociales y correo.',
    features: ['Compresión inteligente', 'Múltiples archivos', 'Comparación antes/después'],
    href: '/image-compressor',
    cta: 'Abrir herramienta',
  },
  {
    id: 'image-cropper',
    Icon: CropperIcon,
    label: 'Disponible',
    labelType: 'available',
    title: 'Recortador de Imágenes',
    description: 'Recorta, redimensiona y rota imágenes con una interfaz visual precisa. Exporta en el tamaño exacto que necesitas.',
    features: ['Recorte libre o fijo', 'Redimensión por píxeles', 'Rotación y volteo'],
    href: '/image-cropper',
    cta: 'Abrir herramienta',
  },
  {
    id: 'exif-remover',
    Icon: ExifIcon,
    label: 'Disponible',
    labelType: 'available',
    title: 'Eliminador de Metadata',
    description: 'Elimina datos EXIF, GPS y metadata privada de tus fotos antes de compartirlas en redes o sitios web.',
    features: ['Elimina datos GPS', 'Preserva calidad', 'Procesamiento local'],
    href: '/exif-remover',
    cta: 'Abrir herramienta',
  },
  {
    id: 'favicon-generator',
    Icon: FaviconIcon,
    label: 'Próximamente',
    labelType: 'soon',
    title: 'Generador de Favicon',
    description: 'Convierte cualquier imagen a favicon en múltiples tamaños para navegadores, iOS, Android y PWAs.',
    features: ['ICO, PNG, SVG', 'Múltiples tamaños', 'Listo para producción'],
    href: null,
    cta: 'Próximamente',
  },
  {
    id: 'ocr',
    Icon: OcrIcon,
    label: 'Próximamente',
    labelType: 'soon',
    title: 'Imagen a Texto (OCR)',
    description: 'Extrae texto de imágenes, capturas de pantalla y documentos escaneados. Soporta múltiples idiomas.',
    features: ['100+ idiomas', 'Copiar al portapapeles', 'Funciona offline'],
    href: null,
    cta: 'Próximamente',
  },
  {
    id: 'pdf-generator',
    Icon: PdfIcon,
    label: 'Próximamente',
    labelType: 'soon',
    title: 'Generador de PDF',
    description: 'Convierte imágenes a PDF o combina múltiples imágenes en un solo documento PDF descargable.',
    features: ['Múltiples imágenes', 'Orden personalizado', 'Sin marcas de agua'],
    href: null,
    cta: 'Próximamente',
  },
];

const STATS = [
  { value: '100%', label: 'Gratuito en el navegador' },
  { value: '0', label: 'Datos enviados al servidor' },
  { value: 'Inf.', label: 'Usos sin restriccion' },
];

export default function Home() {
  useEffect(() => { document.title = 'OkuniSolutions Apps — Herramientas digitales'; }, []);
  return (
    <div className="home">
      {/* HERO */}
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero__bg" aria-hidden="true">
          <div className="hero__blob hero__blob--1" />
          <div className="hero__blob hero__blob--2" />
          <div className="hero__grid" />
        </div>
        <div className="hero__inner container">
          <div className="hero__content">
            <div className="hero__badge" aria-hidden="true">
              <span className="hero__badge-dot" />
              OkuniSolutions Apps
            </div>
            <h1 id="hero-heading" className="hero__heading">
              Herramientas profesionales,{' '}
              <span className="hero__heading-accent">sin complicaciones</span>
            </h1>
            <p className="hero__subheading">
              Okuni Apps reúne herramientas digitales profesionales en un solo lugar, diseñadas para hacer más con menos esfuerzo.
            </p>
            <div className="hero__actions">
              <Link to="/qr-generator" className="btn btn--primary btn--lg">
                Explorar herramientas
              </Link>
              <a href="#servicios" className="btn btn--secondary btn--lg">
                Ver servicios
              </a>
            </div>
          </div>

          <div className="hero__visual" aria-hidden="true">
            <div className="hero__card">
              <div className="hero__card-header">
                <span className="hero__card-dot hero__card-dot--red" />
                <span className="hero__card-dot hero__card-dot--yellow" />
                <span className="hero__card-dot hero__card-dot--green" />
              </div>
              <div className="hero__card-body">
                <div className="hero__qr-mock">
                  <svg viewBox="0 0 80 80" width="120" height="120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="4" y="4" width="22" height="22" rx="3" fill="var(--color-navy)" />
                    <rect x="8" y="8" width="14" height="14" rx="1.5" fill="white" />
                    <rect x="11" y="11" width="8" height="8" rx="1" fill="var(--color-navy)" />
                    <rect x="54" y="4" width="22" height="22" rx="3" fill="var(--color-navy)" />
                    <rect x="58" y="8" width="14" height="14" rx="1.5" fill="white" />
                    <rect x="61" y="11" width="8" height="8" rx="1" fill="var(--color-navy)" />
                    <rect x="4" y="54" width="22" height="22" rx="3" fill="var(--color-navy)" />
                    <rect x="8" y="58" width="14" height="14" rx="1.5" fill="white" />
                    <rect x="11" y="61" width="8" height="8" rx="1" fill="var(--color-navy)" />
                    <rect x="30" y="4" width="6" height="6" rx="1" fill="var(--color-navy)" />
                    <rect x="40" y="4" width="6" height="6" rx="1" fill="var(--color-navy)" />
                    <rect x="30" y="14" width="6" height="6" rx="1" fill="var(--color-navy)" />
                    <rect x="4" y="30" width="6" height="6" rx="1" fill="var(--color-navy)" />
                    <rect x="14" y="30" width="6" height="6" rx="1" fill="var(--color-navy)" />
                    <rect x="4" y="40" width="6" height="6" rx="1" fill="var(--color-navy)" />
                    <rect x="14" y="40" width="6" height="6" rx="1" fill="var(--color-navy)" />
                    <rect x="30" y="30" width="20" height="20" rx="4" fill="var(--color-primary)" />
                    <rect x="54" y="30" width="6" height="6" rx="1" fill="var(--color-navy)" />
                    <rect x="64" y="30" width="6" height="6" rx="1" fill="var(--color-navy)" />
                    <rect x="70" y="40" width="6" height="6" rx="1" fill="var(--color-navy)" />
                    <rect x="30" y="54" width="6" height="6" rx="1" fill="var(--color-navy)" />
                    <rect x="40" y="54" width="6" height="6" rx="1" fill="var(--color-navy)" />
                    <rect x="54" y="64" width="6" height="6" rx="1" fill="var(--color-navy)" />
                    <rect x="64" y="64" width="6" height="6" rx="1" fill="var(--color-navy)" />
                    <rect x="70" y="54" width="6" height="6" rx="1" fill="var(--color-navy)" />
                    <rect x="30" y="70" width="6" height="6" rx="1" fill="var(--color-navy)" />
                    <rect x="40" y="64" width="6" height="6" rx="1" fill="var(--color-navy)" />
                    <path d="M36 40L39 43L44 37" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="hero__card-label">Generador QR</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats" aria-label="Estadisticas de la plataforma">
        <div className="container">
          <ul className="stats__list" role="list">
            {STATS.map((s) => (
              <li key={s.label} className="stats__item">
                <span className="stats__value">{s.value}</span>
                <span className="stats__label">{s.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* SERVICES */}
      <section id="servicios" className="services" aria-labelledby="services-heading">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Servicios</span>
            <h2 id="services-heading" className="section-title">
              Todo lo que necesitas en un solo lugar
            </h2>
            <p className="section-subtitle">
              Herramientas disenadas con atencion al detalle, privacidad y velocidad.
              Sin registro obligatorio, sin anuncios.
            </p>
          </div>

          <ul className="services__grid" role="list">
            {SERVICES.map((service) => {
              const { Icon } = service;
              return (
                <li key={service.id} className="service-card">
                  <article
                    className={'service-card__inner' + (service.href ? '' : ' service-card__inner--soon')}
                    aria-label={service.title}
                  >
                    <div className="service-card__top">
                      <div className="service-card__icon-wrap">
                        <Icon />
                      </div>
                      <span className={'service-card__label service-card__label--' + service.labelType}>
                        {service.label}
                      </span>
                    </div>

                    <h3 className="service-card__title">{service.title}</h3>
                    <p className="service-card__desc">{service.description}</p>

                    <ul className="service-card__features" role="list">
                      {service.features.map((f) => (
                        <li key={f} className="service-card__feature">
                          <span className="service-card__feature-icon">
                            <CheckIcon />
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>

                    <div className="service-card__footer">
                      {service.href ? (
                        <Link to={service.href} className="btn btn--primary btn--md service-card__btn">
                          {service.cta}
                          <ArrowIcon />
                        </Link>
                      ) : (
                        <button disabled className="btn btn--secondary btn--md service-card__btn" aria-disabled="true">
                          {service.cta}
                        </button>
                      )}
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="cta-banner" aria-labelledby="cta-heading">
        <div className="container">
          <div className="cta-banner__inner">
            <div className="cta-banner__text">
              <h2 id="cta-heading" className="cta-banner__title">
                Empieza a usar el Generador QR ahora mismo
              </h2>
              <p className="cta-banner__subtitle">
                Sin registro. Sin instalacion. Directamente en tu navegador.
              </p>
            </div>
            <Link to="/qr-generator" className="btn btn--accent btn--lg cta-banner__btn">
              Generar mi primer QR
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
