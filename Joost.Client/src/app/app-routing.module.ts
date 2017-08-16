import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserDetailsComponent } from "./components/user-details/user-details.component";
import { ConfirmRegistrationComponent } from "./components/confirm-registration/confirm-registration.component";
import { GroupEditComponent } from "./components/group-edit/group-edit.component";
import { UserEditingComponent } from "./components/user-editing/user-editing.component";

const routes: Routes = [
  {
    path: '',
    children: []
  },
  {
      path: 'confirm-registration',
      component: ConfirmRegistrationComponent
  },
  {
    path: 'user-details/:id',
    component: UserDetailsComponent
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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
