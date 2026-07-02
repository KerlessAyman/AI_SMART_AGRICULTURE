interface ButtonProps {
  label: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<string, React.CSSProperties> = {
  primary: {
    background: 'var(--emerald)',
    color: '#030d0e',
    border: '1px solid transparent',
  },
  secondary: {
    background: 'var(--bg-card-hover)',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border-strong)',
  },
  danger: {
    background: 'var(--rose)',
    color: '#fff',
    border: '1px solid transparent',
  },
};

const Button = ({
  label,
  onClick,
  type = 'button',
  variant = 'primary',
  loading = false,
  disabled = false,
  fullWidth = false,
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        ...variantStyles[variant],
        width: fullWidth ? '100%' : undefined,
        padding: '0.55rem 1.25rem',
        borderRadius: '0.5rem',
        fontWeight: 600,
        fontSize: '0.9rem',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.5 : 1,
        transition: 'all 0.2s',
        outline: 'none',
        fontFamily: 'inherit',
      }}
      onMouseEnter={e => {
        if (!disabled && !loading) {
          if (variant === 'primary') (e.currentTarget as HTMLButtonElement).style.background = 'var(--emerald-bright)';
          else if (variant === 'secondary') (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--emerald)';
        }
      }}
      onMouseLeave={e => {
        if (!disabled && !loading) {
          if (variant === 'primary') (e.currentTarget as HTMLButtonElement).style.background = 'var(--emerald)';
          else if (variant === 'secondary') (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-strong)';
        }
      }}
    >
      {loading ? '...' : label}
    </button>
  );
};

export default Button;
