# Dockerfile

# --- Etapa de Build (para gerar os arquivos estáticos) ---
FROM node:20-alpine AS build

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de configuração de pacotes
COPY package.json package-lock.json ./

# Instala as dependências de produção (evita instalar dependências de desenvolvimento desnecessárias)
RUN npm install

# Copia o restante do código-fonte
COPY . .

# Cria a build de produção (os arquivos estáticos vão para a pasta 'dist' no Vite)
RUN npm run build


# --- Etapa de Produção (servindo com Nginx) ---
# Usa a imagem oficial do Nginx
FROM nginx:stable-alpine AS production

# *** CORREÇÃO AQUI: Mudança de /app/build para /app/dist ***
# Copia a build estática da etapa 'build' (agora em /app/dist) para o diretório padrão do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Opcional: Copia um arquivo de configuração customizado do Nginx (se precisar de rotas específicas)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta padrão do Nginx
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]