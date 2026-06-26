# IQISS Insight

**Social Analytics Powered by AI.** Plataforma premium de inteligencia de negocio para transformar datos de redes sociales en decisiones accionables. IQISS Insight es un producto y marca de **IQISSMexico**.

Este proyecto está estructurado con una arquitectura de dos servicios independientes en un mono-repositorio:
1. **api/**: Backend RESTful con FastAPI (Python 3.11) para el procesamiento de datos y analítica predictiva mediante IA.
2. **frontend/**: Interfaz de usuario (SSR) premium y altamente ejecutiva con Next.js (App Router, TypeScript y Tailwind CSS).

---

## 🚀 Funcionalidades del MVP (Fase 1)

El primer lanzamiento viable (MVP) está diseñado para resolver las necesidades inmediatas de análisis de dueños de negocio centrándose en el **último ciclo de 28 días**:
*   **Autenticación con Facebook:** Acceso seguro mediante Meta SDK para sincronizar e importar páginas comerciales administradas por el usuario.
*   **Sincronización Persistente de Métricas:** Descarga en caché local de métricas de rendimiento globales (Seguidores, Alcance y Engagement).
*   **Auditoría de Publicaciones:** Listado detallado de publicaciones recientes con métricas de interacción específicas (reacciones, comentarios, compartidos).
*   **Reportes Semanales con AI:** Reportes automatizados asistidos por Inteligencia Artificial cruzando métricas globales e individuales de posts para sugerir mejoras estratégicas de contenido.

---

## 🛠️ Requisitos Previos

- **Python 3.11** o superior.
- **Node.js** (v18+) y `npm`.
- Una cuenta en **Meta for Developers** con una aplicación de Facebook configurada.

---

## ⚙️ Estructura y Configuración

### 1. Backend (`api`)
El backend utiliza un entorno virtual en la raíz del proyecto para simplificar el flujo de desarrollo.

*   **Variables de Entorno**: Configura tu archivo `api/.env` basándote en `api/.env.example`:
    ```env
    APP_ENV=development
    JWT_SECRET=tu_secreto_jwt
    JWT_EXPIRE_DAYS=7
    DB_USER=iqiss_user
    DB_PASSWORD=iqiss_password
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=iqiss_insight
    FB_APP_ID=tu_app_id
    FB_APP_SECRET=tu_app_secret
    ```
*   **Dependencias**: Se listan en [api/requirements.txt](file:///Users/laclavees12345/code/test/fb_page_admin/api/requirements.txt).

### 2. Frontend (`frontend`)
El frontend consume la API local de forma interna a través de peticiones HTTP en el servidor para mayor seguridad.

*   **Variables de Entorno**: Define un archivo `frontend/.env.local` con las siguientes claves:
    ```env
    NEXT_PUBLIC_FB_APP_ID=tu_app_id_de_facebook
    NEXT_PUBLIC_FB_API_VERSION=v25.0
    NEXT_PUBLIC_API_URL=http://localhost:8000
    ```

---

## ⚡ Cómo Ejecutar en Desarrollo

### 1. Arrancar la API (Backend)
Desde la raíz del espacio de trabajo:
```bash
# Activar entorno virtual
source .venv/bin/activate

# Iniciar Uvicorn con auto-recarga
uvicorn api.main:app --reload --port 8000
```
*La documentación interactiva de la API (Swagger) estará disponible en `http://localhost:8000/docs`.*

### 2. Arrancar el Frontend
Desde una nueva terminal, entra en la carpeta del frontend y arranca el servidor de desarrollo:
```bash
cd frontend
npm run dev
```
*Accede a la interfaz en `http://localhost:3000`.*

---

## 🎯 Lineamientos de Estandarización para el Equipo y Agentes de IA

Si eres un desarrollador del equipo o un **agente de codificación de IA (como Gemini/Cursor/Copilot)**, debes seguir estrictamente las siguientes reglas y estándares del proyecto para mantener la calidad y consistencia del código:

### 1. Manejo Seguro de Redirecciones en Next.js (Server Components)
*   **Regla:** Nunca invoques la función `redirect()` de Next.js dentro de un bloque `try-catch` genérico.
*   **Razón:** `redirect()` funciona internamente arrojando una excepción de enrutamiento especial. Si el `try-catch` captura todas las excepciones, interceptará la redirección de Next.js, causando que el servidor falle con errores 500 y bucles de renderizado.
*   **Patrón Estándar:**
    ```typescript
    // CORRECTO:
    let shouldRedirect = false;
    try {
      // Tu lógica del servidor aquí...
    } catch (error) {
      console.error(error);
      shouldRedirect = true;
    }
    if (shouldRedirect) {
      redirect("/login");
    }
    ```

### 2. Tolerancia a Fallos y Mecanismo de Fallback en Métricas de Facebook
*   **Regla:** Las llamadas externas de insights (como las consultas al Graph API de Facebook) deben implementar reintentos con métricas de respaldo (fallback).
*   **Razón:** Meta depreca y reemplaza métricas constantemente (por ejemplo, reemplazando `page_impressions_unique` por `page_total_media_view_unique`).
*   **Patrón Estándar:** Define un array ordenado de métricas compatibles y realiza un bucle en el backend, rompiendo el ciclo (`break`) únicamente al obtener un estado `200 OK`:
    ```python
    reach_metrics = ["page_total_media_view_unique", "page_impressions_unique"]
    for metric in reach_metrics:
        # Lógica de petición HTTP ...
        if response.status_code == 200:
            # Procesar datos y romper bucle
            break
    ```

### 3. Migraciones de Base de Datos Autocurativas (Self-Healing)
*   **Regla:** Las modificaciones del esquema de la base de datos (nuevas columnas, índices) deben declararse de forma autocurativa en el evento `startup` de la API ([api/main.py](file:///Users/laclavees12345/code/test/fb_page_admin/api/main.py)), utilizando sentencias `IF NOT EXISTS` antes de invocar a `Base.metadata.create_all()`.
*   **Razón:** Permite que los desarrolladores y entornos de staging sincronicen esquemas PostgreSQL existentes sin necesidad de aplicar migraciones manuales invasivas o sufrir caídas por columnas faltantes.

### 4. Directrices de Idioma y Estilo
*   **Código y Comentarios del Backend:** Todo el código de Python, docstrings, mensajes de registro (`logger`) y comentarios deben escribirse en **Inglés**.
*   **Interfaz de Usuario (Frontend):** Las etiquetas, copias del MVP, cards y textos del dashboard deben redactarse en **Español de México**.
*   **Estilos y Temas:** Toda la interfaz debe apegarse al sistema de tokens definido en `frontend/app/globals.css`. Evita utilidades ad-hoc no estandarizadas.

---

## 👥 Créditos y Autoría

- **Desarrollador Principal**: Salvador Glez
- **Organización / Empresa**: [IQISSMexico](https://iqissmexico.com)
- **Producto / Marca**: IQISS Insight (Social Analytics Powered by AI)
