<template>
  <div>
    <h2>Return Locator Slip</h2>
    <div id="map" style="height: 400px; width: 100%;"></div>
    <p v-if="locationName">{{ locationName }}</p>
    <p v-if="error">{{ error }}</p>
    
    <!-- Display the decrypted ID -->
    <p v-if="decryptedId">Decrypted ID: {{ decryptedId }}</p>

    <!-- Input field and button to be displayed after location is loaded -->
    <div v-if="locationLoaded">
      <div class="container">
        <div class="col-md-6">
          
          <br>
          <button @click="handleSubmit" class="btn btn-primary mt-2">Submit</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import L from 'leaflet';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import { useRoute,useRouter } from 'vue-router'; 
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc,updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { ref } from 'vue'; 
import logLocation from '../firebaseService'; 
import checkLocatorExists from '../firebaseService'; 

import { Timestamp } from 'firebase/firestore'; //

export default {
  setup() {
    const route = useRoute(); 
    const router = useRouter(); 

    const encodedId = route.params.id; 
    return { encodedId, router }; 
  },
  data() {
    return {
      user: null, 
      userExists: false, 
      employeeId: "",
      fullName: "",
      mobileNumber: "",
      campus: "",
      campuses: ["Bongabong", "Calapan", "Main"],
      loadingUserData: true, 
      loading: false, 
      drawer: false, 
      map: null,
      userMarker: null,
      locationName: '',
      error: null,
      inputText: '',
      locationLoaded: false,
      latitude: null,
      longitude: null,
    };
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
    this.initMap();
    this.getUserLocation();
    L.Icon.Default.imagePath = 'https://unpkg.com/leaflet@1.7.1/dist/images/';
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
    
    initMap() {      
      this.map = L.map('map').setView([51.505, -0.09], 2);       
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);
    },
    getUserLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
            this.map.setView([this.latitude, this.longitude], 13);
            if (this.userMarker) {
              this.userMarker.setLatLng([this.latitude, this.longitude]);
              this.userMarker.setPopupContent(this.locationName); 
            } else {
              this.userMarker = L.marker([this.latitude, this.longitude]).addTo(this.map)
                .bindPopup(this.locationName)
                .openPopup();
            }  
            this.getLocationName(this.latitude, this.longitude);
          },
          () => {
            this.error = 'Unable to retrieve your location.';
          }
        );
      } else {
        this.error = 'Geolocation is not supported by this browser.';
      }
    },
    async getLocationName(lat, lon) {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
        if (!response.ok) {
          throw new Error('Failed to fetch location name');
        }
        const data = await response.json();
        this.locationName = data.display_name; 
        if (this.userMarker) {
          this.userMarker.setPopupContent(this.locationName).openPopup();
        }
        this.locationLoaded = true;
      } catch (error) {
        this.error = error.message;
      }
    },
    
    async handleSubmit() {
  try {
    // Get the reference to the specific locator document using the encodedId
    const locatorRef = doc(db, "locators", this.encodedId);
    const logRef = doc(db, "logLocator", this.encodedId);
    // await setDoc(logRef, {
    //   employeeId: this.employeeId,
    //   locatorID: this.encodedId,
    //   locationName:this.locationName,
    //   createdAt: new Date(),
    // });
    await updateDoc(locatorRef, {
      locationName:this.locationName,
      dateReturn: new Date(),
      status: "done",
    });

    
    alert('Locator status updated to "done" successfully!');

    
    setTimeout(() => {
      this.router.push('/locator'); 
    }, 2000);

  } catch (error) {
    
    console.error('Error submitting location:', error);
    this.error = 'An error occurred while submitting your data.';
  }
},
  },
};
</script>

<style scoped>
#map {
  height: 400px;
  width: 100%;
}
</style>
