import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-base)', padding: '1.5rem', position: 'relative', overflow: 'hidden',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', width: 500, height: 500, borderRadius: '50%',
        background: 'var(--emerald-glow)', filter: 'blur(140px)',
        top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'relative', zIndex: 1, textAlign: 'center',
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: '1.25rem', padding: '3.5rem 2.5rem',
        maxWidth: 480, width: '100%',
      }}>
        {/* 404 Number */}
        <p style={{
          fontSize: '6rem', fontWeight: 800,
          color: 'var(--emerald)',
          textShadow: '0 0 60px var(--emerald-glow)',
          lineHeight: 1, marginBottom: '1.25rem',
          letterSpacing: '-0.05em',
        }}>
          404
        </p>

        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          الصفحة مش موجودة
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          الصفحة اللي بتدور عليها مش موجودة أو اتنقلت لمكان تاني
        </p>

        <Link
          to="/"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'var(--emerald)', color: '#030d0e',
            padding: '0.75rem 1.75rem', borderRadius: '0.75rem',
            textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem',
            boxShadow: '0 0 24px var(--emerald-glow)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--emerald-bright)'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--emerald)'; (e.currentTarget as HTMLAnchorElement).style.transform = 'none'; }}
        >
          ← ارجع للرئيسية
        </Link>

        {/* Decorative grid dots */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: '1.25rem', overflow: 'hidden',
          backgroundImage: 'radial-gradient(circle, var(--border) 1px, transparent 1px)',
          backgroundSize: '20px 20px', opacity: 0.5,
        }} />
      </div>
    </div>
  );
};

export default NotFoundPage;
