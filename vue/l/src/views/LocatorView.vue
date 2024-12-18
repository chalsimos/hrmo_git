<template>
  <v-app>
    <!-- Your existing code -->
    <v-main>
      <v-container>
        <!-- User Logged In -->
        <div v-if="user">
          <p>Welcome, {{ user.displayName }}</p>
          <img :src="user.photoURL" alt="User profile photo" />
          
          <br>my locators

          <div v-if="locators.length">
            <v-expansion-panels>
              <v-expansion-panel
                v-for="locator in locators"
                :key="locator.id"
              >
                <!-- Summary (collapsed) -->
                <v-expansion-panel-title>
                  <div>
                    <strong>{{ locator.userName }}</strong> 
                    <span :class="statusClass(locator.status)"> <b>
                      ({{ getStatusLabel(locator.status) }})</b>
                    </span>
                  </div>
                </v-expansion-panel-title>

                <!-- Details (expanded) -->
                <v-expansion-panel-text>
                  <p><strong>Date of Visit:</strong> {{ locator.date }}</p>
                  <p><strong>Departure Time:</strong> {{ locator.departureTime }}</p>
                  <p><strong>Expected Return Time:</strong> {{ locator.returnTime }}</p>
                  <p><strong>Return Time:</strong> {{ formatFirestoreDate(locator.dateReturn) }}</p>
                  <p><strong>Location:</strong> {{ locator.location }}</p>
                  <p><strong>Reason:</strong> {{ locator.reason }}</p>

                  <!-- Return button, hidden or disabled based on status -->
                  <router-link 
                    v-if="locator.status !== 'rejected' && locator.status !== 'pending' && locator.status !== 'done'"
                    :to="`/return-home/${locator.id}`" 
                    class="btn btn-primary"
                  >
                    Return
                  </router-link>
                  <span v-else class="text-muted">Return (Not Available)</span>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>

          <div v-else>
            <v-alert type="info">No locators found for this user.</v-alert>
          </div>
        </div>
        <!-- User Not Logged In -->
        <div v-else>
          <LoginButton @login-success="checkUserInFirestore" />
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { signOut } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, query, where, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import LoginButton from "../components/LoginButton.vue";
import { Timestamp } from 'firebase/firestore';

export default {
  components: { LoginButton },
  data() {
    return {
      user: null,
      userExists: false,
      locators: [], 
      employeeId: "", 
      drawer: false, 
    };
  },
  methods: {
    formatFirestoreDate(firestoreTimestamp) {
      if (firestoreTimestamp instanceof Timestamp) {
        const date = firestoreTimestamp.toDate();
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      } else {
        return 'No Return Time Available';  // Optional fallback message
      }
    },
    async checkUserInFirestore(user) {
      this.user = user;
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        this.employeeId = userData.employeeId || user.uid; 
        this.userExists = true;
        this.fetchLocators();
      } else {
        this.userExists = false;
      }
    },
    async fetchLocators() {
      try {
        const locatorsRef = collection(db, "locators");
        const q = query(
          locatorsRef,
          where("employeeId", "==", this.employeeId)
        );

        onSnapshot(q, (querySnapshot) => {
          this.locators = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
        });
      } catch (error) {
        console.error("Error fetching locators:", error);
      }
    },
    async logout() {
      try {
        await signOut(auth); 
        this.user = null;
        this.userExists = false; 
        this.drawer = false; 
        alert("Logged out successfully!");
      } catch (error) {
        console.error("Error logging out:", error);
        alert("An error occurred during logout.");
      }
    },
    getStatusLabel(status) {
      switch (status) {
        case "approved":
          return "Approved";
        case "rejected":
          return "Rejected";
        case "done":
          return "Done";
        default:
          return "Pending";
      }
    },
    statusClass(status) {
      switch (status) {
        case "approved":
          return "text-success";
        case "rejected":
          return "text-danger";
        default:
          return "text-info";
      }
    },
  },
  mounted() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.checkUserInFirestore(user);
      }
    });
  },
};
</script>

<style scoped>
.text-success {
  color: green;
}
.text-danger {
  color: red;
}
.text-info {
  color: blue;
}
</style>
