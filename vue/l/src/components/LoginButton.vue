<!-- src/components/LoginButton.vue -->
<template>
  <button @click="loginWithGoogle">Login with Google</button>
</template>

<script>
import { auth, provider, signInWithPopup } from '../firebaseConfig';

export default {
  methods: {
    async loginWithGoogle() {
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log("User Info:", user);
        this.$emit('login-success', user); // Emit an event on successful login
      } catch (error) {
        console.error("Error during login:", error);
      }
    }
  }
};
</script>
