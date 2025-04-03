// angular import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventLaunchComponent } from './features/event-launch/event-launch.component';
import { MemberRegistrationComponent } from './features/member-registration/member-registration.component';
import { ReactiveFormsModule } from '@angular/forms';
import { authGuard } from './auth.guard';

// Project import
import { AdminComponent } from './theme/layouts/admin-layout/admin-layout.component';
import { GuestLayoutComponent } from './theme/layouts/guest-layout/guest-layout.component';

const routes: Routes = [
  {
    path: 'accueil',
    loadComponent: () => import('./accueil/accueil.component').then((c) => c.AccueilComponent)
  },
  { path: 'admin/event/new', component: EventLaunchComponent },
  { path: 'register/:id', component: MemberRegistrationComponent },
  {

    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: '/accueil',
        pathMatch: 'full'
      },
      {
        path: 'event-launch',
        loadComponent: () => import('./features/event-launch/event-launch.component')
          .then(c => c.EventLaunchComponent)
      },
      {
        path: 'partnerships',
        loadComponent: () => import('./features/partnerships/partnerships.component')
          .then(c => c.PartnershipsComponent)
      },
      {
        path: 'event-requests',
        loadComponent: () => import('./features/event-requests/event-requests.component')
          .then(c => c.EventRequestsComponent)
      } ,
      {
        path: 'dashboard/default',
        loadComponent: () => import('./demo/dashboard/default/default.component').then((c) => c.DefaultComponent),
        canActivate: [authGuard]
      },
      {
        path: 'demandeclubadmin',
        loadComponent: () => import('./demandeclubadmin/demandeclubadmin.component').then((c) => c.DemandeclubadminComponent)
      },
      {
        path: 'enrollment',
        loadComponent: () => import('./enrollment/enrollment.component').then((c) => c.EnrollmentComponent)
      },
      {
        path: 'typography',
        loadComponent: () => import('./demo/component/basic-component/color/color.component').then((c) => c.ColorComponent)
      },
      {
        path: 'color',
        loadComponent: () => import('./demo/component/basic-component/typography/typography.component').then((c) => c.TypographyComponent)
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/others/sample-page/sample-page.component').then((c) => c.SamplePageComponent)
      },

    ]
  },
  {
    path: '',
    component: GuestLayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./demo/pages/authentication/auth-login/auth-login.component').then((c) => c.AuthLoginComponent)
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./demo/pages/authentication/auth-register/auth-register.component').then((c) => c.AuthRegisterComponent)
      }
    ]
  }
];

@NgModule({
  imports:
  [RouterModule.forRoot(routes),
    ReactiveFormsModule ,
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
