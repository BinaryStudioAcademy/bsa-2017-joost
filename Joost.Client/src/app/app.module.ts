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

import { GroupEditComponent } from "./components/group-edit/group-edit.component";
import { GroupDetailsComponent } from './components/group-details/group-details.component';
import { UserEditingComponent } from './components/user-editing/user-editing.component';
import { MessagesListComponent } from "./components/messages-list/messages-list.component";
import { DialogsListComponent } from "./components/dialogs-list/dialogs-list.component";

import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ToastModule, ToastOptions} from 'ng2-toastr/ng2-toastr';
import {CustomOption} from './notification-options/custom-option';

import { MessageService } from "./services/message.service";
import { DialogService } from "./services/dialog.service";
import { ChatHubService } from "./services/chat-hub.service";
import { GroupService } from "./services/group.service";
import { LoginService } from "./services/login.service";
import { AvatarService } from './services/avatar.service';
import { AvatarPipe } from "./pipes/avatar.pipe";
import { GenderPipe } from "./pipes/gender.pipe";

import { MyDatePickerModule } from 'mydatepicker';
import { NamePipe } from "./pipes/name.pipe";
import { SettingsComponent } from './components/settings/settings.component';

import { FileService } from './services/file.service';
import { AttachedImagePipe } from "./pipes/attached-image.pipe";
import { MenuMessagesService } from "./services/menu-messages.service";
import { NotificationService } from "./services/notification.service";

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
    GenderPipe,
    NamePipe,
    SettingsComponent,
    AttachedImagePipe,
    GroupDetailsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    MyDatePickerModule,
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
    ChatHubService,
    AccountService,
    ContactService,
    FileService,
    MenuMessagesService,
    NotificationService,
    {
      provide: ToastOptions,
      useClass: CustomOption
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
