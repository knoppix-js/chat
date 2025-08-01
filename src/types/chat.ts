export interface ChatMessageDTO {
  from: string;
  message: string;
}

export interface ChatMessage {
  from: string;
  message: string;
  timestamp: number;
}

export interface Contact {
  name: string;
  messages: ChatMessage[];
  unreadCount: number;
}
