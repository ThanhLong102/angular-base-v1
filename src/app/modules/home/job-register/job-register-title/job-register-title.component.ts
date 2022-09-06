import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {JobRegister} from '../../../../models/model/JobRegister';
import {JobRegisterService} from '../../../../service/jobRegister.service';
import { saveAs } from 'file-saver';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ScheduleDto} from '../../../../models/Dto/ScheduleDto';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'ngx-job-register-title',
  templateUrl: './job-register-title.component.html',
  styleUrls: ['./job-register-title.component.scss'],
})
export class JobRegisterTitleComponent implements OnInit {

  @Input() jobRegister: JobRegister;
  cvFileName: string;
  displayPositionReason: boolean;
  scheduleDto: ScheduleDto;
  displayPosition: boolean;
  position: string;
  appointment: FormGroup;
  currentDate = new Date();
  methods: any[];
  addressInterviews: any[];
  // eslint-disable-next-line max-len
  avatar: string;
  // eslint-disable-next-line max-len
  constructor(private readonly router: Router,private jobRegisterService: JobRegisterService,private fb: FormBuilder ) { }

  ngOnInit(): void {
    this.getInitData();
    this.appointment = this.fb.group({
      dateBook: ['', [Validators.required]],
      method: [this.methods[0], [Validators.required]],
      addressInterview: [this.addressInterviews[0], [Validators.required]],
    });
  }

  getInitData(){
    this.methods = ['online','offline'];
    this.addressInterviews = ['Skype','Zoom','Zalo'];
    this.avatar= 'http://localhost:9090/api/public/files/'+this.jobRegister.user.avatarName;
  }

  onReadDetail(id: number) {
    this.router.navigate(['/home/job-register-detail', id]).then(r => console.log(r));
  }

  onReadJobDetail(id: number) {
    this.router.navigate(['/home/job-detail', id]).then(r => console.log(r));
  }

  onDownloadCV(id: any) {
    this.cvFileName = this.getCvFileName(this.jobRegister.cv);
    console.log('cvFileName',this.cvFileName);
    this.jobRegisterService.downloadCv(id).subscribe(
      blod => saveAs(blod, this.cvFileName),
    );
  }

  getCvFileName(cvFilePath: string) {
    if (!cvFilePath) {
      console.error('File path is null or undefined');
    }
    const cvFilePaths = cvFilePath.split('/');
    return cvFilePaths[cvFilePaths.length - 1];
  }

  showPositionDialogReason() {
    this.displayPositionReason = true;
  }

  close(closed: boolean){
    this.displayPositionReason = closed;
  }

  showPositionDialog(position: string) {
    this.position = position;
    this.displayPosition = true;
  }


  public schedule(){
    this.jobRegisterService.schedule(this.scheduleDto).subscribe(
      (data: any) => {
        this.jobRegister.statusJobRegister =data.statusJobRegister;
        alert('Đặt lịch thành công');
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      },
    );
  }

  onBook() {
    this.scheduleDto={
      addressInterview: '',
      dateInterview: undefined,
      jobRegisterId: 0,
      methodInterview: '',
      statusRegisterId: 0,
    };
    this.scheduleDto.jobRegisterId = this.jobRegister.id;
    this.scheduleDto.statusRegisterId = 3;
    this.scheduleDto.methodInterview = this.appointment.value.method;
    this.scheduleDto.dateInterview = this.appointment.value.dateBook;
    this.scheduleDto.addressInterview = this.appointment.value.addressInterview;
    this.schedule();
    this.displayPosition=false;
  }

}
