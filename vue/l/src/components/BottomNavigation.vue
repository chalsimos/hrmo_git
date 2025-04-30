<template>
  <v-bottom-navigation app color="success" grow>
    <v-btn to="/">
      <v-icon>mdi-home</v-icon>
      <span>Home</span>
    </v-btn>
    <v-btn @click.prevent="openLocatorModal">
      <v-icon>mdi-map</v-icon>
      <span>Locator</span>
    </v-btn>
    <v-btn @click.prevent="openPayslipModal">
      <v-icon>mdi-card-text</v-icon>
      <span>Payslip</span>
    </v-btn>
    <v-btn @click.prevent="openLeaveModal">
      <v-icon>mdi-card-text</v-icon>
      <span>Leave</span>
    </v-btn>
    <v-btn to="/setting">
      <v-icon>mdi-cog</v-icon>
      <span>Settings</span>
    </v-btn>
  </v-bottom-navigation>

  <!-- Locator Modal -->
  <v-dialog v-model="isLocatorModalOpen" max-width="500px">
    <v-card>
      <v-card-title>Locator Options</v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-btn block @click="navigateToLocator">File Locator</v-btn>
            </v-col>
            <v-col cols="12">
              <v-btn block @click="navigateToMyLocator">My Locator</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey darken-1" text @click="isLocatorModalOpen = false">
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Payslip Modal -->
  <v-dialog v-model="isModalOpen" max-width="500px">
    <v-card>
      <v-card-title>Select Payslip Period</v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6">
              <v-select
                v-model="month"
                :items="months"
                item-title="label"
                item-value="value"
                label="Month"
                outlined
                dense
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="year"
                :items="years"
                label="Year"
                outlined
                dense
              ></v-select>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey darken-1" text @click="isModalOpen = false">
          Cancel
        </v-btn>
        <v-btn 
          color="success" 
          text 
          @click="submitPayslipSelection"
          :disabled="!month || !year"
        >
          View Payslip
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Leave Modal -->
  <v-dialog v-model="isLeaveModalOpen" max-width="500px">
    <v-card>
      <v-card-title>Leave Options</v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-btn block @click="navigateToMyLeaves">My Leaves</v-btn>
            </v-col>
            <v-col cols="12">
              <v-btn block @click="openFileLeaveModal">File Leave</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey darken-1" text @click="isLeaveModalOpen = false">
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- File Leave Modal -->
  <!-- File Leave Modal -->
<v-dialog v-model="isFileLeaveModalOpen" max-width="500px">
  <v-card>
    <v-card-title>File Your Leave</v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field
              label="From"
              v-model="leaveFrom"
              type="date"
              dense
              outlined
            ></v-text-field>

            <v-text-field
              label="To"
              v-model="leaveTo"
              type="date"
              dense
              outlined
            ></v-text-field>

            <v-select
              v-model="leaveCategory"
              :items="leaveCategories"
              label="Leave Category"
              dense
              outlined
            ></v-select>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="grey darken-1" text @click="isFileLeaveModalOpen = false">
        Cancel
      </v-btn>
      <v-btn color="success" text @click="submitLeaveApplication">
        Submit
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

</template>
<script>
export default {
  name: 'BottomNavigation',
  data() {
    return {
      isModalOpen: false,
      isLeaveModalOpen: false,
      isFileLeaveModalOpen: false,
      isLocatorModalOpen: false,
      month: null,
      year: null,
      months: [
        { value: '01', label: 'January' },
        { value: '02', label: 'February' },
        { value: '03', label: 'March' },
        { value: '04', label: 'April' },
        { value: '05', label: 'May' },
        { value: '06', label: 'June' },
        { value: '07', label: 'July' },
        { value: '08', label: 'August' },
        { value: '09', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' }
      ],
      years: this.generateYears(),
      leaveFrom: '',
      leaveTo: '',
      leaveCategory: null,
      leaveCategories: [
        'Vacation Leave',
        'Sick Leave',
        'Maternity Leave',
        'Paternity Leave',
        'Study Leave',
        'Parental Leave',
        'Rehabilitation Leave',
        'Special Emergency Leave',
        'Magna Carta Leave',
        'Leave Without Pay',
        'Others'
      ]
    };
  },
  methods: {
    generateYears() {
      const currentYear = new Date().getFullYear();
      return Array.from({ length: 6 }, (_, i) => (currentYear - i).toString());
    },
    openPayslipModal() {
      this.isModalOpen = true;
    },
    openLocatorModal() {
      this.isLocatorModalOpen = true;
    },
    openLeaveModal() {
      this.isLeaveModalOpen = true;
    },
    navigateToLocator() {
      this.$router.push('/file-locator');
      this.isLocatorModalOpen = false;
    },
    navigateToMyLocator() {
      this.$router.push('/locator');
      this.isLocatorModalOpen = false;
    },
    navigateToMyLeaves() {
      this.$router.push('/my-leaves');
    },
    openFileLeaveModal() {
      this.isFileLeaveModalOpen = true;
      this.isLeaveModalOpen = false;
    },
    submitPayslipSelection() {
      if (this.month && this.year) {
        this.$router.push(`/payslip?month=${this.month}&year=${this.year}`);
        this.isModalOpen = false;
      }
    },
    submitLeaveApplication() {
      // Validate input fields
      if (!this.leaveFrom || !this.leaveTo || !this.leaveCategory) {
        alert('Please fill in all the required fields.');
        return;
      }

      // Ensure "From" date is not after "To" date
      if (new Date(this.leaveFrom) > new Date(this.leaveTo)) {
        alert('"From" date cannot be later than "To" date.');
        return;
      }

      // Prepare payload
      const payload = {
        leaveFrom: this.leaveFrom,
        leaveTo: this.leaveTo,
        category: this.leaveCategory
      };

      // Submit leave application
      fetch('http://localhost:3000/vfile-leave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
        .then(response => {
          if (response.ok) {
            alert('Leave application submitted successfully.');
            this.isFileLeaveModalOpen = false;

            // Clear form fields
            this.leaveFrom = '';
            this.leaveTo = '';
            this.leaveCategory = null;
          } else {
            return response.json().then(err => {
              console.error('Error:', err);
              alert('Error submitting leave application. Please try again.');
            });
          }
        })
        .catch(error => {
          console.error('Network error:', error);
          alert('Network error. Please try again later.');
        });
    }
  }
};
</script>