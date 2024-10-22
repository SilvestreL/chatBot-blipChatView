// firebaseMessages.ts
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebaseConfig'; // Certifique-se de que o Firebase está configurado corretamente
import { z } from 'zod';

// Esquema de validação com Zod
const messageSchema = z.object({
  contactId: z.string(),
  message: z.string(),
  timestamp: z.any(), // Pode ser number ou Timestamp
});

type Message = z.infer<typeof messageSchema>;

export const saveMessageToFirestore = async (messageData: Message) => {
  try {
    messageSchema.parse(messageData); // Validação básica com Zod
    console.log('Salvando no Firestore...', messageData);
    
    // Salvando a mensagem na coleção 'messages'
    await addDoc(collection(db, 'messages'), messageData);

    console.log('Mensagem salva com sucesso no Firestore!');
  } catch (error) {
    console.error('Erro ao salvar a mensagem no Firestore:', error);
    throw error;
  }
};
