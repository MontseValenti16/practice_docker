# Etapa 1: build
FROM node:20 AS build

# Directorio de trabajo
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el proyecto
COPY . .

# Generar Prisma Client
RUN npx prisma generate

# Etapa 2: producción
FROM node:20-slim

# Directorio de trabajo
WORKDIR /usr/src/app

# Copiar solo lo necesario desde la etapa de build
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/prisma ./prisma
COPY --from=build /usr/src/app/src ./src
COPY --from=build /usr/src/app/package*.json ./

# Exponer el puerto
EXPOSE 5000

# Variable de entorno para la base de datos (puede sobreescribirse al correr el contenedor)
ENV DATABASE_URL="mysql://montse:montse16@34.228.92.205:3306/montse_db"

# Comando para iniciar la API
CMD ["node", "src/index.js"]
