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
  store_id?: string;
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

export async function getClientById(clientId: string): Promise<Client> {
  try {
    const response = await axios.get(
      `${config.api.host}/api/v1/get-client-byid`,
      {
        headers: {
          Authorization: `Bearer ${config.api.token}`,
          "Content-Type": "application/json",
        },
        params: { id: clientId, id_type: "_id" },
      },
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching client with ID ${clientId}:`, error);
    throw error;
  }
}

export async function createClient(
  clientData: Partial<Client>,
): Promise<Client> {
  try {
    const response = await axios.post(
      `${config.api.host}/api/v1/create-client`,
      clientData,
      {
        headers: {
          Authorization: `Bearer ${config.api.token}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.data.data;
  } catch (error) {
    console.error("Error creating client:", error);
    throw error;
  }
}

export async function updateClient(
  clientId: string,
  clientData: Partial<Client>,
): Promise<Client> {
  try {
    const response = await axios.put(
      `${config.api.host}/api/v1/update-client`,
      {
        id: clientId,
        client: clientData,
      },
      {
        headers: {
          Authorization: `Bearer ${config.api.token}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating client:", error);
    throw error;
  }
}
