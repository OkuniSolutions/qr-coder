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

const FormIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="3" y="8" width="26" height="18" rx="3" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M10 8V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 17h8M12 21h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="9" cy="17" r="1.5" fill="currentColor"/>
    <circle cx="9" cy="21" r="1.5" fill="currentColor"/>
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
    description:
      'Crea codigos QR personalizados para URLs, texto, contactos y mas. Anade tu logo al centro con soporte de alta correccion de errores.',
    features: ['Logo personalizado', 'Alta resolucion (512px)', 'Correccion de errores nivel H'],
    href: '/qr-generator',
    cta: 'Abrir herramienta',
  },
  {
    id: 'image-converter',
    Icon: ImageConverterIcon,
    label: 'Disponible',
    labelType: 'available',
    title: 'Convertidor de Imagenes',
    description:
      'Convierte tus imágenes a JPG, PNG, WebP o AVIF directamente en tu navegador. Sin subidas a servidores.',
    features: ['Sin limite de archivos', 'Control de calidad', 'Descarga en ZIP'],
    href: '/image-converter',
    cta: 'Abrir herramienta',
  },
  {
    id: 'coming-soon-2',
    Icon: FormIcon,
    label: 'Proximamente',
    labelType: 'soon',
    title: 'Generador de Formularios',
    description:
      'Disena y publica formularios profesionales en minutos. Recopila respuestas, exporta datos y automatiza notificaciones.',
    features: ['Drag and drop', 'Exportacion CSV', 'Notificaciones email'],
    href: null,
    cta: 'Proximamente',
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
