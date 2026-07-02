import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import { loginApi } from '../../api/authApi';
import PublicLayout from '../../components/layout/PublicLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
 
const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();
 
  // If the user was redirected here from a protected page, send them
  // back there after login. Otherwise fall through to /profile.
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/profile';
 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
 
  const handleLogin = async () => {
    if (!email || !password) {
      setError('من فضلك ادخل البيانات كاملة');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const data = await loginApi(email, password);
      setAuth(data.access_token, data.role, data.user);
      // Redirect to /profile (or the originally requested page)
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'خطأ في البيانات');
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <PublicLayout>
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', position: 'relative' }}>
 
        {/* Background glow */}
        <div style={{
          position: 'absolute', width: 300, height: 300, borderRadius: '50%',
          background: 'var(--emerald-glow)', filter: 'blur(120px)',
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
                {t('auth.login_title')}
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                مرحباً بك في نظام الزراعة الذكية
              </p>
            </div>
 
            {/* Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Input
                label={t('auth.email')}
                name="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label={t('auth.password')}
                name="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
 
              {error && (
                <p style={{ color: 'var(--rose)', fontSize: '0.875rem', textAlign: 'center' }}>{error}</p>
              )}
 
              {/* Forgot Password */}
              <div style={{ textAlign: 'end' }}>
                <Link to="/forgot-password" style={{ color: 'var(--emerald)', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 500 }}>
                  {t('auth.forgot_password')}
                </Link>
              </div>
 
              <Button
                label={t('auth.login_btn')}
                onClick={handleLogin}
                loading={loading}
                fullWidth
              />
 
              <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                {t('auth.no_account')}{' '}
                <Link to="/register" style={{ color: 'var(--emerald)', textDecoration: 'none', fontWeight: 600 }}>
                  {t('nav.register')}
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
};
 
export default LoginPage;