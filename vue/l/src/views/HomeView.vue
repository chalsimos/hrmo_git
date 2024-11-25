
<template>
  <v-app>
    <v-main>
      <v-container>
        <h2>Scan QR Code</h2>
         <h1>Vue Google Authentication</h1>
    <div v-if="user">
      <p>Welcome, {{ user.displayName }}</p>
      <img :src="user.photoURL" alt="User profile photo" />
      <LogoutButton @logout-success="user = null" />
    </div>
    <div v-else>
      <LoginButton @login-success="setUser" />
    </div>
        <!-- <v-btn @click="scanQRCode" color="primary">Scan Locator</v-btn>
    <div id="reader" style="width: 250px; height: 250px; margin: auto;"></div>
    <p v-if="scannedData">{{ scannedData }}</p> -->

    
      </v-container>
    </v-main>
  </v-app>
  <div>
    
    

    
    
  </div>
</template>

<script>
import LoginButton from '../components/LoginButton.vue';
import LogoutButton from '../components/LogoutButton.vue';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

import { Html5Qrcode } from "html5-qrcode"; // Correctly import the library
import 'bootstrap/dist/css/bootstrap.min.css';

export default {
  components: { LoginButton, LogoutButton },
  data() {
    return {
      scannedData: null,
      html5QrCode: null,
      user: null
    };
  },
  methods: {
    setUser(user) {
      this.user = user;
    },
    scanQRCode() {
      // Initialize the scanner
      this.html5QrCode = new Html5Qrcode("reader");
      
      this.html5QrCode.start(
        { facingMode: "environment" }, // Use the rear camera
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (decodedText) => {
          this.scannedData = decodedText; // Store scanned data
          this.html5QrCode.stop(); // Stop scanning after successful read
          
          // Navigate to the route defined in the QR code
          this.navigateToRoute(decodedText);
        },
        (errorMessage) => {
          // Handle errors here
          console.log(errorMessage);
        }
      ).catch(err => {
        console.error("Unable to start scanning:", err);
      });
    },
    navigateToRoute(route) {
      // // Check if the scanned data is a valid route
      // if (route) {
      //   this.$router.push({ path: route }).catch(err => {
      //     console.error("Navigation error:", err);
      //   });
      // }
       if (route) {
    if (route.startsWith("http://") || route.startsWith("https://")) {
      // If it's a full URL, navigate directly
      window.location.href = route;
    } else {
      // If it's a relative route, use Vue Router
      this.$router.push({ path: route }).catch(err => {
        console.error("Navigation error:", err);
      });
    }
  }
    },
  },
   mounted() {
    onAuthStateChanged(auth, (user) => {
      this.user = user;
    });
  }
};
</script>

<style scoped>
.text-center {
  margin: 20px;
}
</style>
