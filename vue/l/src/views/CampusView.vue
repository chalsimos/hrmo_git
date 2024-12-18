<template>
  <v-app>


    <!-- Main Content -->
    <v-main>
      <v-container>
        <h1>Mindoro State University - {{ this.campus }} Campus</h1>
        <h2>Approved Employee Locator</h2>

        <!-- Data Table for Approved Locators -->
        <v-data-table
          v-if="locators.length"
          :headers="headers"
          :items="locators"
          item-value="id"
          class="elevation-1"
          hide-default-footer
          :items-per-page="5"
        >

          <template v-slot:[`item.userName`]="{ item }">
            <td>{{ item.userName }}</td>
          </template>
          <template v-slot:[`item.dateOfVisit`]="{ item }">
            <td>{{ item.dateOfVisit }}</td>
          </template>
          <template v-slot:[`item.departureTime`]="{ item }">
            <td>{{ item.departureTime }} - {{ item.returnTime }} </td>
          </template>
          <template v-slot:[`item.location`]="{ item }">
            <td>{{ item.location }}</td>
          </template>
          <template v-slot:[`item.reason`]="{ item }">
            <td>{{ item.reason }}</td>
          </template>
        </v-data-table>

        <!-- Alert if no locators found -->
        <v-alert v-else type="info">No approved locators found for this campus.</v-alert>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { onMounted } from 'vue';
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default {
  data() {
    return {
      locators: [], 
      campus: "", 
      headers: [
        { text: 'User Name', align: 'start', value: 'userName' },
        { text: 'Date of Visit', value: 'dateOfVisit' },
        { text: 'Departure Time', value: 'departureTime' },
        { text: 'Location', value: 'location' },
        { text: 'Reason', value: 'reason' },
      ],

    };
  },
  methods: {
    fetchLocators() {
      const campusName = this.$route.params.campus; 
      this.campus = campusName;
      try {
        const locatorsRef = collection(db, "locators");
        const q = query(
          locatorsRef,
          where("campus", "==", this.campus),
          where("status", "==", "approved")
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
  },
  mounted() {
    this.fetchLocators(); 
  },
};
</script>

<style scoped>
/* Set font size for table data */
.v-data-table td {
  font-size: 30px; /* Set font size for table data */
  padding: 10px; /* Adjust padding for better readability */
}

.v-data-table th {
  font-weight: bold; /* Make header text bold */
}

@media (max-width: 768px) {
  /* Adjust font size for tablets */
  .v-data-table .v-data-table__wrapper {
    font-size: 1.25rem; /* Default font size for tablets */
  }

  /* Adjust column headers for tablets */
  .v-data-table-header th {
    font-size: 1.25rem;
  }

  /* Adjust the rows for easier readability on smaller screens */
  .v-data-table__row {
    font-size: 1.1rem;
  }
}
</style>
