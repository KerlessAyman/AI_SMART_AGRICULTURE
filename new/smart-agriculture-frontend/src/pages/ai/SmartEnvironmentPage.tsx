import { useState } from 'react';
import TempAINav from '../../components/layout/TempAINav';
import { useTranslation } from 'react-i18next';
import { predictIotApi } from '../../api/iotApi';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Reading {
  time: string;
  temperature: number;
  humidity: number;
  soil_moisture: number;
}

const inputStyle: React.CSSProperties = {
  background: 'var(--bg-input)',
  border: '1px solid var(--border-input)',
  borderRadius: '0.5rem',
  padding: '0.55rem 0.875rem',
  fontSize: '0.875rem',
  color: 'var(--text-primary)',
  outline: 'none',
  fontFamily: 'inherit',
  width: '100%',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

const SmartEnvironmentPage = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ temperature: '', humidity: '', soil_moisture: '' });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<Reading[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSimulate = () => {
    setForm({
      temperature: (20 + Math.random() * 20).toFixed(1),
      humidity: (40 + Math.random() * 40).toFixed(1),
      soil_moisture: (30 + Math.random() * 40).toFixed(1),
    });
    setResult(null);
    setError('');
  };

  const handleAnalyze = async () => {
    if (!form.temperature || !form.humidity || !form.soil_moisture) {
      setError('من فضلك ادخل كل البيانات أو استخدم المحاكاة');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const data = await predictIotApi({
        temperature: Number(form.temperature),
        humidity: Number(form.humidity),
        soil_moisture: Number(form.soil_moisture),
      });
      setResult(data);
      setHistory((prev) => [
        ...prev.slice(-9),
        {
          time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
          temperature: Number(form.temperature),
          humidity: Number(form.humidity),
          soil_moisture: Number(form.soil_moisture),
        },
      ]);
    } catch (err: any) {
      setError('حدث خطأ أثناء التحليل، حاول تاني');
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    healthy: { icon: '✅', bg: 'var(--emerald-glow)', border: 'var(--border-chip)', color: 'var(--emerald)' },
    warning: { icon: '⚠️', bg: 'var(--amber-glow)', border: 'rgba(245,158,11,0.25)', color: 'var(--amber)' },
    danger:  { icon: '🚨', bg: 'rgba(244,63,94,0.08)', border: 'rgba(244,63,94,0.2)', color: 'var(--rose)' },
  };
  const statusCfg = result?.status ? (statusConfig[result.status as keyof typeof statusConfig] || statusConfig.danger) : null;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 8, padding: '0.75rem 1rem', fontSize: '0.8rem',
          color: 'var(--text-primary)',
        }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>{label}</p>
          {payload.map((p: any) => (
            <p key={p.dataKey} style={{ color: p.color }}>
              {p.name}: {p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <TempAINav />
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'var(--teal-glow)', border: '1px solid rgba(6,182,212,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
            }}>🌡️</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {t('ai.environment_title')}
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            {t('ai.simulation_note')}
          </p>
          {/* Simulation Badge */}
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            background: 'var(--amber-glow)', border: '1px solid rgba(245,158,11,0.25)',
            color: 'var(--amber)', fontSize: '0.78rem', fontWeight: 600,
            padding: '0.3rem 0.875rem', borderRadius: '999px',
          }}>
            ⚠️ بيانات محاكاة — ليست حساسات حقيقية
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>

          {/* Input Section */}
          <Card>
            <h2 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '0.95rem' }}>
              بيانات البيئة
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { key: 'temperature', icon: '🌡️', label: 'درجة الحرارة (°C)', placeholder: 'مثال: 28.5' },
                { key: 'humidity',    icon: '💧', label: 'رطوبة الجو (%)',     placeholder: 'مثال: 65'   },
                { key: 'soil_moisture', icon: '🌱', label: 'رطوبة التربة (%)', placeholder: 'مثال: 45'  },
              ].map(({ key, icon, label, placeholder }) => (
                <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                    {icon} {label} <span style={{ color: 'var(--rose)' }}>*</span>
                  </label>
                  <input
                    name={key}
                    type="number"
                    value={(form as any)[key]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    style={inputStyle}
                    onFocus={e => { e.currentTarget.style.borderColor = 'var(--emerald)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--emerald-glow)'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'var(--border-input)'; e.currentTarget.style.boxShadow = 'none'; }}
                  />
                </div>
              ))}

              {error && (
                <p style={{ color: 'var(--rose)', fontSize: '0.875rem', textAlign: 'center' }}>{error}</p>
              )}

              <Button label={t('ai.simulate_btn')} onClick={handleSimulate} variant="secondary" fullWidth />
              <Button label={t('ai.analyze_btn')} onClick={handleAnalyze} loading={loading} fullWidth />
            </div>
          </Card>

          {/* Result Section */}
          <Card>
            <h2 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '0.95rem' }}>
              {t('ai.result')}
            </h2>

            {loading && <Loader text="جاري تحليل البيانات البيئية..." />}

            {!loading && !result && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 180, color: 'var(--text-muted)' }}>
                <span style={{ fontSize: '3rem' }}>🌿</span>
                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>النتيجة هتظهر هنا</p>
              </div>
            )}

            {!loading && result && statusCfg && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Status */}
                <div style={{
                  border: `1px solid ${statusCfg.border}`,
                  borderRadius: '0.875rem', padding: '1.25rem',
                  textAlign: 'center', background: statusCfg.bg,
                }}>
                  <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{statusCfg.icon}</p>
                  <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>
                    {result.plant_condition || 'غير محدد'}
                  </p>
                </div>

                {/* Risks */}
                {result.risks && result.risks.length > 0 && (
                  <div style={{
                    background: 'var(--amber-glow)', border: '1px solid rgba(245,158,11,0.25)',
                    borderRadius: '0.75rem', padding: '0.875rem',
                  }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--amber)', marginBottom: '0.5rem' }}>المخاطر البيئية:</p>
                    {result.risks.map((risk: string, i: number) => (
                      <p key={i} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>• {risk}</p>
                    ))}
                  </div>
                )}

                {/* Recommendation */}
                {result.recommendation && (
                  <div style={{
                    background: 'var(--teal-glow)', border: '1px solid rgba(6,182,212,0.2)',
                    borderRadius: '0.75rem', padding: '0.875rem',
                  }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--teal)', marginBottom: '0.35rem' }}>التوصية:</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{result.recommendation}</p>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Chart Section */}
        {history.length > 0 && (
          <Card>
            <h2 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '0.95rem' }}>
              📊 سجل القراءات
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={history}>
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="temperature"   stroke="var(--rose)"    name="حرارة"       dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="humidity"      stroke="var(--teal)"    name="رطوبة جو"    dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="soil_moisture" stroke="var(--emerald)" name="رطوبة تربة"  dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>
    </>
  );
};

export default SmartEnvironmentPage;
