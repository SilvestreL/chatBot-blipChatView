// useMessageStore.ts (Zustand)
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig'; 
import { create } from 'zustand';

type Message = {
  contactId: string;
  message: string;
  timestamp: any;
  direction?: "sent" | "received";
};

type MessageState = {
  messages: Message[];
  fetchMessages: (contactId: string) => void;
  addMessage: (newMessage: Message) => void;
  clearMessages: () => void; // Nova função para limpar as mensagens
};

export const useMessageStore = create<MessageState>((set) => ({
  messages: [],

  // Função para buscar mensagens filtradas por contato no Firestore
  fetchMessages: async (contactId: string) => {
    try {
      console.log(`Buscando mensagens para o contato ${contactId}`);
      
      const q = query(
        collection(db, 'messages'),
        where('contactId', '==', contactId), // Filtra as mensagens por contactId
        orderBy('timestamp', 'asc')
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log(`Nenhuma mensagem encontrada para o contato ${contactId}.`);
        set({ messages: [] }); // Limpa as mensagens se não encontrar nada
      } else {
        const fetchedMessages = querySnapshot.docs.map((doc) => doc.data() as Message);
        console.log(`Mensagens carregadas para ${contactId}:`, fetchedMessages);

        set({ messages: fetchedMessages });
      }
    } catch (error) {
      console.error('Erro ao buscar mensagens do Firestore:', error);
    }
  },

  // Função para adicionar uma nova mensagem
  addMessage: async (newMessage: Message) => {
    try {
      console.log('Enviando mensagem para o Firestore:', newMessage);

      const messageCollection = collection(db, 'messages');
      await addDoc(messageCollection, newMessage);

      // Atualiza o estado com a nova mensagem
      set((state) => ({
        messages: [...state.messages, newMessage],
      }));

      console.log('Mensagem adicionada com sucesso:', newMessage);
    } catch (error) {
      console.error('Erro ao salvar a mensagem no Firebase:', error);
    }
  },

  // Nova função para limpar as mensagens
  clearMessages: () => {
    set({ messages: [] });
  }
}));
