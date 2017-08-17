import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserDetailsComponent } from "./components/user-details/user-details.component";
import { ConfirmRegistrationComponent } from "./components/confirm-registration/confirm-registration.component";

import { GroupEditComponent } from "./components/group-edit/group-edit.component";
import { UserEditingComponent } from "./components/user-editing/user-editing.component";
import { LoginComponent } from './components/login/login.component';
import { LoginSignInComponent } from "./components/login-sign-in/login-sign-in.component";
import { LoginSignUpComponent } from "./components/login-sign-up/login-sign-up.component";
import { MenuSettingsComponent } from "./components/menu-settings/menu-settings.component";
import { MainMenuComponent } from "./components/main-menu/main-menu.component";
import { UserAddContactComponent } from './components/user-add-contact/user-add-contact.component';
import { AppComponent } from "./components/app/app.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/app'
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
    path: 'app',
    component: AppComponent,
  },
  {
      path: 'confirm-registration',
      component: ConfirmRegistrationComponent
  },
  {
    path: 'menu',
    component: MainMenuComponent,
    children: [{
      path: 'user-details',
      component: UserDetailsComponent,
      outlet: 'menu'
    },
      {
        path: 'user-editing/:id',
        component: UserEditingComponent
      },
      {
        path: 'groups',
        children: [
          {
            path: 'new',
            component: GroupEditComponent
          },
          {
            path: 'edit:id',
            component: GroupEditComponent
          }
        ]
      },
      {
        path: 'add-contact/:id',
        component: UserAddContactComponent
      }]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
