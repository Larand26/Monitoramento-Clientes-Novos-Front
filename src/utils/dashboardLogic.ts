import type { Client } from "../interfaces/client.interface";
import type { History } from "../interfaces/history.interface";
import type { ChartData } from "../components/HistoryChart";

export const processHistoryData = (
  client: Client,
  rawHistory: History[],
): ChartData[] => {
  const uniqueOrders = rawHistory.filter(
    (item, index, self) =>
      index === self.findIndex((t) => t.order_id === item.order_id),
  );

  const formattedData: ChartData[] = uniqueOrders.map((item) => ({
    ...item,
    formattedDate: new Date(item.changed_at).toLocaleDateString("pt-BR"),
  }));

  const today = new Date();
  const todayFormatted = today.toLocaleDateString("pt-BR");

  const rawCreatedAt = (client as any).created_at
    ? new Date((client as any).created_at)
    : new Date();
  const createdAtFormatted = rawCreatedAt.toLocaleDateString("pt-BR");

  const finalData: ChartData[] = [];

  finalData.push({
    _id: "start_node",
    client_id: client._id,
    previous_status: "SUCCESS",
    new_status: "SUCCESS",
    order_value: 0,
    changed_at: rawCreatedAt.toISOString(),
    order_id: "start_node",
    formattedDate: createdAtFormatted,
  });

  finalData.push(...formattedData);

  const hasBoughtToday = formattedData.some(
    (item) => item.formattedDate === todayFormatted,
  );

  if (!hasBoughtToday) {
    finalData.push({
      _id: "end_node",
      client_id: client._id,
      previous_status: "SUCCESS",
      new_status: "SUCCESS",
      order_value: 0,
      changed_at: today.toISOString(),
      order_id: "end_node",
      formattedDate: todayFormatted,
    });
  }

  finalData.sort(
    (a, b) =>
      new Date(a.changed_at).getTime() - new Date(b.changed_at).getTime(),
  );

  return finalData;
};
