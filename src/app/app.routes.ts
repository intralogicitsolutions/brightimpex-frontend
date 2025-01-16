import { Routes } from '@angular/router';
import { UserLandingComponent } from '../components/landing/user-landing/user-landing.component';
import { AdminLandingComponent } from '../components/landing/admin-landing/admin-landing.component';

export const routes: Routes = [
  {
    path: '',
    component: UserLandingComponent,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('../components/user/home/home.component').then(
            (c) => c.HomeComponent
          ),
      },
      {
        path: 'catalogue',
        loadComponent: () =>
          import('../components/user/catalogue/catalogue.component').then(
            (c) => c.CatalogueComponent
          ),
      },
      {
        path: 'about-us',
        loadComponent: () =>
          import('../components/user/about-us/about-us.component').then(
            (c) => c.AboutUsComponent
          ),
      },
      {
        path: 'contact-us',
        loadComponent: () =>
          import('../components/user/contact-us/contact-us.component').then(
            (c) => c.ContactUsComponent
          ),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/home',
      },
    ],
  },
  {
    path: 'admin',
    component: AdminLandingComponent,
    children: [
      {
        path: 'signin',
        loadComponent: () =>
          import('../components/admin/signin/signin.component').then(
            (c) => c.SigninComponent
          ),
      },
      {
        path: 'signup',
        loadComponent: () =>
          import('../components/admin/signup/signup.component').then(
            (c) => c.SignupComponent
          ),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/admin/signin',
      },
    ],
  },
];
