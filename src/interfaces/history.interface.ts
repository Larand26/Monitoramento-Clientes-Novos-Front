export interface History {
  _id: string;
  client_id: string;
  previous_status: "IN_CRM" | "LOST" | "SUCCESS";
  new_status: "IN_CRM" | "LOST" | "SUCCESS";
  order_value: number;
  changed_at: string;
  order_id: string;
}
