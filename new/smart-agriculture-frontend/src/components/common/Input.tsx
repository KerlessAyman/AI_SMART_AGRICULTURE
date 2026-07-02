interface InputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
}

const Input = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required,
}: InputProps) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%' }}>
      <label htmlFor={name} style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
        {label} {required && <span style={{ color: 'var(--rose)' }}>*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          background: 'var(--bg-input)',
          border: `1px solid ${error ? 'var(--rose)' : 'var(--border-input)'}`,
          borderRadius: '0.5rem',
          padding: '0.55rem 0.875rem',
          fontSize: '0.875rem',
          color: 'var(--text-primary)',
          outline: 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          fontFamily: 'inherit',
          width: '100%',
          boxSizing: 'border-box',
        }}
        onFocus={e => {
          e.currentTarget.style.borderColor = 'var(--emerald)';
          e.currentTarget.style.boxShadow = '0 0 0 3px var(--emerald-glow)';
        }}
        onBlur={e => {
          e.currentTarget.style.borderColor = error ? 'var(--rose)' : 'var(--border-input)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      />
      {error && <span style={{ color: 'var(--rose)', fontSize: '0.75rem' }}>{error}</span>}
    </div>
  );
};

export default Input;
