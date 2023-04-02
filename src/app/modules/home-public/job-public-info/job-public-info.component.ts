import {Component, OnInit} from '@angular/core';
import {Job} from '../../../models/model/Job';
import {JobService} from '../../../service/job.service';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'ngx-job-public-info',
  templateUrl: './job-public-info.component.html',
  styleUrls: ['./job-public-info.component.scss'],
})
export class JobPublicInfoComponent implements OnInit {
  jobNews: Job[];
  jobDues: Job[];
  jobHighSalaries: Job[];
  page: number;
  size: number;
  totalPageJobNews: number;
  totalPageJobDues: number;
  totalPageJobHighSalary: number;

  constructor(private jobService: JobService, private readonly router: Router,
              private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.getInitData();
    this.getJobNew();
    this.getJobHighSalary();
    this.getJobDue();
  }

  getInitData() {
    this.page = 0;
    this.size = 20;
    this.totalPageJobNews = 1;
    this.totalPageJobDues = 1;
    this.totalPageJobHighSalary = 1;
  }

  public getJobNew() {
    this.jobService.getJobNews(7, this.page, this.size).subscribe(
      (data: any) => {
        this.jobNews = data.list;
        this.totalPageJobNews = data.totalPage;
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: error.message});
      },
    );
  }

  public getJobHighSalary() {
    this.jobService.getJobHighSalary(18, this.page, this.size).subscribe(
      (data: any) => {
        this.jobHighSalaries = data.list;
        this.totalPageJobHighSalary = data.totalPage;
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: error.message});
      },
    );
  }

  public getJobDue() {
    this.jobService.getJobDue(5, this.page, this.size).subscribe(
      (data: any) => {
        this.jobDues = data.list;
        this.totalPageJobDues = data.totalPage;
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: error.message});
      },
    );
  }

  onReadAll() {
    this.router.navigate(['/home-public/list-job']).then(r => console.log(r));
  }
}
