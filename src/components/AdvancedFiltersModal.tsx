import { useState } from "react";
import { useAppStore } from "../store/useAppStore";
import InputDateRange, { type DateRange } from "./InputDateRange";

export interface AdvancedFilters {
  created_start?: string;
  created_end?: string;
  updated_start?: string;
  updated_end?: string;
  seller_id?: string;
  min_orders?: number;
}

interface AdvancedFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: AdvancedFilters) => void;
  currentFilters?: AdvancedFilters;
}

// Função auxiliar para evitar problemas de fuso horário (Timezone) ao montar o calendário
const parseDateString = (dateStr?: string): Date | null => {
  if (!dateStr) return null;
  // Adiciona T00:00:00 para forçar a leitura na meia-noite local, evitando que o dia volte 1 pra trás
  return new Date(`${dateStr}T00:00:00`);
};

const formatDateToString = (date: Date | null): string | undefined => {
  if (!date) return undefined;
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export default function AdvancedFiltersModal({
  isOpen,
  onClose,
  onApplyFilters,
  currentFilters = {},
}: AdvancedFiltersModalProps) {
  const sellers = useAppStore((state) => state.sellers);

  const [createdRange, setCreatedRange] = useState<DateRange>([
    parseDateString(currentFilters.created_start),
    parseDateString(currentFilters.created_end),
  ]);

  const [updatedRange, setUpdatedRange] = useState<DateRange>([
    parseDateString(currentFilters.updated_start),
    parseDateString(currentFilters.updated_end),
  ]);

  const [sellerId, setSellerId] = useState(currentFilters.seller_id || "");
  const [minOrders, setMinOrders] = useState<number | "">(
    currentFilters.min_orders || "",
  );

  if (!isOpen) return null;

  const handleApply = () => {
    const filters: AdvancedFilters = {};

    const cStart = formatDateToString(createdRange[0]);
    const cEnd = formatDateToString(createdRange[1]);
    if (cStart) filters.created_start = cStart;
    if (cEnd) filters.created_end = cEnd;

    const uStart = formatDateToString(updatedRange[0]);
    const uEnd = formatDateToString(updatedRange[1]);
    if (uStart) filters.updated_start = uStart;
    if (uEnd) filters.updated_end = uEnd;

    if (sellerId) filters.seller_id = sellerId;
    if (minOrders !== "") filters.min_orders = Number(minOrders);

    onApplyFilters(filters);
    onClose();
  };

  const handleClear = () => {
    setCreatedRange([null, null]);
    setUpdatedRange([null, null]);
    setSellerId("");
    setMinOrders("");
    onApplyFilters({});
    onClose();
  };

  const inputStyle =
    "w-full bg-page text-main text-sm border border-muted/20 rounded-md px-3 py-2 outline-none focus:border-primary transition-colors duration-300 shadow-sm";
  const labelStyle = "block text-muted text-xs font-semibold mb-1 uppercase";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-card w-full max-w-lg rounded-xl shadow-2xl border border-muted/20 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center px-6 py-4 border-b border-muted/20 bg-muted/5">
          <h2 className="text-xl font-title text-main uppercase">
            Filtros Avançados
          </h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-error transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[70vh] custom-scrollbar">
          {/* Seção Vendedor */}
          <div>
            <label className={labelStyle}>Vendedor</label>
            <select
              value={sellerId}
              onChange={(e) => setSellerId(e.target.value)}
              className={inputStyle}
            >
              <option value="">Todos os vendedores</option>
              {Object.entries(sellers).map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Seção Data de Criação (Substituído pelo novo componente) */}
          <div className="z-20">
            <InputDateRange
              label="Data de Criação"
              value={createdRange}
              onChange={setCreatedRange}
              placeholder="Criado entre..."
            />
          </div>

          {/* Seção Data de Atualização (Substituído pelo novo componente) */}
          <div className="z-10">
            <InputDateRange
              label="Data de Atualização"
              value={updatedRange}
              onChange={setUpdatedRange}
              placeholder="Atualizado entre..."
            />
          </div>

          {/* Seção Total de Pedidos */}
          <div>
            <label className={labelStyle}>Mínimo de Pedidos</label>
            <input
              type="number"
              min="0"
              placeholder="Ex: 5"
              value={minOrders}
              onChange={(e) =>
                setMinOrders(
                  e.target.value !== "" ? Number(e.target.value) : "",
                )
              }
              className={inputStyle}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-muted/20 bg-muted/5">
          <button
            onClick={handleClear}
            className="px-4 py-2 rounded-md bg-transparent text-muted text-sm font-medium hover:text-main hover:bg-muted/10 transition-colors"
          >
            Limpar Filtros
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 rounded-md bg-primary text-page text-sm font-semibold hover:bg-primary/90 transition-colors shadow-md"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  );
}
