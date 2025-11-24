# 🚀 Guía de Inicio Rápido - Módulo de Cursos

## Iniciar los Servidores

### 1. Backend (Puerto 3000)
```bash
cd backend
npm run start:dev
```

### 2. Frontend (Puerto 5173)
```bash
cd frontend
npm run dev
```

## 🌐 URLs de Acceso

### Carreras Disponibles:
- http://localhost:5173/carrera/Arquitectura
- http://localhost:5173/carrera/Psicología
- http://localhost:5173/carrera/Ingeniería
- http://localhost:5173/carrera/Matemáticas
- http://localhost:5173/carrera/Filosofía
- http://localhost:5173/carrera/Trabajo%20Social

### Ejemplo de Curso Individual:
- http://localhost:5173/curso/intro-arquitectura

## 📋 API Endpoints

```
GET /cursos/resolve?career=Arquitectura
GET /cursos/:id
GET /cursos/categories
GET /cursos/debug/connection
```

## ✨ Características Implementadas

✅ Página de resultado de carrera ("Tu Carrera Ideal")  
✅ Muestra 2 cursos recomendados (general + específico)  
✅ Vista completa de curso con módulos y lecciones  
✅ Navegación entre lecciones  
✅ Soporte para videos y contenido de texto  
✅ Diseño responsivo con gradientes púrpura/azul  
✅ Integración completa con MongoDB Atlas
