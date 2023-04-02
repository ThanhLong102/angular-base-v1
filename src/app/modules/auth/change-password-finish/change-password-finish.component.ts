import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../service/auth.service';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'ngx-change-password-finish',
  templateUrl: './change-password-finish.component.html',
  styleUrls: ['./change-password-finish.component.scss'],
})
export class ChangePasswordFinishComponent implements OnInit {
  cpf: FormGroup;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private messageService: MessageService,
  ) {
  }

  ngOnInit() {
    this.cpf = this.fb.group({
      // eslint-disable-next-line max-len
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16), Validators.pattern('^(?=[^A-Z\\n]*[A-Z])(?=[^a-z\\n]*[a-z])(?=[^0-9\\n]*[0-9])(?=[^#?!@$%^&*\\n-]*[#?!@$%^&*-]).{8,}$')]],
      // eslint-disable-next-line max-len
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16), Validators.pattern('^(?=[^A-Z\\n]*[A-Z])(?=[^a-z\\n]*[a-z])(?=[^0-9\\n]*[0-9])(?=[^#?!@$%^&*\\n-]*[#?!@$%^&*-]).{8,}$')]],
      // eslint-disable-next-line max-len
      otp: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5), Validators.pattern('^[0-9]*$')]],
    });
  }

  public changePassword() {
    console.log(window.sessionStorage.getItem('email'));
    this.authService.changePassword(this.cpf.value, window.sessionStorage.getItem('email')).subscribe(
      (data: any) => {
        if (data.obj) {
          this.router.navigate(['/auth']).then(r => console.log(r));
          sessionStorage.removeItem('email');
        } else {
          this.router.navigate(['/auth/change-password-init']).then(r => console.log(r));
        }
        this.messageService.add({severity: 'error', summary: 'Error', detail: data.message});
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: error.message});
      },
    );
  }

  onSubmit() {
    this.changePassword();
  }
}
