import { WebSocketServer } from "ws";
import { Server } from "http";

interface WebSocketManagerDepI {
  httpServer: Server;
}

export class WebSocketManager {
  private wss: WebSocketServer | null = null;
  private httpServer: Server;

  constructor({ httpServer }: WebSocketManagerDepI) {
    this.httpServer = httpServer;
  }

  public initialize() {
    if (this.wss) {
      console.warn("WebSocket already initialized.");
      return;
    }

    this.wss = new WebSocketServer({ server: this.httpServer });

    this.wss.on("connection", (socket) => {
      console.log("WS: Client connected");
      socket.on("message", (data) => {
        console.log("WS message:", data.toString());
      });
    });
  }
}
