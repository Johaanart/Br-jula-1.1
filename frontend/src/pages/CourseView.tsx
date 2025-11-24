import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api, Course, Lesson } from '../services/api';
import LanguageSwitcher from '../components/LanguageSwitcher';

const CourseView = () => {
  const { t, i18n } = useTranslation();
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedModuleIndex, setSelectedModuleIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;
      
      try {
        setLoading(true);
        setError(null);
        console.log('🚀 Fetching course:', courseId, 'Language:', i18n.language);
        
        const data = await api.getCourseById(courseId, i18n.language);
        
        console.log('📦 Course data received:', data);
        setCourse(data);
        
        // Set first lesson as default
        if (data.modules && data.modules.length > 0 && data.modules[0].lessons.length > 0) {
          setSelectedLesson(data.modules[0].lessons[0]);
          setSelectedModuleIndex(0);
        }
      } catch (err: any) {
        console.error('❌ Error fetching course:', err);
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

    fetchCourse();
  }, [courseId, i18n.language, t]);

  const handleLessonSelect = (moduleIndex: number, lesson: Lesson) => {
    setSelectedModuleIndex(moduleIndex);
    setSelectedLesson(lesson);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-xl">{error || t('course_not_found')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 mb-6 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-500 text-white mr-3 hover:bg-primary-600 transition">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
              </svg>
            </Link>
            <div>
              <h1 className="text-lg font-bold text-gray-800">{course.title}</h1>
              <p className="text-sm text-gray-500">{course.duration}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
          <span className="px-4 py-2 bg-primary-500 text-white text-sm font-medium rounded-full">
            {course.difficulty === 'beginner' ? t('beginner') : 
             course.difficulty === 'intermediate' ? t('intermediate') : t('advanced')}
          </span>
          <LanguageSwitcher />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Course Content */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-4">{t('course_content')}</h2>
              
              <div className="space-y-4 max-h-[calc(100vh-240px)] overflow-y-auto">
                {course.modules.map((module, moduleIndex) => (
                  <div key={moduleIndex} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <h3 className="font-semibold text-gray-800 mb-2">{module.title}</h3>
                    <p className="text-xs text-gray-500 mb-3">{module.duration}</p>
                    
                    <div className="space-y-2">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <button
                          key={lessonIndex}
                          onClick={() => handleLessonSelect(moduleIndex, lesson)}
                          className={`w-full text-left p-3 rounded-lg transition-all ${
                            selectedLesson?.id === lesson.id
                              ? 'bg-primary-50 border-2 border-primary-500'
                              : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                          }`}
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mr-2 mt-1">
                              {lesson.content_type === 'video' ? (
                                <svg className="w-4 h-4 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${
                                selectedLesson?.id === lesson.id ? 'text-primary-700' : 'text-gray-700'
                              }`}>
                                {lesson.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">{lesson.duration}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {selectedLesson ? (
                <>
                  <div className="mb-6">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedLesson.title}</h2>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="px-3 py-1 bg-gray-100 rounded-full mr-2">
                        {selectedLesson.content_type === 'video' ? t('video') : t('reading')}
                      </span>
                      <span>{selectedLesson.duration}</span>
                    </div>
                  </div>

                  {selectedLesson.content_type === 'video' && selectedLesson.video_url ? (
                    <div className="mb-6">
                      <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden">
                        <iframe
                          src={selectedLesson.video_url}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                      {selectedLesson.description && (
                        <p className="text-gray-600 mt-4">{selectedLesson.description}</p>
                      )}
                    </div>
                  ) : (
                    <div 
                      className="prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ __html: selectedLesson.content || '' }}
                    />
                  )}

                  {/* Navigation Buttons */}
                  <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
                    <button
                      onClick={() => {
                        // Logic for previous lesson
                        const currentModule = course.modules[selectedModuleIndex];
                        const currentLessonIndex = currentModule.lessons.findIndex((l: Lesson) => l.id === selectedLesson.id);
                        
                        if (currentLessonIndex > 0) {
                          setSelectedLesson(currentModule.lessons[currentLessonIndex - 1]);
                        } else if (selectedModuleIndex > 0) {
                          const prevModule = course.modules[selectedModuleIndex - 1];
                          setSelectedModuleIndex(selectedModuleIndex - 1);
                          setSelectedLesson(prevModule.lessons[prevModule.lessons.length - 1]);
                        }
                      }}
                      disabled={selectedModuleIndex === 0 && course.modules[0].lessons[0].id === selectedLesson.id}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← {t('previous')}
                    </button>
                    
                    <button
                      onClick={() => {
                        // Logic for next lesson
                        const currentModule = course.modules[selectedModuleIndex];
                        const currentLessonIndex = currentModule.lessons.findIndex((l: Lesson) => l.id === selectedLesson.id);
                        
                        if (currentLessonIndex < currentModule.lessons.length - 1) {
                          setSelectedLesson(currentModule.lessons[currentLessonIndex + 1]);
                        } else if (selectedModuleIndex < course.modules.length - 1) {
                          const nextModule = course.modules[selectedModuleIndex + 1];
                          setSelectedModuleIndex(selectedModuleIndex + 1);
                          setSelectedLesson(nextModule.lessons[0]);
                        }
                      }}
                      disabled={
                        selectedModuleIndex === course.modules.length - 1 &&
                        course.modules[selectedModuleIndex].lessons[course.modules[selectedModuleIndex].lessons.length - 1].id === selectedLesson.id
                      }
                      className="px-6 py-3 gradient-primary text-white rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t('next')} →
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">{t('select_lesson')}</p>
                </div>
              )}
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

export default CourseView;
