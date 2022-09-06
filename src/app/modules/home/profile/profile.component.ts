import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PrimeNGConfig} from 'primeng/api';
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
  [x: string]: any;

  formProfile: FormGroup;
  user: User;
  username: string;
  avatarUrl: string;
  fileAvatar: File;
  birthday: string;
  currentDate = new Date();

  constructor(
    private sessionService: SessionService,
    private profileService: ProfileService,
    private fb: FormBuilder,
    private primengConfig: PrimeNGConfig,
    private uploadService: UploadFileService,
    private router: Router,
    private userService: UserService) {
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.getUser();
    console.log('user form' + this.user);
  }

  initForm() {
    const birthday = new Date(this.user.birthday);
    // eslint-disable-next-line max-len
    this.birthday = `${birthday.getDate()}/${birthday.getMonth()}/${birthday.getFullYear()} ${birthday.getHours()}:${birthday.getMinutes()}`;
    console.log('sinh nhat', this.birthday);
    this.username = this.userService.getDecodedAccessToken().sub;
    this.formProfile = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      // eslint-disable-next-line max-len
      phoneNumber: ['', [Validators.required, Validators.minLength(8), Validators.pattern('(84|0[3|5|7|8|9])+([0-9]{8})')]],
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
        alert(error.message);
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
        if (this.fileAvatar) {
          this.uploadAvatar();
        }
        if (data) {
          alert('Câp nhập thành công');
        } else {
          alert('Cập nhập thất bại');
        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      },
    );
    this.router.navigate(['/home/job/list']).then(r => console.log(r));
  }

  onSelectedAvatar(event) {
    this.fileAvatar = event.currentFiles[0];
    console.log('day la file', this.fileAvatar);
  }

  uploadAvatar() {
    this.uploadService.uploadAvatar(this.fileAvatar, this.user.id).subscribe(
      (data: any) => {
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
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
}
