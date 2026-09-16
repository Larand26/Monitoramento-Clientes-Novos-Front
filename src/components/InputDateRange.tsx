import { useState, useEffect, useRef } from "react";

export type DateRange = [Date | null, Date | null];

interface InputDateRangeProps {
  label?: string;
  value: DateRange;
  onChange: (dates: DateRange) => void;
  placeholder?: string;
}

const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function InputDateRange({
  label,
  value,
  onChange,
  placeholder = "Selecione um período...",
}: InputDateRangeProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(
    value[0] || new Date(),
  );

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClear = (event: React.MouseEvent) => {
    event.stopPropagation();
    onChange([null, null]);
  };

  const handleDateClick = (clickedDate: Date) => {
    const [start, end] = value;

    if (!start || (start && end)) {
      onChange([clickedDate, null]);
    } else {
      if (clickedDate >= start) {
        onChange([start, clickedDate]);
        setIsOpen(false);
      } else {
        onChange([clickedDate, start]);
        setIsOpen(false);
      }
    }
  };

  const changeMonth = (offset: number) => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + offset);
      return newDate;
    });
  };

  const buildDaysArray = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDayOfWeek = firstDay.getDay();

    const days = [];

    // Preencher dias do mês anterior
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push({ date: new Date(year, month, -i), isCurrentMonth: false });
    }

    // Dias do mês atual
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }

    // Preencher final para manter a grade fixa (42 dias = 6 semanas)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }

    return days;
  };

  const formatDate = (date: Date) => {
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  const displayValue = () => {
    const [start, end] = value;
    if (start && end) return `${formatDate(start)} - ${formatDate(end)}`;
    if (start) return `${formatDate(start)} - ...`;
    return "";
  };

  const getDayClass = (date: Date, isCurrentMonth: boolean) => {
    const [start, end] = value;
    const time = date.getTime();
    const startTime = start?.getTime();
    const endTime = end?.getTime();

    const baseClass =
      "w-8 h-8 flex items-center justify-center text-sm rounded-full transition-colors duration-200 cursor-pointer";
    const monthClass = isCurrentMonth
      ? "text-main hover:bg-muted/20"
      : "text-muted/40 hover:bg-muted/10";

    if (startTime === time || endTime === time) {
      return `${baseClass} bg-primary text-page font-bold shadow-md z-10 relative`;
    }

    if (startTime && endTime && time > startTime && time < endTime) {
      return `${baseClass} bg-primary/20 text-main rounded-none w-full`;
    }

    return `${baseClass} ${monthClass}`;
  };

  const hasValue = value[0] !== null;

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <label className="block text-muted text-xs font-semibold mb-1 uppercase">
          {label}
        </label>
      )}

      <div
        className="w-full flex items-center bg-page text-main text-sm border border-muted/20 rounded-md px-3 py-2 cursor-pointer focus-within:border-primary transition-colors duration-300 shadow-sm"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <input
          type="text"
          value={displayValue()}
          readOnly
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none cursor-pointer placeholder-muted/60"
        />
        {hasValue ? (
          <button
            onClick={handleClear}
            className="text-muted hover:text-error transition-colors"
            title="Limpar período"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4 text-primary"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
            />
          </svg>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 p-4 bg-card border border-muted/20 rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => changeMonth(-1)}
              className="p-1 rounded-md text-muted hover:bg-muted/10 hover:text-main transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <span className="text-main font-semibold text-sm">
              {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <button
              onClick={() => changeMonth(1)}
              className="p-1 rounded-md text-muted hover:bg-muted/10 hover:text-main transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-semibold text-muted uppercase"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1 justify-items-center">
            {buildDaysArray().map((dayObj, index) => (
              <div key={index} className="w-full flex justify-center">
                <button
                  type="button"
                  onClick={() => handleDateClick(dayObj.date)}
                  className={getDayClass(dayObj.date, dayObj.isCurrentMonth)}
                >
                  {dayObj.date.getDate()}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
