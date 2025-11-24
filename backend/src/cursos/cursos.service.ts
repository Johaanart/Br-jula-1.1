import { Injectable, NotFoundException, Optional } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Connection, Model, createConnection } from 'mongoose';
import { Course, CourseDocument, CourseSchema } from './schemas/course.schema';

//const MONGO_URI='mongodb+srv://khinz:<khinz>@universidad.malu0uo.mongodb.net/?appName=Universidad'

@Injectable()
export class CursosService {
	private readonly connection: Connection | null = null;
	private readonly courseModel: Model<CourseDocument>;

	constructor(
		@Optional() @InjectModel(Course.name) injectedModel?: Model<CourseDocument>,
	) {
		if (injectedModel) {
			console.log('✅ Usando modelo inyectado de Mongoose');
			this.courseModel = injectedModel;
		} else {
			console.log('⚠️ Creando conexión manual a MongoDB Atlas');
			const uri = process.env.MONGO_URI || '';
			if (!uri) {
				throw new Error('MONGO_URI no definido para conexión Atlas');
			}
			console.log('🔗 URI:', uri.replace(/:[^:@]+@/, ':****@')); // Ocultar password en logs
			this.connection = createConnection(uri);
			this.courseModel = this.connection.model<CourseDocument>(Course.name, CourseSchema as any, 'Cursos');
			console.log('📦 Modelo creado para colección: Cursos');
		}
	}

	// Extraer string de campo que puede ser multiidioma o simple
	private extractString(field: any): string | null {
		if (!field) return null;
		// Si es un objeto multiidioma, extraer el español
		if (typeof field === 'object' && !Array.isArray(field)) {
			return field.es || field.en || null;
		}
		// Si es string, devolverlo directamente
		return typeof field === 'string' ? field : null;
	}

	// Normalizar nombre de categoría desde branch
	private normalizeCategory(branch?: any): string | null {
		const branchStr = this.extractString(branch);
		if (!branchStr) return null;
		const normalized = branchStr.toLowerCase().trim();
		if (normalized.includes('exactas')) return 'ciencias-exactas';
		if (normalized.includes('humanas')) return 'ciencias-humanas';
		return normalized;
	}

	// Normalizar nombre de carrera
	private normalizeCareer(career?: any): string | null {
		const careerStr = this.extractString(career);
		if (!careerStr) return null;
		const normalized = careerStr.toLowerCase().trim();
		const careerMap: Record<string, string> = {
			'arquitectura': 'arquitectura',
			'ingeniería': 'ingenieria',
			'ingenieria': 'ingenieria',
			'matemáticas': 'matematicas',
			'matematicas': 'matematicas',
			'psicología': 'psicologia',
			'psicologia': 'psicologia',
			'filosofía': 'filosofia',
			'filosofia': 'filosofia',
			'trabajo social': 'trabajo-social',
		};
		return careerMap[normalized] || normalized;
	}

	// Extraer campo traducido o devolver string original
	private getTranslatedField(field: any, lang: string = 'es'): any {
		if (!field) return field;
		
		// Si el campo es un objeto con idiomas, extraer el idioma solicitado
		if (typeof field === 'object' && !Array.isArray(field)) {
			// Obtener las claves del objeto
			const keys = Object.keys(field);
			
			// Verificar si tiene estructura multiidioma verificando si alguna clave es un código de idioma
			const hasLangKeys = keys.some(key => ['es', 'en', 'fr', 'it', 'de'].includes(key));
			
			if (hasLangKeys) {
				// Intentar obtener el valor en orden de preferencia
				const result = field[lang] || field.es || field.en || field.fr || field.it || field.de || '';
				return result;
			}
			
			// Si es un objeto pero no es multiidioma, procesarlo recursivamente
			const translated: any = {};
			for (const key in field) {
				translated[key] = this.getTranslatedField(field[key], lang);
			}
			return translated;
		}
		
		// Si es un array, procesar cada elemento
		if (Array.isArray(field)) {
			return field.map(item => this.getTranslatedField(item, lang));
		}
		
		// Si es string u otro tipo primitivo, devolverlo tal cual
		return field;
	}

	// Transformar curso completo al idioma solicitado
	private transformCourseToLanguage(course: any, lang: string = 'es'): any {
		console.log('🔄 Transformando curso al idioma:', lang);
		console.log('📝 Curso original - title:', course.title);
		
		const transformed: any = {
			_id: course._id,
			id: course.id,
			title: this.getTranslatedField(course.title, lang),
			career: this.getTranslatedField(course.career, lang),
			branch: this.getTranslatedField(course.branch, lang),
			difficulty: course.difficulty,
			duration: this.getTranslatedField(course.duration, lang),
			description: this.getTranslatedField(course.description, lang),
			intro: this.getTranslatedField(course.intro, lang),
			thumbnail_url: course.thumbnail_url,
			tags: this.getTranslatedField(course.tags, lang),
			modules: this.getTranslatedField(course.modules, lang)
		};
		
		console.log('✅ Curso transformado - title:', transformed.title);
		return transformed;
	}

	async getCourseBySlug(slug: string, lang?: string) {
		const course = await this.courseModel.findOne({ id: slug }).exec();
		if (!course) throw new NotFoundException('Curso no encontrado');
		
		console.log('🔍 getCourseBySlug - Curso desde DB:', {
			id: course.id,
			hasTitle: !!course.title,
			hasDescription: !!course.description,
			hasCareer: !!course.career,
			hasBranch: !!course.branch,
			titleValue: course.title,
			careerValue: course.career
		});
		
		// Siempre transformar al idioma solicitado (por defecto español)
		const targetLang = lang || 'es';
		const transformed = this.transformCourseToLanguage(course, targetLang);
		
		console.log('✅ getCourseBySlug - Curso transformado:', {
			id: transformed.id,
			title: transformed.title,
			description: transformed.description,
			career: transformed.career,
			branch: transformed.branch
		});
		
		return transformed;
	}

	async getByCategory(category: 'ciencias-exactas' | 'ciencias-humanas', lang?: string) {
		// Buscar todos los cursos
		const allCourses = await this.courseModel.find({}).exec();
		
		// Filtrar curso general de la categoría
		const general = allCourses.find(course => {
			const branchStr = this.extractString(course.branch);
			const careerStr = this.extractString(course.career);
			if (!branchStr) return false;
			const normalized = this.normalizeCategory(course.branch);
			return normalized === category && !careerStr;
		});

		// Filtrar cursos de carreras
		const careerList = category === 'ciencias-exactas' 
			? ['arquitectura', 'ingenieria', 'matematicas']
			: ['psicologia', 'filosofia', 'trabajo-social'];
		
		const careers = allCourses.filter(course => {
			const careerStr = this.extractString(course.career);
			if (!careerStr) return false;
			const normalized = this.normalizeCareer(course.career);
			return normalized && careerList.includes(normalized);
		});

		if (!general) throw new NotFoundException('Curso general de categoría no encontrado');
		
		// Transformar al idioma solicitado
		const targetLang = lang || 'es';
		return {
			general: this.transformCourseToLanguage(general, targetLang),
			careers: careers.map(c => this.transformCourseToLanguage(c, targetLang))
		};
	}

	async listCategories(lang?: string) {
		// Buscar todos los cursos que tienen branch
		const docs = await this.courseModel.find({}).exec();
		console.log('📚 Total documentos encontrados:', docs.length);
		console.log('📄 Primeros documentos:', JSON.stringify(docs.slice(0, 2), null, 2));

		if (docs.length === 0) {
			console.error('❌ No se encontraron documentos en la colección');
			return [];
		}

		// Agrupar por categoría
		const categories = new Map<string, any>();
		
		for (const doc of docs) {
			console.log('🔍 Procesando doc:', { id: doc.id, branch: doc.branch, career: doc.career });
			const branchStr = this.extractString(doc.branch);
			const normalizedCat = this.normalizeCategory(doc.branch);
			if (normalizedCat && !categories.has(normalizedCat)) {
				categories.set(normalizedCat, doc);
			}
		}

		const targetLang = lang || 'es';
		const result = Array.from(categories.entries()).map(([category, course]) => ({
			category,
			course: this.transformCourseToLanguage(course, targetLang)
		}));
		
		console.log('✅ Categorías encontradas:', result.length);
		return result;
	}

	async resolveByCareer(career: string, lang?: string) {
		const normalizedCareer = this.normalizeCareer(career);
		console.log('🔍 Buscando carrera:', career, '→ normalizado:', normalizedCareer);
		
		// Mapeo de carrera a categoría
		const careerToCategoryMap: Record<string, string> = {
			'ingenieria': 'ciencias-exactas',
			'arquitectura': 'ciencias-exactas',
			'matematicas': 'ciencias-exactas',
			'psicologia': 'ciencias-humanas',
			'filosofia': 'ciencias-humanas',
			'trabajo-social': 'ciencias-humanas',
		};

		const categoryName = careerToCategoryMap[normalizedCareer || ''];
		console.log('📂 Categoría esperada:', categoryName);
		if (!categoryName) throw new NotFoundException('Carrera no soportada');

		// Buscar todos los cursos
		const allCourses = await this.courseModel.find({}).exec();
		console.log('📚 Total cursos en BD:', allCourses.length);

		// Buscar curso general de la categoría (que NO tiene carrera definida)
		const catCourse = allCourses.find(course => {
			const branchStr = this.extractString(course.branch);
			const careerStr = this.extractString(course.career);
			const normalized = this.normalizeCategory(course.branch);
			console.log(`  Verificando ${course.id}: branch="${branchStr}" (norm: ${normalized}), career="${careerStr}"`);
			if (!branchStr) return false;
			// El curso de categoría no debe tener carrera
			const match = normalized === categoryName && !careerStr;
			if (match) console.log('  ✅ Curso de categoría encontrado:', course.id);
			return match;
		});

		// Buscar curso de la carrera específica
		const carCourse = allCourses.find(course => {
			const careerStr = this.extractString(course.career);
			if (!careerStr) return false;
			const careerNorm = this.normalizeCareer(course.career);
			console.log(`  Verificando ${course.id}: career="${careerStr}" (norm: ${careerNorm})`);
			const match = careerNorm === normalizedCareer;
			if (match) console.log('  ✅ Curso de carrera encontrado:', course.id);
			return match;
		});

		console.log('📊 Resultado búsqueda - Categoría:', catCourse?.id, 'Carrera:', carCourse?.id);
		if (!catCourse || !carCourse) throw new NotFoundException('Cursos asociados no encontrados');
		
		const targetLang = lang || 'es';
		return {
			categoryCourse: this.transformCourseToLanguage(catCourse, targetLang),
			careerCourse: this.transformCourseToLanguage(carCourse, targetLang),
		};
	}

	async upsertMany(docs: Array<Partial<Course>>) {
		for (const d of docs) {
			if (!d.id) continue;
			await this.courseModel.updateOne({ id: d.id }, { $set: d }, { upsert: true }).exec();
		}
		return { inserted: docs.length };
	}

	async debugConnection() {
		try {
			// Obtener información de la conexión
			const modelName = this.courseModel.modelName;
			const collectionName = this.courseModel.collection.name;
			const dbName = this.courseModel.db.name;
			
			// Intentar contar documentos
			const count = await this.courseModel.countDocuments({}).exec();
			
			// Obtener un documento de ejemplo
			const sample = await this.courseModel.findOne({}).exec();
			
			// Listar todas las colecciones disponibles
			const db = this.courseModel.db.db;
			const collections = db ? await db.listCollections().toArray() : [];
			const collectionNames = collections.map(c => c.name);
			
			return {
				status: 'connected',
				database: dbName,
				collection: collectionName,
				model: modelName,
				totalDocuments: count,
				availableCollections: collectionNames,
				sampleDocument: sample ? {
					id: sample.id,
					title: sample.title,
					career: sample.career,
					branch: sample.branch
				} : null,
				message: count > 0 ? '✅ Conexión exitosa' : '⚠️ Colección vacía - revisa availableCollections'
			};
		} catch (error) {
			return {
				status: 'error',
				message: error.message,
				error: error.toString()
			};
		}
	}
}
