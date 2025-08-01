import { chatService } from 'src/services/chatService';
import { useChatStore } from 'src/stores/chatStore';

export function useChatSocket() {
  const store = useChatStore();

  const connect = () => {
    chatService.onMessage((msg) => {
      store.addMessage(msg.from, msg);
    });

    chatService.connect();
  };

  const disconnect = () => {
    chatService.disconnect();
  };

  const send = (text: string) => {
    const msg = store.sendMessage(text);
    if (msg) {
      chatService.sendMessage(msg);
    }
  };


  return {
    connect,
    disconnect,
    send
  };
}
