<template>
  <q-layout view="lHh Lpr lFf" class="layout-full-height">
    <q-page-container class="page-container-full-height">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts"></script>

<style scoped>
.layout-full-height {
  height: 100vh;
  overflow: hidden;
}
.page-container-full-height {
  height: 100%;
  overflow: hidden;
}
</style>
