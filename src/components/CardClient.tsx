import type { Client } from "../interfaces/client.interface";

import FlagStatus from "./FlagStatus";

import * as utils from "../utils/utils";

export default function CardClient(props: {
  client: Client;
  onClick?: () => void;
}) {
  const style = "w-full flex justify-between gap-2 items-center";

  const p = "text-muted text-sm whitespace-nowrap";

  const r = "text-main text-sm truncate text-right";

  return (
    <div
      className="bg-card rounded-lg shadow-md p-4 w-80 cursor-pointer relative"
      onClick={props.onClick}
    >
      <div className="card-header pb-2 flex justify-between items-center gap-2">
        <h2 className="font-title text-main text-2xl truncate">
          {props.client.name}
        </h2>
        <FlagStatus status={props.client.status} />
      </div>
      <hr className="border-muted/20 mb-3" />
      <div className="card-content flex flex-col gap-1">
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
          <p className={r}>{props.client.store_order_ids.length}</p>
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
