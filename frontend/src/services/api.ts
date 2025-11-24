import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface Course {
  _id: string;
  id: string;
  title: string;
  career?: string;
  branch?: string;
  difficulty: string;
  duration: string;
  description: string;
  intro?: string;
  thumbnail_url: string;
  tags: string[];
  modules: Module[];
}

export interface Module {
  title: string;
  duration: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  content_type: 'text' | 'video';
  content?: string;
  video_url?: string;
  duration: string;
  description?: string;
}

export interface CareerCoursesResponse {
  categoryCourse: Course;
  careerCourse: Course;
}

// Normalizar código de idioma (es-ES -> es, en-US -> en)
const normalizeLang = (lang?: string): string | undefined => {
  if (!lang) return undefined;
  // Extraer solo los primeros 2 caracteres (es-ES -> es)
  return lang.split('-')[0];
};

// Transformar campos multiidioma del backend a strings simples
const transformMultilangField = (field: any, lang: string = 'es'): any => {
  // Si es null o undefined, devolverlo
  if (field === null || field === undefined) {
    return field;
  }
  
  // Si es un objeto con idiomas, extraer el idioma solicitado
  if (typeof field === 'object' && !Array.isArray(field)) {
    // Verificar si es un objeto multiidioma verificando las claves
    const keys = Object.keys(field);
    const isMultilang = keys.some(key => ['es', 'en', 'fr', 'it', 'de'].includes(key));
    
    if (isMultilang) {
      // Intentar obtener el valor en el idioma solicitado, o fallback a español, inglés, o el primer valor disponible
      const result = field[lang] || field.es || field.en || field.fr || field.it || field.de || (keys[0] && field[keys[0]]) || '';
      return result;
    }
    
    // Si es un objeto normal (no multiidioma), procesarlo recursivamente
    const transformed: any = {};
    for (const key in field) {
      transformed[key] = transformMultilangField(field[key], lang);
    }
    return transformed;
  }
  
  // Si es un array, procesar cada elemento
  if (Array.isArray(field)) {
    return field.map(item => transformMultilangField(item, lang));
  }
  
  // Si es string u otro tipo primitivo, devolverlo tal cual
  return field;
};

// Transformar curso completo
const transformCourse = (course: any, lang: string = 'es'): Course => {
  if (!course) {
    console.error('❌ Course is null or undefined');
    return course;
  }
  
  console.log('🔧 Transforming course:', course.id);
  
  // Si el backend ya transformó los campos (son strings), devolverlos directamente
  // Si son objetos multiidioma, transformarlos
  const transformed = {
    _id: course._id,
    id: course.id,
    title: typeof course.title === 'string' ? course.title : transformMultilangField(course.title, lang),
    career: typeof course.career === 'string' ? course.career : transformMultilangField(course.career, lang),
    branch: typeof course.branch === 'string' ? course.branch : transformMultilangField(course.branch, lang),
    difficulty: course.difficulty,
    duration: typeof course.duration === 'string' ? course.duration : transformMultilangField(course.duration, lang),
    description: typeof course.description === 'string' ? course.description : transformMultilangField(course.description, lang),
    intro: typeof course.intro === 'string' ? course.intro : transformMultilangField(course.intro, lang),
    thumbnail_url: course.thumbnail_url,
    tags: Array.isArray(course.tags) && course.tags.every((t: any) => typeof t === 'string') 
      ? course.tags 
      : transformMultilangField(course.tags, lang),
    modules: Array.isArray(course.modules) 
      ? course.modules.map((mod: any) => ({
          title: typeof mod.title === 'string' ? mod.title : transformMultilangField(mod.title, lang),
          duration: typeof mod.duration === 'string' ? mod.duration : transformMultilangField(mod.duration, lang),
          lessons: Array.isArray(mod.lessons) 
            ? mod.lessons.map((lesson: any) => ({
                id: lesson.id,
                title: typeof lesson.title === 'string' ? lesson.title : transformMultilangField(lesson.title, lang),
                content_type: lesson.content_type,
                content: typeof lesson.content === 'string' ? lesson.content : transformMultilangField(lesson.content, lang),
                video_url: lesson.video_url,
                duration: typeof lesson.duration === 'string' ? lesson.duration : transformMultilangField(lesson.duration, lang),
                description: typeof lesson.description === 'string' ? lesson.description : transformMultilangField(lesson.description, lang)
              }))
            : mod.lessons
        }))
      : course.modules
  };
  
  console.log('✅ Course transformed:', {
    id: transformed.id,
    title: transformed.title,
    duration: transformed.duration,
    modulesCount: transformed.modules?.length
  });
  
  return transformed;
};

export const api = {
  async getCoursesByCareer(career: string, lang?: string): Promise<CareerCoursesResponse> {
    const normalizedLang = normalizeLang(lang) || 'es';
    console.log('🔍 API Call - getCoursesByCareer:', { career, originalLang: lang, normalizedLang });
    
    // Mapeo de carrera a categoría
    const careerToCategoryMap: Record<string, string> = {
      'ingenieria': 'ciencias-exactas',
      'arquitectura': 'ciencias-exactas',
      'matematicas': 'ciencias-exactas',
      'psicologia': 'ciencias-humanas',
      'filosofia': 'ciencias-humanas',
      'trabajo-social': 'ciencias-humanas',
    };
    
    const categoryName = careerToCategoryMap[career];
    if (!categoryName) {
      throw new Error('Carrera no soportada');
    }
    
    console.log('📂 Obteniendo cursos:', {
      categoria: `intro-${categoryName}`,
      carrera: `intro-${career}`
    });
    
    // Obtener cursos directamente por ID
    const [categoryCourseResponse, careerCourseResponse] = await Promise.all([
      axios.get(`${API_URL}/cursos/intro-${categoryName}`, { params: { lang: normalizedLang } }),
      axios.get(`${API_URL}/cursos/intro-${career}`, { params: { lang: normalizedLang } })
    ]);
    
    console.log('📥 Raw responses:', {
      category: categoryCourseResponse.data,
      career: careerCourseResponse.data
    });
    
    const result = {
      categoryCourse: transformCourse(categoryCourseResponse.data, normalizedLang),
      careerCourse: transformCourse(careerCourseResponse.data, normalizedLang)
    };
    
    console.log('✅ Data retrieved:', result);
    console.log('🔍 Category course after transform:', result.categoryCourse);
    console.log('🔍 Career course after transform:', result.careerCourse);
    return result;
  },

  async getCourseById(id: string, lang?: string): Promise<Course> {
    const normalizedLang = normalizeLang(lang) || 'es';
    console.log('🔍 API Call - getCourseById:', { id, originalLang: lang, normalizedLang });
    
    const response = await axios.get(`${API_URL}/cursos/${id}`, {
      params: { lang: normalizedLang }
    });
    
    console.log('✅ Response received:', response.data);
    
    // Transformar los datos para asegurar que no haya objetos multiidioma
    const transformed = transformCourse(response.data, normalizedLang);
    
    console.log('🔄 Transformed course:', transformed);
    return transformed;
  }
};
