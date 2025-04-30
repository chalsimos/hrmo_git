<!-- src/components/LogoutButton.vue -->
<template>
  <button @click="logout">Logout</button>
</template>

<script>
import { auth, signOut } from '../firebaseConfig';

export default {
  methods: {
    async logout() {
      try {
        await signOut(auth);
        console.log("User logged out");
        this.$emit('logout-success'); // Emit an event on successful logout
      } catch (error) {
        console.error("Error during logout:", error);
      }
    }
  }
};
</script>
