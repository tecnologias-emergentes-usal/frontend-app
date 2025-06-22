# USAL ALERT (App Tentativa)

Aplicación móvil nativa tentativa para Android e iOS desarrollada con tecnologías web modernas para el **proyecto de Tecnologías Emergentes**. El nombre y funcionalidad específica de la aplicación todavia no se definio - esta es una base técnica que permite desarrollar cualquier tipo de aplicación móvil segun el stack tecnologico que manejamos en general.

## 📋 Descripción de Tecnologías

### **React** 
Framework de JavaScript para construir interfaces de usuario interactivas y componentes reutilizables.
- **¿Por qué?**: Permite crear UIs dinámicas con un patrón de programación declarativo y un ecosistema maduro
- **¿Cómo?**: Se utiliza para construir toda la interfaz de usuario de la aplicación con componentes funcionales y hooks

### **TypeScript**
Superset de JavaScript que añade tipado estático al lenguaje.
- **¿Por qué?**: Mejora la calidad del código, reduce errores en tiempo de desarrollo y facilita el mantenimiento
- **¿Cómo?**: Se utiliza para escribir todo el código de la aplicación con tipos definidos para mayor robustez

### **Capacitor**
Framework que permite ejecutar aplicaciones web en dispositivos móviles nativos.
- **¿Por qué?**: Permite usar una sola base de código para web, iOS y Android, con acceso a APIs nativas
- **¿Cómo?**: Envuelve la aplicación web en un contenedor nativo y proporciona plugins para funcionalidades del dispositivo

### **Tailwind CSS**
Framework de CSS utilitario para crear diseños personalizados rápidamente.
- **¿Por qué?**: Permite estilar componentes de forma rápida y consistente sin escribir CSS personalizado
- **¿Cómo?**: Se utilizan clases utilitarias directamente en los componentes para aplicar estilos

### **Konsta UI**
Biblioteca de componentes UI móviles diseñados específicamente para aplicaciones híbridas.
- **¿Por qué?**: Proporciona componentes que siguen las guías de diseño nativas de iOS y Android
- **¿Cómo?**: Se utilizan sus componentes prediseñados para mantener consistencia visual con las plataformas nativas

### **Shadcn/UI**
Colección de componentes reutilizables construidos con Radix UI y Tailwind CSS.
- **¿Por qué?**: Ofrece componentes accesibles y personalizables que aceleran el desarrollo
- **¿Cómo?**: Se integran los componentes en la aplicación para crear interfaces complejas rápidamente

## 🛠️ Herramientas de Desarrollo

### **Xcode** (Desarrollo iOS)
IDE oficial de Apple para desarrollo de aplicaciones iOS y macOS.
- **¿Por qué?**: Es la herramienta requerida para compilar, probar y distribuir aplicaciones iOS
- **¿Cómo?**: Se utiliza para abrir el proyecto iOS generado por Capacitor y ejecutar la app en simuladores o dispositivos

### **CocoaPods** (Gestión de dependencias iOS)
Gestor de dependencias para proyectos iOS y macOS.
- **¿Por qué?**: Facilita la integración de bibliotecas de terceros en proyectos iOS
- **¿Cómo?**: Capacitor lo utiliza automáticamente para gestionar las dependencias nativas de iOS

### **Android Studio** (Desarrollo Android)
IDE oficial de Google para desarrollo de aplicaciones Android.
- **¿Por qué?**: Proporciona todas las herramientas necesarias para compilar, probar y distribuir aplicaciones Android
- **¿Cómo?**: Se utiliza para abrir el proyecto Android generado por Capacitor y ejecutar la app en emuladores o dispositivos

## 🚀 Comenzar

### Requisitos Básicos para Desarrollo Web

- [Node.js](https://nodejs.org/es) >= 20
- [pnpm](https://pnpm.io/es/) >= 8

### Requisitos para Desarrollo iOS

- [Xcode](https://developer.apple.com/xcode/) 14.1+
- [CocoaPods](https://cocoapods.org)

> **Nota**: Se soporta iOS 13+. Se requiere Xcode 14.1+ (ver Configuración del Entorno). Capacitor utiliza WKWebView, no el obsoleto UIWebView.

### Requisitos para Desarrollo Android

- [Android Studio](https://developer.android.com/studio)

> **Nota**: Se soporta API 22+ (Android 5.1 o posterior), que representa más del 99% del mercado Android. Capacitor requiere un Android WebView con Chrome versión 60 o posterior.

## 💻 Desarrollo

### Instalación Inicial

Primero clona el repositorio:

```console
git clone https://github.com/tecnologias-emergentes-usal/frontend-app
```

Configura las variables de entorno:

```console
# Crea el archivo .env con las variables necesarias
touch .env
```

> **Importante**: Debes crear el archivo `.env` y configurar las variables necesarias antes de ejecutar la aplicación.

### Variables de Entorno Requeridas

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```bash
# Variables de Entorno - USAL Parking Monitor

# URL del streaming de video del estacionamiento
VITE_STREAMING_URL=https://097c-190-105-0-25.ngrok-free.app/video

# Configuración del sistema de notificaciones (opcional)
# VITE_POLLING_INTERVAL=3000

# Configuración del estacionamiento (opcional) 
# VITE_TOTAL_PARKING_SPACES=45
```

**Variables Importantes:**
- `VITE_STREAMING_URL`: URL del servidor de streaming de video para el monitoreo del estacionamiento
- `VITE_POLLING_INTERVAL`: Intervalo en millisegundos para actualizar las predicciones (por defecto: 3000ms)
- `VITE_TOTAL_PARKING_SPACES`: Número total de espacios de estacionamiento (por defecto: 45)

Instala todas las dependencias:

```console
pnpm install
```

### Desarrollo Web

Inicia el proyecto para desarrollo web:

```console
pnpm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Ejecutar en Emulador iOS

1. **Compila el frontend:**
```console
pnpm run build
```

2. **Sincroniza el código con iOS:**
```console
pnpm run sync
```

3. **Ejecuta el proyecto en el emulador:**
```console
pnpm run start:ios
```

### Ejecutar en Emulador Android

1. **Compila el frontend:**
```console
pnpm run build
```

2. **Sincroniza el código con Android:**
```console
pnpm run sync
```

3. **Ejecuta el proyecto en el emulador:**
```console
pnpm run start:android
```

## 📱 Plataformas Oficiales Soportadas

- **iOS 13+**
- **Android 5.1+** (Requiere Chrome WebView 60+)
- **Navegadores Web Modernos**: Chrome, Firefox, Safari, Edge

## 📚 Recursos Adicionales

### Documentación de Capacitor
- [Código Nativo Personalizado iOS](https://capacitorjs.com/docs/ios/custom-code)
- [Código Nativo Personalizado Android](https://capacitorjs.com/docs/android/custom-code)
- [Plugins Oficiales](https://capacitorjs.com/docs/plugins)

### APIs de Capacitor
- [API iOS de Capacitor](https://capacitorjs.com/docs/core-apis/ios)
- [API Android de Capacitor](https://capacitorjs.com/docs/core-apis/android)
- [API Web de Capacitor](https://capacitorjs.com/docs/core-apis/web)

### Despliegue
- [Desplegando tu App iOS de Capacitor en la App Store](https://capacitorjs.com/docs/ios/deploying-to-app-store)
- [Desplegando tu App Android de Capacitor en Google Play Store](https://capacitorjs.com/docs/android/deploying-to-google-play)

## 🤝 Contribuir

Si queres contribuir al proyecto USAL ALERT, por favor:

1. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
2. Haz commit de tus cambios siguiendo **[Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/)**
   ```bash
   git commit -m "feat: agrega nueva funcionalidad de alertas"
   git commit -m "fix: corrige error en navegación"
   git commit -m "docs: actualiza README con nueva información"
   ```
3. Haz push a la rama (`git push origin feature/nueva-funcionalidad`)
4. Abre un Pull Request

### 📝 Conventional Commits

Este proyecto utiliza **[Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/)** para mantener un historial de commits claro y consistente.

**Formato:** `<tipo>(<alcance>): <descripción>`

**Tipos principales:**
- `feat`: Nueva funcionalidad
- `fix`: Corrección de errores
- `docs`: Cambios en documentación
- `style`: Cambios de formato (espacios, comas, etc.)
- `refactor`: Cambios de código que no agregan funcionalidad ni corrigen errores
- `test`: Agregar o corregir tests
- `chore`: Cambios en el proceso de build o herramientas auxiliares

---

**Creado por los alumnos de la cátedra de Tecnologías Emergentes - USAL 2025** 🎓
