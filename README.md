
# Blip Chat View

Este projeto é uma aplicação de chat construída com Next.js e integrada ao **Blip**, utilizando **Zustand** para gerenciamento de estado e **Firebase** para o armazenamento das mensagens. A aplicação permite a visualização e o envio de mensagens para contatos cadastrados no Blip, salvando as mensagens no **Firebase Firestore**.

## Project Images

<p float="left">
  <img src="https://github.com/SilvestreL/chatBot-blipChatView/blob/main/public/images/page1.png" alt="DevPage Screenshot 1" width="200" />
  <img src="https://github.com/SilvestreL/chatBot-blipChatView/blob/main/public/images/page2.png" alt="DevPage Screenshot 2" width="200" />
  <img src="https://github.com/SilvestreL/chatBot-blipChatView/blob/main/public/images/page3.png" alt="DevPage Screenshot 4" width="200" />
</p>

## Tecnologias Utilizadas

- **Next.js**: Framework para construção de interfaces modernas e eficientes, com server-side rendering.
- **TypeScript**: Linguagem de programação que adiciona tipos estáticos ao JavaScript, ajudando a prevenir erros em tempo de desenvolvimento.
- **Tailwind CSS**: Framework CSS utilitário para estilização rápida e responsiva.
- **Zustand**: Biblioteca de gerenciamento de estado leve e eficiente.
- **Firebase Firestore**: Banco de dados NoSQL em tempo real para armazenar as mensagens trocadas entre os contatos.
- **Blip API**: Plataforma de mensagens para conectar chatbots e realizar a troca de mensagens entre os contatos.
- **React Icons**: Biblioteca de ícones para melhorar a interface do usuário.

## Funcionalidades

### 1. Autenticação com API Key
- O usuário deve fornecer a chave da API (API Key) do Blip para autenticação.
- A chave é validada através de uma requisição POST para a API do Blip.
- Após o login bem-sucedido, a chave da API é armazenada utilizando **cookies** e **Zustand**.

### 2. Gerenciamento de Contatos
- A aplicação faz requisições para a API do Blip para listar os contatos.
- Os contatos são exibidos em cards organizados na interface, de forma responsiva.
- Ao clicar em um contato, o usuário é redirecionado para a tela de conversa com o contato selecionado.

### 3. Gerenciamento de Mensagens
- As mensagens trocadas com cada contato são carregadas do **Firebase Firestore**, onde estão armazenadas.
- O usuário pode enviar novas mensagens, que são imediatamente exibidas na interface e salvas no Firestore.
- As mensagens possuem um campo `direction` para indicar se foram enviadas ou recebidas.
  
### 4. Gerenciamento de Estado com Zustand
- O **Zustand** é utilizado para gerenciar o estado global da aplicação.
- As chaves da API, os contatos e as mensagens são armazenados no Zustand, permitindo uma experiência de uso eficiente e sem necessidade de recarregar a página.
  
### 5. Integração com Firebase Firestore
- As mensagens enviadas são salvas no **Firestore**, garantindo a persistência dos dados.
- A aplicação busca as mensagens associadas a cada contato a partir do **Firestore**.

### 6. Requisições para a API do Blip
- As requisições são feitas para a API do Blip para carregar os contatos e enviar mensagens para os contatos cadastrados.
- As respostas da API são tratadas e exibidas de forma amigável para o usuário na interface.

## Como Rodar o Projeto Localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/SilvestreL/chatBot-blipChatView.git
   ```

2. Navegue até o diretório do projeto:
   ```bash
   cd chatBot-blipChatView
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

4. Crie um arquivo `.env.local` na raiz do projeto e configure as variáveis de ambiente do Firebase:
   ```bash
   NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id
   ```

5. Execute o projeto:
   ```bash
   npm run dev
   ```

6. Acesse a aplicação no navegador:
   ```
   http://localhost:3000
   ```

## Estrutura do Projeto

- **/app**: Contém as páginas da aplicação e componentes principais, como a listagem de contatos e a interface de chat.
- **/store**: Armazena as stores criadas com **Zustand** para gerenciar o estado de mensagens, contatos e API Key.
- **/firebaseConfig.ts**: Arquivo de configuração do Firebase.
- **/firebaseMessages.ts**: Lógica para salvar e buscar mensagens do Firestore.
- **/pages/api**: Endpoints de API para lidar com requisições de mensagens.
  
## Funcionalidades Futuras

- Melhorias no sistema de autenticação com tokens.
- Criação de um sistema de histórico de mensagens mais robusto.
- Integração com outras plataformas de mensagem suportadas pelo Blip.

## Licença

Este projeto é de código aberto e está disponível sob a licença [MIT](https://opensource.org/licenses/MIT).
