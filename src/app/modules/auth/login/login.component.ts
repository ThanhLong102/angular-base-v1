import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TokenService} from '../../../@core/services/token.service';
import {Router} from '@angular/router';
import { UserService } from '../../../service/user.service';
import {User} from '../../../models/model/User';
import {HttpErrorResponse} from '@angular/common/http';
import {AuthService} from '../../../service/auth.service';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  formLogin: FormGroup;
  isSubmitted = false;
  roles: string[] = [];
  isLoggedIn = false;
  user: User;
  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private tokenService: TokenService,
              private router: Router,
              private  userService: UserService,
            ) {
  }

  ngOnInit(): void {
    this.initForm();
    if (this.tokenService.getToken()) {
      this.isLoggedIn = true;
      // this.roles = this.tokenService.getUser().roles;
    }
  }

  initForm() {
    this.formLogin = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  setFirstTimeLogin(){
    if(this.user.firstTimeLogin){
      window.sessionStorage.removeItem('email');
      window.sessionStorage.setItem('email',this.user.email);
      alert('Đây là lần đầu bạn đăng nhập tài khoản này hãy đổi mật khẩu mới và đăng nhập lại !');
      this.sendOtp();
      this.tokenService.removeToken();
    }else {
      this.router.navigate(['/home/']).then(r => console.log(r));
    }
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.formLogin.valid) {
      this.authService.login(this.formLogin.value).subscribe(
        data => {
          this.isLoggedIn = true;
          this.tokenService.saveToken(data.token);
          // eslint-disable-next-line max-len
          if (this.userService.getDecodedAccessToken().auth === 'ROLE_ADMIN' || this.userService.getDecodedAccessToken().auth === 'ROLE_JE') {
            this.getUserByUserName();
          // }else if (this.userService.getDecodedAccessToken().auth==='ROLE_USER' ||
          //   this.userService.getDecodedAccessToken().auth === 'ROLE_ADMIN' ||
          //   this.userService.getDecodedAccessToken().auth === 'ROLE_JE'){
          //   this.router.navigate(['/home-public']).then(r => console.log(r));
          }else {
            this.router.navigate(['/auth/login']).then(r => console.log(r));
            this.router.navigate(['/home-public']).then(r => console.log(r));
          }
          /*       this.tokenService.saveUser(data.userName);
                 this.roles = this.tokenService.getUser().roles;*/
        },
      );
      // eslint-disable-next-line max-len

    }
  }

  public sendOtp(){
    this.authService.sendOtp(this.user).subscribe(
      (data: any) => {
        alert(data.message);
        if(data.obj === true){
          this.router.navigate(['/auth/change-password/finish']).then(r => console.log(r));
        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      },
    );
  }
  forgotPassword() {
    this.router.navigate(['/auth/change-password/init']).then(r => console.log(r));
  }

  register() {
    this.router.navigate(['/auth/signup']).then(r => console.log(r));
  }
  resetPassword() {}

  public getUserByUserName(): void {
    this.userService.getUserByUserName(  this.userService.getDecodedAccessToken().sub).subscribe(
      (data: User) => {
        this.user = data;
        this.setFirstTimeLogin();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      },
    );
  }
}
