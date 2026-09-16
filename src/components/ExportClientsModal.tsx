import { useState } from "react";
import toast from "react-hot-toast";
import type { AdvancedFilters } from "./AdvancedFiltersModal";
import { exportClientsData } from "../apis/clients"; // Importando a nova função

interface ExportClientsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilters: AdvancedFilters;
  searchQuery: string;
}

type ExportFormat = "excel" | "pdf";

export default function ExportClientsModal({
  isOpen,
  onClose,
  currentFilters,
  searchQuery,
}: ExportClientsModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("excel");
  const [isExporting, setIsExporting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const exportPayload = {
        ...currentFilters,
        name: searchQuery, // Caso você queira que a busca por texto também filtre no Excel
        format: selectedFormat,
      };

      // 1. Chama a API recebendo o arquivo binário (Blob)
      const fileBlob = await exportClientsData(exportPayload);

      // 2. Cria uma URL temporária na memória do navegador para o arquivo
      const url = window.URL.createObjectURL(new Blob([fileBlob]));

      // 3. Cria um link <a> invisível para forçar o download
      const link = document.createElement("a");
      link.href = url;

      // Define a extensão correta dependendo do formato escolhido
      const extension = selectedFormat === "excel" ? "xlsx" : "pdf";
      link.setAttribute("download", `base_clientes.${extension}`);

      // 4. Adiciona à tela, clica e remove (tudo invisível para o usuário)
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 5. Limpa a memória
      window.URL.revokeObjectURL(url);

      toast.success(`Exportação em ${selectedFormat.toUpperCase()} concluída!`);
      onClose();
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Ocorreu um erro ao gerar o arquivo.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-card w-full max-w-sm rounded-xl shadow-2xl border border-muted/20 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center px-6 py-4 border-b border-muted/20 bg-muted/5">
          <h2 className="text-xl font-title text-main uppercase">
            Exportar Dados
          </h2>
          <button
            onClick={onClose}
            disabled={isExporting}
            className="cursor-pointer text-muted hover:text-error transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

        <div className="p-6 flex flex-col gap-5">
          <p className="text-sm text-muted">
            Selecione o formato para baixar a lista de clientes considerando os
            filtros atuais aplicados.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedFormat("excel")}
              className={`cursor-pointer flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 ${
                selectedFormat === "excel"
                  ? "border-success bg-success/10 text-success"
                  : "border-muted/20 bg-page text-muted hover:border-success/50 hover:bg-success/5"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-10 h-10"
              >
                <path
                  fillRule="evenodd"
                  d="M1.5 5.625c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v12.75c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 18.375V5.625zM21 9.375A.375.375 0 0020.625 9h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zm0 3.75a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zm0 3.75a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zM10.875 18.75a.375.375 0 00.375-.375v-1.5a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5zM3 13.5a.375.375 0 00.375.375h7.5a.375.375 0 00.375-.375v-1.5a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5zm0-3.75a.375.375 0 00.375.375h7.5a.375.375 0 00.375-.375v-1.5a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-semibold text-sm uppercase">Excel</span>
            </button>

            <button
              onClick={() => setSelectedFormat("pdf")}
              className={`cursor-pointer flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 ${
                selectedFormat === "pdf"
                  ? "border-error bg-error/10 text-error"
                  : "border-muted/20 bg-page text-muted hover:border-error/50 hover:bg-error/5"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-10 h-10"
              >
                <path
                  fillRule="evenodd"
                  d="M5.625 1.5H9a3.75 3.75 0 013.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 013.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 01-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875zm5.845 17.03a.75.75 0 001.06 0l3-3a.75.75 0 10-1.06-1.06l-1.72 1.72V12a.75.75 0 00-1.5 0v4.19l-1.72-1.72a.75.75 0 00-1.06 1.06l3 3z"
                  clipRule="evenodd"
                />
                <path d="M14.25 5.25a5.23 5.23 0 00-1.279-3.434 9.768 9.768 0 016.963 6.963A5.23 5.23 0 0016.5 7.5h-1.875a.375.375 0 01-.375-.375V5.25z" />
              </svg>
              <span className="font-semibold text-sm uppercase">PDF</span>
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-muted/20 bg-muted/5">
          <button
            onClick={onClose}
            disabled={isExporting}
            className="cursor-pointer px-4 py-2 rounded-md bg-transparent text-muted text-sm font-medium hover:text-main hover:bg-muted/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="cursor-pointer px-4 py-2 rounded-md bg-primary text-page text-sm font-semibold hover:bg-primary/90 transition-colors shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-page"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Gerando...
              </>
            ) : (
              "Baixar Arquivo"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
