import { Body, Controller, Get, NotFoundException, Param, Post, Query } from '@nestjs/common';
import { CursosService } from './cursos.service';

@Controller('cursos')
export class CursosController {
	constructor(private readonly service: CursosService) {}

	@Get('categories')
	listCategories(@Query('lang') lang?: string) {
		return this.service.listCategories(lang);
	}

	@Get('debug/connection')
	async debugConnection() {
		return this.service.debugConnection();
	}

	@Get('categories/:category')
	getCategory(
		@Param('category') category: 'ciencias-exactas' | 'ciencias-humanas',
		@Query('lang') lang?: string,
	) {
		if (!['ciencias-exactas', 'ciencias-humanas'].includes(category)) {
			throw new NotFoundException('Categoría no válida');
		}
		return this.service.getByCategory(category, lang);
	}

	@Get('resolve')
	resolve(@Query('career') career: string, @Query('lang') lang?: string) {
		return this.service.resolveByCareer(career, lang);
	}

	@Get(':id')
	getBySlug(@Param('id') id: string, @Query('lang') lang?: string) {
		return this.service.getCourseBySlug(id, lang);
	}

	// Prototype-only seeding endpoint (protect/disable in production)
	@Post('seed')
	seed(@Body() payload: { courses: any[] }) {
		return this.service.upsertMany(payload?.courses ?? []);
	}
}
