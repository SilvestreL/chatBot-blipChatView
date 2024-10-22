// pages/api/messages.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod'; 
import { saveMessageToFirestore } from '@/firebaseMessages'; 
import { useMessageStore } from '../../store/messageStore'; 
import { Timestamp } from 'firebase/firestore'; // Importa o Timestamp do Firestore

// Esquema de validação com Zod
const messageSchema = z.object({
  contactId: z.string().email("O contactId deve ser um email válido."), 
  message: z.string().min(1, "A mensagem não pode estar vazia."), 
  timestamp: z.number().optional(), // O timestamp agora é opcional
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("🔥 Firebase config foi importado com sucesso.");
  if (req.method === 'POST') {
    try {
      console.log('Corpo da requisição recebido:', req.body);

      // Valida o corpo da requisição com Zod
      const validatedData = messageSchema.parse(req.body);
      console.log('Dados validados com sucesso:', validatedData);

      const { contactId, message, timestamp } = validatedData;

      // Se o timestamp estiver presente, converte para Timestamp, senão usa o timestamp atual
      const finalTimestamp = timestamp 
        ? Timestamp.fromMillis(timestamp) // Usa o Timestamp fornecido
        : Timestamp.now(); // Usa o Timestamp atual se não for fornecido

      console.log('Timestamp final (Firestore Timestamp):', finalTimestamp);

      // Log dos dados que serão enviados ao Firestore
      const messageData = {
        contactId,
        message,
        timestamp: finalTimestamp, // Usa o Timestamp do Firestore diretamente
      };

      console.log('Dados a serem salvos no Firestore:', messageData);

      // Salva no Firebase com o timestamp no formato original
      await saveMessageToFirestore(messageData);

      console.log('Mensagem salva no Firebase com sucesso!');

      // Atualiza o estado com Zustand
      const { addMessage } = useMessageStore.getState();
      addMessage(messageData); // Passa o timestamp como está

      console.log('Mensagem adicionada ao Zustand:', messageData);

      res.status(200).json({ status: 'Mensagem enviada e salva com sucesso!' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Erro de validação Zod:', error.errors);
        return res.status(400).json({ error: error.errors });
      } else {
        console.error('Erro ao processar a mensagem:', error);
        return res.status(500).json({ error: 'Erro ao processar a mensagem.' });
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} não permitido`);
  }
}
