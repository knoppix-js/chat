import type { ChatMessageDTO } from 'src/types/chat';

export interface IChatService {
  connect(): void;

  disconnect(): void;

  sendMessage(msg: ChatMessageDTO): void;

  onMessage(cb: (msg: ChatMessageDTO) => void): void;

  onStatusChange(cb: (connected: boolean) => void): void;
}

const SOCKET_URL = 'ws://localhost:8181';

class ChatService implements IChatService {
  private socket: WebSocket | null = null;
  private manuallyDisconnected = false;
  private onMessageCallback: ((msg: ChatMessageDTO) => void) | null = null;
  private onConnectionChange: ((connected: boolean) => void) | null = null;

  connect(): void {
    if (this.socket?.readyState === WebSocket.OPEN || this.socket?.readyState === WebSocket.CONNECTING) return;

    this.manuallyDisconnected = false;
    this.socket = new WebSocket(SOCKET_URL);

    this.socket.onopen = () => {
      console.log('[WS] Connected');
      this.onConnectionChange?.(true);
    };

    this.socket.onmessage = (event: MessageEvent<string>) => {
      try {
        const parsed = JSON.parse(event.data);
        if ('message' in parsed && typeof parsed.message === 'object') {
          this.onMessageCallback?.(parsed.message);
        }
      } catch {
        console.error('[WS] Failed to parse:', event.data);
      }
    };

    this.socket.onerror = (err) => {
      console.error('[WS] Error:', err);
    };

    this.socket.onclose = () => {
      console.warn('[WS] Disconnected');
      this.onConnectionChange?.(false);
      if (!this.manuallyDisconnected) {
        setTimeout(() => this.connect(), 1000);
      }
    };
  }

  disconnect(): void {
    this.manuallyDisconnected = true;
    this.socket?.close();
    this.socket = null;
  }

  sendMessage(msg: ChatMessageDTO): boolean {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ message: msg }));
      return true;
    }
    console.warn('[WS] Cannot send: not connected');
    return false;
  }

  onMessage(cb: (msg: ChatMessageDTO) => void): void {
    this.onMessageCallback = cb;
  }

  onStatusChange(cb: (connected: boolean) => void): void {
    this.onConnectionChange = cb;
  }
}

export const chatService = new ChatService();
