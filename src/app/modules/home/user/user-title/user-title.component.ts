import {Component, Input, OnInit} from '@angular/core';

import {Router} from '@angular/router';
import {User} from '../../../../models/model/User';
import {HttpErrorResponse} from '@angular/common/http';
import {UserService} from '../../../../service/user.service';

@Component({
  selector: 'ngx-user-title',
  templateUrl: './user-title.component.html',
  styleUrls: ['./user-title.component.scss'],
})
export class UserTitleComponent implements OnInit {

  @Input() user: User;
  avatar: string;

  constructor(private readonly router: Router, private userService: UserService) {
  }

  ngOnInit(): void {
    if(this.user.avatarName){
      this.avatar = 'http://localhost:9090/api/public/files/' + this.user.avatarName;
    } else {
      this.avatar='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpBBnQa6qFgqUBWwrpZhSOOIWzyHoQyHbFaA&usqp=CAU';
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
        alert(error.message);
      },
    );
  }

  public onDeactivate(userid: number) {
    this.userService.deactivateUser(userid).subscribe(
      (data: any) => {
        if (data === true) {
          this.reloadUser();
          alert('Cập nhật thành công');
        } else {
          alert('Hủy cập nhật thất bại');
        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      },
    );
  }


}
