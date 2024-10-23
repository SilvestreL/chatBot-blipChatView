"use client"; // Para garantir que estamos no lado do cliente

import { useEffect, useState } from "react";
import { z } from "zod"; // Para validação dos dados da API
import { useStore } from "../../store/useStore"; // Importando a store do Zustand
// import  withAuth from "../components/hoc/withauth"

// Definindo o esquema para validação das mensagens recebidas
const messageSchema = z.object({
  direction: z.enum(["sent", "received"]),
  content: z.string(),
  timestamp: z.string(),
});

// Definindo o esquema para a resposta da API de mensagens
const messagesResponseSchema = z.object({
  resource: z.object({
    items: z.array(
      z.object({
        direction: z.enum(["sent", "received"]),
        content: z.string(),
        timestamp: z.string(),
      })
    ),
  }),
});

interface Message {
  direction: "sent" | "received";
  content: string;
  timestamp: string;
}

const ContactChat = () => {
  const { apiKey, currentContactId } = useStore(); // Pegando o ID do contato e a chave de API do Zustand
  const [messages, setMessages] = useState<Message[]>([]); // Inicializa como uma lista vazia de mensagens
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Função para buscar as mensagens da API do Blip
  const fetchMessages = async () => {
    setLoading(true);

    try {
      const response = await fetch("https://http.msging.net/commands", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Key ${apiKey}`, // Usa a chave de API
        },
        body: JSON.stringify({
          id: "2",
          to: "postmaster@crm.msging.net",
          method: "get",
          uri: `/threads/${currentContactId}/messages`, // Usa o ID do Zustand
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // console.log("Mensagens retornadas pela API:", data); // Log para verificar a resposta

        // Validação da resposta usando Zod
        const result = messagesResponseSchema.safeParse(data);
        if (!result.success) {
          console.error("Erro de validação dos dados:", result.error);
          setError("Erro ao carregar as mensagens.");
        } else {
          const validData = result.data;
          setMessages(validData.resource.items); // Atualiza o estado com as mensagens
        }
      } else {
        setError("Erro ao buscar mensagens.");
        console.error("Erro ao buscar mensagens:", response.statusText);
      }
    } catch (error) {
      setError("Erro ao conectar com a API do Blip.");
      console.error("Erro ao conectar com a API do Blip:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentContactId && apiKey) {
      fetchMessages(); // Busca as mensagens quando o ID e a chave de API estão disponíveis
    }
  }, [currentContactId, apiKey]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">
        Conversa com o Contato {currentContactId}
      </h1>

      {loading ? (
        <p>Carregando...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="w-full max-w-md">
          {messages && messages.length > 0 ? (
            <ul>
              {messages.map((message, index) => (
                <li
                  key={index}
                  className={`p-2 mb-2 ${
                    message.direction === "sent"
                      ? "bg-blue-200 text-right"
                      : "bg-gray-200 text-left"
                  }`}
                >
                  <p>{message.content}</p>
                  <small>{new Date(message.timestamp).toLocaleString()}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhuma mensagem encontrada.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ContactChat;
