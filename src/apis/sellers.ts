import config from "../config/api.config";
import axios from "axios";

import type { Seller } from "../interfaces/seller.interface";

interface ResponseData {
  success: boolean;
  data: Seller[];
  pagination: {
    total: number;
    page: number;
    total_pages: number;
  };
}

interface filterGetClients {
  name?: string;
  page?: number;
  limit?: number;
}

export async function getSellers(
  filters: filterGetClients,
): Promise<ResponseData> {
  try {
    const response = await axios.get(`${config.api.host}/api/v1/get-sellers`, {
      headers: {
        Authorization: `Bearer ${config.api.token}`,
        "Content-Type": "application/json",
      },
      params: filters,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
}
