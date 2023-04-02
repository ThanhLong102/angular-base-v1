import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {User} from '../../models/model/User';
import {HttpErrorResponse} from '@angular/common/http';
import {UserService} from '../../service/user.service';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'ngx-home-public',
  templateUrl: './home-public.component.html',
  styleUrls: ['./home-public.component.scss'],
})
export class HomePublicComponent implements OnInit {
  user: any;

  constructor(private readonly router: Router, private userService: UserService,
              private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.getUser();
  }

  public getUserByUserName(username: string): void {
    this.userService.getUserByUserName(username).subscribe(
      (data: User) => {
        this.user = data;
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: error.message});
      },
    );
  }

  public getUser(): void {
    const token = this.userService.getDecodedAccessToken();
    if (token) {
      this.getUserByUserName(token.sub);
    }
  }

  onSignIn() {
    this.router.navigate(['/auth']).then(r => console.log(r));
  }

  onSignUp() {
    this.router.navigate(['/auth/signup']).then(r => console.log(r));
  }

  onLogOut() {
    window.localStorage.removeItem('auth-token');
    this.user = undefined;
  }


  onEditInfo() {
    this.router.navigate(['home-public/user/edit']).then(r => console.log(r));
  }

  onHome() {
    this.router.navigate(['/home-public']).then(r => console.log(r));
  }
}
