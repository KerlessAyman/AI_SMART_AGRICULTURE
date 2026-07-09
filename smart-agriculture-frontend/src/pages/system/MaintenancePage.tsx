const MaintenancePage = () => {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-base)', padding: '1.5rem', position: 'relative', overflow: 'hidden',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        background: 'var(--amber-glow)', filter: 'blur(120px)',
        top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }} />

      {/* Card */}
      <div style={{
        position: 'relative', zIndex: 1,
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: '1.25rem', padding: '3rem 2.5rem',
        textAlign: 'center', maxWidth: 440, width: '100%',
        boxShadow: '0 0 40px var(--emerald-glow)',
      }}>
        {/* Icon */}
        <div style={{
          width: 72, height: 72, borderRadius: '1rem',
          background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2rem', margin: '0 auto 1.5rem',
        }}>
          🔧
        </div>

        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          النظام تحت الصيانة
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          بنحسّن النظام عشان تجربة أحسن، هنرجع قريباً
        </p>

        {/* Status badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'var(--emerald-glow)', border: '1px solid var(--border-chip)',
          padding: '0.4rem 1rem', borderRadius: '999px',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--amber)', display: 'inline-block' }} />
          <span style={{ color: 'var(--emerald)', fontSize: '0.875rem', fontWeight: 600 }}>
            🌱 Smart Agriculture System
          </span>
        </div>

        {/* Animated dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: '50%',
              background: 'var(--emerald)',
              animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite`,
            }} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
