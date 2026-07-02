import { useState } from 'react';
import TempAINav from '../../components/layout/TempAINav';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import { predictDiseaseApi } from '../../api/diseaseApi';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';

const DiseaseDetectionPage = () => {
  const { t } = useTranslation();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError('');
    },
  });

  const handleAnalyze = async () => {
    if (!image) {
      setError(t('ai.upload_error'));
      return;
    }
    try {
      setLoading(true);
      setError('');
      const data = await predictDiseaseApi(image);
      setResult(data);
    } catch (err: any) {
      setError(t('ai.analyze_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TempAINav />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'var(--emerald-glow)', border: '1px solid var(--border-chip)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
            }}>🌿</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {t('ai.disease_title')}
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            {t('ai.disease_subtitle')}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

          {/* Upload Section */}
          <Card>
            <h2 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '0.95rem' }}>
              {t('ai.upload_image')}
            </h2>

            <div
              {...getRootProps()}
              style={{
                border: `2px dashed ${isDragActive ? 'var(--emerald)' : 'var(--border-strong)'}`,
                borderRadius: '0.875rem',
                padding: '2rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: isDragActive ? 'var(--emerald-glow)' : 'var(--bg-input)',
              }}
            >
              <input {...getInputProps()} />
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  style={{ maxHeight: 180, margin: '0 auto', borderRadius: 8, objectFit: 'contain', display: 'block' }}
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                  <span style={{ fontSize: '3rem' }}>📷</span>
                  <p style={{ fontSize: '0.875rem' }}>{t('ai.drag_drop_image')}</p>
                </div>
              )}
            </div>

            {preview && (
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', textAlign: 'center' }}>
                {t('ai.click_to_change')}
              </p>
            )}

            {error && (
              <p style={{ color: 'var(--rose)', fontSize: '0.875rem', marginTop: '0.75rem', textAlign: 'center' }}>{error}</p>
            )}

            <div style={{ marginTop: '1rem' }}>
              <Button label={t('ai.analyze_btn')} onClick={handleAnalyze} loading={loading} fullWidth />
            </div>
          </Card>

          {/* Result Section */}
          <Card>
            <h2 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '0.95rem' }}>
              {t('ai.result')}
            </h2>

            {loading && <Loader text={t('ai.analyzing_image')} />}

            {!loading && !result && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 180, color: 'var(--text-muted)' }}>
                <span style={{ fontSize: '3rem' }}>🔍</span>
                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>{t('ai.result_placeholder')}</p>
              </div>
            )}

            {!loading && result && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                {/* Disease Name */}
                <div style={{
                  background: result.is_healthy ? 'rgba(16, 185, 129, 0.08)' : 'rgba(244, 63, 94, 0.08)',
                  border: `1px solid ${result.is_healthy ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)'}`,
                  borderRadius: '0.75rem', padding: '1rem',
                }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t('ai.plant_label')}</p>
                  <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                    {result.plant || t('ai.not_specified')}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{t('ai.disease_detected_label')}</p>
                  <p style={{ fontSize: '1.1rem', fontWeight: 700, color: result.is_healthy ? 'var(--emerald)' : 'var(--rose)', marginTop: '0.25rem' }}>
                    {result.is_healthy ? `✅ ${t('ai.plant_healthy')}` : result.disease_name || result.disease}
                  </p>
                </div>

                {/* Confidence */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.35rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{t('ai.confidence')}</span>
                    <span style={{ fontWeight: 700, color: 'var(--emerald)' }}>
                      {result.confidence ? `${result.confidence.toFixed(1)}%` : 'N/A'}
                    </span>
                  </div>
                  <div style={{ width: '100%', background: 'var(--bg-chip)', borderRadius: '999px', height: 6 }}>
                    <div style={{
                      background: 'var(--emerald)', height: 6, borderRadius: '999px',
                      width: `${Math.min(result.confidence || 0, 100)}%`, transition: 'width 0.8s ease',
                      boxShadow: '0 0 8px var(--emerald-glow)',
                    }} />
                  </div>
                </div>

                {/* Recommendation */}
                {result.recommendation && (
                  <div style={{
                    background: 'var(--emerald-glow)', border: '1px solid var(--border-chip)',
                    borderRadius: '0.75rem', padding: '1rem',
                  }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t('ai.recommendation_label')}</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', marginTop: '0.25rem', lineHeight: 1.6 }}>
                      {result.recommendation}
                    </p>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  );
};

export default DiseaseDetectionPage;