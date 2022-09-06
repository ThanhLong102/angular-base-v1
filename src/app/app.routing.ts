import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from './@core/guards/auth.guard';
import {RegistrationComponent} from './modules/auth/registration/registration.component';
import {ChangePasswordFinishComponent} from './modules/auth/change-password-finish/change-password-finish.component';
import {ChangePasswordInitComponent} from './modules/auth/change-password-init/change-password-init.component';

export const routes: Routes = [
  {
    path: 'home-public',
    loadChildren: () => import('./modules/home-public/home-public.module').then(m => m.HomePublicModule),
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'signup',
    component: RegistrationComponent,
  },
  {
    path: 'changePassword/init',
    component: ChangePasswordInitComponent,
  },
  {
    path: 'changePassword/finish',
    component: ChangePasswordFinishComponent,
  },
  { path: '', redirectTo: 'home-public', pathMatch: 'full' },
  { path: '**', redirectTo: 'home-public' },
];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
