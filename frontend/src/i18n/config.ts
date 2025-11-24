import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Traducciones
const resources = {
  es: {
    translation: {
      // Header
      "career_quiz": "Cuestionario de Carreras",
      
      // Career Results Page
      "your_ideal_career": "Tu Carrera Ideal",
      "based_on_answers": "¡Basado en tus respuestas, hemos determinado la carrera perfecta para ti!",
      "recommended_courses": "Cursos Recomendados para Ti",
      "preview_course": "Preview course",
      "beginner": "PRINCIPIANTE",
      "intermediate": "INTERMEDIO",
      "advanced": "AVANZADO",
      "footer": "© 2025 Buscador de Carreras. Todos los derechos reservados.",
      
      // Course View Page
      "course_content": "Contenido del Curso",
      "select_lesson": "Selecciona una lección para comenzar",
      "previous": "Anterior",
      "next": "Siguiente",
      "reading": "Lectura",
      "video": "Video",
      
      // Loading & Errors
      "loading": "Cargando...",
      "error_loading": "Error al cargar los cursos",
      "course_not_found": "Curso no encontrado",
      
      // Content notice
      "content_translation_notice": "Nota: El contenido del curso se traduce automáticamente. Algunos términos técnicos permanecen en español."
    }
  },
  en: {
    translation: {
      // Header
      "career_quiz": "Career Questionnaire",
      
      // Career Results Page
      "your_ideal_career": "Your Ideal Career",
      "based_on_answers": "Based on your answers, we have determined the perfect career for you!",
      "recommended_courses": "Recommended Courses for You",
      "preview_course": "Preview course",
      "beginner": "BEGINNER",
      "intermediate": "INTERMEDIATE",
      "advanced": "ADVANCED",
      "footer": "© 2025 Career Finder. All rights reserved.",
      
      // Course View Page
      "course_content": "Course Content",
      "select_lesson": "Select a lesson to start",
      "previous": "Previous",
      "next": "Next",
      "reading": "Reading",
      "video": "Video",
      
      // Loading & Errors
      "loading": "Loading...",
      "error_loading": "Error loading courses",
      "course_not_found": "Course not found",
      
      // Content notice
      "content_translation_notice": "Note: Course content is automatically translated. Some technical terms remain in Spanish."
    }
  },
  fr: {
    translation: {
      // Header
      "career_quiz": "Questionnaire de Carrière",
      
      // Career Results Page
      "your_ideal_career": "Votre Carrière Idéale",
      "based_on_answers": "Sur la base de vos réponses, nous avons déterminé la carrière parfaite pour vous!",
      "recommended_courses": "Cours Recommandés pour Vous",
      "preview_course": "Aperçu du cours",
      "beginner": "DÉBUTANT",
      "intermediate": "INTERMÉDIAIRE",
      "advanced": "AVANCÉ",
      "footer": "© 2025 Recherche de Carrière. Tous droits réservés.",
      
      // Course View Page
      "course_content": "Contenu du Cours",
      "select_lesson": "Sélectionnez une leçon pour commencer",
      "previous": "Précédent",
      "next": "Suivant",
      "reading": "Lecture",
      "video": "Vidéo",
      
      // Loading & Errors
      "loading": "Chargement...",
      "error_loading": "Erreur lors du chargement des cours",
      "course_not_found": "Cours non trouvé",
      
      // Content notice
      "content_translation_notice": "Note : Le contenu du cours est traduit automatiquement. Certains termes techniques restent en espagnol."
    }
  },
  it: {
    translation: {
      // Header
      "career_quiz": "Questionario di Carriera",
      
      // Career Results Page
      "your_ideal_career": "La Tua Carriera Ideale",
      "based_on_answers": "In base alle tue risposte, abbiamo determinato la carriera perfetta per te!",
      "recommended_courses": "Corsi Consigliati per Te",
      "preview_course": "Anteprima del corso",
      "beginner": "PRINCIPIANTE",
      "intermediate": "INTERMEDIO",
      "advanced": "AVANZATO",
      "footer": "© 2025 Ricerca Carriera. Tutti i diritti riservati.",
      
      // Course View Page
      "course_content": "Contenuto del Corso",
      "select_lesson": "Seleziona una lezione per iniziare",
      "previous": "Precedente",
      "next": "Successivo",
      "reading": "Lettura",
      "video": "Video",
      
      // Loading & Errors
      "loading": "Caricamento...",
      "error_loading": "Errore nel caricamento dei corsi",
      "course_not_found": "Corso non trovato",
      
      // Content notice
      "content_translation_notice": "Nota: Il contenuto del corso è tradotto automaticamente. Alcuni termini tecnici rimangono in spagnolo."
    }
  },
  de: {
    translation: {
      // Header
      "career_quiz": "Karriere-Fragebogen",
      
      // Career Results Page
      "your_ideal_career": "Ihre Ideale Karriere",
      "based_on_answers": "Basierend auf Ihren Antworten haben wir die perfekte Karriere für Sie ermittelt!",
      "recommended_courses": "Empfohlene Kurse für Sie",
      "preview_course": "Kursvorschau",
      "beginner": "ANFÄNGER",
      "intermediate": "MITTELSTUFE",
      "advanced": "FORTGESCHRITTEN",
      "footer": "© 2025 Karrierefinder. Alle Rechte vorbehalten.",
      
      // Course View Page
      "course_content": "Kursinhalt",
      "select_lesson": "Wählen Sie eine Lektion zum Starten",
      "previous": "Zurück",
      "next": "Weiter",
      "reading": "Lesen",
      "video": "Video",
      
      // Loading & Errors
      "loading": "Lädt...",
      "error_loading": "Fehler beim Laden der Kurse",
      "course_not_found": "Kurs nicht gefunden",
      
      // Content notice
      "content_translation_notice": "Hinweis: Der Kursinhalt wird automatisch übersetzt. Einige Fachbegriffe bleiben auf Spanisch."
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    debug: false,
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
