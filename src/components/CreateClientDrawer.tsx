import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import InputSelect, { type SelectOption } from "./InputSelect";
import * as utils from "../utils/utils";
import { useAppStore } from "../store/useAppStore";
import { createClient } from "../apis/clients"; // Certifique-se de que esta função existe na sua API

interface CreateClientDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshData: () => void;
}

interface CreateClientData {
  name: string;
  cnpj: string;
  magento_id: string;
  rd_station_id: string;
  store_id: string;
  seller_id: string;
  status: "IN_CRM" | "LOST" | "SUCCESS";
}

const initialFormState: CreateClientData = {
  name: "",
  cnpj: "",
  magento_id: "",
  rd_station_id: "",
  store_id: "",
  seller_id: "",
  status: "IN_CRM",
};

export default function CreateClientDrawer({
  isOpen,
  onClose,
  onRefreshData,
}: CreateClientDrawerProps) {
  const [formData, setFormData] = useState<CreateClientData>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sellers = useAppStore((state) => state.sellers);

  // Reseta o formulário toda vez que o Drawer é aberto
  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormState);
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, name?: string) => {
    if (name) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    // Validação básica
    if (!formData.name || !formData.cnpj || !formData.magento_id) {
      toast.error("Preencha os campos obrigatórios (Nome, CNPJ, Magento ID).");
      return;
    }

    try {
      setIsSubmitting(true);
      // O formatCnpjforApi garante que enviamos apenas números para o banco, caso haja máscara
      const payload = {
        ...formData,
        cnpj: utils.formatCnpjforApi(formData.cnpj),
      };

      await createClient(payload);

      toast.success("Cliente criado com sucesso!");
      onRefreshData(); // Atualiza a tabela na página pai
      onClose(); // Fecha o Drawer
    } catch (error) {
      console.error("Error creating client:", error);
      toast.error("Ocorreu um erro ao criar o cliente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mapeamento das opções para os dropdowns
  const statusOptions: SelectOption[] = [
    { label: "No CRM", value: "IN_CRM" },
    { label: "Sucesso", value: "SUCCESS" },
    { label: "Perdido", value: "LOST" },
  ];

  const sellerOptions: SelectOption[] = Object.entries(sellers).map(
    ([id, name]) => ({
      label: name,
      value: id,
    }),
  );

  return (
    <>
      {/* Backdrop (Fundo escuro) */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-md bg-card shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Cabeçalho */}
        <div className="px-6 py-5 border-b border-muted/20 flex justify-between items-center bg-muted/5">
          <h2 className="text-2xl font-title text-main uppercase tracking-wider">
            Novo Cliente
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-muted hover:text-main hover:bg-muted/10 rounded-full transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Corpo do Formulário com Scroll */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label className="text-muted text-xs font-semibold uppercase tracking-wider">
              Nome do Cliente *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: Areia Lifestyle LTDA"
              className="w-full bg-page text-main text-sm border border-muted/20 rounded-md px-3 py-2 outline-none focus:border-primary transition-colors duration-300"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-muted text-xs font-semibold uppercase tracking-wider">
              CNPJ *
            </label>
            <input
              type="text"
              name="cnpj"
              value={utils.formatCNPJ(formData.cnpj)}
              onChange={handleChange}
              placeholder="00.000.000/0000-00"
              className="w-full bg-page text-main text-sm border border-muted/20 rounded-md px-3 py-2 outline-none focus:border-primary transition-colors duration-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-muted text-xs font-semibold uppercase tracking-wider">
                Magento ID *
              </label>
              <input
                type="text"
                name="magento_id"
                value={formData.magento_id}
                onChange={handleChange}
                className="w-full bg-page text-main text-sm border border-muted/20 rounded-md px-3 py-2 outline-none focus:border-primary transition-colors duration-300"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted text-xs font-semibold uppercase tracking-wider">
                Store ID
              </label>
              <input
                type="text"
                name="store_id"
                value={formData.store_id}
                onChange={handleChange}
                className="w-full bg-page text-main text-sm border border-muted/20 rounded-md px-3 py-2 outline-none focus:border-primary transition-colors duration-300"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-muted text-xs font-semibold uppercase tracking-wider">
              RD Station ID
            </label>
            <input
              type="text"
              name="rd_station_id"
              value={formData.rd_station_id}
              onChange={handleChange}
              className="w-full bg-page text-main text-sm border border-muted/20 rounded-md px-3 py-2 outline-none focus:border-primary transition-colors duration-300"
            />
          </div>

          <InputSelect
            label="Vendedor"
            name="seller_id"
            value={formData.seller_id}
            options={sellerOptions}
            onChange={handleSelectChange}
          />

          <InputSelect
            label="Status"
            name="status"
            value={formData.status}
            options={statusOptions}
            onChange={handleSelectChange}
          />
        </div>

        <div className="px-6 py-4 border-t border-muted/20 bg-card flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg bg-transparent text-muted text-sm font-medium border border-muted/30 hover:bg-muted/10 transition-all duration-300 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 hover:shadow-lg transition-all duration-300 flex items-center gap-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="animate-spin w-4 h-4 border-2 border-white/20 border-t-white rounded-full" />
            ) : null}
            Criar Cliente
          </button>
        </div>
      </div>
    </>
  );
}
