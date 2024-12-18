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
      <!-- Home Link -->
      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-home</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            <router-link to="/" class="text-decoration-none">
              Home
            </router-link>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <!-- Profile Link -->
      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-account</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            <router-link to="/profile" class="text-decoration-none">
              Profile
            </router-link>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-map</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            <router-link to="/locator" class="text-decoration-none">
              Locators
            </router-link>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <!-- File Locator Link -->
      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-file-find</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            <router-link to="/file-locator" class="text-decoration-none">
              File Locator
            </router-link>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <!-- Logout -->
      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-logout</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
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
    <v-app-bar v-if="userExists" app color="success" dark>
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
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import LoginButton from "../components/LoginButton.vue";

export default {
  components: { LoginButton },
  data() {
    return {
      user: null, // Firebase authenticated user
      userExists: false, // Tracks if the user exists in Firestore
      employeeId: "",
      fullName: "",
      mobileNumber: "",
      campus: "",
      campuses: ["Bongabong", "Calapan", "Main"],
      loadingUserData: true, // Indicates whether Firestore data is being fetched
      loading: false, // Indicates whether the form is saving
      drawer: false, // Navigation drawer toggle
    };
  },
  methods: {
    async fetchRegisteredName(email) {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0].data();
          this.registeredName = userDoc.fullName || "Name not found";
          this.employeeId = userDoc.employeeId || "";
          this.campus = userDoc.campus || "Campus not Registered";
          this.userExists = true; // User exists in Firestore
        } else {
          console.warn("No user found with this email.");
          this.userExists = false; // User does not exist in Firestore
        }
      } catch (error) {
        console.error("Error fetching registered name:", error);
        this.userExists = false; // Handle errors gracefully
      } finally {
        this.loadingUserData = false; // Data fetching is complete
      }
    },
    async saveUserDetails() {
      if (!this.employeeId || !this.fullName || !this.mobileNumber || !this.campus) {
        alert("Please fill in all required fields.");
        return;
      }

      if (this.user) {
        this.loading = true;
        try {
          const userRef = doc(db, "users", this.user.uid);
          await setDoc(userRef, {
            employeeId: this.employeeId,
            fullName: this.fullName,
            mobileNumber: this.mobileNumber,
            campus: this.campus,
            email: this.user.email,
            photoURL: this.user.photoURL,
          });

          this.userExists = true;
          alert("Profile updated successfully!");
        } catch (error) {
          console.error("Error saving user details:", error);
          alert("An error occurred. Please try again.");
        } finally {
          this.loading = false;
        }
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
  },
  mounted() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.user = user;
        await this.fetchRegisteredName(user.email); // Fetch Firestore data
      } else {
        this.user = null;
        this.userExists = false;
        this.loadingUserData = false; // No user is logged in
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
