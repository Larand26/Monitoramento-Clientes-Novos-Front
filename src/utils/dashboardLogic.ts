import type { Order } from "../interfaces/order.interface";
import type { ChartData } from "../components/HistoryChart";

export const processOrderData = (rawOrders: Order[]): ChartData[] => {
  // 1. Agrupa pedidos feitos no mesmo dia e corrige o fuso horário (UTC -> Local)
  const groupedOrders = rawOrders.reduce(
    (acc, order) => {
      const isoDate = order.order_date.split("T")[0];
      const [year, month, day] = isoDate.split("-").map(Number);

      const localDate = new Date(year, month - 1, day);
      const formattedDate = localDate.toLocaleDateString("pt-BR");

      if (!acc[formattedDate]) {
        acc[formattedDate] = {
          id: order._id,
          date: localDate.toISOString(),
          formattedDate: formattedDate,
          value: 0,
        };
      }

      acc[formattedDate].value += order.total_amount;

      return acc;
    },
    {} as Record<string, ChartData>,
  );

  const finalData: ChartData[] = Object.values(groupedOrders);

  // 2. Ordenação cronológica para garantir o desenho correto da linha no gráfico
  finalData.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  return finalData;
};
