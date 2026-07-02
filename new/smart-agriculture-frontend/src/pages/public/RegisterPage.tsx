import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { registerApi } from '../../api/authApi';
import PublicLayout from '../../components/layout/PublicLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const RegisterPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
    role: 'farmer',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password || !form.confirm_password) {
      setError('من فضلك ادخل البيانات كاملة');
      return;
    }
    if (form.password !== form.confirm_password) {
      setError('كلمة المرور مش متطابقة');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await registerApi({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      navigate('/signin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'حدث خطأ، حاول تاني');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem', position: 'relative' }}>

        {/* Background glow */}
        <div style={{
          position: 'absolute', width: 300, height: 300, borderRadius: '50%',
          background: 'var(--teal-glow)', filter: 'blur(120px)',
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }} />

        <div style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}>
          <Card>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: 'var(--logo-bg)', border: '1px solid var(--border-strong)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', margin: '0 auto 1rem',
                boxShadow: '0 0 20px var(--logo-bg-glow)',
              }}>
                🌱
              </div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                {t('auth.register_title')}
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                انضم لنظام الزراعة الذكية
              </p>
            </div>

            {/* Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Input
                label={t('auth.full_name')}
                name="name"
                placeholder="الاسم الكامل"
                value={form.name}
                onChange={handleChange}
                required
              />
              <Input
                label={t('auth.email')}
                name="email"
                type="email"
                placeholder="example@email.com"
                value={form.email}
                onChange={handleChange}
                required
              />
              <Input
                label={t('auth.password')}
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
              <Input
                label={t('auth.confirm_password')}
                name="confirm_password"
                type="password"
                placeholder="••••••••"
                value={form.confirm_password}
                onChange={handleChange}
                required
              />

              {/* Role Select */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                  {t('auth.role')} <span style={{ color: 'var(--rose)' }}>*</span>
                </label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  style={{
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-input)',
                    borderRadius: '0.5rem',
                    padding: '0.55rem 0.875rem',
                    fontSize: '0.875rem',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  <option value="farmer">{t('auth.farmer')}</option>
                  <option value="trader">{t('auth.trader')}</option>
                  <option value="exporter">{t('auth.exporter')}</option>
                </select>
              </div>

              {error && (
                <p style={{ color: 'var(--rose)', fontSize: '0.875rem', textAlign: 'center' }}>{error}</p>
              )}

              <Button
                label={t('auth.register_btn')}
                onClick={handleRegister}
                loading={loading}
                fullWidth
              />

              <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                {t('auth.have_account')}{' '}
                <Link to="/signin" style={{ color: 'var(--emerald)', textDecoration: 'none', fontWeight: 600 }}>
                  {t('nav.login')}
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
};

export default RegisterPage;
