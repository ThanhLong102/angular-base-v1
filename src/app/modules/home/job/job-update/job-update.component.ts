import {Component, OnInit} from '@angular/core';
import {JobDto} from '../../../../models/model/JobDto';
import {JobPosition} from '../../../../models/model/JobPosition';
import {WorkingForm} from '../../../../models/model/WorkingForm';
import {AcademicLevel} from '../../../../models/model/AcademicLevel';
import {Rank} from '../../../../models/model/Rank';
import {User} from '../../../../models/model/User';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {JobService} from '../../../../service/job.service';
import {UserService} from '../../../../service/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {Job} from '../../../../models/model/Job';

@Component({
  selector: 'ngx-job-update',
  templateUrl: './job-update.component.html',
  styleUrls: ['./job-update.component.scss'],
})
export class JobUpdateComponent implements OnInit {
  jobPositions: JobPosition[];
  workingForms: WorkingForm[];
  academicLevels: AcademicLevel[];
  ranks: Rank[];
  jes: User[];
  job: Job;
  jobDto: JobDto;

  name: any;
  jobPosition: any;
  numberExperience: any;
  workingForm: any;
  addressWork: any;
  academicLevel: any;
  rank: any;
  qtyPerson: any;
  startRequirement: Date;
  dueDate: Date;
  description: any;
  benefits: any;
  jobRequirement: any;
  salaryMin: any;
  salaryMax: any;
  contact: any;

  rfContact: FormGroup;

  constructor(private fb: FormBuilder,
              private jobService: JobService,
              private userService: UserService,
              private readonly router: Router,
              private readonly route: ActivatedRoute) {
  }

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
      salaryMin: ['', [Validators.required, Validators.minLength(0)]],
      salaryMax: ['', [Validators.required, Validators.minLength(1)]],
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
    this.getJobById();
  }

  public getInitData(){
    this.name = this.job.name;
    this.jobPosition = this.job.jobPosition;
    this.numberExperience = this.job.numberExperience;
    this.workingForm = this.job.workingForm;
    this.addressWork = this.job.addressWork;
    this.academicLevel = this.job.academicLevel;
    this.startRequirement = this.job.startRecruitmentDate;
    this.dueDate = this.job.dueDate;
    this.rank = this.job.rank;
    this.qtyPerson = this.job.qtyPerson;
    this.description = this.job.description;
    this.benefits = this.job.benefits;
    this.jobRequirement = this.job.jobRequirement;
    this.salaryMin = this.job.salaryMin;
    this.salaryMax = this.job.salaryMax;
    this.contact = this.job.contact;
  }

  public getJobPosition() {
    this.jobService.getJobPosition().subscribe(
      (data: any) => {
        this.jobPositions = data;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      },
    );
  }

  public getWorkingForm() {
    this.jobService.getWorkingForm().subscribe(
      (data: any) => {
        this.workingForms = data;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      },
    );
  }

  public getAcademicLevel() {
    this.jobService.getAcademicLevels().subscribe(
      (data: any) => {
        this.academicLevels = data;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      },
    );
  }

  public getRank() {
    this.jobService.getRanks().subscribe(
      (data: any) => {
        this.ranks = data;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      },
    );
  }

  public getJe() {
    this.userService.getJe().subscribe(
      (data: any) => {
        this.jes = data;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      },
    );
  }

  public getJobById(): void {
    this.jobService.getJobById(this.route.snapshot.params.id).subscribe(
      (data: Job) => {
        this.job = data;
        console.log('Day la update',this.job);
        this.getInitData();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
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

  public updateJob(){
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
    this.jobDto.id = null;
    this.jobDto.creatorId = 1;
    this.jobDto.createDate = new Date();
    this.jobDto.updateUserId = 1;
    this.jobDto.updateDate = new Date();
    this.jobDto.statusJobId =1;
    this.jobDto.skills =skills;
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    this.jobDto.views =0;

    console.log('UpdateJob',this.jobDto);
    // eslint-disable-next-line max-len
    this.jobService.updateJob(this.jobDto).subscribe(
      (data: any) => {
        alert('Update thành công');
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      },
    );
  }

  onSubmit() {
    // Do something awesome
    this.updateJob();
    this.router.navigate(['/home/list-job']).then(r => console.log(r));
  }

}