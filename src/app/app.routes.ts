import { Routes } from '@angular/router';
import { UserLandingComponent } from '../components/landing/user-landing/user-landing.component';

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
        data: { animation: 'HomePage' },
      },
      {
        path: 'catalogue',
        data: { animation: 'CataloguePage' },
        children: [
          {
            path: ':id',
            loadComponent: () =>
              import('../components/user/catalogue/catalogue.component').then(
                (c) => c.CatalogueComponent
              ),
            data: { animattion: 'CatalogueCategoryPage' },
          },
          {
            path: '',
            pathMatch: 'full',
            redirectTo: '/catalogue/all',
          },
        ],
      },
      {
        path: 'about-us',
        loadComponent: () =>
          import('../components/user/about-us/about-us.component').then(
            (c) => c.AboutUsComponent
          ),
        data: { animation: 'AboutUsPage' },
      },
      {
        path: 'contact-us',
        loadComponent: () =>
          import('../components/user/contact-us/contact-us.component').then(
            (c) => c.ContactUsComponent
          ),
        data: { animation: 'ContactUsPage' },
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
    children: [
      {
        path: 'signin',
        loadComponent: () =>
          import('../components/admin/signin/signin.component').then(
            (c) => c.SigninComponent
          ),
        data: { animation: 'SignInPage' },
      },
      {
        path: 'signup',
        loadComponent: () =>
          import('../components/admin/signup/signup.component').then(
            (c) => c.SignupComponent
          ),
        data: { animation: 'SignUpPage' },
      },
      {
        path: 'activate-account/:userId/:token',
        loadComponent: () =>
          import(
            '../components/admin/activate-account/activate-account.component'
          ).then((c) => c.ActivateAccountComponent),
        data: { animation: 'ActivateAccountPage' },
      },
    ],
  },
];
