import { Controller, Get } from '@nestjs/common';

@Controller('usuarios')
export class UsuariosController {
  @Get()
  getAll() {
    return [{ nombre: 'Johan' }, { nombre: 'María' }];
  }
}
