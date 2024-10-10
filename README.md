## Tecnologias Utilizadas

Frontend:

- React
- Vite (para build e desenvolvimento)
- React Hook Form (para gerenciamento de formulários)
- Yup (para validação de esquemas)
- Tailwind CSS (para estilização)

Backend:

- Node.js
- Express
- Cors
- Compressor

## Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- Node.js 18 / 20+
- pnpm

Se você não tem o pnpm instalado, você pode instalá-lo seguindo esse método:

`npm install -g pnpm`

Para mais detalhes sobre a instalação do pnpm, visite a documentação oficial do [pnpm](https://pnpm.io/installation).

Instalação e Execução
Clone o repositório:

`git clone git@github.com:MatthausZillig/mb-web.git`

`cd md-web`

### 1 - Instale as dependências:

`pnpm install`

### 2 - Build do cliente:

`pnpm build`

### 3 - Inicie o servidor:

`cd server`

`pnpm start`

Acesse a aplicação em seu navegador em http://localhost:3000 (ou a porta configurada).

> Importância do Processo de Build
> O processo de build do cliente (passo 3) é crucial e deve ser executado antes de iniciar o servidor. Aqui está o porquê:
>
> - Geração da Pasta dist: O comando pnpm build gera uma pasta dist (distribuição) na raiz do projeto. Esta pasta contém uma versão otimizada e pronta para produção da aplicação React.
> - Arquivos Estáticos Otimizados: Os arquivos na pasta dist são versões otimizadas dos arquivos fonte. Isso inclui HTML, JavaScript, CSS e outros assets, todos processados para terem um tamanho reduzido e melhor performance.
> - Servindo Arquivos Estáticos: O servidor Express é configurado para servir os arquivos estáticos diretamente da pasta dist. Isso significa que quando um usuário acessa a aplicação, ele recebe estes arquivos otimizados, resultando em carregamentos mais rápidos e melhor performance.
