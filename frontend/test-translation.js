// Test de traducción
const courseTranslations = {
  courseTitles: {
    "Introducción a la Ingeniería": {
      en: "Introduction to Engineering",
      fr: "Introduction à l'Ingénierie",
      it: "Introduzione all'Ingegneria",
      de: "Einführung ins Ingenieurwesen"
    }
  }
};

const translateText = (text, targetLang) => {
  if (targetLang === 'es' || !text) return text;
  
  let translatedText = text;
  
  // Traducir títulos de cursos
  const sortedCourseTitles = Object.entries(courseTranslations.courseTitles)
    .sort((a, b) => b[0].length - a[0].length);
    
  sortedCourseTitles.forEach(([spanish, translations]) => {
    const translation = translations[targetLang];
    if (translation) {
      translatedText = translatedText.replace(new RegExp(spanish, 'gi'), translation);
    }
  });
  
  return translatedText;
};

// Pruebas
console.log("Original:", "Introducción a la Ingeniería");
console.log("EN:", translateText("Introducción a la Ingeniería", "en"));
console.log("FR:", translateText("Introducción a la Ingeniería", "fr"));
console.log("IT:", translateText("Introducción a la Ingeniería", "it"));
console.log("DE:", translateText("Introducción a la Ingeniería", "de"));
