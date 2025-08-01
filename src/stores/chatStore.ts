import { defineStore } from 'pinia';
import type { ChatMessageDTO, Contact } from 'src/types/chat';
import { USERNAME } from 'src/lib/username';

export interface ChatState {
  contacts: Record<string, Contact>;
  activeContact: string;
}

export const useChatStore = defineStore('chat', {
  state: (): ChatState => ({
    contacts: {},
    activeContact: ''
  }),

  getters: {
    contactList: (state) => Object.values(state.contacts),
    activeMessages: (state) =>
      state.contacts[state.activeContact]?.messages ?? []
  },

  actions: {
    setActiveContact(name: string) {
      this.activeContact = name;
      if (this.contacts[name]) {
        this.contacts[name].unreadCount = 0;
      }
    },

    addMessage(contactName: string, message: ChatMessageDTO) {
      if (!this.contacts[contactName]) {
        this.contacts[contactName] = {
          name: contactName,
          messages: [],
          unreadCount: 0
        };
      }

      this.contacts[contactName].messages.push({ ...message, timestamp: Date.now() });

      if (contactName !== this.activeContact) {
        this.contacts[contactName].unreadCount++;
      }
    },

    sendMessage(text: string) {
      if (!this.activeContact) return;

      const message = {
        from: USERNAME,
        message: text
      };

      this.addMessage(this.activeContact, message);
      return message;
    }
  }
});
