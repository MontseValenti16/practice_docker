# Dockerfile backend
FROM node:20

# Directorio de trabajo
WORKDIR /usr/src/app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del proyecto
COPY . .

# Exponer el puerto del backend
EXPOSE 5000

# Entrypoint: generar Prisma Client y luego iniciar la app
CMD npx prisma generate && node src/index.js
