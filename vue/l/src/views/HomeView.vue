<template>
  <v-app>
    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-if="userExists"
      v-model="drawer"
      app
      temporary
    >
      <v-list>
        <v-list-item-group>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Home</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Profile</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                <!-- Logout Action -->
                <v-btn
                  color="error"
                  small
                  @click="logout"
                >
                  Logout
                </v-btn>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <!-- App Bar -->
    <v-app-bar v-if="userExists" app color="primary" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Employee Locator</v-toolbar-title>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <v-container>
        <h1>Mindoro State University</h1>
        <h2>Employee Online Locator</h2>

        <!-- User Logged In -->
        <div v-if="user">
          <p>Welcome, {{ user.displayName }}</p>
          <img :src="user.photoURL" alt="User profile photo" />
          <br />

          <!-- Show form if user does not exist in Firestore -->
          <div v-if="!userExists" class="mt-4">
            <h3>Please Complete Your Profile</h3>
            <v-form @submit.prevent="saveUserDetails">
              <v-text-field
                label="Employee ID"
                v-model="employeeId"
                required
              ></v-text-field>
              <v-text-field
                label="Full Name"
                v-model="fullName"
                required
              ></v-text-field>
              <v-text-field
                label="Mobile Number"
                v-model="mobileNumber"
                required
              ></v-text-field>
              <v-select
                label="Campus"
                :items="campuses"
                v-model="campus"
                required
              ></v-select>

              <!-- Loader and Submit Button -->
              <div class="d-flex align-center">
                <v-btn
                  :disabled="loading"
                  type="submit"
                  color="primary"
                  class="mr-4"
                >
                  Submit
                </v-btn>
                <v-progress-circular
                  v-if="loading"
                  indeterminate
                  color="primary"
                ></v-progress-circular>
              </div>
            </v-form>
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
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import LoginButton from "../components/LoginButton.vue";

export default {
  components: { LoginButton },
  data() {
    return {
      user: null,
      userExists: false,
      employeeId: "",
      fullName: "",
      mobileNumber: "",
      campus: "",
      campuses: ["Bongabong", "Calapan", "Main"],
      loading: false, // Loading state
      drawer: false, // Drawer visibility
    };
  },
  methods: {
    async checkUserInFirestore(user) {
      this.user = user;

      // Check if the user exists in Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        this.userExists = true;
      } else {
        this.userExists = false; // Show the form
      }
    },
    async saveUserDetails() {
      if (this.user) {
        this.loading = true; // Start the loader
        try {
          // Save user details in Firestore
          const userRef = doc(db, "users", this.user.uid);
          await setDoc(userRef, {
            employeeId: this.employeeId,
            fullName: this.fullName,
            mobileNumber: this.mobileNumber,
            campus: this.campus,
            email: this.user.email,
            photoURL: this.user.photoURL,
          });

          this.userExists = true; // Hide the form after saving
          alert("Profile updated successfully!");
        } catch (error) {
          console.error("Error saving user details:", error);
          alert("An error occurred. Please try again.");
        } finally {
          this.loading = false; // Stop the loader
        }
      }
    },
    async logout() {
      try {
        await signOut(auth); // Firebase sign-out
        this.user = null;
        this.userExists = false; // Reset user and app state
        this.drawer = false; // Close drawer
        alert("Logged out successfully!");
      } catch (error) {
        console.error("Error logging out:", error);
        alert("An error occurred during logout.");
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
.mt-4 {
  margin-top: 20px;
}

.d-flex {
  display: flex;
}
.align-center {
  align-items: center;
}
.mr-4 {
  margin-right: 16px;
}
</style>
