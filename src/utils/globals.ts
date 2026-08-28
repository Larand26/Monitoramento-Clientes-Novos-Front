import { getSellers } from "../apis/sellers"; // Ajuste o caminho se necessário

// Cache em memória (dicionário para busca O(1))
const sellerCache = new Map<string, string>();

// Controle de concorrência para evitar múltiplas chamadas simultâneas
let fetchPromise: Promise<void> | null = null;

/**
 * Retorna o nome do vendedor baseado no ID.
 * Utiliza cache em memória para evitar chamadas redundantes à API.
 */
export async function getSellerName(sellerId?: string): Promise<string> {
  if (!sellerId) return "Não atribuído";

  // 1. Verifica se já existe no cache
  if (sellerCache.has(sellerId)) {
    return sellerCache.get(sellerId)!;
  }

  // 2. Se não existe e já há uma requisição em andamento, aguarda ela terminar
  if (!fetchPromise) {
    fetchPromise = (async () => {
      try {
        // Busca um lote grande de vendedores para popular o cache preventivamente
        const response = await getSellers({ limit: 1000 });

        if (response.data && response.data.length > 0) {
          response.data.forEach((seller) => {
            sellerCache.set(seller._id, seller.name);
          });
        }
      } catch (error) {
        console.error("Error populating seller cache:", error);
      }
    })();
  }

  await fetchPromise;

  // 3. Verifica novamente o cache após a API responder
  if (sellerCache.has(sellerId)) {
    return sellerCache.get(sellerId)!;
  }

  // Fallback caso o vendedor realmente não exista no banco
  return "Desconhecido";
}
