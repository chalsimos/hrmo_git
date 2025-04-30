<template>
  <v-app>
    <!-- Navigation Drawer (existing code) -->
    <v-navigation-drawer
  v-if="userExists"
  v-model="drawer"
  app
  temporary
>
  <v-list>
    <!-- Locator -->
    <v-list-item @click="$router.push('/locator')">
      <v-list-item-icon>
        <v-icon>mdi-map</v-icon>
      </v-list-item-icon>
      <v-list-item-title>Locator</v-list-item-title>
    </v-list-item>

    <!-- File Locator -->
    <v-list-item @click="$router.push('/file-locator')">
      <v-list-item-icon>
        <v-icon>mdi-file</v-icon>
      </v-list-item-icon>
      <v-list-item-title>File Locator</v-list-item-title>
    </v-list-item>

    <!-- Logout -->
    <v-list-item @click="logout">
      <v-list-item-icon>
        <v-icon>mdi-logout</v-icon>
      </v-list-item-icon>
      <v-list-item-title>Logout</v-list-item-title>
    </v-list-item>
  </v-list>
</v-navigation-drawer>


    <!-- App Bar (existing code) -->
    <v-app-bar v-if="userExists" app color="success" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>MinSUfied</v-toolbar-title>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <v-container>
        <!-- Existing content -->
        <h1>Mindoro State University</h1>
        <h2>Employee Online Locator</h2>

        <!-- User Logged In -->
        <div v-if="user">
          <!-- Existing content -->
        </div>

        <!-- User Not Logged In -->
        <div v-else>
          <LoginButton @login-success="checkUserInFirestore" />
        </div>
      </v-container>
    </v-main>
    
    <!-- Bottom Navigation -->
    <BottomNavigation v-if="userExists" />
  </v-app>
</template>

<script>
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import LoginButton from "../components/LoginButton.vue";
import BottomNavigation from "../components/BottomNavigation.vue";
export default {
  components: { 
    LoginButton,
    BottomNavigation,
  },
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
