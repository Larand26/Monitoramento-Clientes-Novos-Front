import type { Client } from "../interfaces/client.interface";
import type { Order } from "../interfaces/order.interface";
import type { ChartData } from "../components/HistoryChart";

export const processOrderData = (
  client: Client,
  rawOrders: Order[],
): ChartData[] => {
  const finalData: ChartData[] = rawOrders.map((order) => ({
    id: order._id,
    date: order.order_date,
    formattedDate: new Date(order.order_date).toLocaleDateString("pt-BR"),
    value: order.total_amount,
  }));

  const firstOrderDate = new Date(rawOrders[0].order_date);
  const clientCreationDate = new Date(client.created_at);

  if (clientCreationDate < firstOrderDate) {
    finalData.unshift({
      id: "client_creation",
      date: client.created_at,
      formattedDate: new Date(client.created_at).toLocaleDateString("pt-BR"),
      value: 0,
    });
  }

  finalData.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  return finalData;
};
