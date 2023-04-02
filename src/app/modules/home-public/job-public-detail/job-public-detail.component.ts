import {Component, OnInit} from '@angular/core';
import {Job} from '../../../models/model/Job';
import {User} from '../../../models/model/User';
import {ActivatedRoute, Router} from '@angular/router';
import {JobService} from '../../../service/job.service';
import {UserService} from '../../../service/user.service';
import {HttpErrorResponse} from '@angular/common/http';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AcademicLevel} from '../../../models/model/AcademicLevel';
import {WorkingForm} from '../../../models/model/WorkingForm';
import {UploadFileService} from '../../../service/upload.service';
import {Profiles} from '../../../models/model/Profiles';
import {ProfilesService} from '../../../service/profiles.service';
import {Stomp} from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import {Notifications} from '../../../models/model/Notifications';
import {Type} from '../../../models/model/Type';
import {JobRegister} from '../../../models/model/JobRegister';
import {debounceTime} from 'rxjs/operators';
import {ReasonDto} from '../../../models/Dto/ReasonDto';
import {JobRegisterService} from '../../../service/jobRegister.service';
import {MessageService} from 'primeng/api';


@Component({
  selector: 'ngx-job-public-detail',
  templateUrl: './job-public-detail.component.html',
  styleUrls: ['./job-public-detail.component.scss'],
})
export class JobPublicDetailComponent implements OnInit {

  job: Job;
  user: User;
  info: FormGroup;
  genders: any[];
  academicLevels: AcademicLevel[];
  workingForms: WorkingForm[];
  profile: Profiles = {
    academicLevel: undefined,
    delete: 0,
    description: '',
    desiredSalary: '',
    desiredWorkingAddress: '',
    desiredWorkingForm: '',
    id: 0,
    numberYearsExperience: 0,
    skill: '',
    user: undefined,
  };
  checkedProfile = false;

  displayPosition: boolean;
  position: string;

  fileCv: File;
  fileAvatar: File;

  stompClient = null;
  notifications: Notifications;
  type: Type;

  jobRegister: JobRegister;

  displayPositionInput = false;
  reasonDto: ReasonDto;


  constructor(private readonly route: ActivatedRoute, private jobService: JobService, private userService: UserService
    , private readonly router: Router, private fb: FormBuilder, private uploadService: UploadFileService,
              private jobRegisterService: JobRegisterService, private profilesService: ProfilesService,
              private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.getJobById();
    this.genders = ['name', 'nữ', 'giới tính thứ 3'];
    this.getAcademicLevel();
    this.getWorkingForm();
    this.getUser();
    this.reasonDto = {jobId: 0, reason: '', statusId: 0};
    this.info = this.fb.group({
      description: [''],
      homeTown: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      birthDay: ['', [Validators.required]],
      skills: this.fb.array([
        this.fb.control(''),
      ]),
      numberYearsExperience: ['', [Validators.required]],
      academicLevel: ['', [Validators.required]],
      desiredSalary: ['', [Validators.required]],
      desiredWorkingAddress: ['', [Validators.required]],
      workingForm: ['', [Validators.required]],
    });
    this.connect();
  }

  public addViews() {
    this.jobService.addView(this.route.snapshot.params.id).subscribe(
      () => {
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: error.message});
      },
    );
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  currentDate = new Date();

  getInitData() {
    this.profile = {
      id: null,
      academicLevel: null,
      delete: 0,
      description: '',
      desiredSalary: '',
      desiredWorkingAddress: '',
      desiredWorkingForm: '',
      numberYearsExperience: 0,
      skill: '',
      user: undefined,
    };
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  get skills(): FormArray {
    return this.info.get('skills') as FormArray;
  }

  addSkill() {
    this.skills.push(this.fb.control(''));
  }

  removeSkill(index: number) {
    this.skills.removeAt(index);
  }

  public getJobById(): void {
    this.jobService.getJobById(this.route.snapshot.params.id).subscribe(
      (data: Job) => {
        this.job = data;
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: error.message});
      },
    );
  }

  checkApply(): boolean {
    if (!this.userService.checkProfile(this.profile)) {
      if (!this.info.valid) {
        return false;
      }
      if (!this.fileAvatar) {
        return false;
      }
    }
    if (!this.fileCv) {
      return false;
    }
    return true;
  }

  public getProfilesByUserId(): void {
    this.profilesService.getProfilesByUserId(this.user.id).subscribe(
      (data: Profiles) => {
        if (!data) {
          this.getInitData();
        } else {
          this.profile = data;
        }
        this.checkedProfile = this.userService.checkProfile(this.profile);
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: error.message});
      },
    );
  }

  public getWorkingForm() {
    this.jobService.getWorkingForm().subscribe(
      (data: any) => {
        this.workingForms = data;
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: error.message});
      },
    );
  }

  public getAcademicLevel() {
    this.jobService.getAcademicLevels().subscribe(
      (data: any) => {
        this.academicLevels = data;
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: error.message});
      },
    );
  }

  public getUserByUserName(username: string): void {
    debounceTime(1000);
    this.userService.getUserByUserName(username).subscribe(
      (data: User) => {
        this.user = data;
        this.getProfilesByUserId();
        this.getJobRegister();
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
      console.log('Day la id', this.route.snapshot.params.id);
      this.addViews();
    }
  }

  public updateUser(): void {
    this.userService.update(this.user).subscribe(
      (data: User) => {
        this.user = data;
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: error.message});
      },
    );
  }

  public updateProfiles(): void {
    this.profilesService.update(this.profile).subscribe(
      (data: Profiles) => {
        this.profile = data;
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: error.message});
      },
    );
  }

  public updateJobRegister(): void {
    this.jobRegisterService.save(this.jobRegister).subscribe(
      (data: JobRegister) => {
        this.jobRegister = data;
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: error.message});
      },
    );
  }

  onApply() {
    if (!this.checkedProfile) {
      let skills = '';
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < this.info.value.skills.length; i++) {
        if (i === this.info.value.skills.length - 1) {
          skills += this.info.value.skills[i];
        } else {
          skills += this.info.value.skills[i] + ',';
        }
      }
      this.user.avatarName = this.fileAvatar.name;
      this.user.homeTown = this.info.value.homeTown;
      this.user.birthday = this.info.value.birthday;
      this.profile.skill = skills;
      this.profile.numberYearsExperience = this.info.value.numberYearsExperience;
      this.profile.academicLevel = this.info.value.academicLevel;
      this.profile.desiredSalary = this.info.value.desiredSalary;
      this.profile.desiredWorkingAddress = this.info.value.desiredWorkingAddress;
      this.profile.desiredWorkingForm = this.info.value.workingForm.code;
      this.profile.user = this.user;
      this.uploadAvatar();
      this.updateUser();
    }
    this.profile.description = this.info.value.description;
    this.uploadCv();
    this.updateProfiles();
    this.sendApply();
    this.disconnect();
    this.router.navigate(['/home-public']).then(r => console.log(r));
  }

  onSelected(event) {
    this.fileCv = event.currentFiles[0];
    console.log('day la file', this.fileCv);
  }

  onSelectedAvatar(event) {
    this.fileAvatar = event.currentFiles[0];
    console.log('day la file', this.fileAvatar);
  }

  uploadCv() {
    this.uploadService.upload(this.fileCv, this.user.userName, this.job.id).subscribe(
      (data: any) => {
        this.messageService.add({severity: 'success', summary: 'Success', detail: data.message});
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: error.message});
      },
    );
  }

  uploadAvatar() {
    this.uploadService.uploadAvatar(this.fileAvatar, this.user.id).subscribe(
      (data: any) => {
        this.messageService.add({severity: 'success', summary: 'Success', detail: data.message});
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: error.message});
      },
    );
  }

  onBeforeApply(top: string) {
    const token = this.userService.getDecodedAccessToken();
    if (token) {
      this.position = top;
      this.displayPosition = true;
    } else {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Vui lòng đăng nhập trước'});
      this.router.navigate(['/auth']).then(r => console.log(r));
    }
  }

  onCancel() {
    // eslint-disable-next-line max-len
    this.jobRegister.statusJobRegister = {
      code: 'Ứng viên đã hủy ứng tuyển',
      delete: false,
      description: 'Ứng vine đã hủy ứng tuyển',
      id: 6,
    };
    this.updateJobRegister();
    this.sendRefuse();
    this.onRefuse();
    this.router.navigate(['home-public']).then(r => console.log(r));
  }

  connect() {
    const socket = new SockJS('http://localhost:9090/gkz-stomp-endpoint');
    this.stompClient = Stomp.over(socket);
    const _this = this;
    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
    this.stompClient.connect({}, function(frame) {
      console.log('Connected: ' + frame);

      // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
      _this.stompClient.subscribe('/topic/apply', function(notify) {
        console.log((JSON.parse(notify.body)));
        // _this.showGreeting(JSON.parse(hello.body).greeting);
      });
    });
  }

  disconnect() {
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }
  }

  sendApply() {
    this.type = {code: 'ứng tuyển', delete: false, description: 'ứng tuyển', id: 1};
    // eslint-disable-next-line max-len
    this.notifications = {
      receiver: this.job.creator,
      job: this.job, content: '', createDate: new Date(), delete: false, id: null, sender: this.user, type: this.type,
    };
    this.stompClient.send('/gkz/job-register', {}, JSON.stringify(this.notifications));
  }

  sendRefuse() {
    this.type = {code: 'ứng tuyển', delete: false, description: 'ứng tuyển', id: 2};
    // eslint-disable-next-line max-len
    this.notifications = {
      receiver: this.job.creator,
      job: this.job, content: '', createDate: new Date(), delete: false, id: null, sender: this.user, type: this.type,
    };
    this.stompClient.send('/gkz/job-register', {}, JSON.stringify(this.notifications));
  }

  public getJobRegister(): void {
    this.jobRegisterService.findByUserAndJob(this.user.id, this.job.id).subscribe(
      (data: JobRegister) => {
        if (data.statusJobRegister.id === 6) {
          this.jobRegister = null;
        } else {
          this.jobRegister = data;
        }
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: error.message});
      },
    );
  }

  public updateReason() {
    this.jobRegisterService.updateReason(this.reasonDto).subscribe(
      (data: any) => {
        this.jobRegister.statusJobRegister = data.statusJobRegister;
        this.messageService.add({severity: 'success', summary: 'Success', detail: 'Update thành công'});
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: error.message});
      },
    );
  }

  onRefuse() {
    this.reasonDto.jobId = this.jobRegister.id;
    this.reasonDto.statusId = 6;
    this.updateReason();
    this.displayPositionInput = false;
  }
}
