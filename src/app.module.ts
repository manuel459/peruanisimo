import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VentasController } from './ventas.controller';
import { VentasService } from './ventas.service';
import { VentasGateway } from './ventas.gateway';

@Module({
  imports: [],
  controllers: [AppController, VentasController],
  providers: [AppService, VentasService, VentasGateway],
})
export class AppModule {}
