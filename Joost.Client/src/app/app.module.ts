import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { UserService } from './services/user.service';
import { AuthenticationService } from './services/authentication.service';
import { AuthInterceptor } from './interceptor/auth-interceptor';

import { AppComponent } from './components/app/app.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { MenuSettingsComponent } from './components/menu-settings/menu-settings.component';
import { MenuUsersComponent } from './components/menu-users/menu-users.component';
import { MenuSearchComponent } from './components/menu-search/menu-search.component';
import { MenuAddComponent } from './components/menu-add/menu-add.component';


import { MenuMessagesComponent } from './components/menu-messages/menu-messages.component';
import { UserAddContactComponent } from './components/user-add-contact/user-add-contact.component';

import { LoginComponent} from './components/login/login.component';
import { LoginSignUpComponent } from './components/login-sign-up/login-sign-up.component';
import { LoginSignInComponent } from './components/login-sign-in/login-sign-in.component';

import { UserDetailsComponent } from './components/user-details/user-details.component';
import { SignalTestComponent } from './components/signal-test/signal-test.component';
import { ConfirmRegistrationComponent } from './components/confirm-registration/confirm-registration.component';

import { GenderPipe } from "./pipes/gender.pipe";
import { StateIconPipe } from "./pipes/state-icon.pipe";

import { StateStringPipe } from "./pipes/state-string.pipe";
import { LoginService } from "./services/login.service";
import { GroupEditComponent } from "./components/group-edit/group-edit.component";
import { GroupService } from "./services/group.service";
import { UserEditingComponent } from './components/user-editing/user-editing.component';

import {ToastModule, ToastOptions} from 'ng2-toastr/ng2-toastr';
import {CustomOption} from './notification-options/custom-option'

@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    MenuSettingsComponent,
    MenuUsersComponent,
    MenuSearchComponent,
    MenuAddComponent,
    MenuMessagesComponent,
    LoginComponent,
    LoginSignUpComponent,
    LoginSignInComponent,
    UserDetailsComponent,
    SignalTestComponent,
    ConfirmRegistrationComponent,
    GenderPipe,
    StateIconPipe,
    StateStringPipe,
    GroupEditComponent,
    UserEditingComponent,
    UserAddContactComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ToastModule.forRoot()
  ],
  providers: [
    GroupService,
    UserService,
    LoginService,
    AuthenticationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: ToastOptions,
      useClass: CustomOption
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
