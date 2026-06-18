import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
      },
      {
        path: 'verify-email',
        loadComponent: () => import('./features/auth/verify-email/verify-email').then((m) => m.VerifyEmail),
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./features/auth/forgot-password/forgot-password').then((m) => m.ForgotPassword),
      },
      {
        path: 'add-info',
        loadComponent: () => import('./features/auth/add-info/add-info').then((m) => m.AddInfo),
      },
    ],
  },
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home').then((m) => m.Home),
      },
      {
        path:'category/:name',
        loadComponent:()=>import('./features/category/category').then((m)=>m.Category),
      },
      {
        path: 'products/:id',
        loadComponent: () => import('./features/products/product-detail/product-detail').then((m) => m.ProductDetail),
      },
      {
        path: 'cart',
        loadComponent: () => import('./features/cart/cart').then((m) => m.Cart),
      },
      {
        path: 'wishlist',
        loadComponent: () => import('./features/wishlist/wishlist').then((m) => m.Wishlist),
      },
      {
        path: 'categories/:slug',
        loadComponent: () => import('./features/category/laptop/laptop-category').then((m) => m.LaptopCategory),
      },
      {
        path: 'admin/inventory',
        canActivate: [adminGuard],
        loadComponent: () => import('./features/admin/inventory-admin/inventory-admin').then((m) => m.InventoryAdmin),
      },
      
    ],
  },
];
