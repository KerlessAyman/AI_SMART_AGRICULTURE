import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <nav style={{
        background: 'var(--bg-sidebar)',
        borderBottom: '1px solid var(--border)',
        padding: '0 1.5rem',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(12px)',
      }}>
        {/* Logo */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          textDecoration: 'none',
          fontWeight: 700,
          fontSize: '1.1rem',
          color: 'var(--emerald)',
        }}>
          <span style={{
            width: 32, height: 32,
            background: 'var(--logo-bg)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            boxShadow: '0 0 12px var(--logo-bg-glow)',
          }}>🌱</span>
          Smart Agriculture
        </Link>

        {/* Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/about" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--emerald)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            {t('nav.about')}
          </Link>
          <Link to="/signin" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--emerald)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            {t('nav.login')}
          </Link>
          <Link to="/register" style={{
            background: 'var(--emerald)',
            color: '#030d0e',
            padding: '0.4rem 1rem',
            borderRadius: 8,
            fontSize: '0.875rem',
            fontWeight: 600,
            textDecoration: 'none',
            transition: 'background 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--emerald-bright)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--emerald)')}
          >
            {t('nav.register')}
          </Link>

          <button
            onClick={toggleLanguage}
            style={{
              border: '1px solid var(--border-strong)',
              background: 'transparent',
              color: 'var(--text-secondary)',
              padding: '0.3rem 0.75rem',
              borderRadius: 8,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--emerald)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--emerald)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-strong)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'; }}
          >
            {i18n.language === 'ar' ? 'EN' : 'عربي'}
          </button>
        </div>
      </nav>

      {/* Content */}
      <main style={{ flex: 1 }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{
        background: 'var(--bg-sidebar)',
        borderTop: '1px solid var(--border)',
        padding: '1rem',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.875rem',
      }}>
        © 2026 Smart Agriculture System
      </footer>
    </div>
  );
};

export default PublicLayout;
