# Recuperación Cliente - Buscador y Catálogo de Series y Películas

Este proyecto es una aplicación web interactiva desarrollada en **React** y **Vite** que permite a los usuarios buscar películas y series, consultar sus detalles, ver dónde están disponibles en streaming en España, gestionar sus plataformas contratadas y guardar sus títulos favoritos.

La aplicación consume en tiempo real la API de **Watchmode**.

---

## 🚀 Características Principales

1. **Buscador y Autocomplete**: 
   * Filtro en tiempo real con sugerencias e imágenes de portadas provenientes de TMDB conforme el usuario escribe.
2. **Tendencias / Títulos Populares**: 
   * Sección en la página principal con las películas y series más populares del momento.
3. **Catálogo Completo con Paginación**: 
   * Exploración del catálogo completo mediante un componente de paginación eficiente con navegación interactiva.
4. **Detalle de Títulos**: 
   * Ficha técnica detallada que incluye: sinopsis, año de estreno, tipo (película/serie), duración, valoración global de usuarios, etiquetas de géneros, tráiler insertado de YouTube (o enlace alternativo) y el póster del título.
5. **Gestión de Plataformas**: 
   * El usuario puede seleccionar qué plataformas de streaming tiene contratadas para personalizar su experiencia. Se guardan localmente en el navegador.
6. **Lista de Favoritos**: 
   * Permite guardar títulos como favoritos, gestionando la lista en `localStorage` y cargando sus detalles de forma ultra rápida y paralela en la interfaz de favoritos.

---

## 🛠️ Stack Tecnológico

* **Frontend**: React 19 (JavaScript / JSX)
* **Empaquetador / Entorno**: Vite 8
* **Enrutado**: React Router v7
* **Gestión de Peticiones y Caché**: React Query / TanStack Query v5 (evita peticiones repetitivas de API mediante caché local)
* **Gestión del Estado Global**: React Context API
* **Persistencia**: LocalStorage API
* **Estilos**: Vanilla CSS con variables personalizadas y diseño responsive (móvil, tablet y escritorio)

---

## 💻 Instalación y Uso Local

Sigue estos pasos para poner en marcha el proyecto en tu entorno local:

### 1. Requisitos Previos
* Tener instalado **Node.js** (versión 18 o superior recomendada).

### 2. Configurar Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto y añade tu API Key de Watchmode:
```env
VITE_WATCHMODE_API_KEY=tu_api_key_aqui
```

### 3. Instalar Dependencias
Instala los paquetes necesarios del proyecto:
```bash
npm install
```

### 4. Iniciar el Servidor de Desarrollo
Lanza la aplicación en modo desarrollo:
```bash
npm run dev
```
La terminal indicará una dirección local (habitualmente `http://localhost:5173`) para abrirla en tu navegador.

### 5. Compilación para Producción
Genera el paquete optimizado de producción:
```bash
npm run build
```
Para previsualizar la compilación localmente:
```bash
npm run preview
```

---

## 📂 Estructura de Carpetas

```text
├── public/                # Favicon e iconos globales
├── src/
│   ├── api/               # Módulos de llamada a la API (watchmode.js)
│   ├── components/        # Componentes comunes de UI (Header, GetMediaCard, GetDetails)
│   ├── context/           # Contextos globales de la app (PlatformContext)
│   ├── hooks/             # Hooks personalizados (useFavorites, usePagination)
│   ├── pages/             # Vistas principales (Home, AllTitles, Favorites, Details, MyPlatforms)
│   ├── router/            # Configuración de las rutas de la app (AppRouter.jsx)
│   ├── App.css            # Estilos generales del contenedor raíz
│   ├── App.jsx            # Componente raíz y Providers
│   ├── index.css          # Estilos globales y variables de color/tipografía
│   └── main.jsx           # Punto de entrada de la aplicación React
├── .env                   # API Keys de desarrollo (ignorado en git)
├── eslint.config.js       # Configuración del linter
├── index.html             # Plantilla HTML raíz
├── package.json           # Dependencias y scripts de ejecución
└── README.md              # Documentación del proyecto
```
