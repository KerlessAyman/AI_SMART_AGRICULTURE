import { useState } from 'react';
import TempAINav from '../../components/layout/TempAINav';
import { useTranslation } from 'react-i18next';
import { predictExportApi } from '../../api/exportApi';
import Loader from '../../components/common/Loader';

const marketKeys = ['eu', 'gulf', 'local'] as const;
const marketBadge: Record<typeof marketKeys[number], { text: string; color: string }> = {
  eu: { text: 'EU', color: 'var(--cyan)' },
  gulf: { text: 'GCC', color: 'var(--amber)' },
  local: { text: '🏠', color: 'var(--emerald)' },
};

// Grade-based starting points for the quality sliders. These are only a
// convenient starting point — every value is fully editable, and it's the
// actual slider values (not the grade) that get sent to the model.
const GRADE_PRESETS: Record<string, Record<string, number>> = {
  A: { moisture: 12, defect_rate: 3, pesticide_level: 1.5, sugar_content: 14, size_uniformity: 90, color_score: 9, shelf_life_days: 21, temperature_storage: 6, ph_level: 6.5 },
  B: { moisture: 16, defect_rate: 10, pesticide_level: 3, sugar_content: 11, size_uniformity: 75, color_score: 7, shelf_life_days: 14, temperature_storage: 10, ph_level: 6.2 },
  C: { moisture: 20, defect_rate: 20, pesticide_level: 8, sugar_content: 9, size_uniformity: 52, color_score: 3, shelf_life_days: 5, temperature_storage: 15, ph_level: 5.5 },
};

const gradeColors: Record<string, string> = {
  A: 'var(--emerald)',
  B: 'var(--amber)',
  C: 'var(--rose)',
};

const qualitySliderKeys = [
  { key: 'moisture', labelKey: 'ai.slider_moisture', icon: '💧', min: 0, max: 40, step: 0.5 },
  { key: 'defect_rate', labelKey: 'ai.slider_defect_rate', icon: '🩹', min: 0, max: 50, step: 0.5 },
  { key: 'pesticide_level', labelKey: 'ai.slider_pesticide_level', icon: '🧪', min: 0, max: 15, step: 0.1 },
  { key: 'sugar_content', labelKey: 'ai.slider_sugar_content', icon: '🍯', min: 0, max: 25, step: 0.5 },
  { key: 'size_uniformity', labelKey: 'ai.slider_size_uniformity', icon: '📐', min: 0, max: 100, step: 1 },
  { key: 'color_score', labelKey: 'ai.slider_color_score', icon: '🎨', min: 0, max: 10, step: 0.1 },
  { key: 'shelf_life_days', labelKey: 'ai.slider_shelf_life_days', icon: '📅', min: 0, max: 40, step: 1 },
  { key: 'temperature_storage', labelKey: 'ai.slider_temperature_storage', icon: '🌡️', min: -5, max: 30, step: 0.5 },
  { key: 'ph_level', labelKey: 'ai.slider_ph_level', icon: '⚗️', min: 0, max: 14, step: 0.1 },
] as const;

const cropOptionKeys = [
  { value: 'tomato', labelKey: 'ai.crop_tomato', emoji: '🍅' },
  { value: 'orange', labelKey: 'ai.crop_orange', emoji: '🍊' },
  { value: 'strawberry', labelKey: 'ai.crop_strawberry', emoji: '🍓' },
  { value: 'potato', labelKey: 'ai.crop_potato', emoji: '🥔' },
  { value: 'pepper', labelKey: 'ai.crop_pepper', emoji: '🫑' },
  { value: 'grape', labelKey: 'ai.crop_grape', emoji: '🍇' },
  { value: 'apple', labelKey: 'ai.crop_apple', emoji: '🍎' },
  { value: 'banana', labelKey: 'ai.crop_banana', emoji: '🍌' },
  { value: 'mango', labelKey: 'ai.crop_mango', emoji: '🥭' },
  { value: 'onion', labelKey: 'ai.crop_onion', emoji: '🧅' },
] as const;

const regionOptionKeys = [
  { value: 'Nile_Delta', labelKey: 'ai.region_nile_delta' },
  { value: 'Upper_Egypt', labelKey: 'ai.region_upper_egypt' },
  { value: 'Alexandria', labelKey: 'ai.region_alexandria' },
  { value: 'Sinai', labelKey: 'ai.region_sinai' },
  { value: 'Fayoum', labelKey: 'ai.region_fayoum' },
  { value: 'Beheira', labelKey: 'ai.region_beheira' },
  { value: 'Minya', labelKey: 'ai.region_minya' },
  { value: 'Aswan', labelKey: 'ai.region_aswan' },
] as const;

// ── Reusable field shell: icon chip + label, consistent across the form ──
const FieldLabel = ({ icon, color, children, required }: { icon: string; color: string; children: React.ReactNode; required?: boolean }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
    <span style={{
      width: 22, height: 22, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '0.75rem', background: `${color}1f`, border: `1px solid ${color}33`, flexShrink: 0,
    }}>{icon}</span>
    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
      {children} {required && <span style={{ color: 'var(--rose)' }}>*</span>}
    </label>
  </div>
);

const selectStyle: React.CSSProperties = {
  background: 'var(--bg-input)',
  border: '1px solid var(--border-input)',
  borderRadius: '0.65rem',
  padding: '0.7rem 0.9rem',
  fontSize: '0.875rem',
  color: 'var(--text-primary)',
  outline: 'none',
  fontFamily: 'inherit',
  width: '100%',
  boxSizing: 'border-box',
  cursor: 'pointer',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  appearance: 'none',
  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%237fb9a0' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'left 0.9rem center',
  paddingInlineStart: '2.1rem',
};

const focusRing = (e: React.FocusEvent<HTMLElement>) => {
  (e.currentTarget as HTMLElement).style.borderColor = 'var(--emerald)';
  (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 3px var(--emerald-glow)';
};
const blurRing = (e: React.FocusEvent<HTMLElement>) => {
  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-input)';
  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
};

const ExportIntelligencePage = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    crop_type: '',
    quality_grade: 'A',
    weight: '',
    region: '',
  });
  const [quality, setQuality] = useState<Record<string, number>>({ ...GRADE_PRESETS.A });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const setGrade = (grade: string) => {
    setForm(prev => ({ ...prev, quality_grade: grade }));
    // Re-seed the quality sliders to the new grade's typical values so the
    // form stays sensible, but the user can still override any of them.
    if (GRADE_PRESETS[grade]) setQuality({ ...GRADE_PRESETS[grade] });
  };

  const handleQualityChange = (key: string, value: number) => {
    setQuality(prev => ({ ...prev, [key]: value }));
  };

  const handleAnalyze = async () => {
    if (!form.crop_type || !form.weight || !form.region) {
      setError(t('ai.fill_all_fields_error'));
      return;
    }
    try {
      setLoading(true);
      setError('');
      const data = await predictExportApi({
        crop_type: form.crop_type,
        quality_grade: form.quality_grade,
        weight: Number(form.weight),
        region: form.region,
        ...quality,
      });
      setResult(data);
    } catch (err: any) {
      setError(t('ai.analyze_error'));
    } finally {
      setLoading(false);
    }
  };

  const eligibleCount = result ? marketKeys.filter(k => result[k]?.eligible).length : 0;

  return (
    <>
      <TempAINav />
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.5rem' }} className="animate-fadeInUp">

        {/* ── Header ── */}
        <div style={{ marginBottom: '1.75rem' }}>
          <span className="ai-badge" style={{ marginBottom: '0.6rem' }}>
            <span className="pulse-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--emerald)', display: 'inline-block' }} />
            AI Export Advisor
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginTop: '0.5rem' }}>
            <div style={{
              width: 46, height: 46, borderRadius: 13, flexShrink: 0,
              background: 'linear-gradient(135deg, var(--teal-glow), var(--cyan-glow))',
              border: '1px solid rgba(6,182,212,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem',
              boxShadow: '0 0 24px var(--teal-glow)',
            }}>🚢</div>
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.3px', lineHeight: 1.2 }}>
                {t('ai.export_title')}
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
                {t('ai.export_intel_subtitle')}
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>

          {/* ── Form Card ── */}
          <div className="card card-hover animate-fadeInUp" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <div style={{ width: 4, height: 18, borderRadius: 999, background: 'linear-gradient(180deg, var(--emerald), var(--cyan))' }} />
              <h2 style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                {t('ai.crop_data_section')}
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>

              {/* Crop Type */}
              <div>
                <FieldLabel icon="🌾" color="var(--emerald)" required>{t('ai.crop_type_label')}</FieldLabel>
                <select
                  name="crop_type"
                  value={form.crop_type}
                  onChange={handleChange}
                  style={selectStyle}
                  onFocus={focusRing}
                  onBlur={blurRing}
                >
                  <option value="">{t('ai.select_crop_type')}</option>
                  {cropOptionKeys.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.emoji} {t(opt.labelKey)}</option>
                  ))}
                </select>
              </div>

              {/* Quality Grade — segmented control */}
              <div>
                <FieldLabel icon="⭐" color="var(--amber)" required>{t('ai.quality_grade_label')}</FieldLabel>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  {(['A', 'B', 'C'] as const).map(g => {
                    const active = form.quality_grade === g;
                    const color = gradeColors[g];
                    const labelKey = g === 'A' ? 'ai.grade_a_excellent' : g === 'B' ? 'ai.grade_b_good' : 'ai.grade_c_acceptable';
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGrade(g)}
                        style={{
                          padding: '0.6rem 0.4rem',
                          borderRadius: '0.65rem',
                          border: `1.5px solid ${active ? color : 'var(--border-input)'}`,
                          background: active ? `${color}1a` : 'var(--bg-input)',
                          color: active ? color : 'var(--text-secondary)',
                          fontWeight: 700,
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                          textAlign: 'center',
                          lineHeight: 1.3,
                        }}
                      >
                        {t(labelKey)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Weight */}
              <div>
                <FieldLabel icon="⚖️" color="var(--cyan)" required>{t('ai.weight_label')}</FieldLabel>
                <div style={{ position: 'relative' }}>
                  <input
                    name="weight"
                    type="number"
                    value={form.weight}
                    onChange={handleChange}
                    placeholder={t('ai.weight_placeholder')}
                    style={{ ...selectStyle, paddingInlineStart: '0.9rem', paddingInlineEnd: '3rem', cursor: 'text', backgroundImage: 'none' }}
                    onFocus={focusRing}
                    onBlur={blurRing}
                  />
                  <span style={{
                    position: 'absolute', insetInlineEnd: '0.9rem', top: '50%', transform: 'translateY(-50%)',
                    fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', pointerEvents: 'none',
                  }}>kg</span>
                </div>
              </div>

              {/* Region */}
              <div>
                <FieldLabel icon="📍" color="var(--violet)" required>{t('ai.region_label')}</FieldLabel>
                <select
                  name="region"
                  value={form.region}
                  onChange={handleChange}
                  style={selectStyle}
                  onFocus={focusRing}
                  onBlur={blurRing}
                >
                  <option value="">{t('ai.select_region')}</option>
                  {regionOptionKeys.map(opt => (
                    <option key={opt.value} value={opt.value}>{t(opt.labelKey)}</option>
                  ))}
                </select>
              </div>

              {/* Advanced quality features — these are what actually drive the prediction */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '0.15rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAdvanced(v => !v)}
                  style={{
                    background: 'transparent', border: 'none', cursor: 'pointer', width: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 0,
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--emerald)', fontSize: '0.83rem', fontWeight: 700 }}>
                    🎚️ {t('ai.advanced_quality_toggle')}
                  </span>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 20, height: 20, borderRadius: 6, background: 'var(--emerald-glow)', color: 'var(--emerald)',
                    fontSize: '0.65rem', transition: 'transform 0.2s', transform: showAdvanced ? 'rotate(180deg)' : 'none',
                  }}>▼</span>
                </button>

                {showAdvanced && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginTop: '1rem' }}>
                    {qualitySliderKeys.map(s => (
                      <div key={s.key} style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '0.65rem', padding: '0.65rem 0.85rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span style={{ fontSize: '0.85rem' }}>{s.icon}</span> {t(s.labelKey)}
                          </span>
                          <span style={{
                            fontSize: '0.75rem', color: 'var(--emerald)', fontWeight: 800, fontFamily: 'monospace',
                            background: 'var(--emerald-glow)', padding: '0.1rem 0.5rem', borderRadius: 999,
                          }}>
                            {quality[s.key]}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={s.min}
                          max={s.max}
                          step={s.step}
                          value={quality[s.key]}
                          onChange={e => handleQualityChange(s.key, Number(e.target.value))}
                          style={{ width: '100%', accentColor: 'var(--emerald)' }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {error && (
                <p style={{
                  color: 'var(--rose)', fontSize: '0.82rem', textAlign: 'center', fontWeight: 600,
                  background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)',
                  borderRadius: '0.6rem', padding: '0.6rem',
                }}>{error}</p>
              )}

              <button
                onClick={handleAnalyze}
                disabled={loading}
                style={{
                  background: 'linear-gradient(135deg,#10b981,#059669)',
                  border: 'none', color: '#fff', padding: '0.8rem', borderRadius: '0.7rem',
                  fontWeight: 700, fontSize: '0.92rem', cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1, transition: 'all 0.2s', fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  boxShadow: '0 4px 18px rgba(16,185,129,0.25)',
                }}
              >
                {loading ? '···' : <>🧠 {t('ai.analyze_btn')}</>}
              </button>
            </div>
          </div>

          {/* ── Result Card ── */}
          <div className="card animate-fadeInUp" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 4, height: 18, borderRadius: 999, background: 'linear-gradient(180deg, var(--cyan), var(--violet))' }} />
                <h2 style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                  {t('ai.result')}
                </h2>
              </div>
              {result && (
                <span style={{
                  fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.65rem', borderRadius: 999,
                  background: eligibleCount > 0 ? 'var(--emerald-glow)' : 'rgba(244,63,94,0.1)',
                  color: eligibleCount > 0 ? 'var(--emerald)' : 'var(--rose)',
                  border: `1px solid ${eligibleCount > 0 ? 'var(--border-chip)' : 'rgba(244,63,94,0.25)'}`,
                }}>
                  {eligibleCount}/{marketKeys.length}
                </span>
              )}
            </div>

            {loading && <Loader text={t('ai.analyzing_export_data')} />}

            {!loading && !result && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 280, color: 'var(--text-muted)', gap: '0.75rem' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.8rem', border: '1.5px dashed var(--border-strong)', background: 'var(--bg-input)',
                }}>🌍</div>
                <p style={{ fontSize: '0.85rem', textAlign: 'center', maxWidth: 220 }}>{t('ai.export_recommendations_placeholder')}</p>
              </div>
            )}

            {!loading && result && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {marketKeys.map((marketKey, i) => {
                  const marketResult = result[marketKey];
                  const eligible = marketResult?.eligible;
                  return (
                    <div
                      key={marketKey}
                      className={`animate-fadeInUp-delay-${Math.min(i + 1, 5) as 1 | 2 | 3 | 4 | 5}`}
                      style={{
                        border: `1px solid ${eligible ? 'var(--border-chip)' : 'rgba(244,63,94,0.22)'}`,
                        borderRadius: '0.8rem',
                        padding: '1rem',
                        background: eligible ? 'var(--emerald-glow)' : 'rgba(244,63,94,0.06)',
                        position: 'relative', overflow: 'hidden',
                      }}
                    >
                      <div style={{
                        position: 'absolute', top: 0, insetInlineStart: 0, bottom: 0, width: 3,
                        background: eligible ? 'var(--emerald)' : 'var(--rose)',
                      }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                        <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            minWidth: 30, height: 22, padding: '0 0.4rem', borderRadius: 7,
                            fontSize: marketBadge[marketKey].text.length > 2 ? '0.62rem' : '0.68rem',
                            fontWeight: 800, letterSpacing: '0.02em',
                            background: `${marketBadge[marketKey].color}1f`,
                            border: `1px solid ${marketBadge[marketKey].color}40`,
                            color: marketBadge[marketKey].color,
                          }}>{marketBadge[marketKey].text}</span>
                          {t(`ai.market_${marketKey}`)}
                        </p>
                        <span style={{
                          fontSize: '0.72rem', fontWeight: 800,
                          padding: '0.25rem 0.65rem', borderRadius: '999px',
                          background: eligible ? 'rgba(0,201,167,0.18)' : 'rgba(244,63,94,0.15)',
                          color: eligible ? 'var(--emerald)' : 'var(--rose)',
                          whiteSpace: 'nowrap',
                        }}>
                          {eligible ? t('ai.eligible_status') : t('ai.not_eligible_status')}
                        </span>
                      </div>
                      {(() => {
                        const reasonText = t(eligible ? 'ai.reason_eligible' : 'ai.reason_not_eligible', {
                          market: t(`ai.market_name_${marketKey}`),
                        });
                        return (
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>{reasonText}</p>
                        );
                      })()}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ExportIntelligencePage;