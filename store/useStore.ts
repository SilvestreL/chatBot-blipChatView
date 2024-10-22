import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface StoreState {
  apiKey: string;
  currentContactId: string | null; // Armazenando o ID do contato
  isLoading: boolean; // Estado para saber se está carregando
  setApiKey: (key: string) => void;
  setContactId: (id: string | null) => void;
  setLoading: (loading: boolean) => void; // Função para ativar/desativar o estado de carregamento
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      apiKey: '',
      currentContactId: null, // Inicializando como null
      isLoading: false, // Inicializa o estado de carregamento como falso
      setApiKey: (key: string) => set({ apiKey: key }),
      setContactId: (id: string | null) => set({ currentContactId: id }), // Função para definir ou remover o ID do contato
      setLoading: (loading: boolean) => set({ isLoading: loading }), // Função para definir o estado de carregamento
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
