interface InputBoxProps {
  type: string;
  name: string;
  placeholder: string;
  value?: string;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function InputBox({ type, name, placeholder, value = '', onChange, error }: InputBoxProps) {
  return (
    <input
      type={type}
      name={name}
      id={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full h-14 mt-2 px-5 text-base text-[var(--text)] bg-white rounded-full border transition-all outline-none ${error
          ? 'border-red-400 ring-1 ring-red-300 focus:border-red-400'
          : 'border-[var(--border)] focus:border-brand focus:ring-2 focus:ring-[var(--brand-glow)]'
        } shadow-[0_4px_16px_rgba(0,0,0,0.04)]`}
    />
  );
}