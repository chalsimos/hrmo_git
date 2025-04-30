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
          <input
            type="text"
            v-model="inputText"
            class="form-control"
            placeholder="Enter your Employee ID no."
          />
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

import { ref } from 'vue'; 
import logLocation from '../firebaseService'; 
import checkLocatorExists from '../firebaseService'; 

import { Timestamp } from 'firebase/firestore'; //

export default {
  setup() {
    const route = useRoute(); 
    const router = useRouter(); 

    const encodedId = route.params.id; 
    const decryptedId = ref(atob(encodedId)); 
    return { decryptedId, router }; 
  },
  data() {
    return {
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
    this.initMap();
    this.getUserLocation();
    L.Icon.Default.imagePath = 'https://unpkg.com/leaflet@1.7.1/dist/images/';
  },
  methods: {
    
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
        const submissionData = {
          text: this.inputText,
          locatorID: this.decryptedId, 
          locationName: this.locationName,
          latitude: this.latitude,
          longitude: this.longitude,
          dateTime: Timestamp.now(), 

        };


        // If locatorID does not exist, proceed with submission
        const docId = await logLocation(submissionData);
        console.log('Document added with ID:', docId);
        alert(`Location successfully submitted! Document ID: ${docId}`);

        // Redirect to homepage after a short delay
        setTimeout(() => {
          this.router.push('/');
        }, 2000);

        // Clear the input field
        this.inputText = '';
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
