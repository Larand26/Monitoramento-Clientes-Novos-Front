import config from "../config/api.config";
import axios from "axios";

import type { Order } from "../interfaces/order.interface";

interface ResponseData {
  success: boolean;
  data: Order[];
  pagination: {
    total: number;
    page: number;
    total_pages: number;
  };
}

interface filterGetOrders {
  client_id?: string;
  seller_id?: string;
  store_order_id?: string;
  date_start?: string;
  date_end?: string;
  page?: number;
  limit?: number;
}

export async function getOrders(
  filters: filterGetOrders,
): Promise<ResponseData> {
  try {
    const response = await axios.get(`${config.api.host}/api/v1/get-orders`, {
      headers: {
        Authorization: `Bearer ${config.api.token}`,
        "Content-Type": "application/json",
      },
      params: filters,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
}
