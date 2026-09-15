import { useState, useEffect } from "react";
import { getOrders } from "../apis/orders";

interface UseClientOrdersCountReturn {
  totalOrders: number;
  isLoading: boolean;
}

export function useClientOrdersCount(
  clientId: string,
): UseClientOrdersCountReturn {
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const fetchTotalOrders = async () => {
      setIsLoading(true);
      try {
        const response = await getOrders({
          client_id: clientId,
          limit: 1,
          page: 1,
        });

        if (isMounted) {
          setTotalOrders(response.pagination.total);
        }
      } catch (error) {
        console.error("Error fetching client orders count:", error);
        if (isMounted) {
          setTotalOrders(0);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (clientId) {
      fetchTotalOrders();
    }

    return () => {
      isMounted = false;
    };
  }, [clientId]);

  return { totalOrders, isLoading };
}
