export interface Client {
  _id: string;
  magento_id: string;
  rd_station_id: string;
  name: string;
  cnpj: string;
  magento_order_ids: string[];
  store_order_ids: string[];
  status: "IN_CRM" | "LOST" | "SUCCESS";
  created_at: string;
  updated_at: string;
}
