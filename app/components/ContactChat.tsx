"use client";
import { useEffect, useState } from "react";
import { useStore } from "../../store/useStore"; // Zustand para armazenar o estado
import { useMessageStore } from "@/store/messageStore"; // Zustand para as mensagens
import { useRouter } from "next/navigation";

const ContactChat = () => {
  const { apiKey, currentContactId, setContactId } = useStore(); // Zustand para obter e resetar o ID do contato
  const { messages, fetchMessages, addMessage } = useMessageStore(); // Zustand para gerenciar mensagens
  const [newMessage, setNewMessage] = useState<string>(""); // Estado para a mensagem nova
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Função para buscar as mensagens filtradas por contato no Firestore via Zustand
  const loadMessages = async () => {
    if (!currentContactId) {
      setError("Nenhum contato selecionado.");
      return;
    }

    setLoading(true);
    try {
      console.log(`Carregando mensagens para o contato ${currentContactId}`);
      await fetchMessages(currentContactId); // Busca as mensagens filtradas pelo contactId
    } catch (err) {
      setError("Erro ao carregar mensagens.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentContactId && apiKey) {
      loadMessages(); // Carrega as mensagens ao carregar o componente
    }
  }, [currentContactId, apiKey]);

  // Função para enviar a nova mensagem
  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return; // Verifica se a mensagem não está vazia

    const newMessageObj = {
      contactId: currentContactId!,
      message: newMessage,
      timestamp: new Date(),
      direction: "sent", // Marca a mensagem como "enviada"
    };

    console.log("Enviando nova mensagem:", newMessageObj);

    // Usa o Zustand para adicionar a nova mensagem e atualizar o Firestore
    await addMessage(newMessageObj);

    // Limpa o campo de input
    setNewMessage("");
  };

  // Função para voltar à lista de contatos e limpar o contato atual
  const handleBack = () => {
    setContactId(null);
    router.push("/"); // Volta para a página de contatos
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-900 text-white px-4">
      <div className="w-full max-w-4xl flex flex-col bg-gray-800 p-4 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-medium text-gray-200">
            Conversa com{" "}
            <span className="font-semibold text-white">{currentContactId}</span>
          </h1>
          {/* Botão de Voltar */}
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-700 text-gray-400 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Voltar para Contatos
          </button>
        </div>

        {/* Exibição das mensagens */}
        <div className="flex-grow overflow-y-auto mb-6 p-4 bg-gray-900 rounded-lg">
          {loading ? (
            <p className="text-gray-400">Carregando...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="space-y-4">
              {messages && messages.length > 0 ? (
                <ul className="space-y-4">
                  {messages.map((message, index) => (
                    <li
                      key={index}
                      className={`flex ${
                        message.direction === "sent"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs sm:max-w-md p-3 rounded-lg ${
                          message.direction === "sent"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-600 text-gray-100"
                        }`}
                      >
                        <p>{message.message}</p>
                        <small className="text-gray-400 block mt-1 text-xs">
                          {new Date(
                            message.timestamp?.seconds
                              ? message.timestamp.seconds * 1000
                              : message.timestamp
                          ).toLocaleString()}
                        </small>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">Nenhuma mensagem encontrada.</p>
              )}
            </div>
          )}
        </div>

        {/* Campo de input para enviar nova mensagem */}
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Digite sua mensagem..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactChat;
