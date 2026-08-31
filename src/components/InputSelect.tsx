export interface SelectOption {
  label: string;
  value: string | number;
}

interface InputSelectProps {
  label?: string;
  name?: string;
  value: string | number;
  options: SelectOption[];
  onChange: (value: string, name?: string) => void;
}

export default function InputSelect({
  label,
  name,
  value,
  options,
  onChange,
}: InputSelectProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-muted text-xs font-semibold uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative w-full">
        <select
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value, name)}
          className="w-full bg-card text-main text-sm border border-muted/20 rounded-md pl-3 pr-8 py-2 outline-none focus:border-primary transition-colors duration-300 appearance-none cursor-pointer"
        >
          <option value="" disabled hidden>
            Selecione uma opção...
          </option>
          {options.map((option) => (
            <option key={String(option.value)} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Ícone customizado de seta para substituir o padrão do navegador */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
