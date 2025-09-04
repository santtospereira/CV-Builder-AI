# CV Builder IA

Este é um aplicativo de construção de currículos moderno e interativo, desenvolvido com React e TypeScript. Ele permite aos usuários criar e personalizar seus currículos de forma eficiente, com a capacidade de aprimorar seções usando inteligência artificial e exportar o currículo final para PDF.

## Funcionalidades Principais:
*   **Criação de Currículos Interativa:** Interface amigável para inserção e edição de dados pessoais, experiência, habilidades e resumo.
*   **Aprimoramento com IA:** Utilize a inteligência artificial para otimizar e refinar o conteúdo do seu currículo (ex: resumo, descrições de experiência).
*   **Exportação para PDF:** Gere facilmente seu currículo em formato PDF para impressão ou compartilhamento.
*   **Gerenciamento de Histórico:** Desfaça e refaça alterações para maior flexibilidade na edição.
*   **Temas Personalizáveis:** Alterne entre diferentes temas para uma experiência visual agradável.

## Tecnologias Utilizadas:
*   **Frontend:** React, TypeScript
*   **Estilização:** Tailwind CSS (provavelmente, dado `postcss.config.js`)
*   **Build Tool:** Vite
*   **Geração de PDF:** html2canvas, jsPDF (inferido de `pdfService.ts`)
*   **Integração com IA:** OpenAI API (inferido de `aiService.ts`)

## Como Rodar o Projeto Localmente:

1.  **Clone o repositório:**
    ```bash
    git clone [URL_DO_SEU_REPOSITORIO]
    cd CV_Buider_IA
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    # ou yarn install
    ```
3.  **Configure a API da OpenAI:**
    *   Crie um arquivo `.env` na raiz do projeto.
    *   Adicione sua chave da API da OpenAI:
        ```
        VITE_OPENAI_API_KEY=sua_chave_aqui
        ```
        (Nota: `VITE_` é necessário para variáveis de ambiente no Vite que serão expostas ao cliente.)
4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    # ou yarn dev
    ```
    O aplicativo estará disponível em `http://localhost:5173` (ou outra porta, conforme indicado pelo terminal).

---
