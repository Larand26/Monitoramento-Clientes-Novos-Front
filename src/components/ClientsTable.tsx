import { useState, useEffect } from "react";
import type { Client } from "../interfaces/client.interface";
import FlagStatus from "./FlagStatus";
import * as utils from "../utils/utils";
import { getSellerName } from "../utils/globals";

export interface ClientTableData extends Client {
  seller_id?: string;
}

interface ClientsTableProps {
  clients: ClientTableData[];
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPrevPage: () => void;
}

function SellerCell({ sellerId }: { sellerId?: string }) {
  const [sellerName, setSellerName] = useState<string>("Carregando...");

  useEffect(() => {
    let isMounted = true;

    getSellerName(sellerId).then((name) => {
      if (isMounted) setSellerName(name);
    });

    return () => {
      isMounted = false;
    };
  }, [sellerId]);

  return <span className="text-main">{sellerName}</span>;
}

export default function ClientsTable({
  clients,
  currentPage,
  totalPages,
  onNextPage,
  onPrevPage,
}: ClientsTableProps) {
  return (
    <div className="w-full flex flex-col bg-card rounded-xl border border-muted/20 shadow-xl overflow-hidden">
      {/* Contêiner da Tabela Flexível com Scroll e max-h responsivo */}
      <div className="overflow-auto custom-scrollbar max-h-[calc(100vh-300px)]">
        <table className="w-full text-left border-collapse relative">
          {/* Cabeçalho Fixo (Sticky) */}
          <thead className="sticky top-0 z-10 bg-card shadow-sm">
            <tr className="bg-muted/10 border-b border-muted/20">
              <th className="px-6 py-4 text-muted text-sm font-title uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-4 text-muted text-sm font-title uppercase tracking-wider">
                CNPJ
              </th>
              <th className="px-6 py-4 text-muted text-sm font-title uppercase tracking-wider">
                Vendedor
              </th>
              <th className="px-6 py-4 text-muted text-sm font-title uppercase tracking-wider text-center">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-muted/10">
            {clients.length > 0 ? (
              clients.map((client) => (
                <tr
                  key={client._id}
                  className="hover:bg-muted/5 transition-colors duration-200 group"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-main text-sm font-medium">
                    {utils.removeFirstsNubersFromName(client.name)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-muted text-sm">
                    {utils.formatCNPJ(client.cnpj)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <SellerCell sellerId={client.seller_id} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex justify-center">
                    <FlagStatus status={client.status} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-muted text-sm"
                >
                  Nenhum cliente encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação Fixa no Rodapé do Card */}
      <div className="flex items-center justify-between px-6 py-4 bg-muted/5 border-t border-muted/20">
        <span className="text-muted text-sm">
          Página <strong className="text-main">{currentPage}</strong> de{" "}
          <strong className="text-main">{totalPages || 1}</strong>
        </span>
        <div className="flex gap-2">
          <button
            onClick={onPrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg bg-page text-main text-sm font-medium border border-muted/20 hover:bg-muted/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer"
          >
            Anterior
          </button>
          <button
            onClick={onNextPage}
            disabled={currentPage >= totalPages || totalPages === 0}
            className="px-4 py-2 rounded-lg bg-page text-main text-sm font-medium border border-muted/20 hover:bg-muted/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer"
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
}
