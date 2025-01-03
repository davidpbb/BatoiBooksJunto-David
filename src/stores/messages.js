import { defineStore } from 'pinia';

export const useStoreDeMensajes = defineStore('messages', {

    state: () => ({
        messages: []
    }),
    actions: {
        addMessage(message) {
            this.messages.push(message);
        },
        clearMessages() {
            this.messages = [];
        },
        removeMessage(index) {
            this.messages.splice(index, 1);
        }
    }
});
