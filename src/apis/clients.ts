import config from "../config/api.config";
import axios from "axios";

import type { Client } from "../interfaces/client.interface";

interface ResponseData {
  success: boolean;
  data: Client[];
  pagination: {
    total: number;
    page: number;
    total_pages: number;
  };
}

interface filterGetClients {
  status?: "IN_CRM" | "LOST" | "SUCCESS";
  cnpj?: string;
  created_start?: string;
  created_end?: string;
  updated_start?: string;
  updated_end?: string;
  name?: string;
  seller_id?: number;
  page?: number;
  limit?: number;
}

export async function getClients(
  filters: filterGetClients,
): Promise<ResponseData> {
  try {
    const response = await axios.get(`${config.api.host}/api/v1/get-clients`, {
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
