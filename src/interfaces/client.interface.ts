export interface Client {
  _id: string;
  magento_id: string;
  rd_station_id: string;
  store_id?: string;
  name: string;
  cnpj: string;
  status: "IN_CRM" | "LOST" | "SUCCESS" | "FREEZE";
  created_at: string;
  updated_at: string;
  projected_profit?: number;
  seller_id?: string;
  avg_days_between_purchases: number;
}
