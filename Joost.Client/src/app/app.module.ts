import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './components/app/app.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { MenuSettingsComponent } from './components/menu-settings/menu-settings.component';
import { MenuUsersComponent } from './components/menu-users/menu-users.component';
import { MenuSearchComponent } from './components/menu-search/menu-search.component';
import { MenuAddComponent } from './components/menu-add/menu-add.component';
import { MenuMessagesComponent } from './components/menu-messages/menu-messages.component';
import {LoginComponent} from './components/login/login.component';
import { LoginSignUpComponent } from './components/login-sign-up/login-sign-up.component';
import { LoginSignInComponent } from './components/login-sign-in/login-sign-in.component';

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
    LoginSignInComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
