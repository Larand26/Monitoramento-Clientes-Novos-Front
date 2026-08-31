import { useState, useEffect } from "react";
import type { Client } from "../interfaces/client.interface";
import * as utils from "../utils/utils";

interface EditClientModalProps {
  isOpen: boolean;
  clientData: Client | null;
  onClose: () => void;
  onSave: (updatedClient: Client) => void;
}

export default function EditClientModal({
  isOpen,
  clientData,
  onClose,
  onSave,
}: EditClientModalProps) {
  const [formData, setFormData] = useState<Client | null>(null);

  // Sincroniza os dados do formulário sempre que o modal abre ou o cliente selecionado muda
  useEffect(() => {
    if (clientData) {
      setFormData({ ...clientData });
    }
  }, [clientData, isOpen]);

  if (!isOpen || !formData) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSave = () => {
    if (formData) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-md rounded-xl shadow-2xl border border-muted/20 flex flex-col animate-fade-in-up">
        {/* Cabeçalho do Modal */}
        <div className="px-6 py-4 border-b border-muted/20">
          <h2 className="text-2xl font-title text-main uppercase tracking-wider">
            Editar Cliente
          </h2>
        </div>

        {/* Corpo do Formulário */}
        <div className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-muted text-xs font-semibold uppercase tracking-wider">
              Nome
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-page text-main text-sm border border-muted/20 rounded-md px-3 py-2 outline-none focus:border-primary transition-colors duration-300"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-muted text-xs font-semibold uppercase tracking-wider">
              CNPJ
            </label>
            <input
              type="text"
              name="cnpj"
              value={utils.formatCNPJ(formData.cnpj)}
              onChange={handleChange}
              className="w-full bg-page text-main text-sm border border-muted/20 rounded-md px-3 py-2 outline-none focus:border-primary transition-colors duration-300"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-muted text-xs font-semibold uppercase tracking-wider">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-page text-main text-sm border border-muted/20 rounded-md px-3 py-2 outline-none focus:border-primary transition-colors duration-300 appearance-none"
            >
              <option value="IN_CRM">No CRM</option>
              <option value="SUCCESS">Sucesso</option>
              <option value="LOST">Perdido</option>
            </select>
          </div>
        </div>

        {/* Rodapé do Modal */}
        <div className="px-6 py-4 border-t border-muted/20 bg-muted/5 flex justify-end gap-3 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-transparent text-muted text-sm font-medium border border-muted/30 hover:bg-muted/10 transition-all duration-300"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 hover:shadow-lg transition-all duration-300"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}
