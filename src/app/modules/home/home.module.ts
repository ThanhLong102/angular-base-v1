import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './home.component';
import {RouterModule, Routes} from '@angular/router';
import {NbMenuModule} from '@nebular/theme';
import {ThemeModule} from '../../@theme/theme.module';
import {ProfileComponent} from './profile/profile.component';
import {SharedModule} from 'primeng/api';
import {PrimengModule} from '../../shared/primeng.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {JobListComponent} from './job/job-list/job-list.component';
import {JobDetailsComponent} from './job/job-details/job-details.component';
import {DropdownModule} from 'primeng/dropdown';
import {PaginatorModule} from 'primeng/paginator';
import {JobAddComponent} from './job/job-add/job-add.component';
import {JobTitleComponent} from './job/job-title/job-title.component';
import {JobUpdateComponent} from './job/job-update/job-update.component';
import {JobRegisterListComponent} from './job-register/job-register-list/job-register-list.component';
import {JobRegisterTitleComponent} from './job-register/job-register-title/job-register-title.component';
import {JobRegisterDetailComponent} from './job-register/job-register-detail/job-register-detail.component';
import {ListJobRegisterComponent} from './job-register/list-job-register/list-job-register.component';
import {DialogModule} from 'primeng/dialog';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {PopupReasonComponent} from './popup-reason/popup-reason.component';
import {UserListComponent} from './user/user-list/user-list.component';
import {UserDetailsComponent} from './user/user-details/user-details.component';
import {UserTitleComponent} from './user/user-title/user-title.component';
import {UserAddComponent} from './user/user-add/user-add.component';
import {AuthJeGuard} from '../../@core/guards/authJe.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import {ChartModule} from 'primeng/chart';
import { TagInfoComponent } from './dashboard/tag-info/tag-info.component';

const routes: Routes = [{
  path: '',
  component: HomeComponent,
  children: [
    {
      path: 'dashboard',
      component : DashboardComponent,
    },
    {
      path: 'profile',
      component: ProfileComponent,
    },
    {
      path: 'list-job',
      component: JobListComponent,
    },
    {
      path: 'add-job',
      component: JobAddComponent,
    },
    {
      path: 'job-detail/:id',
      component: JobDetailsComponent,
    },
    {
      path: 'job-update/:id',
      component: JobUpdateComponent,
    },
    {
      path: 'list-job-register',
      component: JobRegisterListComponent,
    },
    {
      path: 'job-register-detail/:id',
      component: JobRegisterDetailComponent,
    },
    {
      path: 'list-job-register/:id',
      component: ListJobRegisterComponent,
    },

    {
      path: 'user/list',
      canActivate: [AuthJeGuard],
      component: UserListComponent,
    },
    {
      path: 'user/add',
      component: UserAddComponent,
    },
    {
      path: 'user-detail/:id',
      component: UserDetailsComponent,
    },

  ],
}];

@NgModule({
  declarations: [
    HomeComponent,
    ProfileComponent,
    JobListComponent,
    JobDetailsComponent,
    JobAddComponent,
    JobTitleComponent,
    JobUpdateComponent,
    JobRegisterListComponent,
    JobRegisterTitleComponent,
    JobRegisterDetailComponent,
    ListJobRegisterComponent,
    PopupReasonComponent,
    UserListComponent,
    UserDetailsComponent,
    UserTitleComponent,
    UserAddComponent,
    DashboardComponent,
    TagInfoComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ThemeModule,
    NbMenuModule,
    ReactiveFormsModule,
    PrimengModule,
    SharedModule,
    FormsModule,
    DropdownModule,
    PaginatorModule,
    DialogModule,
    InputTextareaModule,
    PrimengModule,
    ChartModule,
  ],
  exports: [],
})
export class HomeModule {
}
