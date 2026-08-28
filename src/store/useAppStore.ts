import { create } from "zustand";
import { getSellers } from "../apis/sellers"; // Importe sua API

export interface User {
  id: string;
  name: string;
  role: string;
  activeProject: string;
}

interface AppState {
  currentUser: User | null;
  isAppReady: boolean;
  sellers: Record<string, string>; // Dicionário de Vendedores
  initializeAppData: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  currentUser: null,
  isAppReady: false,
  sellers: {},

  initializeAppData: async () => {
    try {
      // 1. Carrega dados do usuário (Simulado)
      const mockUser: User = {
        id: "usr_01",
        name: "Victor de Brito Laranjeira",
        role: "Desenvolvedor Front-end Sênior",
        activeProject: "Daniel Calçados - E-commerce",
      };

      // 2. Carrega a lista base de Vendedores da API
      const sellersResponse = await getSellers({ limit: 1000 });

      // Transforma o array em um dicionário para busca instantânea
      const sellersMap: Record<string, string> = {};
      if (sellersResponse?.data) {
        sellersResponse.data.forEach((seller) => {
          sellersMap[seller._id] = seller.name;
        });
      }

      // 3. Salva tudo no estado global de uma vez
      set({
        currentUser: mockUser,
        sellers: sellersMap,
        isAppReady: true,
      });
    } catch (error) {
      console.error("Error fetching initial app data:", error);
      set({ isAppReady: true });
    }
  },
}));
