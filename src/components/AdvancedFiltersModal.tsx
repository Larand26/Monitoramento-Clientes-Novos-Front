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
  status?: string;
  min_avg_days_between_purchases?: number;
}

interface AdvancedFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: AdvancedFilters) => void;
  currentFilters?: AdvancedFilters;
}

const parseDateString = (dateStr?: string): Date | null => {
  if (!dateStr) return null;
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
  const [status, setStatus] = useState(currentFilters.status || "");
  const [minOrders, setMinOrders] = useState<number | "">(
    currentFilters.min_orders || "",
  );
  const [minAvgDays, setMinAvgDays] = useState<number | "">(
    currentFilters.min_avg_days_between_purchases || "",
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
    if (status) filters.status = status;
    if (minOrders !== "") filters.min_orders = Number(minOrders);
    if (minAvgDays !== "")
      filters.min_avg_days_between_purchases = Number(minAvgDays);

    onApplyFilters(filters);
    onClose();
  };

  const handleClear = () => {
    setCreatedRange([null, null]);
    setUpdatedRange([null, null]);
    setSellerId("");
    setStatus("");
    setMinOrders("");
    setMinAvgDays("");
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
          {/* Primeira Linha: Vendedor e Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyle}>Vendedor</label>
              <select
                value={sellerId}
                onChange={(e) => setSellerId(e.target.value)}
                className={inputStyle}
              >
                <option value="">Todos</option>
                {Object.entries(sellers).map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelStyle}>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={inputStyle}
              >
                <option value="">Todos</option>
                <option value="SUCCESS">Sucesso</option>
                <option value="IN_CRM">No CRM</option>
                <option value="FREEZE">Esfriando</option>
                <option value="LOST">Perdido</option>
              </select>
            </div>
          </div>

          <div className="z-20">
            <InputDateRange
              label="Data de Criação"
              value={createdRange}
              onChange={setCreatedRange}
              placeholder="Criado entre..."
            />
          </div>

          <div className="z-10">
            <InputDateRange
              label="Data de Atualização"
              value={updatedRange}
              onChange={setUpdatedRange}
              placeholder="Atualizado entre..."
            />
          </div>

          {/* Última Linha: Métricas Numéricas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyle} title="Mínimo de Pedidos">
                Mín. de Pedidos
              </label>
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
            <div>
              <label
                className={labelStyle}
                title="Mínimo de Dias Médios entre Compras"
              >
                Mín. Dias (Média)
              </label>
              <input
                type="number"
                min="0"
                placeholder="Ex: 30"
                value={minAvgDays}
                onChange={(e) =>
                  setMinAvgDays(
                    e.target.value !== "" ? Number(e.target.value) : "",
                  )
                }
                className={inputStyle}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-muted/20 bg-muted/5">
          <button
            onClick={handleClear}
            className="px-4 py-2 rounded-md bg-transparent text-muted text-sm font-medium hover:text-main hover:bg-muted/10 transition-colors"
          >
            Limpar
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
