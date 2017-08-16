import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserDetailsComponent } from "./components/user-details/user-details.component";
import { ConfirmRegistrationComponent } from "./components/confirm-registration/confirm-registration.component";
import { LoginComponent } from './components/login/login.component';
import { LoginSignInComponent } from "./components/login-sign-in/login-sign-in.component";
import { LoginSignUpComponent } from "./components/login-sign-up/login-sign-up.component";
import { MenuSettingsComponent } from "./components/menu-settings/menu-settings.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/login'
  },
  {
      path: 'login',
      component: LoginComponent,
      children: [{
        path: 'sign-in',
        component: LoginSignInComponent
      }, {
        path: 'sign-up',
        component: LoginSignUpComponent
      }]
  },
  {
      path: 'confirm-registration',
      component: ConfirmRegistrationComponent
  },
  {
      path: 'settings',
      component: MenuSettingsComponent
  },
  {
    path: 'user-details',
    component: UserDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
