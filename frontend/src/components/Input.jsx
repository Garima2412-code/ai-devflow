const Input = ({ label, type = 'text', value, onChange, placeholder, required }) => {
  return (
    <div className="flex flex-col gap-1 mb-4">
      <label className="text-small text-text-secondary font-medium">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="border border-border rounded-sm px-3 py-2 text-body text-text-primary
                   bg-surface-0 outline-none focus:border-accent transition-colors"
      />
    </div>
  );
};

export default Input;