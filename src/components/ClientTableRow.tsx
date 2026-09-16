import type { Client } from "../interfaces/client.interface";
import FlagStatus from "./FlagStatus";
import * as utils from "../utils/utils";
import { useClientOrdersCount } from "../hooks/useClientOrdersCount";

interface ClientTableRowProps {
  client: Client;
  sellerName: string;
  onEdit: (client: Client) => void;
}

export default function ClientTableRow({
  client,
  sellerName,
  onEdit,
}: ClientTableRowProps) {
  const { totalOrders, isLoading } = useClientOrdersCount(client._id);

  return (
    <tr className="hover:bg-muted/5 transition-colors duration-200 group border-b border-muted/10 last:border-0">
      <td className="px-6 py-4 whitespace-nowrap text-main text-sm font-medium">
        {utils.removeFirstsNubersFromName(client.name)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-muted text-sm">
        {utils.formatCNPJ(client.cnpj)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <span className="text-main">{sellerName}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-muted text-sm text-center">
        {client.updated_at ? utils.formatDateString(client.updated_at) : "--"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-main text-sm text-center font-semibold">
        {isLoading ? (
          <span className="animate-pulse text-muted">...</span>
        ) : (
          totalOrders
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap flex justify-center">
        <FlagStatus status={client.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <button
          onClick={() => onEdit(client)}
          className="p-2 rounded-md text-muted hover:text-primary hover:bg-primary/10 transition-colors duration-200"
          title="Editar Cliente"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 inline-block"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
            />
          </svg>
        </button>
      </td>
    </tr>
  );
}
