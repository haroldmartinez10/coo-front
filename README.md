# COO Frontend

Aplicación web frontend desarrollada con Next.js para el sistema COO .

## Características

- Autenticación con NextAuth
- Dashboard de usuario con gestión de órdenes y cotizaciones
- Seguimiento de estado de órdenes en tiempo real
- Interfaz de usuario con Material-UI
- Gestión de estado con Redux
- Testing con Jest
- Comunicación en tiempo real con Socket.IO

## Requisitos previos

- Node.js (versión 18 o superior)
- npm o yarn

## Variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```
# NextAuth Configuration
AUTH_SECRET="KV3RJ1O7pJjut3xz38e5mgscoShFUfDkyPn7UfRwmvY="
NEXTAUTH_URL="http://localhost:3001"

# API Backend URL
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### Descripción de variables

- **AUTH_SECRET**: Clave secreta para NextAuth (ya generada por npx auth)
- **NEXTAUTH_URL**: URL donde se ejecuta la aplicación frontend
- **NEXT_PUBLIC_API_URL**: URL del servidor backend/API

## Instalación

1. Clona el repositorio
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno (ver sección anterior)
4. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```

La aplicación estará disponible en http://localhost:3001

## Scripts disponibles

- `npm run dev` - Ejecuta el servidor de desarrollo en puerto 3001
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Ejecuta la aplicación en modo producción en puerto 3001
- `npm run lint` - Ejecuta el linter
- `npm run test` - Ejecuta las pruebas
- `npm run test:watch` - Ejecuta las pruebas en modo watch

## Estructura del proyecto

```
├── app/                    # App Router de Next.js
├── features/              # Características por módulos
│   ├── auth/             # Autenticación (login/register)
│   └── dashboarduser/    # Dashboard del usuario
├── shared/               # Componentes y utilidades compartidas
├── services/             # Configuración de servicios (axios)
└── public/               # Archivos estáticos
```

## Funcionalidades

### Autenticación

- Login y registro de usuarios
- Protección de rutas con middleware
- Sesiones JWT con NextAuth

### Dashboard de Usuario

- **Órdenes**: Crear, visualizar y gestionar órdenes
- **Cotizaciones**: Solicitar y gestionar cotizaciones
- **Estado de órdenes**: Seguimiento en tiempo real

### Tecnologías utilizadas

- Next.js 15
- React 19
- NextAuth 5
- Material-UI (MUI)
- Redux Toolkit
- React Query (TanStack Query)
- Socket.IO Client
- Formik + Yup
- Jest + Testing Library
- TypeScript

## Desarrollo

El proyecto utiliza:

- TypeScript para tipado estático
- ESLint para linting
- Jest para testing
- Tailwind CSS para estilos adicionales

## Notas importantes

- El puerto por defecto es 3001 (configurable en scripts)
- La aplicación requiere conexión con un backend API
- NextAuth está configurado con estrategia JWT
- Se incluye comunicación en tiempo real con WebSockets
