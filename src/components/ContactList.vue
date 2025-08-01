<template>
  <q-drawer
    show-if-above
    v-model="drawer"
    side="left"
    :width="260"
    class="bg-white q-pa-sm"
  >
    <template v-if="contactList.length === 0">
      <div class="q-pa-md flex flex-center">
        <q-spinner color="primary" size="md" />
      </div>
    </template>
    <template v-else>
      <q-list separator padding>
        <q-item
          v-for="contact in contactList"
          :key="contact.name"
          clickable
          @click="select(contact.name)"
          :class="contact.name === activeContact && 'bg-grey-3'"
        >
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">
              {{ contact.name[0] }}
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium">
              {{ contact.name }}
            </q-item-label>
            <q-item-label caption lines="1">
              {{ contact.messages.at(-1)?.message }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-badge v-if="contact.unreadCount" color="red" floating>
              {{ contact.unreadCount }}
            </q-badge>
          </q-item-section>
        </q-item>
      </q-list>
    </template>
  </q-drawer>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useChatStore } from 'src/stores/chatStore';

const props = defineProps<{
  modelValue: boolean;
  activeContact: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'select', name: string): void;
}>();

const drawer = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const store = useChatStore();
const contactList = computed(() => store.contactList);

function select(name: string) {
  emit('select', name);
}
</script>
