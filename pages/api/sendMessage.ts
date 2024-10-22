// pages/api/sendMessage.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { saveMessageToFirestore } from '../../firebaseMessages';
import { Timestamp } from 'firebase/firestore'; // Importa o Timestamp do Firestore

// Definindo o esquema de validação com Zod
const messageSchema = z.object({
  contactId: z.string().email("O contactId deve ser um email válido."), // Verifica se o contactId é um e-mail
  message: z.string().min(1, "A mensagem não pode estar vazia."), // Verifica se a mensagem não está vazia
  timestamp: z.number().optional(), // O timestamp agora é opcional e deve ser um número
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      console.log('Corpo da requisição:', req.body);

      // Valida o corpo da requisição usando Zod
      const validatedData = messageSchema.parse(req.body);
      const { contactId, message, timestamp } = validatedData;

      console.log('Dados validados:', validatedData);

      // Converte o timestamp para Timestamp do Firestore, se estiver presente
      const finalTimestamp = timestamp 
        ? Timestamp.fromMillis(timestamp)  // Converte o número de milissegundos para Timestamp
        : Timestamp.now();  // Usa o Timestamp atual se não for fornecido

      console.log('Tentando salvar no Firebase...');
      await saveMessageToFirestore({ contactId, message, timestamp: finalTimestamp });
      console.log('Mensagem salva com sucesso no Firebase');

      res.status(200).json({ status: 'Mensagem enviada e salva com sucesso!' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Erro de validação Zod:', error.errors); // Log de erro de validação
        return res.status(400).json({ error: error.errors });
      } else {
        console.error('Erro ao processar a mensagem:', error); // Log de outros erros
        return res.status(500).json({ error: 'Erro ao processar a mensagem.' });
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} não permitido`);
  }
}
