import config from "../config/api.config";
import axios from "axios";

import type { History } from "../interfaces/history.interface";

interface ResponseData {
  success: boolean;
  data: History[];
}

interface filterGetHistory {
  id: string;
  id_type: "_id" | "rd_station_id" | "magento_id" | "store_id";
}

export async function getHistory(
  filters: filterGetHistory,
): Promise<ResponseData> {
  try {
    const response = await axios.get(
      `${config.api.host}/api/v1/get-client-history`,
      {
        headers: {
          Authorization: `Bearer ${config.api.token}`,
          "Content-Type": "application/json",
        },
        params: filters,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching history:", error);
    throw error;
  }
}
