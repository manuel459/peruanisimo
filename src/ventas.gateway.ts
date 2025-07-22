import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // O el dominio de tu frontend
  },
})
export class VentasGateway {
  @WebSocketServer()
  server: Server;

  emitirVenta(monto: number) {
    this.server.emit('ventaEmitida', { monto });
  }
} 