# Fullstack Challenge Nousware

## Descripción General

Este proyecto es una aplicación de chat de soporte en tiempo real, construida con una arquitectura moderna y escalable. Utiliza tecnologías de última generación tanto en el frontend como en el backend, integrando servicios de mensajería, base de datos, cache y procesamiento de lenguaje natural.

---

## Tecnologías Utilizadas y Razones de Elección

### Frontend
- **Next.js + React**: Permite construir interfaces modernas, reactivas y optimizadas para SEO. Next.js facilita el desarrollo de aplicaciones escalables y el rendering híbrido (SSR/SSG).
- **TypeScript**: Proporciona tipado estático, lo que ayuda a evitar errores y mejora la mantenibilidad del código.
- **TailwindCSS**: Permite un desarrollo de interfaces rápido y consistente.
- **MQTT.js**: Facilita la comunicación en tiempo real con el backend mediante el protocolo MQTT.
- **Axios**: Cliente HTTP moderno y fácil de usar para consumir la API REST del backend.

### Backend
- **Express.js**: Framework minimalista y flexible para construir APIs robustas y escalables.
- **TypeScript**: Mejora la calidad y mantenibilidad del código.
- **Prisma**: ORM moderno para bases de datos SQL, facilita la integración con PostgreSQL y el manejo de modelos de datos.
- **Redis**: Usado como cache para mejorar el rendimiento en la obtención de mensajes recientes.
- **MQTT**: Protocolo ligero de mensajería para comunicación en tiempo real entre backend y frontend.
- **OpenAI**: Integración para respuestas automáticas inteligentes usando modelos de lenguaje.
- **Docker**: Facilita el despliegue y la portabilidad del sistema.
- **Zod**: Biblioteca para validación de esquemas y tipos, asegurando la integridad de los datos en el backend.

### Infraestructura
- **Docker Compose**: Orquesta todos los servicios (frontend, backend, base de datos, cache, broker MQTT) para un despliegue sencillo y reproducible.
- **PostgreSQL**: Base de datos relacional robusta y ampliamente utilizada.
- **Eclipse Mosquitto**: Broker MQTT open source, ideal para mensajería en tiempo real.
- **Redis**: Base de datos en memoria para cacheo de mensajes, mejorando la velocidad de acceso a datos recientes.
---

## Arquitectura e Integración

- **Frontend**: Se comunica con el backend mediante HTTP (API REST) para operaciones CRUD y mediante MQTT para recibir mensajes en tiempo real. El estado del chat se gestiona con React Context y hooks personalizados.
- **Backend**: Expone una API REST para la gestión de mensajes y utiliza MQTT para publicar mensajes nuevos. Los mensajes se almacenan en PostgreSQL y se cachean en Redis para mejorar el rendimiento. Además, integra OpenAI con el modelo de DeepSeek para generar respuestas automáticas inteligentes.
- **MQTT**: Permite la actualización instantánea de mensajes entre usuarios y el bot, logrando una experiencia de chat en tiempo real.
- **Docker Compose**: Permite levantar todos los servicios con un solo comando, facilitando el desarrollo y despliegue.

---

## Estructura de Carpetas

- `/frontend`: Aplicación Next.js (React) para la interfaz de usuario.
- `/backend`: API REST y lógica de negocio (Express, Prisma, Redis, MQTT, OpenAI).
- `/mosquitto`: Configuración y datos persistentes del broker MQTT.

---

## Instrucciones de Ejecución

1. **Clonar el repositorio**
2. **Configurar variables de entorno** en archivos `.env` para backend y frontend (ver ejemplos en los archivos de configuración).
3. **Levantar los servicios** con Docker Compose:
   ```bash
   docker-compose up --build
   ```
4. **Acceder a la aplicación**:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend: [http://localhost:4000/api](http://localhost:4000/api)

---

## Variables de Entorno (envs)

### Backend (`backend/.env`)

| Variable                  | Descripción                                                                                  | Ejemplo                                  |
|---------------------------|---------------------------------------------------------------------------------------------|------------------------------------------|
| `PORT`                    | Puerto en el que se ejecuta el backend.                                                     | `4000`                                   |
| `MQTT_BROKER`             | URL de conexión al broker MQTT.                                                             | `mqtt://mqtt:1883`                       |
| `REDIS_URL`               | URL de conexión a Redis.                                                                    | `redis://redis:6379`                     |
| `DATABASE_URL`            | URL de conexión a la base de datos PostgreSQL.                                              | `postgresql://chatuser:chatpass@postgres:5432/chatdb` |
| `OPEN_ROUTER_API_KEY`     | API Key para acceder a OpenAI o el modelo LLM configurado. [Para generarla se debe ingresar a este enlace](https://openrouter.ai/settings/keys)                                  | `sk-xxxxxxx`                             |
| `OPEN_ROUTER_BASE_URL`    | URL base para el endpoint de OpenAI o el modelo LLM.                                        | `https://api.openai.com/v1`              |
| `OPEN_ROUTER_MODEL`       | Nombre del modelo LLM a utilizar (por ejemplo, deepseek).                                   | `deepseek/deepseek-chat-v3-0324:free`                          |
| `FRONTEND_URL`            | URL del frontend permitida para CORS.                                                       | `http://localhost:3000`                  |

#### Ejemplo de archivo `backend/.env`:
```
PORT=4000
MQTT_BROKER=mqtt://mqtt:1883
REDIS_URL=redis://redis:6379
DATABASE_URL=postgresql://chatuser:chatpass@postgres:5432/chatdb
OPEN_ROUTER_API_KEY=sk-xxxxxxx
OPEN_ROUTER_BASE_URL=https://api.openai.com/v1
OPEN_ROUTER_MODEL=deepseek-chat
FRONTEND_URL=http://localhost:3000
```

---

### Frontend (`frontend/.env`)

| Variable                      | Descripción                                                        | Ejemplo                        |
|-------------------------------|-------------------------------------------------------------------|--------------------------------|
| `NEXT_PUBLIC_BACKEND_URL`     | URL base del backend para consumir la API desde el frontend.       | `http://localhost:4000`        |
| `NEXT_PUBLIC_MQTT_URL`        | URL de conexión al broker MQTT desde el frontend.                  | `ws://localhost:9001`          |

#### Ejemplo de archivo `frontend/.env`:
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
NEXT_PUBLIC_MQTT_URL=ws://localhost:9001
```

---

## ¿Cómo usar los archivos .env?

1. Crea un archivo llamado `.env` en la carpeta `backend` y otro en la carpeta `frontend`.
2. Copia y pega las variables de ejemplo según corresponda.
3. Modifica los valores según tu entorno (por ejemplo, si cambias los puertos o usas servicios en la nube).
4. Docker Compose puede leer automáticamente estas variables si están definidas en los archivos `.env` de cada servicio.

---

## Calidad y Estilo de Código

Este proyecto utiliza **ESLint** y **Prettier** tanto en el frontend como en el backend para asegurar un código limpio, consistente y fácil de mantener.

- **ESLint**: Herramienta de análisis estático que ayuda a identificar y corregir problemas en el código JavaScript/TypeScript, promoviendo buenas prácticas y evitando errores comunes.
- **Prettier**: Formateador de código que asegura un estilo consistente en toda la base de código, facilitando la colaboración entre desarrolladores.

Ambas herramientas contribuyen a:
- Mejorar la calidad del código.
- Facilitar la escalabilidad y mantenibilidad del proyecto.
- Reducir errores y discrepancias de estilo.

Puedes ejecutar los siguientes comandos para analizar y formatear el código:

### Backend
```bash
npm run lint      # Analiza el código con ESLint
npm run format    # Formatea el código con Prettier
```

### Frontend
```bash
npm run lint      # Analiza el código con ESLint
npm run format    # Formatea el código con Prettier
```

---

## Explicación de la Integración

- El usuario envía un mensaje desde el frontend, que se envía al backend vía API REST.
- El backend almacena el mensaje en PostgreSQL y Redis, hace el análisis buscando una respuesta predeterminada y si no la encuentra llama a un llm para hacer el análisis y proponer una solución para el ticket al finalizar la publica en el topic MQTT.
- El frontend está suscrito al topic MQTT y recibe los mensajes en tiempo real, actualizando la interfaz instantáneamente.

---

## Ventajas de las Tecnologías Elegidas

- **Escalabilidad**: Separación clara de responsabilidades y uso de contenedores.
- **Rendimiento**: Uso de cache (Redis) y mensajería ligera (MQTT).
- **Desarrollo Ágil**: TypeScript, Next.js y Prisma aceleran el desarrollo y reducen errores.
- **Portabilidad**: Docker asegura que el sistema funcione igual en cualquier entorno.
- **Experiencia de Usuario**: Interfaz moderna y chat en tiempo real.

## Endpoints de la API

### Obtener mensajes
- **GET** `/api/messages`
  - **Descripción:** Obtiene los mensajes almacenados en caché (Redis) y el total de mensajes.
  - **Query params:**
    - `rest` (opcional, boolean): Si es `true`, retorna todos los mensajes (Redis + PostgreSQL).
  - **Respuesta:**
    ```json
    {
      "messages": [
        {
          "id": "string",
          "sender": "user" | "bot",
          "content": "string",
          "timestamp": "string"
        }
      ],
      "total": 10
    }
    ```

### Crear mensaje
- **POST** `/api/messages`
  - **Descripción:** Crea un nuevo mensaje de usuario, lo almacena, lo procesa y publica la respuesta del bot si aplica.
  - **Body:**
    ```json
    {
      "sender": "user",
      "content": "string"
    }
    ```
    - `sender`: Debe ser "user".
    - `content`: Texto del mensaje (no vacío).
  - **Respuesta exitosa:**
    ```json
    {
      "id": "string",
      "sender": "user",
      "content": "string",
      "timestamp": "string"
    }
    ```
  - **Errores de validación:**
    ```json
    {
      "errors": { ... }
    }
    ```

---

Actualmente, estos son los endpoints principales definidos en el backend. Todos los endpoints están bajo el prefijo `/api`.

---

## Estructura de Carpetas (Diagrama)

```mermaid
graph TD
  subgraph Backend
    A1[backend/]
    A2[├─ src/]
    A3[│  ├─ config/]
    A4[│  ├─ controllers/]
    A5[│  ├─ middlewares/]
    A6[│  ├─ models/]
    A7[│  ├─ repositories/]
    A8[│  ├─ routes/]
    A9[│  ├─ utils/]
    A10[│  ├─ generated/]
    A11[│  └─ index.ts]
    A12[├─ prisma/]
    A13[│  └─ schema.prisma]
    A14[├─ Dockerfile]
    A15[├─ package.json]
    A16[├─ tsconfig.json]
    A17[└─ ...]
    A1 --> A2
    A2 --> A3
    A2 --> A4
    A2 --> A5
    A2 --> A6
    A2 --> A7
    A2 --> A8
    A2 --> A9
    A2 --> A10
    A2 --> A11
    A1 --> A12
    A12 --> A13
    A1 --> A14
    A1 --> A15
    A1 --> A16
    A1 --> A17
  end
  subgraph Frontend
    B1[frontend/]
    B2[├─ src/]
    B3[│  ├─ app/]
    B4[│  ├─ components/]
    B5[│  ├─ config/]
    B6[│  ├─ context/]
    B7[│  ├─ hooks/]
    B8[│  └─ ...]
    B9[├─ public/]
    B10[├─ Dockerfile]
    B11[├─ package.json]
    B12[├─ tsconfig.json]
    B13[└─ ...]
    B1 --> B2
    B2 --> B3
    B2 --> B4
    B2 --> B5
    B2 --> B6
    B2 --> B7
    B2 --> B8
    B1 --> B9
    B1 --> B10
    B1 --> B11
    B1 --> B12
    B1 --> B13
  end
```

### Explicación de la estructura

#### Backend
- **src/config/**: Configuración de servicios externos (DB, Redis, MQTT, OpenAI, variables de entorno).
- **src/controllers/**: Lógica de negocio y controladores de rutas.
- **src/middlewares/**: Middlewares para validación y procesamiento de peticiones.
- **src/models/**: Definición de modelos y esquemas de datos.
- **src/repositories/**: Acceso y gestión de datos en la base de datos y cache.
- **src/routes/**: Definición de rutas y endpoints de la API.
- **src/utils/**: Funciones utilitarias y helpers.
- **src/generated/**: Código generado automáticamente (por ejemplo, Prisma).
- **prisma/**: Esquema de la base de datos para Prisma.
- **Dockerfile, package.json, tsconfig.json**: Archivos de configuración y dependencias.

#### Frontend
- **src/app/**: Páginas principales y layout de la aplicación Next.js.
- **src/components/**: Componentes reutilizables de la interfaz.
- **src/config/**: Configuración de variables y endpoints.
- **src/context/**: Contextos globales de React (por ejemplo, chat).
- **src/hooks/**: Hooks personalizados para lógica reutilizable.
- **public/**: Archivos estáticos y recursos públicos.
- **Dockerfile, package.json, tsconfig.json**: Archivos de configuración y dependencias.

---
