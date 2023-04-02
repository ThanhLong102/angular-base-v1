import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthComponent} from './auth.component';
import {RouterModule, Routes} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {RegistrationComponent} from './registration/registration.component';
import {ChangePasswordInitComponent} from './change-password-init/change-password-init.component';
import {ChangePasswordFinishComponent} from './change-password-finish/change-password-finish.component';
import {LoginComponent} from './login/login.component';
import {MaterialModule} from '../../shared/material.module';
import {ToastModule} from 'primeng/toast';

const routes: Routes = [{
  path: '',
  component: AuthComponent,
  children: [{
    path: 'signup',
    component: RegistrationComponent,
  },
    {
      path: 'change-password/init',
      component: ChangePasswordInitComponent,
    },
    {
      path: 'change-password/finish',
      component: ChangePasswordFinishComponent,
    },
    {
      path: '',
      component: LoginComponent,
    }],
},
];

@NgModule({
  declarations: [
    AuthComponent,
    RegistrationComponent,
    ChangePasswordInitComponent,
    ChangePasswordFinishComponent,
    LoginComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    MaterialModule,
    ToastModule,
  ],
  // bootstrap: [AppComponent],
})
export class AuthModule {
}
