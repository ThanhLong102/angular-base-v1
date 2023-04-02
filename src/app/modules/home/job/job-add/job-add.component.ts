import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {JobService} from '../../../../service/job.service';
import {HttpErrorResponse} from '@angular/common/http';
import {JobDto} from '../../../../models/model/JobDto';
import {JobPosition} from '../../../../models/model/JobPosition';
import {WorkingForm} from '../../../../models/model/WorkingForm';
import {AcademicLevel} from '../../../../models/model/AcademicLevel';
import {Rank} from '../../../../models/model/Rank';
import {UserService} from '../../../../service/user.service';
import {User} from '../../../../models/model/User';
import {Router} from '@angular/router';
import {Stomp} from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import {Notifications} from '../../../../models/model/Notifications';
import {Type} from '../../../../models/model/Type';
import {Job} from '../../../../models/model/Job';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'ngx-job-add',
  templateUrl: './job-add.component.html',
  styleUrls: ['./job-add.component.scss'],
})
export class JobAddComponent implements OnInit {

  date7: Date;
  date8: Date;
  jobDto: JobDto;
  jobPositions: JobPosition[];
  workingForms: WorkingForm[];
  academicLevels: AcademicLevel[];
  ranks: Rank[];
  jes: User[];
  admin: User;

  rfContact: FormGroup;
  user: User;

  stompClient= null;
  notifications: Notifications;
  type: Type;

  constructor(private fb: FormBuilder,
              private jobService: JobService,
              private userService: UserService,
              private readonly router: Router,
              private messageService: MessageService) { }

  ngOnInit() {
    this.rfContact = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      jobPositionId: ['', [Validators.required]],
      numberExperience: ['', [Validators.required]],
      workingFormId: ['', [Validators.required]],
      addressWork: ['', [Validators.required, Validators.minLength(3)]],
      academicLevelId: ['', [Validators.required]],
      rankId: ['', [Validators.required]],
      qtyPerson: ['', [Validators.required]],
      startRecruitmentDate: ['', [Validators.required]],
      dueDate: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      benefits: ['', [Validators.required, Validators.minLength(3)]],
      jobRequirement: ['', [Validators.required, Validators.minLength(3)]],
      salaryMin: ['', [Validators.required]],
      salaryMax: ['', [Validators.required]],
      contactId: ['', [Validators.required]],
      skills: this.fb.array([
        this.fb.control(''),
      ]),
    });
    this.getJobPosition();
    this.getAcademicLevel();
    this.getWorkingForm();
    this.getRank();
    this.getJe();
    this.getAdmin();
    this.getUser();
    this.connect();
  }
  public addJob(){
    console.log('skills',this.rfContact.value.skills);
    let skills ='';
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for(let i=0 ;i<this.rfContact.value.skills.length;i++){
      if( i === this.rfContact.value.skills.length-1){
        skills += this.rfContact.value.skills[i];
      } else {
        skills += this.rfContact.value.skills[i]+',';
      }
    }
    this.jobDto = this.rfContact.value;
    this.jobDto.creatorId = this.user.id;
    this.jobDto.createDate = new Date();
    this.jobDto.updateUserId = this.user.id;
    this.jobDto.updateDate = new Date();
    this.jobDto.statusJobId =1;
    this.jobDto.skills =skills;
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    this.jobDto.views =0;
    // eslint-disable-next-line max-len
    this.jobService.addJob(this.jobDto).subscribe(
      (data: Job) => {
        this.sendApply(data);
        this.disconnect();
        alert('Add thành công');
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
      },
    );
  }

  public getJobPosition(){
    this.jobService.getJobPosition().subscribe(
      (data: any) => {
        this.jobPositions = data;
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
      },
    );
  }
  public getWorkingForm(){
    this.jobService.getWorkingForm().subscribe(
      (data: any) => {
        this.workingForms = data;
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
      },
    );
  }
  public getAcademicLevel(){
    this.jobService.getAcademicLevels().subscribe(
      (data: any) => {
        this.academicLevels = data;
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
      },
    );
  }

  public getRank(){
    this.jobService.getRanks().subscribe(
      (data: any) => {
        this.ranks = data;
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
      },
    );
  }

  public getJe(){
    this.userService.getJe().subscribe(
      (data: any) => {
        this.jes = data;
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
      },
    );
  }

  public getAdmin(){
    this.userService.getAdmin().subscribe(
      (data: any) => {
        this.admin = data[0];
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
      },
    );
  }
  // eslint-disable-next-line @typescript-eslint/member-ordering
  get skills(): FormArray {
    return this.rfContact.get('skills') as FormArray;
  }

  addSkill() {
    this.skills.push(this.fb.control(''));
  }

  removeSkill(index: number) {
    this.skills.removeAt(index);
  }

  public getUserByUserName(username: string): void {
    this.userService.getUserByUserName(username).subscribe(
      (data: User) => {
        this.user = data;
        console.log('roles',data.roles);
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
      },
    );
  }

  public getUser(): void {
    const token = this.userService.getDecodedAccessToken();
    this.getUserByUserName(token.sub);
  }

  onSubmit() {
    // Do something awesome
    this.addJob();
    console.log('abc:',this.rfContact.value);
    this.router.navigate(['/home/list-job']).then(r => console.log(r));
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  minDate = new Date();

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

  sendApply(jobA) {
    this.type = {code: 'job add', delete: false, description: 'job add', id: 3};
    // eslint-disable-next-line max-len
    this.notifications = {
      receiver: this.admin,
      job: jobA, content: '', createDate: new Date(), delete: false, id: null, sender: this.user, type: this.type};
    this.stompClient.send('/gkz/job-register', {}, JSON.stringify(this.notifications));
  }

}
