<template>
  <q-page class="row full-height bg-grey-2">

    <!-- Список контактов -->
    <ContactList
      v-model="drawer"
      @select="select"
    />

    <!-- Правая часть -->
    <div class="col column full-height relative-position">
      <q-toolbar v-if="isMobile" class="bg-white q-px-sm shadow-1">
        <q-btn v-if="!activeContact" flat round icon="menu" @click="drawer = true" />
        <q-btn v-else flat round icon="arrow_back" @click="back" />
        <q-toolbar-title>{{ activeContact }}</q-toolbar-title>
      </q-toolbar>

      <ChatWindow />

      <q-footer v-if="activeContact" class="bg-white q-pa-sm">
        <q-input
          dense
          filled
          v-model="input"
          placeholder="Введите сообщение..."
          class="rounded-borders"
          @keyup.enter="send"
        >
          <template v-slot:append>
            <q-btn round dense icon="send" @click="send" color="primary" />
          </template>
        </q-input>
      </q-footer>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useChatStore } from 'src/stores/chatStore';
import { useChatSocket } from 'src/composables/useChatSocket';
import ChatWindow from 'src/components/ChatWindow.vue';
import ContactList from 'src/components/ContactList.vue';

const $q = useQuasar();
const store = useChatStore();

const drawer = ref(true);
const input = ref('');
const isMobile = computed(() => $q.screen.lt.md);
const activeContact = computed(() => store.activeContact);

const { connect, disconnect, send: sendMessage } = useChatSocket();

onMounted(connect);
onBeforeUnmount(disconnect);

function select(name: string) {
  store.setActiveContact(name);
  if (isMobile.value) drawer.value = false;
}

function back() {
  store.setActiveContact('');
  drawer.value = true;
}

function send() {
  const text = input.value.trim();
  if (!text) return;
  sendMessage(text);
  input.value = '';
}
</script>
