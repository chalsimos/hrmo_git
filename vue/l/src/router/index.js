import { createRouter, createWebHistory } from 'vue-router';
import ReturnView from '@/views/ReturnView.vue';
import HomeView from '@/views/HomeView.vue';

import Payslip from '@/views/Payslip.vue';
const routes = [
  {
    path: '/return/:id', // Ensure the parameter is correctly named
    name: 'return',
    component: ReturnView,
  },
  {
    path: '/',
    name:'home',
    component: HomeView
  },
  { 
    path:'/payslip', 
    name:'Payslip', 
    component: Payslip
  },
 
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.afterEach((to) => {
  document.title = to.meta.title || 'Personnel Locator Manager'; // Set a default title if no meta title exists
});

export default router;
