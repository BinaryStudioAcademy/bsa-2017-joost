import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpService } from './services/http.service';

import { AppRoutingModule } from './app-routing.module';

import { UserService } from './services/user.service';
import { AccountService } from './services/account.service';
import { ContactService } from './services/contact.service';
import { AuthenticationService } from './services/authentication.service';

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

import { StatePipe } from "./pipes/state.pipe";

import { LoginService } from "./services/login.service";
import { GroupEditComponent } from "./components/group-edit/group-edit.component";
import { GroupService } from "./services/group.service";
import { UserEditingComponent } from './components/user-editing/user-editing.component';

import { DialogsListComponent } from "./components/dialogs-list/dialogs-list.component";
import { MessagesListComponent } from "./components/messages-list/messages-list.component";
import { DialogService } from "./services/dialog.service";
import { MessageService } from "./services/message.service"

import {ToastModule, ToastOptions} from 'ng2-toastr/ng2-toastr';
// import {CustomOption} from './notification-options/custom-option'

import { AvatarService } from './services/avatar.service';
import { AvatarPipe } from "./pipes/avatar.pipe";
import { GenderPipe } from "./pipes/gender.pipe";


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
    StatePipe,
    GroupEditComponent,
    UserEditingComponent,
    UserAddContactComponent,
    AvatarPipe,
    DialogsListComponent,
    MessagesListComponent,
    GenderPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ToastModule.forRoot()
  ],
  providers: [
    HttpService,
    GroupService,
    UserService,
    LoginService,
    AvatarService,
    AuthenticationService,
    DialogService,
    MessageService,
    AccountService,
    ContactService
    // {
    //   provide: ToastOptions,
    //   useClass: CustomOption
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
