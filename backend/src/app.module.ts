import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { CursosModule } from './cursos/cursos.module';
import { TestModule } from './test/test.module';
import { PagosModule } from './pagos/pagos.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsuariosModule, CursosModule, TestModule, PagosModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
