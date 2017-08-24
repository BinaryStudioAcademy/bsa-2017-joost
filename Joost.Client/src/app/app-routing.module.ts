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

import { DialogsListComponent } from "./components/dialogs-list/dialogs-list.component";
import { MessagesListComponent } from "./components/messages-list/messages-list.component";
import { SettingsComponent } from "./components/settings/settings.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/app'
  },
  {
    path: 'app',
    component: AppComponent,
  },
  {
    path: 'menu',
    component: MainMenuComponent,
    children: [{
      path: 'user-details/:id',
      component: UserDetailsComponent
    },
    {
      path: 'user-editing',
      component: UserEditingComponent
    },
    {
      path: 'messages/:type/:id',
      component: MessagesListComponent
    },
    {
      path: 'groups',
      children: [
        {
          path: 'new',
          component: GroupEditComponent
        },
        {
          path: 'edit/:id',
          component: GroupEditComponent
        }
      ]
    },
    {
      path: 'add-contact',
      component: UserAddContactComponent
    },
    {
        path: 'settings',
        component: SettingsComponent
    }]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'confirm-registration/:key',
    component: ConfirmRegistrationComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
