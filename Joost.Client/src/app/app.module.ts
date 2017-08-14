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
<<<<<<< HEAD
import {LoginComponent} from './components/login/login.component';
import { LoginSignUpComponent } from './components/login-sign-up/login-sign-up.component';
import { LoginSignInComponent } from './components/login-sign-in/login-sign-in.component';
=======
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { SignalTestComponent } from './components/signal-test/signal-test.component';
import { ConfirmRegistrationComponent } from './components/confirm-registration/confirm-registration.component';
>>>>>>> 963ab2503f52275185d227bc64de32d3be57c03d

import { GenderPipe } from "./pipes/gender.pipe";
import { StateIconPipe } from "./pipes/state-icon.pipe";
import { StateStringPipe } from "./pipes/state-string.pipe";

@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    MenuSettingsComponent,
    MenuUsersComponent,
    MenuSearchComponent,
    MenuAddComponent,
    MenuMessagesComponent,
<<<<<<< HEAD
    LoginComponent,
    LoginSignUpComponent,
    LoginSignInComponent
=======
    UserDetailsComponent,
    SignalTestComponent,
    ConfirmRegistrationComponent,
    GenderPipe,
    StateIconPipe,
    StateStringPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    UserService,
    AuthenticationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
