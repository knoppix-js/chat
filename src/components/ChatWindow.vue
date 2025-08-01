<template>
  <div class="col scroll q-pa-md" ref="messageContainer" style="min-height: 0; overflow-y: auto;">
    <template v-if="activeContact">
      <div v-for="(msg, index) in activeMessages" :key="msg.timestamp">
        <div
          v-if="shouldShowDate(index)"
          class="text-center text-grey text-caption q-mb-sm text-bold"
        >
          {{ formatDate(msg.timestamp) }}
        </div>

        <div
          class="q-mt-sm row"
          :class="msg.from === USERNAME ? 'justify-end' : 'justify-start'"
        >
          <div
            class="q-pa-sm q-px-md rounded-borders"
            :class="msg.from === USERNAME ? 'bg-primary text-white' : 'bg-grey-4 text-black'"
            style="max-width: 75%; white-space: pre-wrap; overflow-wrap: break-word;"
          >
            <div>{{ msg.message }}</div>
            <div
              class="text-caption text-right q-mt-xs"
              :class="msg.from === USERNAME ? 'text-grey-1' : 'text-grey-7'"
            >
              {{ formatTime(msg.timestamp) }}
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="text-grey text-center q-mt-md">
        Выберите контакт, чтобы начать общение
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref, watch } from 'vue';
import { useChatStore } from "src/stores/chatStore";
import { USERNAME } from "src/lib/username";
import { formatDate, formatTime } from "src/lib/date";

const store = useChatStore();
const messageContainer = ref<HTMLElement | null>(null);

const activeContact = computed(() => store.activeContact);
const activeMessages = computed(() => store.activeMessages);

function scrollToBottom(force = false) {
  const el = messageContainer.value;
  if (!el) return;

  const distanceToBottom = el.scrollHeight - (el.scrollTop + el.clientHeight);

  if (!force && distanceToBottom > 150) return; // Если была прокуртка вверх по чату сообщений, то не тригерим скролл вниз

  el.scrollTop = el.scrollHeight;
}

watch(
  () => store.activeContact,
  async () => {
    await nextTick();
    scrollToBottom(true);
  }
);

watch(
  () => store.activeMessages.at(-1),
  async (lastMsg) => {
    await nextTick();
    if (!lastMsg) return;
    scrollToBottom(lastMsg.from === USERNAME);
  }
);

function shouldShowDate(index: number): boolean {
  const current = store.activeMessages[index];
  const prev = store.activeMessages[index - 1];
  if (!current) return false;
  if (!prev) return true;

  const currentDate = new Date(current.timestamp).toDateString();
  const prevDate = new Date(prev.timestamp).toDateString();
  return currentDate !== prevDate;
}
</script>
