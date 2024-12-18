<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar v-if="userExists" app color="primary" dark>
      <v-toolbar-title>Employee Locator</v-toolbar-title>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <v-container>
        <h1>Mindoro State University</h1>
        <h2>Employee Online Locator</h2>

        <!-- Form Section -->
        <div v-if="userExists">
          <p>Welcome, {{ this.registeredName }}</p>
          <p>Current Date and Time: {{ currentDateTime }}</p>

          <v-form @submit.prevent="saveLocator">
            <!-- Date of Visit -->
            <v-text-field
              label="Date of Visit"
              v-model="date"
              type="date"
              required
            ></v-text-field>

            <!-- Time of Departure -->
            <v-text-field
              label="Time of Departure"
              v-model="departureTime"
              type="time"
              required
            ></v-text-field>

            <!-- Time of Return -->
            <v-text-field
              label="Time of Return"
              v-model="returnTime"
              type="time"
              required
            ></v-text-field>

            <!-- Specific Location to Visit -->
            <v-text-field
              label="Specific Location to Visit"
              v-model="location"
              required
            ></v-text-field>

            <!-- Reason -->
            <v-textarea
              label="Reason"
              v-model="reason"
              required
            ></v-textarea>

            <!-- Visit Type -->
            <v-checkbox
              v-model="isOfficial"
              label="Official Visit"
            ></v-checkbox>
            <v-checkbox
              v-model="isPersonal"
              label="Personal Visit"
            ></v-checkbox>

            <!-- Submit Button -->
            <v-btn type="submit" color="primary" :disabled="loading">
              Submit
            </v-btn>
            <v-progress-circular
              v-if="loading"
              indeterminate
              color="primary"
            ></v-progress-circular>
          </v-form>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

export default {
  data() {
    return {
      user: null,
      userExists: false,
      currentDateTime: new Date().toLocaleString(),
      registeredName: "",
      employeeId: "",
      departureTime: "",
      returnTime: "",
      location: "",
      reason: "",
      campus:"",
      isOfficial: false,
      isPersonal: false,
      date: "", // Date of visit field
      loading: false,
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
          this.userExists = true;
          console.log(this.employeeId);
          
        } else {
          console.warn("No user found with this email.");
          alert("Your account is not registered in the system.");
        }
      } catch (error) {
        console.error("Error fetching registered name:", error);
      }
      
      
    },
    async saveLocator() {
      if (!this.date || !this.departureTime || !this.returnTime || !this.location || !this.reason) {
        alert("Please fill out all required fields.");
        return;
      }

      try {
        this.loading = true;

        await addDoc(collection(db, "locators"), {
          userId: this.user.uid,
          employeeId: this.employeeId,
          userName: this.registeredName,
          date: this.date, // Adding date to the document
          departureTime: this.departureTime,
          returnTime: this.returnTime,
          location: this.location,
          reason: this.reason,
          campus: this.campus,
          isOfficial: this.isOfficial,
          isPersonal: this.isPersonal,
          status: "pending",
          createdAt: new Date(),
        });

        alert("Locator saved successfully!");
        this.date = "";
        this.departureTime = "";
        this.returnTime = "";
        this.location = "";
        this.reason = "";
        this.isOfficial = false;
        this.isPersonal = false;
      } catch (error) {
        console.error("Error saving locator:", error);
        alert("Failed to save locator. Please try again.");
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.user = user;
        await this.fetchRegisteredName(user.email);
      } else {
        this.userExists = false;
      }
    });
  },
};
</script>

<style scoped>
.text-decoration-none {
  text-decoration: none;
}

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
