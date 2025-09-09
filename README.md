# Frontend de Monitoreo de Estacionamiento

Este proyecto es la interfaz de usuario (UI) para un sistema de monitoreo de estacionamiento en tiempo real. Está construido con React, Next.js y TypeScript, y está diseñado para ser una aplicación web moderna.

## Funcionalidades Principales

- **Visualización Multi-cámara:** Muestra simultáneamente las transmisiones de video de un número configurable de cámaras.
- **Detección en Tiempo Real:** Dibuja recuadros (bounding boxes) sobre los vehículos detectados en su respectiva transmisión de video.
- **Estadísticas Globales:** Presenta información consolidada del estacionamiento, como el total de lugares ocupados, lugares disponibles y el porcentaje de ocupación.
- **Control e Información de Barrera:** Muestra el estado actual de la barrera de acceso (abierta, cerrada, etc.).
- **Notificaciones:** Informa al usuario sobre eventos importantes, como la entrada o salida de vehículos.
- **Diseño Adaptativo:** La interfaz está diseñada para funcionar tanto en escritorio como en dispositivos móviles.

## Stack Tecnológico

- **Framework:** React 18
- **Herramientas de Build:** Next.js
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Autenticación:** Clerk


## Estructura del Proyecto

Una guía rápida de las carpetas más importantes:

```
src/
├── components/   # Componentes de React reutilizables (ej. VideoStream)
├── context/      # Lógica de estado global (el "cerebro" de la app)
├── guards/       # Componentes para proteger rutas (ej. AuthGuard)
├── hooks/        # Hooks de React personalizados
├── layouts/      # Estructuras de página (ej. MainLayout)
├── lib/          # Utilidades, helpers y configuración de entorno (env.ts)
├── routes/       # Definición de las rutas de la aplicación
├── services/     # Clientes para comunicarse con servicios externos (WebSockets)
├── types/        # Definiciones de tipos de TypeScript
└── views/        # Páginas principales de la aplicación (ej. Home)
```

## Configuración

El proyecto se configura mediante variables de entorno. Copia el archivo `.env.example` a un nuevo archivo `.env` y completa los valores requeridos.

```bash
cp .env.example .env
```

### Variables de Entorno Clave

- `NEXT_PUBLIC_API_URL`: La URL base del **Parking Middleware API**.
- `NEXT_PUBLIC_STREAMING_BASE_URL`: La URL base donde se sirven los streams de video.
- `NEXT_PUBLIC_APP_CAMERA_COUNT`: El número de cámaras que la aplicación debe mostrar.
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: La clave pública de tu instancia de Clerk para la autenticación.

## Instalación y Uso

1.  **Instalar dependencias:**
    ```bash
    npm install
    # o si usas pnpm
    pnpm install
    ```

2.  **Ejecutar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:3000`.

## Comunicación con el Backend

El frontend se comunica con el backend a través de dos canales principales:

1.  **WebSockets:** Para recibir datos en tiempo real:
    *   **Predicciones de Vehículos:** Se conecta a un WebSocket del Middleware para recibir las detecciones de vehículos, incluyendo el índice de la cámara (`cam_index`) a la que pertenecen.
    *   **Estado de Barrera:** Se conecta a otro WebSocket del Middleware para recibir actualizaciones sobre el estado de la barrera de acceso.

2.  **HTTP Streaming:** Para las transmisiones de video en vivo:
    *   El frontend espera que los streams de video estén disponibles en URLs construidas a partir de `NEXT_PUBLIC_STREAMING_BASE_URL` y el índice de la cámara (ej. `{NEXT_PUBLIC_STREAMING_BASE_URL}/stream/{cam_index}`). Estos streams son de tipo Motion JPEG (MJPEG).
