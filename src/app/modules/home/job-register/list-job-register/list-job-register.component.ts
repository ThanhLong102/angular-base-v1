import { Component, OnInit } from '@angular/core';
import {JobRegisterService} from '../../../../service/jobRegister.service';
import {JobRegister} from '../../../../models/model/JobRegister';
import {HttpErrorResponse} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'ngx-list-job-register',
  templateUrl: './list-job-register.component.html',
  styleUrls: ['./list-job-register.component.scss'],
})
export class ListJobRegisterComponent implements OnInit {

  public jobRegisters: JobRegister[];

  constructor(public jobRegisterService: JobRegisterService,private readonly route: ActivatedRoute,
              private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.getByJobId();
  }

  public getByJobId(): void {
    this.jobRegisterService.getByJobId(this.route.snapshot.params.id).subscribe(
      (data: JobRegister[]) => {
        this.jobRegisters = data;
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
      },
    );
  }

}
