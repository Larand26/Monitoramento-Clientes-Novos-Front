import type { Client } from "../interfaces/client.interface";

import FlagStatus from "./FlagStatus";

import * as utils from "../utils/utils";
import { useClientOrdersCount } from "../hooks/useClientOrdersCount";

export default function CardClient(props: {
  client: Client;
  onClick?: () => void;
}) {
  const { totalOrders, isLoading } = useClientOrdersCount(props.client._id);

  const style = "w-full flex justify-between gap-2 items-center";

  const p = "text-muted text-sm whitespace-nowrap";

  const r = "text-main text-sm truncate text-right";

  const hoverCardStyle =
    "hover:shadow-lg hover:scale-[1.02] transition-all duration-300";

  const isFrozen = props.client.status === "FREEZE";

  const cardBaseStyle =
    "rounded-lg p-4 w-80 cursor-pointer relative overflow-hidden";

  const activeStyle = isFrozen
    ? "border border-cyan-500/40 shadow-[0_0_15px_rgba(34,211,238,0.15)] bg-gradient-to-br from-card to-cyan-900/30"
    : "bg-card shadow-md border border-transparent";

  return (
    <div
      className={`${hoverCardStyle} ${cardBaseStyle} ${activeStyle}`}
      onClick={props.onClick}
    >
      {/* Camada de efeito visual de "gelo" (overlay) */}
      {isFrozen && (
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
      )}

      <div className="card-header pb-2 flex justify-between items-center gap-2 relative z-10">
        <h2 className="font-title text-main text-2xl truncate">
          {utils.removeFirstsNubersFromName(props.client.name)}
        </h2>
        <FlagStatus status={props.client.status} />
      </div>

      <hr
        className={`mb-3 relative z-10 ${
          isFrozen ? "border-cyan-500/20" : "border-muted/20"
        }`}
      />

      <div className="card-content flex flex-col gap-1 relative z-10">
        <div className={style}>
          <p className={p}>Última atualização:</p>
          <p className={r}>{utils.timeAgo(props.client.updated_at)}</p>
        </div>
        <div className={style}>
          <p className={p}>cnpj:</p>
          <p className={r}>{utils.formatCNPJ(props.client.cnpj)}</p>
        </div>
        <div className={style}>
          <p className={p}>Pedidos:</p>
          <p className={r}>{isLoading ? "Carregando..." : totalOrders}</p>
        </div>
        <div className={style}>
          <p className={p}>Total Gasto:</p>
          <p className={r}>
            {utils.formatMoney(props.client.projected_profit || 0)}
          </p>
        </div>
      </div>
    </div>
  );
}
