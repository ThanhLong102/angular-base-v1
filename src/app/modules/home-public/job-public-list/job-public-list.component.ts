import { Component, OnInit } from '@angular/core';
import {Job} from '../../../models/model/Job';
import {User} from '../../../models/model/User';
import {SearchJob} from '../../../models/job/SearchJob';
import {MessageService, SelectItem} from 'primeng/api';
import {JobService} from '../../../service/job.service';
import {Router} from '@angular/router';
import {UserService} from '../../../service/user.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'ngx-job-public-list',
  templateUrl: './job-public-list.component.html',
  styleUrls: ['./job-public-list.component.scss'],
})
export class JobPublicListComponent implements OnInit {
  public jobs: Job[];
  user: User;
  searchJob: SearchJob;

  sortOptions: SelectItem[];

  sortOrder: number;

  sortField: string;
  sortKey: any;
  page: number;
  size: number;
  totalRecords: number;
  sortNumber: number;
  rangeValues: number[] = [0,200];

  constructor(public jobService: JobService,private readonly router: Router,private userService: UserService,
              private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.sortOptions = [
      {label: 'Tên công việc', value: 'name'},
      {label: 'Thời gian nộp hồ sơ', value: 'dueDate'},
    ];
    this.getInnitData();
    this.onSearch();
    this.getUser();
  }

  getInnitData() {
    this.searchJob = {addressWork: '', name:'',statusId:2,salaryMin:0,salaryMax:200,skills:''};
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
      this.onSortByName();
    } else {
      this.sortNumber = 1;
      this.onSearch();
    }
  }


  public onSearch() {
    this.searchJob.statusId = 2;
    this.jobService.findJob(this.searchJob, this.page, this.size).subscribe(
      (data: any) => {
        this.jobs = data.list;
        this.totalRecords = data.totalPage;
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
      },
    );
  }

  public onSortByName() {
    this.searchJob.statusId = 2;
    this.jobService.sortByName(this.searchJob, this.page, this.size).subscribe(
      (data: any) => {
        this.jobs = data.list;
        this.totalRecords = data.totalPage;
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
      },
    );
  }

  paginate(event: any) {
    this.page = event.page;
    this.size = event.rows;
    if(this.sortNumber === 1){
      this.onSearch();
    } else {
      this.onSortByName();
    }
  }

  handleChangeSalary() {
    this.searchJob.salaryMin = this.rangeValues[0];
    this.searchJob.salaryMax = this.rangeValues[1];
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

}
