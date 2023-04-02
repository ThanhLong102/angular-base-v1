import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MessageService, PrimeNGConfig} from 'primeng/api';
import {SessionService} from '../../../@core/services/session.service';
import {UserService} from '../../../service/user.service';
import {ProfileService} from './profile.service';
import {User} from '../../../models/model/User';
import {environment} from '../../../../environments/environment';
import {UploadFileService} from '../../../service/upload.service';
import {Router} from '@angular/router';

@Component({
  selector: 'ngx-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  formProfile: FormGroup;
  user: User;
  username: string;
  avatarUrl: string;
  birthday: string;
  file: File;
  currentDate = new Date();

  constructor(
    private sessionService: SessionService,
    private profileService: ProfileService,
    private fb: FormBuilder,
    private primengConfig: PrimeNGConfig,
    private uploadService: UploadFileService,
    private router: Router,
    private userService: UserService,
    private messageService: MessageService,
  ) {
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.getUser();
  }

  initForm() {
    const birthday = new Date(this.user.birthday);
    this.birthday = `${birthday.getDate()}/${birthday.getMonth() + 1}/${birthday.getFullYear()}`;
    this.username = this.userService.getDecodedAccessToken().sub;
    this.formProfile = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.minLength(8)
        , Validators.pattern('(84|0[3|5|7|8|9])+([0-9]{8})')]],
      birthday: ['', Validators.required],
      homeTown: [''],
      gender: [''],
    });
    this.updateForm();
  }

  public getUserByUserName(username: string): void {
    this.userService.getUserByUserName(username).subscribe(
      (data: User) => {
        this.user = data;
        this.avatarUrl = environment.apiImageUrl + this.user.avatarName;
        this.initForm();
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: error.message});
      },
    );
  }

  public getUser(): void {
    const token = this.userService.getDecodedAccessToken();
    this.getUserByUserName(token.sub);
  }

  onSubmit() {
    this.updateUser();
  }

  public updateUser() {
    this.user.name = this.formProfile.value.name;
    this.user.email = this.formProfile.value.email;
    this.user.birthday = this.formProfile.value.birthday;
    this.user.homeTown = this.formProfile.value.homeTown;
    this.user.gender = this.formProfile.value.gender;
    this.user.phoneNumber = this.formProfile.value.phoneNumber;
    const token = this.userService.getDecodedAccessToken();
    this.user.userName = token.sub;
    this.userService.updateUser(this.user).subscribe(
      (data: any) => {
        if (this.file) {
          this.uploadAvatar();
        }
        if (data) {
          debugger;
          this.messageService.add({severity: 'success', summary: 'Success', detail: 'Câp nhập thành công'});
        } else {
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'Cập nhập thất bại'});
        }
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: error.message});
      },
    );
    this.router.navigate(['/home']).then();
  }

  changeAvatar(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(this.file);
      reader.onload = () => {
        // @ts-ignore
        this.avatarUrl = reader.result;
      };
    }
  };

  uploadAvatar() {
    this.uploadService.uploadAvatar(this.file, this.user.id).subscribe(
      () => {
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: error.message});
      },
    );
  }

  updateForm() {
    this.formProfile.patchValue({
      name: this.user.name,
      email: this.user.email,
      phoneNumber: this.user.phoneNumber,
      birthday: this.user.birthday,
      homeTown: this.user.homeTown,
      gender: this.user.gender,
    });
  }

  show() {
    this.messageService.add({severity: 'success', summary: 'Success', detail: 'Message Content'});
  }
}
