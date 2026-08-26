import type { Client } from "../interfaces/client.interface";

export default function CardClient(props: {
  client: Client;
  onClick?: () => void;
}) {
  // items-center garante que se uma fonte for maior, elas fiquem alinhadas ao centro
  const style = "w-full flex justify-between gap-2 items-center";

  const p = "text-muted text-sm whitespace-nowrap";

  const r = "text-main text-sm truncate text-right";

  const convertMoney = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div
      className="bg-card rounded-lg shadow-md p-4 w-80 cursor-pointer"
      onClick={props.onClick}
    >
      <div className="card-header pb-2">
        <h2 className="font-title text-main text-2xl truncate">
          {props.client.name}
        </h2>
      </div>
      <hr className="border-muted/20 mb-3" />
      <div className="card-content flex flex-col gap-1">
        <div className={style}>
          <p className={p}>Última atualização:</p>
          <p className={r}>{props.client.updated_at}</p>
        </div>
        <div className={style}>
          <p className={p}>cnpj:</p>
          <p className={r}>{props.client.cnpj}</p>
        </div>
        <div className={style}>
          <p className={p}>Pedidos:</p>
          <p className={r}>{props.client.store_order_ids.length}</p>
        </div>
        <div className={style}>
          <p className={p}>Total Gasto:</p>
          <p className={r}>{convertMoney(props.client.projected_profit)}</p>
        </div>
      </div>
    </div>
  );
}
