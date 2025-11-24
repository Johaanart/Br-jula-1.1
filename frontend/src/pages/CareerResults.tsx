import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api, Course } from '../services/api';
import LanguageSwitcher from '../components/LanguageSwitcher';

// Normalizar nombre de carrera (eliminar acentos y espacios)
const normalizeCareerName = (name: string): string => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/\s+/g, '-'); // Reemplazar espacios con guiones
};

const CareerResults = () => {
  const { t, i18n } = useTranslation();
  const { careerName } = useParams<{ careerName: string }>();
  const [categoryCourse, setCategoryCourse] = useState<Course | null>(null);
  const [careerCourse, setCareerCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!careerName) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Normalizar el nombre de la carrera
        const normalizedCareer = normalizeCareerName(careerName);
        console.log('🚀 Fetching courses for career:', { original: careerName, normalized: normalizedCareer, language: i18n.language });
        
        const data = await api.getCoursesByCareer(normalizedCareer, i18n.language);
        
        console.log('📦 Data received:', data);
        console.log('📌 Category Course Title:', data.categoryCourse?.title);
        console.log('📌 Career Course Title:', data.careerCourse?.title);
        console.log('📌 Category Course Object:', JSON.stringify(data.categoryCourse, null, 2));
        
        setCategoryCourse(data.categoryCourse);
        setCareerCourse(data.careerCourse);
      } catch (err: any) {
        console.error('❌ Error fetching courses:', err);
        console.error('Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        setError(err.response?.data?.message || t('error_loading'));
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [careerName, i18n.language, t]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Validar que los cursos tengan los campos necesarios
  const isCategoryValid = categoryCourse && categoryCourse.title;
  const isCareerValid = careerCourse && careerCourse.title;

  if (!isCategoryValid || !isCareerValid) {
    console.error('❌ Invalid course data:', {
      categoryCourse: {
        exists: !!categoryCourse,
        hasTitle: !!categoryCourse?.title,
        data: categoryCourse
      },
      careerCourse: {
        exists: !!careerCourse,
        hasTitle: !!careerCourse?.title,
        data: careerCourse
      }
    });
    
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-2xl px-4">
          <p className="text-red-500 text-xl mb-4">Error: Datos incompletos del servidor</p>
          <p className="text-gray-600 mb-4">
            Los cursos se recibieron pero sin información completa.
            {!isCategoryValid && <span className="block">- Curso de categoría: {categoryCourse ? 'Sin título' : 'No encontrado'}</span>}
            {!isCareerValid && <span className="block">- Curso de carrera: {careerCourse ? 'Sin título' : 'No encontrado'}</span>}
          </p>
          <details className="text-left bg-gray-100 p-4 rounded-lg">
            <summary className="cursor-pointer font-medium mb-2">Ver datos recibidos</summary>
            <pre className="text-xs overflow-auto">
              {JSON.stringify({ categoryCourse, careerCourse }, null, 2)}
            </pre>
          </details>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-6 mb-8">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-500 text-white mr-3">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">{t('career_quiz')}</h1>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <div className="container mx-auto px-4 max-w-4xl">
        {/* Result Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{t('your_ideal_career')}</h2>
            <p className="text-gray-600">{t('based_on_answers')}</p>
          </div>

          <div className="text-center p-6 bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl">
            <h3 className="text-2xl font-bold text-primary-600 mb-2">{careerCourse.title}</h3>
            <p className="text-gray-700">{careerCourse.intro || careerCourse.description}</p>
          </div>
        </div>

        {/* Courses Section */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('recommended_courses')}</h2>
          
          <div className="space-y-6">
            {/* Category Course */}
            {categoryCourse && (
              <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{categoryCourse.title}</h3>
                    <p className="text-gray-600 mb-3">{categoryCourse.description}</p>
                  </div>
                  <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full whitespace-nowrap">
                    {categoryCourse.difficulty === 'beginner' ? t('beginner') : 
                     categoryCourse.difficulty === 'intermediate' ? t('intermediate') : t('advanced')}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {categoryCourse.duration}
                  </div>
                  <Link
                    to={`/curso/${categoryCourse.id}`}
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {t('preview_course')}
                  </Link>
                </div>
              </div>
            )}

            {/* Career Course */}
            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{careerCourse.title}</h3>
                  <p className="text-gray-600 mb-3">{careerCourse.description}</p>
                </div>
                <span className="ml-4 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full whitespace-nowrap">
                  {careerCourse.difficulty === 'beginner' ? t('beginner') : 
                   careerCourse.difficulty === 'intermediate' ? t('intermediate') : t('advanced')}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {careerCourse.duration}
                </div>
                <Link
                  to={`/curso/${careerCourse.id}`}
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                >
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t('preview_course')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-10 py-6 text-center text-gray-500 text-sm">
        <p>{t('footer')}</p>
      </footer>
    </div>
  );
};

export default CareerResults;
