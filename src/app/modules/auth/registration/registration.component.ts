import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../service/auth.service';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'ngx-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {

  regi: FormGroup;
  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private messageService: MessageService) { }

  ngOnInit() {
    this.regi = this.fb.group({
      userName: ['', [Validators.required, Validators.maxLength(50)]],
      // eslint-disable-next-line max-len
      password: ['', [Validators.required,Validators.maxLength(16),Validators.pattern('^(?=[^A-Z\\n]*[A-Z])(?=[^a-z\\n]*[a-z])(?=[^0-9\\n]*[0-9])(?=[^#?!@$%^&*\\n-]*[#?!@$%^&*-]).{8,}$')]],
      name: ['', [Validators.required,Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      // eslint-disable-next-line max-len
      phoneNumber: ['', [Validators.required,Validators.pattern('(84|0[3|5|7|8|9])+([0-9]{8})')]],
    });
  }
  public addUser(){

    this.authService.addUser(this.regi.value).subscribe(
      (data: any) => {
        // eslint-disable-next-line eqeqeq
        if (data == false) {
          alert('Đăng ký thất bại');
        } else {
          alert('Đăng ký thành công');
        }
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
      },
    );
  }


  onSubmit() {
    this.addUser();
    this.router.navigate(['/auth']).then(r => console.log(r));
  }
}
