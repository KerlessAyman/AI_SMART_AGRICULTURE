import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { forgotPasswordApi } from '../../api/authApi';
import PublicLayout from '../../components/layout/PublicLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const ForgotPasswordPage = () => {
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      setError('من فضلك ادخل البريد الإلكتروني');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await forgotPasswordApi(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'حدث خطأ، حاول تاني');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>

          {/* Glow orb */}
          <div style={{
            width: 200, height: 200, borderRadius: '50%',
            background: 'var(--emerald-glow)', filter: 'blur(80px)',
            position: 'absolute', left: '50%', transform: 'translateX(-50%)',
            pointerEvents: 'none', zIndex: 0,
          }} />

          <Card>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '2rem', position: 'relative', zIndex: 1 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: 'var(--emerald-glow)', border: '1px solid var(--border-strong)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', margin: '0 auto 1rem',
              }}>
                🔑
              </div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                {t('auth.forgot_password')}
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                هندخل بريدك الإلكتروني ونبعتلك رابط إعادة التعيين
              </p>
            </div>

            {/* Success State */}
            {success ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontSize: '3.5rem' }}>📧</div>
                <p style={{ color: 'var(--emerald)', fontWeight: 600, textAlign: 'center' }}>
                  تم إرسال رابط إعادة التعيين على بريدك الإلكتروني
                </p>
                <Link to="/signin">
                  <Button label={t('nav.login')} />
                </Link>
              </div>
            ) : (
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

                {error && (
                  <p style={{ color: 'var(--rose)', fontSize: '0.875rem', textAlign: 'center' }}>{error}</p>
                )}

                <Button
                  label="إرسال رابط إعادة التعيين"
                  onClick={handleSubmit}
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
            )}
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ForgotPasswordPage;
