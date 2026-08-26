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

export async function getClients(): Promise<ResponseData> {
  try {
    const response = await axios.get(`${config.api.host}/api/v1/get-clients`, {
      headers: {
        Authorization: `Bearer ${config.api.token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
}
