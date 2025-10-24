# Proyecto CRUD de Mesas - Montserrat Valenti

Sistema completo de gestión de mesas con arquitectura de tres capas: frontend, backend API REST y base de datos MySQL, todo orquestado con Docker Compose.

---

## Tabla de Contenidos

1. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
2. [Base de Datos](#base-de-datos)
3. [Backend](#backend)
4. [Frontend](#frontend)
5. [Docker Compose](#docker-compose)
6. [Instalación y Despliegue](#instalación-y-despliegue)
7. [Endpoints de la API](#endpoints-de-la-api)
8. [Solución de Problemas](#solución-de-problemas)

---

## Arquitectura del Proyecto

El proyecto está dividido en tres servicios principales:

- *Frontend*: Aplicación web estática servida con serve
- *Backend*: API REST construida con Express.js y Prisma ORM
- *Base de Datos*: MySQL 8 para persistencia de datos

Todos los servicios están contenorizados con Docker y orquestados mediante Docker Compose.


proyecto/
├── Front/                  # Aplicación frontend
│   ├── index.html
│   ├── app.js
│   └── Dockerfile
├── back/                   # API backend
│   ├── src/
│   │   └── index.js
│   ├── prisma/
│   │   └── schema.prisma
│   ├── .env
│   ├── package.json
│   └── Dockerfile
└── docker-compose.yml      # Orquestación de servicios


---

## Base de Datos

### Tecnología
- *Motor*: MySQL 8
- *Contenedor*: mysql-valenti
- *Puerto*: 3306

### Configuración

*Credenciales*:
- Root Password: montsevale
- Database: montse_db
- User: montse
- Password: montse16

### Esquema de Datos

La base de datos contiene una única tabla Mesa:

| Campo     | Tipo    | Descripción                           |
|-----------|---------|---------------------------------------|
| id        | INT     | Primary Key, Auto-increment           |
| nombre    | STRING  | Nombre identificador de la mesa       |
| capacidad | INT     | Número de personas que soporta        |
| estado    | STRING  | Estado actual (default: "disponible") |

### Volumen Persistente

Los datos se persisten en un volumen Docker llamado db_data, lo que garantiza que la información no se pierda al reiniciar los contenedores.

---

## Backend

### Tecnologías

- *Framework*: Express.js 4.18.2
- *ORM*: Prisma 6.18.0
- *Base de Datos Client*: @prisma/client
- *Utilidades*: cors, dotenv
- *Lenguaje*: JavaScript (ES Modules)

### Estructura del Proyecto


back/
├── src/
│   └── index.js           # Punto de entrada de la API
├── prisma/
│   └── schema.prisma      # Definición del modelo de datos
├── .env                   # Variables de entorno
├── package.json           # Dependencias
├── Dockerfile             # Configuración del contenedor
└── prisma.config.ts       # Configuración de Prisma


### Variables de Entorno

El archivo .env debe contener:

env
DATABASE_URL="mysql://montse:montse16@db:3306/montse_db"


*Nota*: El host es db porque es el nombre del servicio en Docker Compose.

### Dockerfile

dockerfile
FROM node:20
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD npx prisma generate && node src/index.js


*Características*:
- Utiliza Node.js 20
- Instala dependencias
- Genera el cliente de Prisma en cada inicio
- Expone el puerto 5000

### Endpoints Principales

#### 1. Endpoint de Prueba

GET /valenti
Respuesta: { "nombre_completo": "Montserrat Valenti" }


#### 2. Crear Mesa

POST /mesas
Body: {
  "nombre": "Mesa 1",
  "capacidad": 4,
  "estado": "disponible"  // opcional
}


#### 3. Listar Todas las Mesas

GET /mesas
Respuesta: Array de objetos Mesa ordenados por ID descendente


#### 4. Obtener Mesa por ID

GET /mesas/:id
Parámetro: id (número)


#### 5. Actualizar Mesa

PUT /mesas/:id
Body: {
  "nombre": "Mesa Actualizada",
  "capacidad": 6,
  "estado": "ocupada"
}


#### 6. Eliminar Mesa

DELETE /mesas/:id
Respuesta: 204 No Content


### Validaciones

- *POST/PUT*: Requiere nombre y capacidad
- *Todos los endpoints*: Incluyen manejo de errores con códigos HTTP apropiados
- *404*: Cuando no se encuentra una mesa
- *400*: Cuando faltan campos requeridos
- *500*: Errores internos del servidor

---

## Frontend

### Tecnologías

- *HTML5*: Estructura
- *CSS3*: Estilos inline
- *JavaScript Vanilla*: Lógica de aplicación
- *Servidor*: serve (npm package)

### Estructura


Front/
├── index.html             # Página principal
├── app.js                 # Lógica de la aplicación
└── Dockerfile             # Configuración del contenedor


### Dockerfile

dockerfile
FROM node:20
WORKDIR /usr/src/app
RUN npm install -g serve
COPY . .
EXPOSE 3000
CMD ["serve", "-s", ".", "-l", "3000"]


*Características*:
- Instala serve globalmente
- Sirve archivos estáticos en el puerto 3000
- Modo single-page application (-s)

### Funcionalidades

*1. Listar Mesas*
- Carga automática al iniciar la aplicación
- Muestra: ID, nombre, capacidad y estado

*2. Agregar Mesa*
- Formulario con campos: nombre y capacidad
- Validación de campos requeridos
- Estado por defecto: "disponible"

*3. Actualizar Mesa*
- Botón "Actualizar" en cada mesa
- Usa prompts para capturar nuevos valores
- Actualiza todos los campos: nombre, capacidad y estado

*4. Eliminar Mesa*
- Botón "Borrar" en cada mesa
- Elimina permanentemente del sistema

### Configuración de API

El frontend se comunica con el backend a través de:

javascript
const API_URL = 'http://54.167.5.5:5000';


*Nota*: Esta IP debe coincidir con la IP pública de tu servidor EC2.

### Estilos

El diseño incluye:
- Paleta de colores moderna (azul, amarillo, rojo)
- Diseño responsive centrado
- Máximo ancho de 600px
- Sombras y bordes redondeados
- Botones con efectos hover

---

## Docker Compose

### Archivo docker-compose.yml

yaml
version: "3.9"

services:
  db:
    image: mysql:8
    container_name: mysql-valenti
    environment:
      MYSQL_ROOT_PASSWORD: montsevale
      MYSQL_DATABASE: montse_db
      MYSQL_USER: montse
      MYSQL_PASSWORD: montse16
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql
    networks:
      - app-network

  backend:
    build: ./back
    container_name: api-valenti
    ports:
      - "5000:5000"
    env_file:
      - ./back/.env
    depends_on:
      - db
    networks:
      - app-network

  frontend:
    build: ./Front
    container_name: front-valenti
    ports:
      - "3000:3000"
    depends_on:
      - backend
    networks:
      - app-network

volumes:
  db_data:

networks:
  app-network:


### Servicios Definidos

#### 1. Servicio db
- *Imagen*: mysql:8
- *Puerto*: 3306
- *Volumen*: Persistencia de datos
- *Red*: app-network

#### 2. Servicio backend
- *Build*: Construye desde ./back
- *Puerto*: 5000
- *Dependencia*: Espera a que db esté disponible
- *Variables de entorno*: Carga desde ./back/.env

#### 3. Servicio frontend
- *Build*: Construye desde ./Front
- *Puerto*: 3000
- *Dependencia*: Espera a que backend esté disponible

### Red

Todos los servicios están conectados a la red app-network, lo que permite:
- Comunicación entre contenedores por nombre de servicio
- Aislamiento de la red externa
- Resolución DNS automática

---

## Instalación y Despliegue

### Requisitos Previos

- Docker instalado
- Docker Compose instalado
- Puertos 3000, 5000 y 3306 disponibles

### Pasos de Instalación

#### 1. Clonar el Repositorio

bash
git clone <url-repositorio>
cd proyecto


#### 2. Configurar Variables de Entorno

Crear archivo back/.env:

env
DATABASE_URL="mysql://montse:montse16@db:3306/montse_db"


#### 3. Iniciar Servicios

bash
docker-compose up -d --build


*Flags*:
- -d: Modo detached (segundo plano)
- --build: Reconstruye las imágenes

#### 4. Crear Tablas en la Base de Datos

bash
docker exec -it api-valenti npx prisma db push


O con migraciones:

bash
docker exec -it api-valenti npx prisma migrate deploy


#### 5. Verificar Estado de los Servicios

bash
docker-compose ps


#### 6. Ver Logs

bash
# Todos los servicios
docker-compose logs -f

# Servicio específico
docker-compose logs -f backend


### Acceso a la Aplicación

- *Frontend*: http://localhost:3000 o http://IP-PUBLICA:3000
- *Backend*: http://localhost:5000 o http://IP-PUBLICA:5000
- *Base de Datos*: localhost:3306

---

## Endpoints de la API

### Base URL


http://54.167.5.5:5000


### Documentación de Endpoints

#### GET /valenti

*Descripción*: Endpoint de prueba

*Respuesta*:
json
{
  "nombre_completo": "Montserrat Valenti"
}


---

#### POST /mesas

*Descripción*: Crear una nueva mesa

*Request Body*:
json
{
  "nombre": "Mesa 1",
  "capacidad": 4,
  "estado": "disponible"
}


*Campos requeridos*: nombre, capacidad

*Respuesta*: Status 201
json
{
  "id": 1,
  "nombre": "Mesa 1",
  "capacidad": 4,
  "estado": "disponible"
}


---

#### GET /mesas

*Descripción*: Obtener todas las mesas

*Respuesta*: Status 200
json
[
  {
    "id": 1,
    "nombre": "Mesa 1",
    "capacidad": 4,
    "estado": "disponible"
  },
  {
    "id": 2,
    "nombre": "Mesa VIP",
    "capacidad": 8,
    "estado": "ocupada"
  }
]


---

#### GET /mesas/:id

*Descripción*: Obtener una mesa específica

*Parámetros*: id (número)

*Respuesta*: Status 200
json
{
  "id": 1,
  "nombre": "Mesa 1",
  "capacidad": 4,
  "estado": "disponible"
}


*Error*: Status 404 si no existe

---

#### PUT /mesas/:id

*Descripción*: Actualizar una mesa existente

*Parámetros*: id (número)

*Request Body*:
json
{
  "nombre": "Mesa Actualizada",
  "capacidad": 6,
  "estado": "ocupada"
}


*Campos requeridos*: nombre, capacidad, estado

*Respuesta*: Status 200
json
{
  "id": 1,
  "nombre": "Mesa Actualizada",
  "capacidad": 6,
  "estado": "ocupada"
}


---

#### DELETE /mesas/:id

*Descripción*: Eliminar una mesa

*Parámetros*: id (número)

*Respuesta*: Status 204 (No Content)

---

## Solución de Problemas

### Error: "The table Mesa does not exist"

*Problema*: La tabla no está creada en la base de datos.

*Solución*:
bash
docker exec -it api-valenti npx prisma db push


---

### Error: "Shadow database" al ejecutar migraciones

*Problema*: El usuario MySQL no tiene permisos para crear bases de datos temporales.

*Solución 1* (Recomendada):
bash
docker exec -it api-valenti npx prisma db push


*Solución 2*: Usar el usuario root en DATABASE_URL:
env
DATABASE_URL="mysql://root:montsevale@db:3306/montse_db"


---

### Backend no se conecta a la base de datos

*Verificar*:

1. Que el servicio db esté corriendo:
bash
docker-compose ps


2. Logs del backend:
bash
docker-compose logs backend


3. Conectividad desde el backend:
bash
docker exec -it api-valenti ping db


---

### Frontend no se comunica con el Backend

*Verificar*:

1. La variable API_URL en Front/app.js:
javascript
const API_URL = 'http://54.167.5.5:5000';


2. Que el backend esté respondiendo:
bash
curl http://54.167.5.5:5000/valenti


3. Configuración de CORS en el backend (ya incluida):
javascript
app.use(cors());


---

### Puertos ya en uso

*Problema*: Algún servicio ya está usando los puertos 3000, 5000 o 3306.

*Solución*: Modificar los puertos en docker-compose.yml:
yaml
ports:
  - "3001:3000"  # Puerto externo:Puerto interno


---

### Reiniciar completamente el proyecto

bash
# Detener y eliminar contenedores, redes
docker-compose down

# Eliminar también volúmenes (CUIDADO: Borra los datos)
docker-compose down -v

# Reconstruir y levantar
docker-compose up -d --build


---

### Acceder a la base de datos MySQL

bash
# Desde línea de comando
docker exec -it mysql-valenti mysql -u montse -pmontse16 montse_db

# Comandos útiles dentro de MySQL
SHOW TABLES;
DESCRIBE Mesa;
SELECT * FROM Mesa;


---

### Ver Prisma Studio (GUI para la base de datos)

bash
docker exec -it api-valenti npx prisma studio


Luego acceder a: http://localhost:5555

---

## Comandos Útiles

### Docker Compose

bash
# Iniciar servicios
docker-compose up -d

# Detener servicios
docker-compose down

# Ver logs en tiempo real
docker-compose logs -f

# Reiniciar un servicio específico
docker-compose restart backend

# Reconstruir imágenes
docker-compose up -d --build

# Ver estado de servicios
docker-compose ps


### Docker

bash
# Listar contenedores
docker ps

# Entrar a un contenedor
docker exec -it api-valenti bash

# Ver logs de un contenedor
docker logs api-valenti

# Eliminar todos los contenedores detenidos
docker container prune

# Eliminar imágenes sin usar
docker image prune


### Prisma

bash
# Generar cliente
docker exec -it api-valenti npx prisma generate

# Aplicar cambios al esquema
docker exec -it api-valenti npx prisma db push

# Crear migración
docker exec -it api-valenti npx prisma migrate dev --name nombre_migracion

# Aplicar migraciones
docker exec -it api-valenti npx prisma migrate deploy

# Abrir Prisma Studio
docker exec -it api-valenti npx prisma studio


---

## Información del Autor

*Proyecto creado por*: Montserrat Valenti

*Propósito*: Sistema CRUD de gestión de mesas con arquitectura completa de tres capas.