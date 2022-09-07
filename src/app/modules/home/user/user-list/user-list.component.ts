import { Component, OnInit } from '@angular/core';


import {SelectItem} from 'primeng/api';
import {HttpErrorResponse} from '@angular/common/http';
import {User} from '../../../../models/model/User';
import {UserService} from '../../../../service/user.service';
import { SearchUser } from '../../../../models/model/SearchUser';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {

  public users: User[];
  searchUser: SearchUser;
  selectedUserName:  string;
  selectedEmail: string;
  selectedPhoneNumber: string;

  sortOptions: SelectItem[];


  sortKey: any;
  page: number;
  size: number;
  totalRecords: number;
  sortNumber: number;

  constructor(public userService: UserService, private router: Router) {
  }

  ngOnInit(): void {
    this.getInnitData();
    this.onSearch();
  }

  getInnitData() {
    this.selectedUserName = '';
    this.selectedEmail='';
    this.selectedPhoneNumber='';
    // eslint-disable-next-line max-len
    this.searchUser = {email: this.selectedEmail, phoneNumber: this.selectedPhoneNumber, userName: this.selectedUserName};
    this.page = 0;
    this.size = 3;
    this.totalRecords = 5;
    this.sortNumber = 1;
  }


  onSortChange(event) {
    const value = event.value;
    console.log(value,value);

    if (value.indexOf('name') === 0) {
      this.sortNumber = 2;
    } else {
      this.sortNumber = 1;
      this.onSearch();
    }
  }



  public onSearch() {
    // eslint-disable-next-line max-len
    this.searchUser = {email: this.selectedEmail, phoneNumber: this.selectedPhoneNumber, userName: this.selectedUserName};
    // eslint-disable-next-line max-len
    this.userService.searchUser(this.searchUser, this.page, this.size).subscribe(
      (data: any) => {
        this.users = data.list;
        this.totalRecords = data.totalPage * this.size;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      },
    );
  }


  public onAddJe() {
    this.router.navigate(['home/user/add']).then(r => console.log(r));
  }
  paginate(event: any) {
    this.page = event.page;
    this.size = event.rows;
    this.onSearch();
  }

}
