import {Component, Input, OnInit} from '@angular/core';

import {Router} from '@angular/router';
import {User} from '../../../../models/model/User';
import {HttpErrorResponse} from '@angular/common/http';
import {UserService} from '../../../../service/user.service';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'ngx-user-title',
  templateUrl: './user-title.component.html',
  styleUrls: ['./user-title.component.scss'],
})
export class UserTitleComponent implements OnInit {

  @Input() user: User;
  avatar: string;

  constructor(private readonly router: Router, private userService: UserService,
              private messageService: MessageService) {
  }

  ngOnInit(): void {
    if (this.user.avatarName) {
      this.avatar = 'http://localhost:9090/api/public/files/' + this.user.avatarName;
    } else {
      this.avatar = 'http://localhost:9090/api/public/files/avatar1.png';
    }
  }

  onReadUserDetail(id: number) {
    this.router.navigate(['/home/user-detail', id]).then(r => console.log(r));
  }

  public reloadUser() {
    this.userService.getUserByUserName(this.user.userName).subscribe(
      (data: any) => {
        this.user = data;
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: error.message});
      },
    );
  }

  public onDeactivate(userid: number) {
    this.userService.deactivateUser(userid).subscribe(
      (data: any) => {
        if (data === true) {
          this.reloadUser();
          this.messageService.add({severity: 'success', summary: 'Success', detail: 'Đặt lịch thành công'});
        } else {
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'Hủy cập nhật thất bại'});
        }
      },
      () => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Đặt lịch thất bại'});
      },
    );
  }
}
