"use client";

import { useState } from "react";
import { z } from "zod";
import { useStore } from "../../store/useStore";
import { useRouter } from "next/navigation";
import {
  AiOutlineCheckCircle,
  AiOutlineLoading3Quarters,
} from "react-icons/ai"; // Ícones de sucesso e carregamento
import { FaReact, FaNodeJs } from "react-icons/fa"; // Ícones de tecnologias usadas
import { SiNextdotjs, SiZod, SiTailwindcss } from "react-icons/si"; // Outros ícones
import { setCookie } from "cookies-next"; // Importa a função para manipulação de cookies

// Esquema de validação para a chave de API usando Zod
const apiKeySchema = z
  .string()
  .min(10, "Chave de API muito curta")
  .max(100, "Chave de API muito longa");

const Login = () => {
  // Hooks de estado
  const { setApiKey } = useStore(); // Zustand para armazenar a chave de API
  const [inputValue, setInputValue] = useState(""); // Valor da chave de API inserida
  const [error, setError] = useState(""); // Mensagens de erro
  const [loading, setLoading] = useState(false); // Estado de carregamento
  const [success, setSuccess] = useState(false); // Estado de sucesso no login
  const router = useRouter(); // Router para redirecionamento de páginas

  // Função para validar a chave de API e fazer a requisição
  const validateApiKey = async (apiKey: string) => {
    try {
      // Valida o formato da chave de API
      apiKeySchema.parse(apiKey);

      // Faz uma requisição para validar a chave de API
      const response = await fetch("https://http.msging.net/commands", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Key ${apiKey}`,
        },
        body: JSON.stringify({
          id: "1",
          to: "postmaster@desk.msging.net",
          method: "get",
          uri: "/contacts",
        }),
      });

      if (response.ok) {
        // Se a resposta for positiva, salva a chave de API no Zustand
        setApiKey(apiKey);

        // Salva a chave de API nos cookies
        setCookie("apiKey", apiKey, {
          path: "/",
          maxAge: 60 * 60 * 24,
          secure: true,
        });

        // Define sucesso no login
        setSuccess(true);
        return true;
      } else {
        throw new Error("Chave de API inválida");
      }
    } catch (error) {
      // Exibe mensagem de erro em caso de falha na validação
      setError("Erro na validação da chave.");
      return false;
    }
  };

  // Função para iniciar o processo de login
  const handleLogin = async () => {
    setLoading(true); // Ativa o estado de carregamento
    const isValid = await validateApiKey(inputValue); // Valida a chave de API
    setLoading(false); // Desativa o estado de carregamento

    // Se a chave de API for válida, redireciona para a página inicial
    if (isValid) {
      router.push("/");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      {/* Caixa de login */}
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-center mb-6 text-gray-100">
          Insira sua chave da API
        </h1>

        {/* Campo de input para chave de API */}
        <input
          type="text"
          className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white mb-4 focus:outline-none focus:border-blue-500"
          placeholder="Digite a chave da API..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />

        {/* Exibe mensagem de erro, se houver */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Botão de login */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full p-3 rounded-md font-semibold text-white ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } transition duration-200`}
        >
          {loading ? (
            <AiOutlineLoading3Quarters className="animate-spin inline-block mr-2" />
          ) : null}
          {loading ? "Carregando..." : "Login"}
        </button>
      </div>

      {/* Ícones das tecnologias utilizadas */}
      <div className="flex items-center justify-center space-x-6 mt-8 text-gray-400">
        <SiNextdotjs
          className="text-3xl hover:text-white transition duration-200"
          title="Next.js"
        />
        <FaReact
          className="text-3xl hover:text-blue-400 transition duration-200"
          title="React"
        />
        <FaNodeJs
          className="text-3xl hover:text-green-400 transition duration-200"
          title="Node.js"
        />
        <SiZod
          className="text-3xl hover:text-orange-400 transition duration-200"
          title="Zod"
        />
        <SiTailwindcss
          className="text-3xl hover:text-blue-500 transition duration-200"
          title="Tailwind CSS"
        />
      </div>
    </div>
  );
};

export default Login;
