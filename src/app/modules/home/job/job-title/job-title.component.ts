import {Component, Input, OnInit} from '@angular/core';
import {Job} from '../../../../models/model/Job';
import {Router} from '@angular/router';
import {User} from '../../../../models/model/User';
import {HttpErrorResponse} from '@angular/common/http';
import {JobService} from '../../../../service/job.service';
import {StatusDto} from '../../../../models/Dto/StatusDto';
// @ts-ignore
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'ngx-job-title',
  templateUrl: './job-title.component.html',
  styleUrls: ['./job-title.component.scss'],
})
export class JobTitleComponent implements OnInit {
  @Input() job: Job;
  @Input() user: User;

  jobs: any[];
  statusDto: StatusDto;
  displayPositionReason: boolean;
  currentDate = new Date().getTime();

  constructor(private readonly router: Router, private jobService: JobService) {
  }

  ngOnInit(): void {
  }

  public updateJob(statusDto) {
    this.jobService.updateStatusJob(statusDto).subscribe(
      (data: any) => {
        this.job.statusJob = data.statusJob;
        alert('Update thành công');
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      },
    );
  }

  getInit() {
    this.statusDto = {jobId: 1, statusId: 1};
  }

  onReadDetail(id: number) {
    this.router.navigate(['/home/job-detail', id]).then(r => console.log(r));
  }

  onPreview(id: number) {
    this.router.navigate(['/home-public/job-detail', id]).then(r => console.log(r));
  }

  onReadList(id: number) {
    this.router.navigate(['/home/list-job-register', id]).then(r => console.log(r));
  }

  onUp() {
    this.getInit();
    this.statusDto.jobId = this.job.id;
    this.statusDto.statusId = 2;
    this.updateJob(this.statusDto);
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  exportColumns = [{title: 'Name', dataKey: 'name'},
    {title: 'Trình độ học vấn', dataKey: 'academicLevel'},
    {title: 'Địa chỉ làm việc', dataKey: 'addressWork'},
    {title: 'Lương', dataKey: 'salary'},
    {title: 'Mô tả', dataKey: 'description'}];

  exportPdf() {
    this.jobs = [{
      name: this.job.name, academicLevel: this.job.academicLevel.code, addressWork: this.job.addressWork,
      salary: this.job.salaryMax, description: this.job.description,
    }];
    const doc = new jsPDF('p', 'px');
    doc.setFontSize(20);
    // eslint-disable-next-line max-len
    // doc.addFileToVFS('Roboto-regular','77u/aW1wb3J0IHsganNQREYgfSBmcm9tICJqc3BkZiIKdmFyIGZvbnQgPSAndW5kZWZpbmVkJzsKdmFyIGNhbGxBZGRGb250ID0gZnVuY3Rpb24gKCkgewp0aGlzLmFkZEZpbGVUb1ZGUygnUm9ib3RvLXJlZ3VsYXItbm9ybWFsLnR0ZicsIGZvbnQpOwp0aGlzLmFkZEZvbnQoJ1JvYm90by1yZWd1bGFyLW5vcm1hbC50dGYnLCAnUm9ib3RvLXJlZ3VsYXInLCAnbm9ybWFsJyk7Cn07CmpzUERGLkFQSS5ldmVudHMucHVzaChbJ2FkZEZvbnRzJywgY2FsbEFkZEZvbnRdKQo=');
    // doc.addFont('Roboto-Regular', 'Roboto-regular', 'normal');
    // doc.setFont('Times', 'Roman');
    // this.addFont();
    // doc.addFont('Roboto-regular-normal.ttf', 'Roboto-regular', 'normal');
    doc.setFont('Roboto-regular', 'normal');

    console.log('font', doc.getFontList());

    autoTable(doc, {
      columns: this.exportColumns,
      body: this.jobs,
      didDrawPage: (dataArg) => {
        doc.text('  Job Jd', 10, 20);
      },
      styles: {
        font: 'Roboto regular',
        fontStyle: 'normal',
      },
    });
    doc.save('job.pdf');
  }
}

