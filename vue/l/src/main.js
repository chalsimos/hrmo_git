import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';

// Import Vuetify
import { createVuetify } from 'vuetify';
import 'vuetify/styles'; // Import Vuetify CSS styles
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// Create a Vuetify instance
const vuetify = createVuetify({
  components,
  directives,
});

// Create and mount the Vue app with Vuetify and router
createApp(App)
  .use(router)
  .use(vuetify) // Add Vuetify here
  .mount('#app');
