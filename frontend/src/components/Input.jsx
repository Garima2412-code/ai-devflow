const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  error,
  helper,
  icon: Icon,
  disabled,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1.5 mb-4 ${className}`}>
      {label && (
        <label className="text-xs font-medium text-text-secondary flex items-center justify-between">
          <span>
            {label}
            {required && <span className="text-priority-high ml-1">*</span>}
          </span>
          {helper && <span className="text-[11px] text-text-tertiary">{helper}</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 text-text-tertiary pointer-events-none">
            <Icon size={16} />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`w-full rounded-lg border bg-surface-0 px-3.5 py-2.5 text-sm text-text-primary transition-all duration-150 outline-none placeholder:text-text-tertiary/70 shadow-xs ${
            Icon ? 'pl-9' : ''
          } ${
            error
              ? 'border-priority-high focus:border-priority-high focus:ring-2 focus:ring-priority-high/20'
              : 'border-border focus:border-accent focus:ring-2 focus:ring-accent/15 hover:border-slate-300 dark:hover:border-slate-600'
          } ${disabled ? 'opacity-50 cursor-not-allowed bg-surface-1' : ''}`}
          {...props}
        />
      </div>

      {error && (
        <p className="text-xs text-priority-high mt-0.5 flex items-center gap-1">
          <span>•</span> {error}
        </p>
      )}
    </div>
  );
};

export default Input;