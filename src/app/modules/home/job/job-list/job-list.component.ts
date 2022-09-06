// @ts-ignore
import {Component, OnInit} from '@angular/core';
import {Job} from '../../../../models/model/Job';
import {JobService} from '../../../../service/job.service';
import {HttpErrorResponse} from '@angular/common/http';
import {StatusJob} from '../../../../models/model/StatusJob';
import {SelectItem} from 'primeng/api';
import {Router} from '@angular/router';
import {User} from '../../../../models/model/User';
import {UserService} from '../../../../service/user.service';
import {SearchJob} from '../../../../models/job/SearchJob';

@Component({
  selector: 'ngx-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss'],
})
export class JobListComponent implements OnInit {
  public jobs: Job[];
  user: User;
  searchJob: SearchJob;
  statusJobs: any[];
  selectedStatusJobAdvanced: any;
  filteredStatusJobs: any[];
  sortOptions: SelectItem[];
  sortOrder: number;
  sortField: string;
  sortKey: any;
  page: number;
  size: number;
  totalRecords: number;
  sortNumber: number;
  rangeValues: number[] = [0,200];

  constructor(public jobService: JobService,private readonly router: Router,private userService: UserService) {
  }

  ngOnInit(): void {
    this.getStatusJob();
    this.sortOptions = [
      {label: 'Tên công việc', value: 'name'},
      {label: 'Thời gian nộp hồ sơ', value: 'dueDate'},
    ];
    this.getInnitData();
    this.onSearch();
    this.getUser();
  }

  getInnitData() {
    this.selectedStatusJobAdvanced = {id: 1, code:'Chờ xét duyệt'};
    this.searchJob = {name:'',statusId:1,salaryMin:0,salaryMax:200,addressWork:'',skills:''};
    this.page = 0;
    this.size = 2;
    this.totalRecords = 5;
    this.sortNumber = 1;
  }

  public getStatusJob(): void {
    this.jobService.getStatusJob().subscribe(
      (data: StatusJob[]) => {
        this.statusJobs = data;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      },
    );
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

  filterStatusJob(event) {
    const filtered: any[] = [];
    const query = event.query;
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < this.statusJobs.length; i++) {
      const statusJob = this.statusJobs[i];
      if (statusJob.code.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        filtered.push(statusJob);
      }
    }
    this.filteredStatusJobs = filtered;
  }

  public onSearch() {
    console.log('status',this.selectedStatusJobAdvanced);
    this.searchJob.statusId = this.selectedStatusJobAdvanced.id;
    this.jobService.findJob(this.searchJob, this.page, this.size).subscribe(
      (data: any) => {
        this.jobs = data.list;
        this.totalRecords = data.totalPage;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      },
    );
  }

  public onSortByName() {
    this.searchJob.statusId = this.selectedStatusJobAdvanced.id;
    this.jobService.sortByName(this.searchJob, this.page, this.size).subscribe(
      (data: any) => {
        this.jobs = data.list;
        this.totalRecords = data.totalPage;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
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
        alert(error.message);
      },
    );
  }

  public getUser(): void {
    const token = this.userService.getDecodedAccessToken();
    this.getUserByUserName(token.sub);
  }

  onAdd() {
    this.router.navigate(['/home/add-job']).then(r => console.log(r));
  }
}
