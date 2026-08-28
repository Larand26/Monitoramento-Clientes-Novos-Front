import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { History } from "../interfaces/history.interface";

export interface ChartData extends History {
  formattedDate: string;
}

interface HistoryChartProps {
  data: ChartData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card p-3 rounded-lg border border-muted/20 shadow-xl">
        <p className="text-muted text-xs mb-1">{label}</p>
        <p className="text-main font-semibold text-sm">
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export default function HistoryChart({ data }: HistoryChartProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full h-[60vh] min-h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <XAxis
            dataKey="changed_at"
            scale="point"
            padding={{ left: 0, right: 20 }}
            stroke="#94a3b8"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            tickMargin={10}
            tickFormatter={(value) =>
              new Date(value).toLocaleDateString("pt-BR")
            }
            label={{
              value: "Tempo",
              position: "insideBottom",
              offset: -10,
              fill: "#f8fafc",
            }}
          />
          <YAxis
            dataKey="order_value"
            stroke="#94a3b8"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            tickFormatter={(value) => `R$ ${value}`}
            width={80}
            label={{
              value: "Gasto",
              angle: -90,
              position: "insideLeft",
              fill: "#f8fafc",
            }}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              stroke: "#94a3b8",
              strokeWidth: 1,
              strokeDasharray: "4 4",
            }}
          />
          <Line
            type="monotone"
            dataKey="order_value"
            stroke="var(--color-primary)"
            strokeWidth={3}
            dot={{ r: 5, fill: "var(--color-primary)", strokeWidth: 0 }}
            activeDot={{
              r: 7,
              fill: "var(--color-primary)",
              stroke: "var(--color-card)",
              strokeWidth: 2,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
