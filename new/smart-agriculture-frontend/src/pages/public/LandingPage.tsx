import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PublicLayout from '../../components/layout/PublicLayout';
import Card from '../../components/common/Card';
import heroVideo from '../../assets/hero-video.mp4';

const LandingPage = () => {
  const { t } = useTranslation();

  const features = t('landing.features', { returnObjects: true }) as {
    icon: string; title: string; description: string;
  }[];

  const stats = t('landing.stats', { returnObjects: true }) as {
    value: string; label: string;
  }[];

  return (
    <PublicLayout>

      {/* ── Hero Section ── */}
      <section style={{
        position: 'relative', minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '2rem 1.5rem', overflow: 'hidden',
        background: 'var(--bg-base)',
      }}>
        {/* Background video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center', zIndex: 0,
          }}
        >
          <source src={heroVideo} type="video/mp4" />
        </video>

        {/* Dark gradient overlay for readability */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          background: 'linear-gradient(180deg, rgba(5,10,15,0.75) 0%, rgba(5,10,15,0.55) 50%, rgba(5,10,15,0.75) 100%)',
        }} />

        {/* Ambient glows */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'var(--emerald-glow)', filter: 'blur(100px)' }} />
          <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'var(--teal-glow)', filter: 'blur(120px)' }} />
        </div>

        {/* Decorative emojis */}
        <div style={{ position: 'absolute', top: 80, right: 40, fontSize: '5rem', opacity: 0.05, userSelect: 'none', display: 'none', zIndex: 1 }} className="hidden lg:block">🌿</div>
        <div style={{ position: 'absolute', bottom: 80, left: 40, fontSize: '4rem', opacity: 0.05, userSelect: 'none', zIndex: 1 }}>🚜</div>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px', textAlign: 'center' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
            background: 'var(--emerald-glow)', border: '1px solid var(--border-chip)',
            backdropFilter: 'blur(10px)',
            padding: '0.5rem 1.25rem', borderRadius: '999px', marginBottom: '2rem',
          }}>
            <span style={{ position: 'relative', display: 'inline-flex' }}>
              <span style={{ position: 'absolute', width: 8, height: 8, borderRadius: '50%', background: 'var(--emerald)', opacity: 0.75, animation: 'ping 1s cubic-bezier(0,0,0.2,1) infinite' }} />
              <span style={{ position: 'relative', width: 8, height: 8, borderRadius: '50%', background: 'var(--emerald)', display: 'inline-block' }} />
            </span>
            <span style={{ color: 'var(--emerald)', fontWeight: 600, fontSize: '0.875rem' }}>
              🚀 AI-Powered Smart Agriculture
            </span>
          </div>

          {/* Title */}
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem', lineHeight: 1.1 }}>
            {t('landing.hero_title_1')}
            <br />
            <span style={{ color: 'var(--emerald)', textShadow: '0 0 40px var(--emerald-glow)' }}>
              {t('landing.hero_title_2')}
            </span>
          </h1>

          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: '560px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            {t('landing.hero_desc')}
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <button style={{
                background: 'var(--emerald)', color: '#030d0e',
                padding: '0.875rem 2rem', borderRadius: '0.75rem', border: 'none',
                fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
                boxShadow: '0 0 30px var(--emerald-glow)',
                transition: 'all 0.2s', fontFamily: 'inherit',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--emerald-bright)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--emerald)'; (e.currentTarget as HTMLButtonElement).style.transform = 'none'; }}
              >
                {t('landing.start_free')} →
              </button>
            </Link>
            <Link to="/about" style={{ textDecoration: 'none' }}>
              <button style={{
                background: 'var(--bg-card)', color: 'var(--text-primary)',
                padding: '0.875rem 2rem', borderRadius: '0.75rem',
                border: '1px solid var(--border-strong)',
                fontWeight: 600, fontSize: '1rem', cursor: 'pointer',
                transition: 'all 0.2s', fontFamily: 'inherit',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--emerald)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--emerald)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-strong)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)'; }}
              >
                {t('landing.learn_more')}
              </button>
            </Link>
          </div>

          {/* Trust Badges */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {['Free Forever', 'No Credit Card', '24/7 Support'].map((badge) => (
              <span key={badge} style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: 'var(--bg-chip)', border: '1px solid var(--border-chip)',
                padding: '0.3rem 0.875rem', borderRadius: '999px',
                fontSize: '0.8rem', color: 'var(--text-secondary)',
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--emerald)', display: 'inline-block' }} />
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Section ── */}
      <section style={{ padding: '5rem 1.5rem', background: 'var(--bg-surface)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {stats.map((stat, index) => (
              <div key={index} style={{
                textAlign: 'center', padding: '2rem 1.5rem',
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: '1rem', transition: 'all 0.3s',
                position: 'relative', overflow: 'hidden',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-strong)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLDivElement).style.transform = 'none'; }}
              >
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'radial-gradient(circle at 50% 0%, var(--emerald-glow), transparent 70%)',
                  pointerEvents: 'none',
                }} />
                <p style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--emerald)', textShadow: '0 0 20px var(--emerald-glow)', position: 'relative' }}>
                  {stat.value}
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem', position: 'relative' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section style={{ padding: '6rem 1.5rem', background: 'var(--bg-base)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'var(--emerald-glow)', border: '1px solid var(--border-chip)',
              padding: '0.35rem 1rem', borderRadius: '999px', marginBottom: '1rem',
            }}>
              <span style={{ color: 'var(--emerald)', fontSize: '0.8rem', fontWeight: 600 }}>Features</span>
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              {t('landing.features_title')}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '500px', margin: '0 auto' }}>
              Discover how our AI-powered platform transforms agriculture
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {features.map((feature, index) => (
              <Card key={index}>
                <div style={{
                  width: 56, height: 56, borderRadius: 14,
                  background: 'var(--emerald-glow)', border: '1px solid var(--border-chip)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.75rem', marginBottom: '1rem',
                  transition: 'transform 0.2s',
                }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.6rem' }}>
                  {feature.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7 }}>
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section style={{ position: 'relative', padding: '7rem 1.5rem', overflow: 'hidden', background: 'var(--bg-surface)' }}>
        {/* Gradient background */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(0,201,167,0.08) 0%, rgba(6,182,212,0.06) 100%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, borderRadius: '50%', background: 'var(--emerald-glow)', filter: 'blur(100px)', pointerEvents: 'none' }} />

        {/* Grid pattern overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, rgba(0,201,167,0.06) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'var(--emerald-glow)', border: '1px solid var(--border-chip)',
            padding: '0.4rem 1.25rem', borderRadius: '999px', marginBottom: '1.5rem',
          }}>
            <span style={{ color: 'var(--emerald)', fontSize: '0.875rem', fontWeight: 600 }}>🚀 Get Started Today</span>
          </div>

          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            {t('landing.cta_title')}
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: 1.7 }}>
            {t('landing.cta_desc')}
          </p>

          <Link to="/register" style={{ textDecoration: 'none' }}>
            <button style={{
              background: 'var(--emerald)', color: '#030d0e',
              padding: '1rem 2.5rem', borderRadius: '0.875rem', border: 'none',
              fontWeight: 700, fontSize: '1.05rem', cursor: 'pointer',
              boxShadow: '0 0 40px var(--emerald-glow)',
              transition: 'all 0.2s', fontFamily: 'inherit',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--emerald-bright)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--emerald)'; (e.currentTarget as HTMLButtonElement).style.transform = 'none'; }}
            >
              {t('landing.cta_btn')} →
            </button>
          </Link>

          <p style={{ marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            ✨ No commitment • Cancel anytime
          </p>
        </div>
      </section>

    </PublicLayout>
  );
};

export default LandingPage;