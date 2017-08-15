import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserDetailsComponent } from "./components/user-details/user-details.component";
import { ConfirmRegistrationComponent } from "./components/confirm-registration/confirm-registration.component";

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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
