import { createRouter, createWebHistory } from 'vue-router';
import ReturnView from '@/views/ReturnView.vue';
import HomeView from '@/views/HomeView.vue';
import FileLocator from '@/views/FileLocator.vue';
import Payslip from '@/views/Payslip.vue';
import CampusView from '@/views/CampusView.vue';
import LocatorView from '@/views/LocatorView.vue';
import ReturnHome from '@/views/ReturnHome.vue';
import Leave from '@/views/Leave.vue';
const routes = [
  {
    path: '/return/:id', // Ensure the parameter is correctly named
    name: 'return',
    component: ReturnView,
  },
  {
    path: '/return-home/:id',
    name:'returnhome',
    component: ReturnHome
  },
  {
    path:'/locator',
    name: 'locator',
    component: LocatorView
  },
  {
    path: '/campus/:campus',
    name: 'campus',
    component: CampusView
  },
  {
    path:'/file-locator',
    name: 'fileLocator',
    component: FileLocator
  },
  {
    path: '/leave',
    name:'leave',
    component: Leave
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
