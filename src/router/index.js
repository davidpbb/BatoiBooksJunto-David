import { createRouter, createWebHistory } from 'vue-router';
import BooksList from '../views/BooksList.vue';
import AddBook from '../views/AddBook.vue';
import AppCart from '../views/AppCart.vue';
import AppAbout from '../views/AppAbout.vue';

const routes = [
  { path: '/', name: 'BooksList', component: BooksList },
  { path: '/addbook', name: 'AddBook', component: AddBook },
  { path: '/cart', name: 'Cart', component: AppCart },
  { path: '/about', name: 'About', component: AppAbout }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
