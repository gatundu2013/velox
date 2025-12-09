import express from "express";
import { createServer } from "http";
import { WebSocketManager } from "./websocket/webSocketManager";

const app = express();
const httpServer = createServer(app);
const wsManager = new WebSocketManager({ httpServer });

export function initServer() {
  try {
    httpServer.listen(3330, () => {
      console.log("HTTP server is listening on port 3330");
      wsManager.initialize();
      console.log("WebSocket server initialized");
    });
  } catch (err) {
    console.error("Failed to initServer", err);
  }
}
