# Estágio 1: Build (Node.js)
FROM node:20-alpine AS build
WORKDIR /app

# Copia apenas os arquivos de dependências primeiro
# Isso evita reinstalar tudo se você mudar apenas o código-fonte
COPY package*.json ./
RUN npm install

# Copia o restante do código
COPY . .

# Executa o build de produção (substitui environments conforme o angular.json)
RUN npx ng build --configuration production

# Estágio 2: Runtime (Nginx)
FROM nginx:alpine

# Limpa o diretório padrão do Nginx antes de copiar o build
RUN rm -rf /usr/share/nginx/html/*

# Copia o build do estágio anterior
# Nota: O caminho '/browser' é comum nas versões mais recentes do Angular (v17+)
COPY --from=build /app/dist/monaco-client-spa/browser /usr/share/nginx/html

# AJUSTE: Copia o arquivo de configuração da pasta docker/
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
