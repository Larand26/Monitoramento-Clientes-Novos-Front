import { create } from "zustand";

// 1. Tipagem dos dados globais
export interface User {
  id: string;
  name: string;
  role: string;
  activeProject: string;
}

interface AppState {
  currentUser: User | null;
  isAppReady: boolean;
  initializeAppData: () => Promise<void>;
}

// 2. Criação do Store
export const useAppStore = create<AppState>((set) => ({
  currentUser: null,
  isAppReady: false,

  // 3. Ação para buscar os dados iniciais
  initializeAppData: async () => {
    try {
      // Aqui você faria sua chamada real (ex: await getUserProfile())
      // Simulando o tempo de resposta de uma API
      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockUser: User = {
        id: "usr_01",
        name: "Victor de Brito Laranjeira",
        role: "Desenvolvedor Front-end Sênior",
        activeProject: "Daniel Calçados - E-commerce",
      };

      // Atualiza o estado global, notificando todos os componentes
      set({ currentUser: mockUser, isAppReady: true });
    } catch (error) {
      console.error("Error fetching initial app data:", error);
      set({ isAppReady: true }); // Evita travar a tela de loading para sempre
    }
  },
}));
