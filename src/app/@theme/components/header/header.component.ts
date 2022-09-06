import { Component, OnDestroy, OnInit } from '@angular/core';
import {NbAdjustment, NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService} from '@nebular/theme';

import { LayoutService } from '../../../@core/utils';
import {map, takeUntil} from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SessionService } from '../../../@core/services/session.service';
import { Router } from '@angular/router';
import {UserService} from '../../../service/user.service';
import {User} from '../../../models/model/User';
import {HttpErrorResponse} from '@angular/common/http';
import {NotificationsService} from '../../../service/notifications.service';
import {Notifications} from '../../../models/model/Notifications';
import {Stomp} from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import {JobRegister} from '../../../models/model/JobRegister';
import {JobRegisterService} from '../../../service/jobRegister.service';


@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  // eslint-disable-next-line @typescript-eslint/member-ordering
  adjustment= NbAdjustment.VERTICAL;

  // eslint-disable-next-line @typescript-eslint/member-ordering
  userPictureOnly = false;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  user: any;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  badgeDot: boolean;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  picture='http://localhost:9090/api/public/files/';
  // eslint-disable-next-line @typescript-eslint/member-ordering
  name=this.userService.getDecodedAccessToken().sub;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  role=this.userService.getDecodedAccessToken().auth;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];
  // eslint-disable-next-line @typescript-eslint/member-ordering
  currentTheme = 'default';
  // eslint-disable-next-line @typescript-eslint/member-ordering
  apply = [];
  // eslint-disable-next-line @typescript-eslint/member-ordering
  refuse= [];
  // eslint-disable-next-line @typescript-eslint/member-ordering
  today = [];
  // eslint-disable-next-line @typescript-eslint/member-ordering
  notifyMenu = [];
  // eslint-disable-next-line @typescript-eslint/member-ordering
  userMenu = [ { title: 'Trang Cá Nhân' }, { title: 'Đăng Xuất'   }];

  private stompClient = null;

  // eslint-disable-next-line @typescript-eslint/member-ordering
  jobRegister: JobRegister;


  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private themeService: NbThemeService,
              private layoutService: LayoutService,
              private breakpointService: NbMediaBreakpointsService,
              private sessionService: SessionService,
              private userService: UserService,
              private router: Router,
              private notificationsService: NotificationsService,
              private jobRegisterService: JobRegisterService) {}

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;
    const token = this.userService.getDecodedAccessToken();
    this.getUserByUserName(token.sub);
    this.connect();

    this.menuService.onItemClick().subscribe((event)=>{
      if(event.item.title==='Đăng Xuất'){
        this.sessionService.removeItem('auth-token');
        this.sessionService.removeItem('auth-user');
        this.router.navigate(['/auth/']).then(r => console.log(r));
      }
      if(event.item.title==='Trang Cá Nhân'){
        this.router.navigate(['/home/profile']).then(r => console.log(r));
      }
    });

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);
  }

  ngOnDestroy() {
    this.disconnect();
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

  public getUserByUserName(username: string): void {
    this.userService.getUserByUserName(username).subscribe(
      (data: User) => {
        this.user = data;
        this.getNotification();
        this.picture += data.avatarName;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      },
    );
  }

  public getNotification(): void {
    this.notificationsService.getNotifications(this.user.id).subscribe(
      (data: Notifications[]) => {
        for (const notification of data) {
          const time = new Date(notification.createDate).toLocaleString();
          if(this.role === 'ROLE_JE'){
            this.getJobRegister(notification);
          }else {
            this.notifyMenu = [...this.notifyMenu,{title: notification.sender.name+' chờ xét duyệt công việc '
                + notification.job.name+' ('+ time+' )', link: '/home/job-detail/'+notification.job.id}];
          }
        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      },
    );
  }

  setNotification(notification){
    const time = new Date(notification.createDate).toLocaleString();
    if(notification.type.id === 1){
      this.apply = [...this.apply,{title: notification.sender.name+' đã ứng tuyển vào công ty '
          + notification.job.name+' ('+ time+' )', link: '/home/job-register-detail/'+this.jobRegister.id}];
    } else if(notification.type.id === 2){
      this.refuse = [...this.refuse,{title: notification.sender.name+' đã hủy ứng tuyển vào công ty '
          + notification.job.name+' ('+ time+' )', link:  '/home/job-register-detail/'+this.jobRegister.id}];
    }
    this.today = [...this.apply,...this.refuse];
    this.notifyMenu = [ { title: 'Hôm nay', children:this.today}, { title: 'Ứng tuyển', children:this.apply},
      { title: 'Từ chối ứng tuyển', children:this.refuse} ];
  }

  public getJobRegister(notification): void {
    this.jobRegisterService.findByUserAndJob(notification.sender.id,notification.job.id).subscribe(
      (data: JobRegister) => {
          this.jobRegister = data;
          this.setNotification(notification);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      },
    );
  }
  // Notification

  connect() {
    const socket = new SockJS('http://localhost:9090/gkz-stomp-endpoint');
    this.stompClient = Stomp.over(socket);
    const _this = this;
    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
    this.stompClient.connect({}, function(frame) {
      console.log('Connected: ' + frame);

      // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
      _this.stompClient.subscribe('/topic/apply', function(notify) {
        _this.badgeDot = true;
        const notification= JSON.parse(notify.body);
        const time = new Date(notification.createDate).toDateString();
        if(_this.role === 'ROLE_JE'){
          _this.getJobRegister(notification);
        }else {
          _this.notifyMenu = [..._this.notifyMenu,{title: notification.sender.name+' chờ xét duyệt công việc '
              + notification.job.name+' ('+ time+' )', link: '/home/job-detail/'+notification.job.id}];
        }
      });
    });
  }

  disconnect() {
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }
  }

}
