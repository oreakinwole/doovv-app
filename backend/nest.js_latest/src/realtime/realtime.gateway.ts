import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ cors: { origin: '*' } })
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, { userId: string; role: string; socket: Socket }>();

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.request.headers.authorization?.replace('Bearer ', '');
      if (token) {
        const payload = this.jwtService.verify(token);
        this.connectedUsers.set(client.id, {
          userId: payload.sub,
          role: payload.role,
          socket: client,
        });
        console.log(`User ${payload.sub} connected`);
      }
    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.connectedUsers.delete(client.id);
  }

  sendToCustomer(customerId: string, event: string, data: any) {
    for (const [, connection] of this.connectedUsers) {
      if (connection.userId === customerId && connection.role === 'CUSTOMER') {
        connection.socket.emit(event, data);
      }
    }
  }

  sendToWashers(event: string, data: any) {
    for (const [, connection] of this.connectedUsers) {
      if (connection.role === 'WASHER') {
        connection.socket.emit(event, data);
      }
    }
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() room: string) {
    client.join(room);
    return { event: 'joined', data: room };
  }
}
