import { useTranslation } from 'react-i18next';
import PublicLayout from '../../components/layout/PublicLayout';
import Card from '../../components/common/Card';

const AboutPage = () => {
  const { t } = useTranslation();

  const features = t('about.features', { returnObjects: true }) as {
    icon: string; title: string; description: string;
  }[];

  const team = t('about.team', { returnObjects: true }) as {
    name: string; role: string;
  }[];

  const techStack = [
    'Python', 'TypeScript', 'React', 'FastAPI',
    'TensorFlow', 'PyTorch', 'Scikit-learn', 'Hugging Face',
    'PostgreSQL', 'Docker', 'GitHub Actions', 'Tailwind CSS'
  ];

  return (
    <PublicLayout>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'var(--emerald-glow)', border: '1px solid var(--border-chip)',
            padding: '0.35rem 1rem', borderRadius: '999px', marginBottom: '1.25rem',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--emerald)', display: 'inline-block' }} />
            <span style={{ color: 'var(--emerald)', fontSize: '0.8rem', fontWeight: 600 }}>About the Platform</span>
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            🌱 {t('about.hero_title')}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
            {t('about.hero_desc')}
          </p>
        </div>

        {/* Features */}
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
          {t('about.features_title')}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
          {features.map((feature, index) => (
            <Card key={index}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: 'var(--emerald-glow)', border: '1px solid var(--border-chip)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem',
                }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{feature.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Team */}
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
          {t('about.team_title')}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
          {team.map((member, index) => (
            <Card key={index}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'var(--emerald-glow)', border: '1px solid var(--border-strong)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--emerald)', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0,
                }}>
                  {index + 1}
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{member.name}</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{member.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Tech Stack */}
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
          {t('about.tech_title')}
        </h2>
        <Card>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
            {techStack.map((tech) => (
              <span
                key={tech}
                style={{
                  background: 'var(--bg-chip)',
                  color: 'var(--emerald)',
                  border: '1px solid var(--border-chip)',
                  padding: '0.35rem 0.875rem',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </Card>

      </div>
    </PublicLayout>
  );
};

export default AboutPage;
