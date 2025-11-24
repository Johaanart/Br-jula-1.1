# Brújula Frontend

Frontend de la aplicación Brújula - Sistema de recomendación de cursos basado en carreras.

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Crear archivo .env
cp .env.example .env

# Iniciar servidor de desarrollo
npm run dev
```

## 📋 Rutas Disponibles

- `/` - Página de inicio
- `/carrera/:careerName` - Vista de resultados de carrera con cursos recomendados
  - Ejemplo: `/carrera/Arquitectura`
  - Ejemplo: `/carrera/Psicología`
- `/curso/:courseId` - Vista de curso individual con todo el contenido
  - Ejemplo: `/curso/intro-arquitectura`

## 🎨 Características

- ✅ Diseño responsivo con Tailwind CSS
- ✅ **Multiidioma**: 5 idiomas soportados (Español, Inglés, Francés, Italiano, Alemán)
- ✅ **Traducción automática**: Todo el contenido se traduce (títulos, descripciones, HTML)
- ✅ Navegación por módulos y lecciones
- ✅ Soporte para contenido de texto y video
- ✅ Integración con API backend de NestJS
- ✅ Navegación entre lecciones (anterior/siguiente)
- ✅ Interfaz moderna estilo la imagen proporcionada
- ✅ Cambio de idioma en tiempo real sin recargar página

## 🌍 Sistema Multiidioma

La aplicación soporta **5 idiomas**:

| Idioma | Código | Bandera |
|--------|--------|---------|
| Español | `es` | 🇪🇸 |
| Inglés | `en` | 🇬🇧 |
| Francés | `fr` | 🇫🇷 |
| Italiano | `it` | 🇮🇹 |
| Alemán | `de` | 🇩🇪 |

### Traducción de Contenido

El sistema traduce **automáticamente**:
- ✅ Toda la interfaz (botones, mensajes, labels)
- ✅ Nombres de carreras
- ✅ Títulos y descripciones de cursos
- ✅ Títulos de módulos y lecciones
- ✅ **Contenido HTML completo** de las lecciones

**Sistema sin APIs externas**: Usa un diccionario expandido sin dependencias de Google Translate.

Ver documentación completa: [`TRADUCCION_MEJORADA.md`](./TRADUCCION_MEJORADA.md)

## 🔧 Tecnologías

- React 18
- TypeScript
- Vite
- React Router DOM
- Tailwind CSS
- Axios

## 📝 Uso

### Acceder a resultados de carrera:
```
http://localhost:5173/carrera/Arquitectura
```

### Ver contenido de un curso:
```
http://localhost:5173/curso/intro-arquitectura
```

## 🌐 Variables de Entorno

Crea un archivo `.env` con:

```
VITE_API_URL=http://localhost:3000
```
