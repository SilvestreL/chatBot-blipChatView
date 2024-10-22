"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useStore } from "../store/useStore";
import { useRouter } from "next/navigation";

// Validação dos contatos
const contactSchema = z.object({
  identity: z.string().email("A identidade deve ser um e-mail válido"),
  name: z.string().min(1, "O nome não pode estar vazio"),
});

const contactsResponseSchema = z.object({
  resource: z.object({
    items: z.array(contactSchema),
    total: z.number(),
  }),
});

const ITEMS_PER_PAGE = 10;

const HomePage = () => {
  const { apiKey, setApiKey, setContactId, isLoading, setLoading } = useStore();
  const [contacts, setContacts] = useState<
    { identity: string; name: string }[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showTutorial, setShowTutorial] = useState<boolean>(true); // Modal state
  const router = useRouter();

  // Função para buscar os contatos da API
  const fetchContacts = async (page = 1) => {
    setLoading(true);

    try {
      const response = await fetch("https://http.msging.net/commands", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Key ${apiKey}`,
        },
        body: JSON.stringify({
          id: "1",
          to: "postmaster@crm.msging.net",
          method: "get",
          uri: `/contacts?$skip=${
            (page - 1) * ITEMS_PER_PAGE
          }&$take=${ITEMS_PER_PAGE}`,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const result = contactsResponseSchema.safeParse(data);
        if (!result.success) {
          console.error("Erro de validação dos dados:", result.error);
        } else {
          const validData = result.data;
          setContacts(validData.resource.items);
          setTotalPages(Math.ceil(validData.resource.total / ITEMS_PER_PAGE));
        }
      } else {
        console.error("Erro ao buscar contatos:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao conectar com a API do Blip:", error);
    } finally {
      setLoading(false);
    }
  };

  // Função de logout
  const handleLogout = () => {
    setApiKey("");
    document.cookie = "apiKey=; path=/; max-age=0;";
    router.push("/login");
  };

  // Função para abrir contato
  const handleContactClick = (contact: { identity: string; name: string }) => {
    setContactId(contact.identity);
    router.push(`/contato/${encodeURIComponent(contact.identity)}`);
  };

  // Carrega os contatos quando o componente é montado
  useEffect(() => {
    if (!apiKey) {
      router.push("/login");
    } else {
      fetchContacts(currentPage);
    }
  }, [apiKey, currentPage]);

  // Fecha o tutorial e salva no localStorage
  const handleCloseTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem("showTutorial", "false");
  };

  // Reabrir tutorial
  const handleReopenTutorial = () => {
    setShowTutorial(true);
    localStorage.setItem("showTutorial", "true");
  };

  useEffect(() => {
    const showTutorialFlag = localStorage.getItem("showTutorial");
    if (showTutorialFlag === "false") {
      setShowTutorial(false);
    }
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-900 text-white px-6">
      {/* Título e Logout */}
      <div className="flex justify-between items-center w-full max-w-7xl mx-auto py-8">
        <h1 className="text-3xl font-bold">Lista de Contatos</h1>
        <button
          onClick={handleLogout}
          className={`px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500 transition-colors`}
        >
          Logout
        </button>
      </div>

      {/* Lista de Contatos em Cards */}
      {isLoading ? (
        <p className="text-center text-gray-400">Carregando contatos...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {contacts.map((contact) => (
            <div
              key={contact.identity}
              onClick={() => handleContactClick(contact)}
              className="bg-gray-800 p-6 rounded-lg shadow-md hover:bg-gray-700 cursor-pointer transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-semibold">
                  {contact.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{contact.name}</h2>
                  <p className="text-gray-400">{contact.identity}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Paginação */}
      <div className="flex justify-between items-center mt-6 max-w-7xl mx-auto">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="text-gray-400">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50"
        >
          Próxima
        </button>
      </div>

      {/* Modal Tutorial */}
      {showTutorial && (
        <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-80 flex items-center justify-center px-4 sm:px-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full text-center">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Como esta aplicação funciona?
            </h2>
            <p className="text-gray-300 mb-6">
              Navegue pelos contatos e clique para visualizar os detalhes.
            </p>

            <ol className="list-decimal list-inside text-left text-gray-300 space-y-2">
              <li>
                Requisição para a API Blip para buscar a lista de contatos.
              </li>
              <li>
                Início da aplicação na rota <code>/</code> e armazenamento dos
                dados no Zustand.
              </li>
              <li>
                Consulta ao Firebase para obter histórico de conversas quando um
                contato é selecionado.
              </li>
              <li>
                Exibição do histórico de conversas na interface do usuário.
              </li>
            </ol>

            <button
              onClick={handleCloseTutorial}
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
            >
              Entendi, não mostrar novamente
            </button>
          </div>
        </div>
      )}

      {/* Botão para reabrir tutorial */}
      <button
        onClick={handleReopenTutorial}
        className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors"
      >
        Reabrir Tutorial
      </button>
    </div>
  );
};

export default HomePage;
