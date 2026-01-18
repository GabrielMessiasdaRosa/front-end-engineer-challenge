# Front End Engineer Challenge

Este repositório contém a solução do desafio Front End Engineer Challenge utilizando **Next.js**, com foco em organização de código, boas práticas e facilidade de execução para avaliadores.

## Sobre o Projeto

Este projeto foi criado como resposta ao desafio técnico proposto para vaga de Front End Engineer. A aplicação entrega a interface desenvolvida com **Next.js**, organizada e preparada para rodar tanto no ambiente local quanto em container Docker.

## Estrutura

- **app/**: código principal da aplicação Next.js
- **public/**: ativos estáticos
- **docker-compose.yaml**: configuração para execução com Docker
- **.env.example**: exemplo de variáveis de ambiente
- **prisma/**: configuração de ORM e banco (se aplicável)
- **package.json** e **tsconfig.json**: configuração do projeto

## Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- **Docker** e **Docker Compose**
- **Git**
- (Opcional) **Node.js** e **npm/yarn/pnpm** para rodar sem Docker

## Rodando o Projeto Localmente com Docker

Siga os passos abaixo para levantar a aplicação usando Docker:

1. Clone este repositório

   ```
   git clone https://github.com/GabrielMessiasdaRosa/front-end-engineer-challenge.git
   cd front-end-engineer-challenge
   git checkout dev
   ```

2. Copie as variáveis de ambiente

   ```
   cp .env.example .env
   ```

3. Suba os containers

   ```
   docker compose up --build
   ```

4. Acesse no navegador
   ```
   http://localhost:3000
   ```

A aplicação estará disponível nesse endereço.

Para interromper, use **Ctrl + C** e depois:

```
docker compose down
```

## Rodando sem Docker (Opcional)

Se preferir rodar localmente sem Docker:

1. Instale dependências

```
npm install
```


2. Inicie o servidor de desenvolvimento

```
npm run dev
```


3. Abra no navegador:

```
http://localhost:3000
```

## Principais Scripts

| Comando               | Descrição                            |
| --------------------- | ------------------------------------ |
| \`npm run dev\`       | Inicia servidor de desenvolvimento   |
| \`npm run build\`     | Gera build de produção               |
| \`npm run start\`     | Inicia aplicação em modo de produção |
| \`docker compose up\` | Sobe aplicação com Docker            |

## Observações

- Este projeto foi configurado para ser simples de rodar e de avaliar.
- Variáveis de ambiente sensíveis devem ser ajustadas conforme necessidade.
- A organização do código privilegia clareza e escalabilidade.
