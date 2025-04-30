<template>
  <v-app-bar app color="primary" dark>
    <v-app-bar-nav-icon @click="$emit('toggle-drawer')"></v-app-bar-nav-icon>
    <v-toolbar-title>Employee Locator</v-toolbar-title>
  </v-app-bar>
</template>

<script>
export default {
  name: "AppBar",
  emits: ["toggle-drawer"],
};
</script>
