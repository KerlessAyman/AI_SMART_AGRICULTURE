import { useState } from 'react';
import TempAINav from '../../components/layout/TempAINav';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import { predictQualityApi } from '../../api/qualityApi';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
const gradeConfig: Record<string, { color: string; bg: string; border: string; labelKey: string }> = {
 A: { color: 'var(--emerald)', bg: 'var(--emerald-glow)', border: 'var(--border-chip)', labelKey: 'ai.fresh_exportable' },
 C: { color: 'var(--rose)', bg: 'rgba(244,63,94,0.08)', border: 'rgba(244,63,94,0.2)', labelKey: 'ai.not_fresh_not_exportable' },
};
const QualityAssessmentPage = () => {
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
     const data = await predictQualityApi(image);
     setResult(data);
   } catch (err: any) {
     setError(t('ai.analyze_error'));
   } finally {
     setLoading(false);
   }
 };
 const grade = result?.grade ? gradeConfig[result.grade] : null;
 return (
<>
<TempAINav />
<div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>
       {/* Header */}
<div style={{ marginBottom: '2rem' }}>
<div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
<div style={{
             width: 40, height: 40, borderRadius: 10,
             background: 'var(--amber-glow)', border: '1px solid rgba(245,158,11,0.2)',
             display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
           }}>⭐</div>
<h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
             {t('ai.quality_title')}
</h1>
</div>
<p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
           {t('ai.quality_subtitle')}
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
<span style={{ fontSize: '3rem' }}>🌾</span>
<p style={{ fontSize: '0.875rem' }}>{t('ai.drag_drop_crop')}</p>
</div>
             )}
</div>
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
           {loading && <Loader text={t('ai.evaluating_quality')} />}
           {!loading && !result && (
<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 180, color: 'var(--text-muted)' }}>
<span style={{ fontSize: '3rem' }}>⭐</span>
<p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>{t('ai.result_placeholder')}</p>
</div>
           )}
           {!loading && result && (
<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               {/* Grade Badge */}
<div style={{
                 border: `1px solid ${grade?.border || 'var(--border)'}`,
                 borderRadius: '0.875rem',
                 padding: '1.5rem',
                 textAlign: 'center',
                 background: grade?.bg || 'var(--bg-chip)',
               }}>
<p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{t('ai.quality_grade_label')}</p>
<p style={{ fontSize: '4rem', fontWeight: 800, color: grade?.color || 'var(--text-primary)', lineHeight: 1 }}>
                   {result.grade || 'N/A'}
</p>
<p style={{ fontSize: '0.85rem', color: grade?.color || 'var(--text-secondary)', marginTop: '0.5rem' }}>
                   {result.label || (grade ? t(grade.labelKey) : '')}
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
                     background: grade?.color || 'var(--emerald)',
                     height: 6,
                     borderRadius: '999px',
                     width: `${Math.min(result.confidence || 0, 100)}%`,
                     transition: 'width 0.8s ease',
                   }} />
</div>
</div>
               {/* Details */}
               {result.details && (
<div style={{
                   background: 'var(--bg-chip)', border: '1px solid var(--border)',
                   borderRadius: '0.75rem', padding: '0.875rem',
                 }}>
<p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t('ai.additional_details_label')}</p>
<p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', marginTop: '0.25rem', lineHeight: 1.6 }}>{result.details}</p>
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
export default QualityAssessmentPage;