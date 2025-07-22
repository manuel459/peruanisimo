import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiBody, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { VentasService } from './ventas.service';
import { VentasGateway } from './ventas.gateway';

@ApiTags('ventas')
@Controller('ventas')
export class VentasController {
  constructor(
    private readonly ventasService: VentasService,
    private readonly ventasGateway: VentasGateway,
  ) {}

  @Post('emitir')
  @ApiOperation({ summary: 'Emitir una venta por WebSocket' })
  @ApiBody({ schema: { properties: { monto: { type: 'number', example: 123 } } } })
  @ApiResponse({ status: 201, description: 'Venta emitida correctamente.' })
  async emitirVenta(@Body('monto') monto: number) {
    const resultado = await this.ventasService.procesarVenta(monto);
    this.ventasGateway.emitirVenta(resultado);
    return { mensaje: 'Venta emitida', monto: resultado };
  }

  @Get('total')
  @ApiOperation({ summary: 'Obtener el total acumulado de ventas' })
  @ApiResponse({ status: 200, description: 'Total acumulado de ventas.' })
  async obtenerTotal() {
    const total = await this.ventasService.obtenerTotal();
    return { total };
  }
} 